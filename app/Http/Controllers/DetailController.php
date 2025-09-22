<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\DocumentUpdateRequest;
use App\Models\{
    Document,
    DocumentPublication,
    DocumentKekayaanIntelektual,
    DocumentPks,
    DocumentLoaStudiLanjut,
    DocumentPelatihanLuarNegeri,
    DocumentPurwarupa
};

class DetailController extends Controller
{
    public function index(): Response
    {
        DB::beginTransaction();
        try {
            $user = Auth::user();
            $filter = $user->role === 'researcher' ? fn($q) => $q->where('user_id', $user->id) : fn() => null;

            $types = [
                'publication' => DocumentPublication::class,
                'ki' => DocumentKekayaanIntelektual::class,
                'pks' => DocumentPks::class,
                'loa' => DocumentLoaStudiLanjut::class,
                'pdvr' => DocumentPelatihanLuarNegeri::class,
                'purwarupa' => DocumentPurwarupa::class,
            ];

            $data = [];
            foreach ($types as $type => $modelClass) {
                $data[$this->getInertiaKey($type)] = $this->getData($modelClass, $filter, $type)->map(fn($item) => array_merge($item, [
                    'unique_id' => $type . '-' . $item['No'],
                ]));
            }

            DB::commit();
            return Inertia::render('details', $data);
        } catch (\Throwable $e) {
            DB::rollBack();
            return Inertia::render('details-error', [
                'message' => 'Terjadi kesalahan saat mengambil data dokumen.',
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function stamp(string $type, int $id): RedirectResponse
    {
        abort_unless(Auth::user()?->role === 'monev', 403);
        DB::beginTransaction();
        try {
            $item = $this->findItem($type, $id);
            $item->document->update([
                'monev_stamp' => $item->document->monev_stamp ? null : now(),
            ]);
            DB::commit();
            return back()->with('success', 'Stamp diperbarui.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memperbarui stamp: ' . $e->getMessage());
        }
    }

    public function update(DocumentUpdateRequest $request, string $type, int $id)
    {
        $user = Auth::user();
        // Debug logging to check incoming data
        \Log::debug("Update request for {$type}/{$id}", [
            'request_data' => $request->all(),
            'validated_data' => $request->validated(),
            'user_id' => $user->id,
            'user_role' => $user->role
        ]);
        
        DB::beginTransaction();
        try {
            $item = $this->findItem($type, $id);
            $document = $item->document;

            // Check permissions based on role
            if ($user->role === 'monev') {
                // Monev users can update status and notes
                if ($request->has('status_monev')) {
                    $validStatuses = ['approved', 'rejected', 'submitted', 'revised', '-'];
                    $newStatus = $request->status_monev;
                    
                    if (in_array($newStatus, $validStatuses)) {
                        $document->status = $newStatus;
                        $document->save();
                        \Log::debug("Monev updated document status", ['new_status' => $newStatus]);
                    } else {
                        return response()->json(['error' => 'Status tidak valid'], 422);
                    }
                }
                
                if ($request->has('notes')) {
                    $document->notes = $request->notes;
                    $document->save();
                    \Log::debug("Monev updated document notes", ['notes' => $document->notes]);
                }
            } else {
                // Regular users can only update their own documents
                abort_unless($document->user_id === $user->id, 403, 'Tidak memiliki izin untuk mengubah dokumen ini.');
                
                // Check if document is already approved
                if ($document->status === 'approved') {
                    return response()->json(['error' => 'Dokumen yang sudah disetujui tidak dapat diubah'], 422);
                }
                
                // Get mapped data using our new request class
                
                // Get document data (fields that belong to the Document model)
                $documentData = $request->getMappedDocumentData();
                if (!empty($documentData)) {
                    $document->fill($documentData);
                    \Log::debug("Document fields to update", ['fields' => $documentData]);
                }
                
                // Get item data (fields that belong to the specific document type model)
                $mappedData = $request->getMappedItemData();
                \Log::debug("Mapped fields for database update", [
                    'type' => $type, 
                    'mapped_fields' => $mappedData
                ]);
                
                if (!empty($mappedData)) {
                    $item->fill($mappedData);
                    \Log::debug("Item fields to update", ['type' => $type, 'fields' => $mappedData]);
                }
            }

            // Ensure both document and item are saved
            try {
                // Debug database column information
                $docColumns = \Schema::getColumnListing($item->getTable());
                \Log::debug("Database columns for {$type}", [
                    'table' => $item->getTable(),
                    'available_columns' => $docColumns,
                    'attributes_to_save' => array_keys($item->getAttributes())
                ]);
                
                // Check for any columns that might not exist in the database
                $missingColumns = array_diff(array_keys($item->getAttributes()), $docColumns);
                if (!empty($missingColumns)) {
                    \Log::warning("Attempting to save to non-existent columns", [
                        'missing_columns' => $missingColumns,
                        'type' => $type
                    ]);
                    
                    // Remove attributes that don't have corresponding database columns
                    foreach ($missingColumns as $column) {
                        unset($item->{$column});
                    }
                }
                
                \Log::debug("Saving document", ['document_id' => $document->id, 'attributes' => $document->getAttributes()]);
                $document->save();
                
                \Log::debug("Saving item", ['item_id' => $item->id, 'item_type' => get_class($item), 'attributes' => $item->getAttributes()]);
                $item->save();
                
                DB::commit();
                \Log::debug("Transaction committed successfully");
                
                // Verify the changes by re-fetching the models
                $refreshedDocument = Document::find($document->id);
                $refreshedItem = $this->findItem($type, $id);
                \Log::debug("Verification after save - Document", [
                    'document_id' => $refreshedDocument->id,
                    'attributes' => $refreshedDocument->getAttributes()
                ]);
                \Log::debug("Verification after save - Item", [
                    'item_id' => $refreshedItem->id, 
                    'attributes' => $refreshedItem->getAttributes()
                ]);
            } catch (\Exception $e) {
                \Log::error("Error saving models", [
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                throw $e; // Rethrow to be caught by the outer catch block
            }
            
            // Untuk request AJAX, return JSON
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'message' => 'Data berhasil diperbarui',
                    'document_id' => $document->id,
                    'item_id' => $item->id
                ]);
            }
            
            // Untuk request normal, redirect dengan message
            return back()->with('success', 'Data berhasil diperbarui.');
        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error("Error updating document", [
                'type' => $type,
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Untuk request AJAX, return JSON error
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'error' => 'Gagal memperbarui data: ' . $e->getMessage(),
                    'code' => $e->getCode(),
                    'file' => $e->getFile() . ':' . $e->getLine()
                ], 500);
            }
            
            return back()->with('error', 'Gagal memperbarui data: ' . $e->getMessage());
        }
    }

    // public function destroy(string $type, int $id): RedirectResponse
    // {
    //     $user = Auth::user();
    //     DB::beginTransaction();
    //     try {
    //         $item = $this->findItem($type, $id);
    //         $document = $item->document;

    //         if (($user->role === 'researcher' && $user->id === $document->user_id) || $user->role === 'head') {
    //             $document->delete();
    //             DB::commit();
    //             return back()->with('success', 'Dokumen berhasil dihapus.');
    //         }

    //         DB::rollBack();
    //         abort(403);
    //     } catch (\Throwable $e) {
    //         DB::rollBack();
    //         return back()->with('error', 'Gagal menghapus dokumen: ' . $e->getMessage());
    //     }
    // }

    private function getModelClass(string $type): ?string
    {
        return [
            'publication' => DocumentPublication::class,
            'ki' => DocumentKekayaanIntelektual::class,
            'pks' => DocumentPks::class,
            'loa' => DocumentLoaStudiLanjut::class,
            'pdvr' => DocumentPelatihanLuarNegeri::class,
            'purwarupa' => DocumentPurwarupa::class,
        ][$type] ?? null;
    }

    private function getInertiaKey(string $type): string
    {
        return match ($type) {
            'publication' => 'publications',
            'ki' => 'intellectualProperties',
            'pks' => 'pksData',
            'loa' => 'furtherStudyData',
            'pdvr' => 'overseasTrainingData',
            'purwarupa' => 'purwarupaData',
            default => $type,
        };
    }

    private function findItem(string $type, int $id)
    {
        $modelClass = $this->getModelClass($type);
        abort_if(is_null($modelClass), 404);
        return $modelClass::with('document')->findOrFail($id);
    }

    private function getData(string $modelClass, $filter, string $type)
    {
        return $modelClass::whereHas('document', $filter)
            ->with('document')
            ->get()
            ->map(fn($item) => $this->formatDocumentData($item, $type));
    }

    private function formatDocumentData($item, string $type): array
    {
        $doc = $item->document;
        $formatDate = fn($date, $format = 'Y-m-d') => optional($date)->format($format) ?? '-';
        $isStamped = !is_null($doc->monev_stamp);

        $common = [
            'No' => $item->id,
            'Periode Input' => $formatDate($doc->created_at),
            'Monev Stamp' => $isStamped,
            'Periode Stamp' => $formatDate($doc->monev_stamp, 'Y-m-d H:i'),
            'Status Dokumen' => $doc->status ?? '-',
            'Catatan Monev' => $doc->notes ?? '-',
        ];

        $typeSpecific = match ($type) {
            'publication' => [
                'No' => $item->id,
                'Periode Input' => $formatDate($doc->created_at),
                'Bulan' => $formatDate($doc->created_at, 'F'),
                'Monev Stamp' => $isStamped,
                'Judul Publikasi Global' => $doc->title ?? '-',
                'Kelompok Riset' => $doc->kelompok_riset ?? '-',
                'Author 1' => $item->authors1 ?? '-',
                'Author 2' => $item->authors2 ?? '-',
                'Author 3' => $item->authors3 ?? '-',
                'Author 4' => $item->authors4 ?? '-',
                'Author 5' => $item->authors5 ?? '-',
                'Author 6' => $item->authors6 ?? '-',
                'Author 7' => $item->authors7 ?? '-',
                'Author Non-PRSDI' => $item->nonprsdi_authors ?? '-',
                'Jenis' => $item->jenis ?? '-',
                'Status' => $item->status ?? '-',
                'Nama Jurnal/Prosiding' => $item->nama_jurnal ?? '-',
                'Terindeks Scopus' => $item->scopus_indexed ? 'Ya' : 'Tidak',
                'Reputasi' => $item->reputasi ?? '-',
                'URL' => $item->url ?? '-',
                'DOI' => $item->doi ?? '-',
                'Status Upload' => $item->status_upload ?? '-',
                'Status Dokumen' => $doc->status ?? '-',
                'Catatan Monev' => $doc->notes ?? '-',
            ],
            'ki' => [
                'No' => $item->id,
                'Periode Input' => $formatDate($doc->created_at),
                'Monev Stamp' => $isStamped,
                'Judul' => $doc->title ?? '-',
                'Kelompok Riset' => $doc->kelompok_riset ?? '-',
                'Inventor 1' => $item->inventors1 ?? '-',
                'Inventor 2' => $item->inventors2 ?? '-',
                'Inventor 3' => $item->inventors3 ?? '-',
                'Inventor 4' => $item->inventors4 ?? '-',
                'Inventor 5' => $item->inventors5 ?? '-',
                'Inventor 6' => $item->inventors6 ?? '-',
                'Inventor 7' => $item->inventors7 ?? '-',
                'Inventor 8' => $item->inventors8 ?? '-',
                'Non Sivitas PRSDI' => $item->nonprsdi_inventors ?? '-',
                'Status' => $item->status ?? '-',
                'Jenis' => $item->jenis ?? '-',
                'No Pendaftaran' => $item->no_pendaftaran ?? '-',
                'No Sertifikat' => $item->no_sertifikat ?? '-',
                'Tanggal Sertifikasi' => $formatDate($item->tanggal_sertifikasi),
                'LINK Dokumen' => $item->link_dokumen ?? '-',
                'Status Upload' => $item->status_upload ?? '-',
                'Status Dokumen' => $doc->status ?? '-',
                'Catatan Monev' => $doc->notes ?? '-',
            ],
            'pks' => [
                'No' => $item->id,
                'Periode Input' => $formatDate($doc->created_at),
                'Monev Stamp' => $isStamped,
                'Periode Stamp' => $formatDate($doc->monev_stamp, 'Y-m-d H:i'),
                'JUDUL' => $doc->title ?? '-',
                'KELOMPOK RISET' => $doc->kelompok_riset ?? '-',
                '1' => $item->pic_prsdi1 ?? '-',
                '2' => $item->pic_prsdi2 ?? '-',
                '3' => $item->pic_prsdi3 ?? '-',
                'NON SIVITAS PRSDI' => $item->pic_nonprsdi ?? '-',
                'TIPE' => $item->tipe ?? '-',
                'JENIS' => $item->jenis ?? '-',
                'SUMBER' => $item->sumber ?? '-',
                'OUTPUT' => $item->output ?? '-',
                'PIHAK K3' => $item->pihak_k3 ?? '-',
                'NILAI' => $item->nilai ?? '-',
                'KETERANGAN' => $item->keterangan ?? '-',
                'NO KERJASAMA' => $item->no_kerjasama ?? '-',
                'TANGGAL KERJASAMA' => $formatDate($item->tanggal_kerjasama),
                'NO PERJANJIAN' => $item->no_perjanjian ?? '-',
                'TANGGAL PERJANJIAN' => $formatDate($item->tanggal_perjanjian),
                'STATUS UPLOAD' => $item->status_upload ?? '-',
                'TAHUN PKS' => $item->tahun_pks ?? '-',
                'LINK BUKTI DUKUNG' => $item->link_bukti_dukung ?? '-',
                'Status Dokumen' => $doc->status ?? '-',
                'Catatan Monev' => $doc->notes ?? '-',
            ],
            'loa' => [
                'No' => $item->id,
                'Monev Stamp' => $isStamped,
                'Periode Stamp' => $formatDate($doc->monev_stamp, 'Y-m-d H:i'),
                'NAMA SDM IPTEK' => $item->nama_sdm_iptek ?? '-',
                'KELOMPOK RISET' => $doc->kelompok_riset ?? '-',
                'JENJANG PENDIDIKAN DITEMPUH' => $item->jenjang_pendidikan ?? '-',
                'NAMA UNIVERSITAS' => $item->nama_universitas ?? '-',
                'STATUS' => $item->status ?? '-',
                'Status Upload' => $item->status_upload ?? '-',
                'KETERANGAN' => $item->keterangan ?? '-',
                'UPLOAD DAKUNG' => $item->upload_dakung ?? '-',
                'tahun masuk' => $item->tahun_masuk ?? '-',
                'Status Dokumen' => $doc->status ?? '-',
                'Catatan Monev' => $doc->notes ?? '-',
            ],
            'pdvr' => [
                'No' => $item->id,
                'Monev Stamp' => $isStamped,
                'Periode Stamp' => $formatDate($doc->monev_stamp, 'Y-m-d H:i'),
                'NAMA SDM PRSDI' => $item->nama_sdm_prsdi ?? '-',
                'NON SDM PRSDI' => $item->non_sdm_prsdi ?? '-',
                'KELOMPOK RISET' => $item->kelompok_riset ?? '-',
                'STATUS' => $item->status ?? '-',
                'JENIS' => $item->jenis ?? '-',
                'KETERANGAN' => $item->keterangan ?? '-',
                'UPLOAD DAKUNG' => $item->upload_dakung ?? '-',
                'Status Upload' => $item->status_upload ?? '-',
                'Status Dokumen' => $doc->status ?? '-',
                'Catatan Monev' => $doc->notes ?? '-',
            ],
            'purwarupa' => [
                'No' => $item->id,
                'Periode Input' => $formatDate($doc->created_at),
                'Monev Stamp' => $isStamped, // Mengirim boolean
                'Periode Stamp' => $formatDate($doc->monev_stamp, 'Y-m-d H:i'),
                'Judul Purwarupa' => $item->judul_purwarupa ?? '-',
                'KELOMPOK RISET' => $item->kelompok_riset ?? '-',
                'Inventor 1' => $item->inventor1 ?? '-',
                'Inventor 2' => $item->inventor2 ?? '-',
                'Inventor 3' => $item->inventor3 ?? '-',
                'Inventor 4' => $item->inventor4 ?? '-',
                'Inventor 5' => $item->inventor5 ?? '-',
                'NON SIVITAS PRSDI' => $item->non_sivitas_prsdi ?? '-',
                'JENIS' => $item->jenis ?? '-',
                'STATUS' => $item->status ?? '-',
                'Status Upload' => $item->status_upload ?? '-',
                'NAMA MITRA' => $item->nama_mitra ?? '-',
                'LINK' => $item->link ?? '-',
                'Status Dokumen' => $doc->status ?? '-',
                'Catatan Monev' => $doc->notes ?? '-',
            ],
            default => [],
        };

        return array_merge($common, $typeSpecific);
    }
}


<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
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

        return Inertia::render('details', $data);
    }

    public function stamp(string $type, int $id): RedirectResponse
    {
        abort_unless(Auth::user()?->role === 'monev', 403);
        $item = $this->findItem($type, $id);

        // Ambil bulan saat ini dalam format nama bulan
        $currentMonth = now()->format('F');

        // Jika saat ini belum ada stamp, maka ketika diberi stamp update bulan menjadi bulan saat ini
        if (!$item->document->monev_stamp) {
            // Update hanya monev_stamp tanpa mengubah kolom bulan
            $item->document->update([
                'monev_stamp' => now(),
            ]);
            
            // Untuk jenis dokumen publikasi, update kolom Bulan di entity publication jika ada
            // dan jika kolom bulan tersedia di tabel
            if ($type === 'publication') {
                // Cek apakah kolom bulan ada di tabel publication
                try {
                    if (array_key_exists('bulan', $item->getAttributes())) {
                        $item->update(['bulan' => $currentMonth]);
                    }
                } catch (\Exception $e) {
                    // Jika error karena kolom tidak ada, abaikan saja
                    // dan lanjutkan eksekusi
                }
            }
            
            return back()->with('success', "Stamp berhasil ditambahkan pada bulan $currentMonth.");
        } else {
            // Jika menghapus stamp, cukup set monev_stamp menjadi null
            $item->document->update([
                'monev_stamp' => null
            ]);
            
            return back()->with('success', 'Stamp berhasil dihapus.');
        }

        return back()->with('success', 'Stamp diperbarui.');
    }

    /**
     * Update the specified resource in storage.
     * 
     * @param \Illuminate\Http\Request $request
     * @param string $type
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $type, int $id)
    {
        // 1. Otorisasi: Pastikan hanya 'monev' yang bisa menjalankan aksi ini.
        abort_if(Auth::user()?->role !== 'monev', 403, 'Hanya Monev yang dapat mengedit catatan.');

        // 2. Validasi request
        $validatedData = $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        // 3. Dapatkan kelas model berdasarkan tipe
        $modelClass = $this->getModelClass($type);
        abort_if(is_null($modelClass), 404, 'Tipe dokumen tidak ditemukan.');

        // 4. Cari item dokumen beserta relasi 'document'
        $item = $modelClass::with('document')->findOrFail($id);
        $document = $item->document;

        // 5. Update catatan
        $document->update([
            'notes' => $validatedData['notes']
        ]);

        // 6. Return JSON response untuk API
        return response()->json([
            'success' => true,
            'message' => 'Catatan berhasil diperbarui.'
        ]);
    }

    public function destroy(string $type, int $id): RedirectResponse
    {
        $user = Auth::user();
        $item = $this->findItem($type, $id);
        $document = $item->document;

        if (($user->role === 'researcher' && $user->id === $document->user_id) || $user->role === 'head') {
            $document->delete();
            return back()->with('success', 'Dokumen berhasil dihapus.');
        }

        abort(403);
    }

    /**
     * Helper function untuk mendapatkan model class berdasarkan tipe
     */
    private function getModelClass(string $type): ?string
    {
        return match ($type) {
            'publication' => DocumentPublication::class,
            'ki' => DocumentKekayaanIntelektual::class,
            'pks' => DocumentPks::class,
            'loa' => DocumentLoaStudiLanjut::class,
            'pdvr', 'pelatihan' => DocumentPelatihanLuarNegeri::class,
            'purwarupa' => DocumentPurwarupa::class,
            default => null,
        };
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
                'File di Google Drive' => $item->file_drive_link ?? '-',
                'URL' => $item->url ?? '-',
                'DOI' => $item->doi ?? '-',
                'Status Monev' => $doc->status ?? '-',
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
                'Tanggal Daftar' => $formatDate($item->tanggal_daftar),
                'No Sertifikat' => $item->no_sertifikat ?? '-',
                'Tanggal Sertifikasi' => $formatDate($item->tanggal_sertifikasi),
                'Link Upload' => $item->link_upload ?? '-',
                'LINK Dokumen' => $item->link_dokumen ?? '-',
                'Status Monev' => $doc->status ?? '-',
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
                'LINK UPLOAD' => $item->link_upload ?? '-',
                'STATUS UPLOAD' => $item->status_upload ?? '-',
                'TAHUN PKS' => $item->tahun_pks ?? '-',
                'LINK BUKTI DUKUNG' => $item->link_bukti_dukung ?? '-',
                'CATATAN' => $item->catatan ?? '-',
                'Status Monev' => $doc->status ?? '-',
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
                'KETERANGAN' => $item->keterangan ?? '-',
                'UPLOAD DAKUNG' => $item->upload_dakung ?? '-',
                'tahun masuk' => $item->tahun_masuk ?? '-',
                'direct evidence' => $item->direct_evidence ?? '-',
                'Status Monev' => $doc->status ?? '-',
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
                'direct link' => $item->direct_link ?? '-',
                'Status Monev' => $doc->status ?? '-',
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
                'NAMA MITRA' => $item->nama_mitra ?? '-',
                'UPLOAD GDRIVE' => $item->upload_gdrive ?? '-',
                'LINK' => $item->link ?? '-',
                'Status Monev' => $doc->status ?? '-',
                'Catatan Monev' => $doc->notes ?? '-',
            ],
            default => [],
        };

        return array_merge($common, $typeSpecific);
    }
}


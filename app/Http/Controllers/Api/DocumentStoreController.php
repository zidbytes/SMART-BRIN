<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Throwable;

use App\Models\Document;
use App\Models\DocumentPublication;
use App\Models\DocumentKekayaanIntelektual;
use App\Models\DocumentPks;
use App\Models\DocumentPurwarupa;
use App\Models\DocumentLoaStudiLanjut;
use App\Models\DocumentPelatihanLuarNegeri;


class DocumentStoreController extends Controller
{
    /**
     * Field labels untuk pesan error yang user-friendly
     */
    private const FIELD_LABELS = [
        // Publikasi Global
        'judul' => 'Judul Publikasi Global',
        'authorsCivitasPRSDI' => 'Authors',
        'jenisDokumen/Jurnal/Prosiding/Bagbook' => 'Jenis Dokumen Publikasi',
        'statusDokumen' => 'Status Dokumen Publikasi',
        'namaJurnal/Prosiding/BagBook' => 'Nama Jurnal/Prosiding',
        'terindeksScopus' => 'Terindeks Scopus',
        'status_upload' => 'Status Upload Dokumen',
        
        // Kekayaan Intelektual
        'judulciptaan' => 'Judul Inovasi/Karya',
        'Status' => 'Status',
        'PenciptaDariPusatRisetSainsDataDanInformasi' => 'Inventor',
        'JenisDokumen' => 'Jenis Kekayaan Intelektual',
        'nomorPermohonan' => 'Nomor Pendaftaran',
        'tanggalPenerimaan' => 'Tanggal Sertifikasi',
        
        // Studi Lanjut
        'namaMahasiswaAtauPeserta' => 'Nama SDM Studi Lanjut',
        'programPendidikan' => 'Jenjang Pendidikan Ditempuh',
        'namaUniversitasPenerima' => 'Nama Universitas',
        'tahunMasuk' => 'Tahun Masuk',
        'status' => 'Status',
        
        // PKS
        'tipe' => 'Tipe',
        'jenis' => 'Jenis',
        'sumber' => 'Sumber',
        'output' => 'Output',
        'tglKerjasama' => 'Tanggal Kerjasama',
        'linkUpload' => 'Link Upload',
        
        // Purwarupa
        'jenisPurwarupa' => 'Jenis Purwarupa',
        'namaMitra' => 'Nama Mitra',
        
        // PDVR
        'namaSdmPRSDI' => 'Nama SDM PRSDI',
        'namaSdmNonPRSDI' => 'Nama SDM Non PRSDI',
        'lokasiKegiatan' => 'Lokasi Kegiatan',
        'keterangan' => 'Keterangan',
    ];

    /**
     * Required fields per document type
     */
    private const REQUIRED_FIELDS = [
        'publikasi-global' => [
            'judul', 'authorsCivitasPRSDI', 'jenisDokumen/Jurnal/Prosiding/Bagbook',
            'statusDokumen', 'namaJurnal/Prosiding/BagBook', 'terindeksScopus', 'status_upload'
        ],
        'kekayaan-intelektual' => [
            'judulciptaan', 'Status', 'PenciptaDariPusatRisetSainsDataDanInformasi',
            'JenisDokumen', 'nomorPermohonan', 'tanggalPenerimaan', 'status_upload'
        ],
        'studi-lanjut' => [
            'namaMahasiswaAtauPeserta', 'programPendidikan', 'namaUniversitasPenerima',
            'tahunMasuk', 'status', 'status_upload'
        ],
        'perjanjian-kerjasama' => [
            'judul', 'tipe', 'jenis', 'sumber', 'output', 'tglKerjasama',
            'linkUpload', 'status_upload'
        ],
        'purwarupa' => [
            'judulciptaan', 'PenciptaDariPusatRisetSainsDataDanInformasi',
            'jenisPurwarupa', 'namaMitra', 'status', 'status_upload'
        ],
        'pdvr' => [
            'status', 'lokasiKegiatan', 'keterangan', 'status_upload'
        ],
    ];

    /**
     * Validasi metadata berdasarkan tipe dokumen
     */
    private function validateMetadata(string $documentKey, array $metadata): array
    {
        if (!isset(self::REQUIRED_FIELDS[$documentKey])) {
            return [
                'valid' => false,
                'message' => 'Tipe dokumen tidak valid.',
            ];
        }

        $requiredFields = self::REQUIRED_FIELDS[$documentKey];
        $missingFields = [];

        foreach ($requiredFields as $field) {
            $value = $metadata[$field] ?? null;
            
            // Handle different data types safely
            if ($this->isFieldEmpty($value)) {
                $missingFields[] = self::FIELD_LABELS[$field] ?? $field;
            }
        }

        if (!empty($missingFields)) {
            return [
                'valid' => false,
                'message' => 'Field berikut wajib diisi: ' . implode(', ', $missingFields),
                'missing_fields' => $missingFields,
            ];
        }

        return ['valid' => true];
    }

    /**
     * Check if field is empty safely handling different data types
     */
    private function isFieldEmpty($value): bool
    {
        // Handle null
        if (is_null($value)) {
            return true;
        }
        
        // Handle array
        if (is_array($value)) {
            return empty($value);
        }
        
        // Handle string
        if (is_string($value)) {
            return trim($value) === '';
        }
        
        // Handle other types (convert to string first)
        return trim((string) $value) === '';
    }

    /**
     * Menyimpan data dokumen yang sudah direview ke database.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Gunakan $request->user() untuk cek autentikasi
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: Sesi tidak valid atau token tidak ditemukan.',
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'documentKey' => 'required|string',
            'metadata' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $documentKey = $request->input('documentKey');
        $metadata = $request->input('metadata');

        // Validasi metadata berdasarkan tipe dokumen
        $metadataValidationResult = $this->validateMetadata($documentKey, $metadata);
        if (!$metadataValidationResult['valid']) {
            return response()->json([
                'success' => false,
                'message' => $metadataValidationResult['message'],
                'missing_fields' => $metadataValidationResult['missing_fields'] ?? null,
            ], 422);
        }

        DB::beginTransaction();

        try {
            $user = $request->user();

            $document = Document::create([
                'user_id' => $user->id,
                'document_type' => $documentKey,
                'title' => $metadata['judul'] ?? $metadata['judulciptaan'] ?? $metadata['title'] ?? 'Judul Tidak Ditemukan',
                'kelompok_riset' => $metadata['kelompokRiset'] ?? 'Tidak Ada',
                'status' => 'Submitted',
            ]);

            switch ($documentKey) {
                // ==========================================================
                // === PUBLIKASI GLOBAL ===
                // ==========================================================
                case 'publikasi-global':
                    try {
                        $prsdiAuthorsString = $metadata['authorsCivitasPRSDI'];
                        
                        if (is_string($prsdiAuthorsString)) {
                            if (preg_match('/\b[A-Z]\.[A-Z][a-z]*\.?\b/', $prsdiAuthorsString)) {
                                $prsdiAuthorsArray = preg_split('/,(?=[A-Z])/', $prsdiAuthorsString);
                            } else {
                                $prsdiAuthorsArray = explode(',', $prsdiAuthorsString);
                            }
                            $prsdiAuthorsArray = array_map('trim', $prsdiAuthorsArray);
                        } else {
                            $prsdiAuthorsArray = is_array($prsdiAuthorsString) ? $prsdiAuthorsString : [];
                        }
                        
                        $authorData = [];
                        foreach (array_slice($prsdiAuthorsArray, 0, 7) as $index => $authorName) {
                            $authorData['authors' . ($index + 1)] = trim($authorName);
                        }

                        $nonPrsdiAuthorsArray = $metadata['authorsNonCivitasPRSDI'] ?? [];
                        $nonPrsdiAuthorsString = is_array($nonPrsdiAuthorsArray) ? implode(', ', $nonPrsdiAuthorsArray) : $nonPrsdiAuthorsArray;

                        $publicationBaseData = [
                            'document_id' => $document->id,
                            'judul_publikasi' => $metadata['judul'],
                            'kelompok_riset' => $user->research_group,
                            'nonprsdi_authors' => $nonPrsdiAuthorsString,
                            'jenis' => $metadata['jenisDokumen/Jurnal/Prosiding/Bagbook'],
                            'status' => $metadata['statusDokumen'],
                            'nama_jurnal' => $metadata['namaJurnal/Prosiding/BagBook'],
                            'scopus_indexed' => ($metadata['terindeksScopus'] === 'Ya') ? 1 : 0,
                            'reputasi' => $metadata['reputasiScopus'] ?? null,
                            'file_drive_link' => $metadata['linkDrivePi'] ?? null,
                            'url' => $metadata['linkDokumen'] ?? null,
                            'doi' => $metadata['linkDOI'] ?? null,
                            'status_upload' => $metadata['status_upload'],
                        ];
                        
                        $finalPublicationData = array_merge($publicationBaseData, $authorData);
                        DocumentPublication::create($finalPublicationData);
                    } catch (Throwable $e) {
                        DB::rollBack();
                        Log::error("Error saat menyimpan publikasi global: " . $e->getMessage());
                        return response()->json([
                            'success' => false,
                            'message' => 'Gagal menyimpan data Publikasi Global. Periksa kembali data yang diinput.',
                            'error_details' => $e->getMessage(),
                        ], 500);
                    }
                    break;
                
                // ==========================================================
                // === KEKAYAAN INTELEKTUAL ===
                // ==========================================================
                case 'kekayaan-intelektual':
                    try {
                        $prsdiInventorsString = $metadata['PenciptaDariPusatRisetSainsDataDanInformasi'];
                        
                        if (is_string($prsdiInventorsString)) {
                            if (preg_match('/\b[A-Z]\.[A-Z][a-z]*\.?\b/', $prsdiInventorsString)) {
                                $prsdiInventorsArray = preg_split('/,(?=[A-Z])/', $prsdiInventorsString);
                            } else {
                                $prsdiInventorsArray = explode(',', $prsdiInventorsString);
                            }
                            $prsdiInventorsArray = array_map('trim', $prsdiInventorsArray);
                        } else {
                            $prsdiInventorsArray = is_array($prsdiInventorsString) ? $prsdiInventorsString : [];
                        }
                        
                        $inventorData = [];
                        foreach (array_slice($prsdiInventorsArray, 0, 8) as $index => $inventorName) {
                            $inventorData['inventors' . ($index + 1)] = trim($inventorName);
                        }
                        
                        $nonPrsdiInventorsArray = $metadata['PenciptaNonPusatRisetSainsDataDanInformasi'] ?? [];
                        $nonPrsdiInventorsString = is_array($nonPrsdiInventorsArray) ? implode(', ', $nonPrsdiInventorsArray) : $nonPrsdiInventorsArray;

                        $kiBaseData = [
                            'document_id' => $document->id,
                            'judul_ki' => $metadata['judulciptaan'],
                            'kelompok_riset' => $user->research_group,
                            'status' => $metadata['Status'],
                            'nonprsdi_inventors' => $nonPrsdiInventorsString,
                            'jenis' => $metadata['JenisDokumen'], 
                            'no_pendaftaran' => $metadata['nomorPermohonan'] ,
                            'no_sertifikat' => $metadata['nomorPencatatan'] ?? null,
                            'tanggal_sertifikasi' => $metadata['tanggalPenerimaan'],
                            'link_upload' => $metadata['linkDriveKi'] ?? null,
                            'link_dokumen' => $metadata['linkDokumen'] ?? null,
                            'status_upload' => $metadata['status_upload'],
                        ];

                        $finalKiData = array_merge($kiBaseData, $inventorData);
                        DocumentKekayaanIntelektual::create($finalKiData);
                    } catch (Throwable $e) {
                        DB::rollBack();
                        Log::error("Error saat menyimpan kekayaan intelektual: " . $e->getMessage());
                        return response()->json([
                            'success' => false,
                            'message' => 'Gagal menyimpan data Kekayaan Intelektual. Periksa format tanggal dan data lainnya.',
                            'error_details' => $e->getMessage(),
                        ], 500);
                    }
                    break;

                // ==========================================================
                // === STUDI LANJUT ===
                // ==========================================================    
                case 'studi-lanjut':
                    try {
                        DocumentLoaStudiLanjut::create([
                            'document_id' => $document->id,
                            'nama_sdm_iptek' => $metadata['namaMahasiswaAtauPeserta'],
                            'kelompok_riset' => $user->research_group,
                            'jenjang_pendidikan' => $metadata['programPendidikan'] ,
                            'nama_universitas' => $metadata['namaUniversitasPenerima'],
                            'tahun_masuk' => $metadata['tahunMasuk'],
                            'status' => $metadata['status'] ,
                            'keterangan' => $metadata['keterangan'] ?? null,
                            'upload_dakung' => $metadata['linkDataPendukung'] ?? null,
                            'status_upload' => $metadata['status_upload'],
                        ]);
                    } catch (Throwable $e) {
                        DB::rollBack();
                        Log::error("Error saat menyimpan studi lanjut: " . $e->getMessage());
                        return response()->json([
                            'success' => false,
                            'message' => 'Gagal menyimpan data Studi Lanjut. Periksa format tahun masuk dan data lainnya.',
                            'error_details' => $e->getMessage(),
                        ], 500);
                    }
                    break;
                
                // ==========================================================
                // === PERJANJIAN KERJASAMA DAN DANA EKSTERNAL ===
                // ==========================================================
                case 'perjanjian-kerjasama':
                    try {
                        $picString = $metadata['PICKegiatanSivitasPRSDI'] ?? '';
                        
                        if (is_string($picString) && !empty($picString)) {
                            if (preg_match('/\b[A-Z]\.[A-Z][a-z]*\.?\b/', $picString)) {
                                $picArray = preg_split('/,(?=[A-Z])/', $picString);
                            } else {
                                $picArray = explode(',', $picString);
                            }
                            $picArray = array_filter(array_map('trim', $picArray));
                        } else {
                            $picArray = [];
                        }
                        
                        $picData = [];
                        foreach (array_slice($picArray, 0, 3) as $index => $picName) {
                            $picData['pic_prsdi' . ($index + 1)] = trim($picName);
                        }

                        $pksBaseData = [
                            'document_id' => $document->id,
                            'judul' => $metadata['judul'],
                            'kelompok_riset' => $user->research_group,
                            'pic_nonprsdi' => $metadata['PICKegiatanNonSivitasPRSDI'] ?? null,
                            'tipe' => $metadata['tipe'],
                            'jenis' => $metadata['jenis'],
                            'sumber' => $metadata['sumber'] ?? null,
                            'output' => $metadata['output'] ?? null,
                            'pihak_k3' => $metadata['pihakK3'] ?? null,
                            'nilai' => $metadata['nilai'] ?? null,
                            'keterangan' => $metadata['keterangan'] ?? null,
                            'no_kerjasama' => $metadata['noKerjasama'] ?? null,
                            'tanggal_kerjasama' => $metadata['tglKerjasama'] ?? null,
                            'no_perjanjian' => $metadata['noPerjanjian'] ?? null,
                            'tanggal_perjanjian' => $metadata['tglPerjanjian'] ?? null,
                            'link_upload' => $metadata['linkUpload'] ?? null,
                            'status_upload' => $metadata['status_upload'],
                            'tahun_pks' => $metadata['tahunPKS'] ?? null,
                            'link_bukti_dukung' => $metadata['linkDataPendukung'] ?? null,
                        ];
                        
                        $finalPksData = array_merge($pksBaseData, $picData);
                        DocumentPks::create($finalPksData);
                    } catch (Throwable $e) {
                        DB::rollBack();
                        Log::error("Error saat menyimpan PKS: " . $e->getMessage());
                        return response()->json([
                            'success' => false,
                            'message' => 'Gagal menyimpan data Perjanjian Kerjasama. Periksa format tanggal dan link yang diinput.',
                            'error_details' => $e->getMessage(),
                        ], 500);
                    }
                    break;
                
                // ==========================================================
                // ===                      PURWARUPA                     ===
                // ==========================================================
                case 'purwarupa':
                    try {
                        $prsdiInventorsString = $metadata['PenciptaDariPusatRisetSainsDataDanInformasi'];
                        
                        if (is_string($prsdiInventorsString) && !empty($prsdiInventorsString)) {
                            if (preg_match('/\b[A-Z]\.[A-Z][a-z]*\.?\b/', $prsdiInventorsString)) {
                                $prsdiInventorsArray = preg_split('/,(?=[A-Z])/', $prsdiInventorsString);
                            } else {
                                $prsdiInventorsArray = explode(',', $prsdiInventorsString);
                            }
                            $prsdiInventorsArray = array_map('trim', $prsdiInventorsArray);
                        } else {
                            $prsdiInventorsArray = is_array($prsdiInventorsString) ? $prsdiInventorsString : [];
                        }
                        
                        $inventorData = [];
                        foreach (array_slice($prsdiInventorsArray, 0, 5) as $index => $inventorName) {
                            $inventorData['inventor' . ($index + 1)] = trim($inventorName);
                        }

                        $nonPrsdiInventorsArray = $metadata['PenciptaNonPusatRisetSainsDataDanInformasi'] ?? [];
                        $nonPrsdiInventorsString = is_array($nonPrsdiInventorsArray) ? implode(', ', $nonPrsdiInventorsArray) : $nonPrsdiInventorsArray;
                        $purwarupaBaseData = [
                            'document_id' => $document->id,
                            'judul_purwarupa' => $metadata['judulciptaan'],
                            'kelompok_riset' => $user->research_group,
                            'non_sivitas_prsdi' => $nonPrsdiInventorsString,
                            'jenis' => $metadata['jenisPurwarupa'],
                            'status' => $metadata['status'],
                            'nama_mitra' => $metadata['namaMitra'] ?? null,
                            'link' => $metadata['linkDataPendukung'] ?? null,
                            'status_upload' => $metadata['status_upload'],
                        ];

                        $finalPurwarupaData = array_merge($purwarupaBaseData, $inventorData);
                        DocumentPurwarupa::create($finalPurwarupaData);
                    } catch (Throwable $e) {
                        DB::rollBack();
                        Log::error("Error saat menyimpan purwarupa: " . $e->getMessage());
                        return response()->json([
                            'success' => false,
                            'message' => 'Gagal menyimpan data Purwarupa. Periksa kembali data inventor dan nama mitra.',
                            'error_details' => $e->getMessage(),
                        ], 500);
                    }
                    break;
                
                // ==========================================================
                // === PDVR / PELATIHAN LUAR NEGERI ===
                // ==========================================================
                case 'pdvr':
                    try {
                        DocumentPelatihanLuarNegeri::create([
                            'document_id' => $document->id,
                            'nama_sdm_prsdi' => $metadata['namaSdmPRSDI'] ?? null,
                            'non_sdm_prsdi' => $metadata['namaSdmNonPRSDI'] ?? null,
                            'kelompok_riset' => $user->research_group,
                            'status' => $metadata['status'],
                            'jenis' => $metadata['lokasiKegiatan'],
                            'keterangan' => $metadata['keterangan'],
                            'upload_dakung' => $metadata['linkDataPendukung'] ?? null,
                            'status_upload' => $metadata['status_upload'],
                        ]);
                    } catch (Throwable $e) {
                        DB::rollBack();
                        Log::error("Error saat menyimpan PDVR: " . $e->getMessage());
                        return response()->json([
                            'success' => false,
                            'message' => 'Gagal menyimpan data PDVR. Periksa kembali data SDM dan keterangan.',
                            'error_details' => $e->getMessage(),
                        ], 500);
                    }
                    break;

                default:
                    DB::rollBack();
                    return response()->json(['success' => false, 'message' => 'Tipe dokumen tidak valid.'], 400);
            }

            DB::commit();

            Log::info("Dokumen berhasil disimpan dengan ID: {$document->id} oleh: {$user->name} dan tipe: {$documentKey}");

            return response()->json([
                'success' => true,
                'message' => 'Dokumen berhasil disimpan ke database!',
                'document_id' => $document->id,
                'user_name' => $user->name,
            ], 201);

        } catch (Throwable $e) {
            DB::rollBack();
            
            // Tentukan jenis error berdasarkan pesan error
            $errorMessage = 'Terjadi kesalahan saat menyimpan dokumen.';
            
            if (str_contains($e->getMessage(), 'foreign key constraint')) {
                $errorMessage = 'Gagal menyimpan: Terdapat masalah dengan relasi data. Pastikan semua data valid.';
            } elseif (str_contains($e->getMessage(), 'Data too long')) {
                $errorMessage = 'Gagal menyimpan: Data yang diinput terlalu panjang. Periksa kembali input Anda.';
            } elseif (str_contains($e->getMessage(), 'Duplicate entry')) {
                $errorMessage = 'Gagal menyimpan: Data sudah ada sebelumnya. Periksa nomor pendaftaran atau identitas unik lainnya.';
            } elseif (str_contains($e->getMessage(), 'cannot be null')) {
                $errorMessage = 'Gagal menyimpan: Ada field wajib yang belum diisi. Periksa kembali semua field yang diperlukan.';
            } elseif (str_contains($e->getMessage(), 'Invalid datetime format')) {
                $errorMessage = 'Gagal menyimpan: Format tanggal tidak valid. Pastikan format tanggal sudah benar (YYYY-MM-DD).';
            }

            Log::error("Gagal menyimpan dokumen {$documentKey}: " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => $errorMessage,
                'document_type' => $documentKey,
                'error_details' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}

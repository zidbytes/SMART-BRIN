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
                    $authorString = $metadata['authorsCivitasPRSDI'] ?? '';
                    $authorsArray = array_filter(array_map('trim', explode(',', $authorString)));
                    $authorData = [];
                    foreach (array_slice($authorsArray, 0, 7) as $index => $authorName) {
                        $authorData['authors' . ($index + 1)] = $authorName;
                    }
                    
                    $publicationBaseData = [
                        'document_id' => $document->id,
                        'judul_publikasi' => $metadata['judul'],
                        'kelompok_riset' => $metadata['kelompokRiset'],
                        'nonprsdi_authors' => $metadata['authorsNonCivitasPRSDI'] ?? null,
                        'jenis' => $metadata['jenis DokumenJurnalProsidingBagbook'],
                        'status' => $metadata['statusDokumen'],
                        'nama_jurnal' => $metadata['namaJurnal/Prosiding'] ?? null,
                        'scopus_indexed' => isset($metadata['terindeksScopus']) && ($metadata['terindeksScopus'] === 'Ya'),
                        'reputasi' => $metadata['reputasiScopus'],
                        'file_drive_link' => $metadata['linkDrivePi'] ?? null,
                        'url' => $metadata['linkDokumen'] ?? null,
                        'doi' => $metadata['linkDOI'] ?? null,
                    ];
                    
                    $finalPublicationData = array_merge($publicationBaseData, $authorData);
                    DocumentPublication::create($finalPublicationData);
                    break;
                
                // ==========================================================
                // === KEKAYAAN INTELEKTUAL ===
                // ==========================================================
                case 'kekayaan-intelektual':
                    $inventorString = $metadata['PenciptaDariPusatRisetSainsDataDanInformasi'] ?? '';
                    $inventorsArray = array_filter(array_map('trim', explode(',', $inventorString)));
                    $inventorData = [];
                    foreach (array_slice($inventorsArray, 0, 8) as $index => $inventorName) {
                        $inventorData['inventors' . ($index + 1)] = $inventorName;
                    }

                    $kiBaseData = [
                        'document_id' => $document->id,
                        'judul_ki' => $metadata['judulciptaan'] ?? null,
                        'kelompok_riset' => $metadata['kelompokRiset'],
                        'status' => $metadata['Status'],
                        'nonprsdi_inventors' => $metadata['PenciptaNonPusatRisetSainsDataDanInformasi'] ?? null,
                        'jenis' => $metadata['JenisKekayaanIntelektual'],
                        'no_pendaftaran' => $metadata['nomorPermohonan'] ?? null,
                        'tanggal_daftar' => $metadata['tanggalPermohonan'] ?? null,
                        'no_sertifikat' => $metadata['nomorPencatatan'] ?? null,
                        'tanggal_sertifikasi' => $metadata['tanggalSertifikasi'] ?? null,
                        'link_upload' => $metadata['linkDriveKi'] ?? null,
                        'link_dokumen' => $metadata['linkDokumen'] ?? null,
                    ];

                    $finalKiData = array_merge($kiBaseData, $inventorData);
                    DocumentKekayaanIntelektual::create($finalKiData);
                    break;

                // ==========================================================
                // === STUDI LANJUT ===
                // ==========================================================    
                case 'studi-lanjut':
                    DocumentLoaStudiLanjut::create([
                        'document_id' => $document->id,
                        'nama_sdm_iptek' => $metadata['namaMahasiswaAtauPeserta'] ?? null,
                        'kelompok_riset' => $metadata['kelompokRiset'] ,
                        'jenjang_pendidikan' => $metadata['programPendidikan'] ,
                        'nama_universitas' => $metadata['namaUniversitasPenerima'] ?? null,
                        'status' => $metadata['status'],
                        'keterangan' => $metadata['keterangan'] ?? null,
                        'upload_dakung' => $metadata['linkDataPendukung'] ?? null,
                        'tahun_masuk' => $metadata['tahunMasuk'] ?? null,
                        'direct_evidence' => $metadata['linkDirectEvidence'] ?? null,
                    ]);
                    break;
                
                // ==========================================================
                // === PERJANJIAN KERJASAMA DAN DANA EKSTERNAL ===
                // ==========================================================
                case 'perjanjian-kerjasama':
                    $picString = $metadata['PICKegiatanSivitasPRSDI'] ?? '';
                    $picArray = array_filter(array_map('trim', explode(',', $picString)));
                    $picData = [];
                    foreach (array_slice($picArray, 0, 3) as $index => $picName) {
                        $picData['pic_prsdi' . ($index + 1)] = $picName;
                    }

                    $pksBaseData = [
                        'document_id' => $document->id,
                        'judul' => $metadata['judul'],
                        'kelompok_riset' => $metadata['kelompokRiset'],
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
                        'status' => $metadata['status'],
                        'tahun_pks' => $metadata['tahunPKS'] ?? null,
                        'link_bukti_dukung' => $metadata['linkDataPendukung'] ?? null,
                    ];
                    
                    $finalPksData = array_merge($pksBaseData, $picData);
                    DocumentPks::create($finalPksData);
                    break;
                
                // ==========================================================
                // === PURWARUPA ===
                // ==========================================================
                case 'purwarupa':
                    $inventorString = $metadata['PenciptaDariPusatRisetSainsDataDanInformasi'] ?? '';
                    $inventorsArray = array_filter(array_map('trim', explode(',', $inventorString)));
                    $inventorData = [];
                    foreach (array_slice($inventorsArray, 0, 5) as $index => $inventorName) {
                        $inventorData['inventor' . ($index + 1)] = $inventorName;
                    }

                    $purwarupaBaseData = [
                        'document_id' => $document->id,
                        'judul_purwarupa' => $metadata['judulciptaan'],
                        'kelompok_riset' => $metadata['kelompokRiset'],
                        'non_sivitas_prsdi' => $metadata['PenciptaNonPusatRisetSainsDataDanInformasi'] ?? null,
                        'jenis' => $metadata['jenisPurwarupa'],
                        'status' => $metadata['status'],
                        'nama_mitra' => $metadata['namaMitra'] ?? null,
                        'upload_gdrive' => $metadata['linkDrivePWRP'] ?? null,
                        'link' => $metadata['linkDirectEvidence'] ?? null,
                    ];

                    $finalPurwarupaData = array_merge($purwarupaBaseData, $inventorData);
                    DocumentPurwarupa::create($finalPurwarupaData);
                    break;
                
                // ==========================================================
                // === PDVR / PELATIHAN LUAR NEGERI ===
                // ==========================================================
                case 'pdvr':
                    DocumentPelatihanLuarNegeri::create([
                        'document_id' => $document->id,
                        'nama_sdm_prsdi' => $metadata['namaSdmPRSDI'] ?? null,
                        'non_sdm_prsdi' => $metadata['namaSdmNonPRSDI'] ?? null,
                        'kelompok_riset' => $metadata['kelompokRiset'],
                        'status' => $metadata['status'],
                        'jenis' => $metadata['lokasiKegiatan'],
                        'keterangan' => $metadata['keterangan'],
                        'upload_dakung' => $metadata['linkDataPendukung'] ?? null,
                        'direct_link' => $metadata['linkDirectEvidence'] ?? null,
                    ]);
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
            Log::error("Gagal menyimpan dokumen: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan internal saat menyimpan data.',
                'error_details' => $e->getMessage(),
            ], 500);
        }
    }
}

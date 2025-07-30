<?php

namespace App\Services;

class PromptService
{
    /**
     * Create a dynamic prompt for Mistral AI based on the document type.
     *
     * @param  string  $documentKey The key identifying the document type (e.g., 'publikasi-global').
     * @param  string  $textContent The text extracted from the PDF document.
     * @return string|null The generated prompt string, or null if the document key is invalid.
     */
    public function createPromptForDocument(string $documentKey, string $textContent): ?string
    {
        $baseInstruction = "You are an expert metadata extractor. From the following text, extract the required information and provide it strictly in JSON format. Do not include any explanatory text outside of the JSON object. If a field cannot be found, return an empty string for its value.";

        $fields = $this->getFieldsForDocument($documentKey);

        if (!$fields) {
            return null; // Return null if the document key is not found
        }

        return "{$baseInstruction}\n\nHere is the JSON structure to fill: {$fields}\n\nHere is the document text:\n\n---\n{$textContent}\n---";
    }

    /**
     * Get the JSON field structure for a given document key.
     *
     * @param  string  $documentKey
     * @return string|null
     */
    private function getFieldsForDocument(string $documentKey): ?string
    {
        switch ($documentKey) {
            // ====================================
            // Publikasi Global
            // ====================================
            case 'publikasi-global':
                return '{"judul": "", "authorsCivitasPRSDI": "", "authorsNonCivitasPRSDI": "", "jenisDokumenJurnalProsidingBagbook": "", "namaJurnal/Prosiding": "", "linkDOI": ""}';
            
            // ====================================
            // Kekayaan Intelektual
            // ====================================    
            case 'kekayaan-intelektual':
                return '{"judulciptaan": "", "PenciptaDariPusatRisetSainsDataDanInformasi": "", "PenciptaNonPusatRisetSainsDataDanInformasi": "", "jenisKekayaanIntelektualHakCiptaAtauPaten": "", "nomorPermohonan": "", "tanggalPermohonan": "", "nomorPencatatan": ""}';
            
            // ====================================
            // Perjanjian Kerjasama
            // ====================================    
            case 'perjanjian-kerjasama':
                return '{"title": "", "nomorPerjanjian": "", "pihak": "", "lingkup": "", "tanggal": "", "durasi": "", "penanggungJawab": ""}';
            
            // ====================================
            // Purwarupa
            // ====================================
            case 'purwarupa':
                return '{"judulciptaan": ", "PenciptaDariPusatRisetSainsDataDanInformasi": "", "PenciptaNonPusatRisetSainsDataDanInformasi": ""}' ;
            
            // ====================================
            // Studi Lanjut
            // ====================================    
            case 'studi-lanjut':
                return '{"peserta": "", "namaMahasiswaAtauPeserta": "", "programPendidikan": "", "namaUniversitasPenerima": "", "tahunMasuk": ""}';
            
            // ====================================
            // Postdoctoral dan Visiting Research
            // ====================================    
            case 'pdvr':
                return
            '# PERAN & TUJUAN
            Anda adalah asisten AI yang ahli dalam mengekstrak informasi dari dokumen terkait program Postdoctoral atau Visiting Research.

            # ATURAN OUTPUT
            - Output HARUS berupa objek JSON tunggal yang valid, tanpa komentar atau teks tambahan.
            - Jika sebuah informasi tidak dapat ditemukan di dalam teks, gunakan nilai `null`.

            # INSTRUKSI EKSTRAKSI FIELD
            - Cari nama lengkap peserta dalam dokumen.
            - Jika afiliasi peserta adalah "BRIN" atau "Pusat Riset Sains Data dan Informasi", masukkan nama tersebut ke field `namaSdmPRSDI` dan biarkan field `namaSdmNonPRSDI` kosong ("").
            - Jika afiliasi peserta BUKAN "BRIN" atau "Pusat Riset Sains Data dan Informasi", masukkan nama tersebut ke field `namaSdmNonPRSDI` dan biarkan field `namaSdmPRSDI` kosong ("").
            - `status`: Tentukan jenis program dengan mencari kata kunci "Postdoctoral" atau "Visiting Research" dalam dokumen. Jika dokumen mengandung kata "Postdoctoral", isi field ini dengan "Postdoctoral". Jika dokumen mengandung kata "Visiting Research", isi field ini dengan "Visiting Research".
            - `lokasiKegiatan`: Tentukan apakah lokasi kegiatan berada di "Dalam Negeri" atau "Luar Negeri".
            - `keterangan`: Tentukan afiliasi peserta sebagai "SDMI" atau "Non SDMI".
            - `status_upload`: Selalu isi dengan "Belum Upload".
            - `linkDataPendukung`: Selalu gunakan nilai `null`.

            # STRUKTUR JSON UNTUK DIISI
            {
                "namaSdmPRSDI": "",
                "namaSdmNonPRSDI": "",
                "status": "",
                "lokasiKegiatan": "",
                "keterangan": "",
                "status_upload": "Belum Upload",
                "linkDataPendukung": null
            }';

            default:
                return null;
        }
    }
}
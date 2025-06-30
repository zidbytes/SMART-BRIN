<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DetailController extends Controller
{
    public function index()
    {
        // Ambil data publikasi
        $publications = Document::where('document_type', 'publication')
            ->with('user', 'publication')
            ->latest()
            ->get()
            ->map(function ($document) {
                return [
                    'No' => $document->id,
                    'Periode Input' => $document->created_at->format('Y-m-d'),
                    'Bulan' => $document->created_at->format('F'),
                    'Monev Stamp' => $document->monev_stamp ? $document->monev_stamp->format('Y-m-d H:i') : '-',
                    'Judul Publikasi Global' => $document->title,
                    'Kelompok Riset' => $document->kelompok_riset ?? '-',
                    'Author 1' => $document->publication->authors1 ?? '-',
                    'Author 2' => $document->publication->authors2 ?? '-',
                    'Author 3' => $document->publication->authors3 ?? '-',
                    'Author 4' => $document->publication->authors4 ?? '-',
                    'Author 5' => $document->publication->authors5 ?? '-',
                    'Author 6' => $document->publication->authors6 ?? '-',
                    'Author Non-PRSDI' => $document->publication->nonprsdi_authors ?? '-',
                    'Jenis' => $document->publication->jenis ?? '-',
                    'Status' => $document->publication->status ?? '-',
                    'Nama Jurnal/Prosiding' => $document->publication->nama_jurnal ?? '-',
                    'Terindeks Scopus' => $document->publication->scopus_indexed ? 'Ya' : 'Tidak',
                    'Reputasi' => $document->publication->reputasi ?? '-',
                    'File di Google Drive' => $document->publication->file_drive_link ?? '-',
                    'URL' => $document->publication->url ?? '-',
                    'DOI' => $document->publication->doi ?? '-',
                ];
            });

        // Ambil data Kekayaan Intelektual
        $intellectualProperties = Document::where('document_type', 'intellectual_property')
            ->with('user', 'intellectualProperty')
            ->latest()
            ->get()
            ->map(function ($document) {
                return [
                    'No' => $document->id,
                    'Periode Input' => $document->created_at->format('Y-m-d'),
                    'Monev Stamp' => $document->monev_stamp ? $document->monev_stamp->format('Y-m-d H:i') : '-',
                    'Judul' => $document->title,
                    'Kelompok Riset' => $document->kelompok_riset ?? '-',
                    'Inventor 1' => $document->intellectualProperty->inventors[0] ?? '-',
                    'Inventor 2' => $document->intellectualProperty->inventors[1] ?? '-',
                    'Inventor 3' => $document->intellectualProperty->inventors[2] ?? '-',
                    'Inventor 4' => $document->intellectualProperty->inventors[3] ?? '-',
                    'Inventor 5' => $document->intellectualProperty->inventors[4] ?? '-',
                    'Inventor 6' => $document->intellectualProperty->inventors[5] ?? '-',
                    'Inventor 7' => $document->intellectualProperty->inventors[6] ?? '-',
                    'Inventor 8' => $document->intellectualProperty->inventors[7] ?? '-',
                    'Non Sivitas PRSDI' => implode(', ', $document->intellectualProperty->nonprsdi_inventors ?? []) ?: '-',
                    'Status' => $document->intellectualProperty->status ?? '-',
                    'Jenis' => $document->intellectualProperty->jenis ?? '-',
                    'No Pendaftaran' => $document->intellectualProperty->no_pendaftaran ?? '-',
                    'Tanggal Daftar' => $document->intellectualProperty->tanggal_daftar?->format('Y-m-d') ?? '-',
                    'No Sertifikat' => $document->intellectualProperty->no_sertifikat ?? '-',
                    'Tanggal Sertifikasi' => $document->intellectualProperty->tanggal_sertifikasi?->format('Y-m-d') ?? '-',
                    'Link Upload' => $document->intellectualProperty->link_upload ?? '-',
                    'LINK Dokumen' => $document->intellectualProperty->link_dokumen ?? '-',
                ];
            });

        // Ambil data PKS
        $pksData = Document::where('document_type', 'pks')
            ->with('user', 'pks')
            ->latest()
            ->get()
            ->map(function ($document) {
                return [
                    'NO' => $document->id,
                    'Periode Input' => $document->created_at->format('Y-m-d'),
                    'Periode Stamp' => $document->monev_stamp?->format('Y-m-d H:i') ?? '-',
                    'JUDUL' => $document->title,
                    'KELOMPOK RISET' => $document->kelompok_riset ?? '-',
                    '1' => $document->pks->pic_prsdi[0] ?? '-',
                    '2' => $document->pks->pic_prsdi[1] ?? '-',
                    '3' => $document->pks->pic_prsdi[2] ?? '-',
                    'NON SIVITAS PRSDI' => implode(', ', $document->pks->pic_nonprsdi ?? []) ?: '-',
                    'TIPE' => $document->pks->tipe ?? '-',
                    'JENIS' => $document->pks->jenis ?? '-',
                    'SUMBER' => $document->pks->sumber ?? '-',
                    'OUTPUT' => $document->pks->output ?? '-',
                    'PIHAK K3' => $document->pks->pihak_k3 ?? '-',
                    'NILAI' => $document->pks->nilai ?? '-',
                    'KETERANGAN' => $document->pks->keterangan ?? '-',
                    'NO KERJASAMA' => $document->pks->no_kerjasama ?? '-',
                    'TANGGAL KERJASAMA' => $document->pks->tanggal_kerjasama?->format('Y-m-d') ?? '-',
                    'NO PERJANJIAN' => $document->pks->no_perjanjian ?? '-',
                    'TANGGAL PERJANJIAN' => $document->pks->tanggal_perjanjian?->format('Y-m-d') ?? '-',
                    'LINK UPLOAD' => $document->pks->link_upload ?? '-',
                    'STATUS UPLOAD' => $document->pks->status_upload ?? '-',
                    'TAHUN PKS' => $document->pks->tahun_pks ?? '-',
                    'LINK BUKTI DUKUNG' => $document->pks->link_bukti_dukung ?? '-',
                    'CATATAN' => $document->pks->catatan ?? '-',
                    'JUMLAH' => $document->pks->jumlah_keuangan ?? '-',
                ];
            });

        // Ambil data LoA Studi Lanjut
        $furtherStudyData = Document::where('document_type', 'further_study')
            ->with('user', 'furtherStudy')
            ->latest()
            ->get()
            ->map(function ($document) {
                return [
                    'NO' => $document->id,
                    'Periode Stamp' => $document->monev_stamp?->format('Y-m-d H:i') ?? '-',
                    'NAMA SDM IPTEK' => $document->furtherStudy->nama_sdm_iptek ?? '-',
                    'KELOMPOK RISET' => $document->kelompok_riset ?? '-',
                    'JENJANG PENDIDIKAN DITEMPUH' => $document->furtherStudy->jenjang_pendidikan ?? '-',
                    'NAMA UNIVERSITAS' => $document->furtherStudy->nama_universitas ?? '-',
                    'STATUS' => $document->status,
                    'KETERANGAN' => $document->furtherStudy->keterangan ?? '-',
                    'UPLOAD DAKUNG' => $document->furtherStudy->upload_dakung ?? '-',
                    'tahun masuk' => $document->furtherStudy->tahun_masuk ?? '-',
                    'direct evidence' => $document->furtherStudy->direct_evidence ?? '-',
                ];
            });

        // Ambil data Pelatihan Luar Negeri
        $overseasTrainingData = Document::where('document_type', 'overseas_training')
            ->with('user', 'overseasTraining')
            ->latest()
            ->get()
            ->map(function ($document) {
                return [
                    'NO' => $document->id,
                    'Periode Stamp' => $document->monev_stamp?->format('Y-m-d H:i') ?? '-',
                    'NAMA SDM PRSDI' => $document->overseasTraining->nama_sdm_prsdi ?? '-',
                    'NON SDM PRSDI' => $document->overseasTraining->non_sdm_prsdi ?? '-',
                    'KELOMPOK RISET' => $document->kelompok_riset ?? '-',
                    'STATUS' => $document->status,
                    'JENIS' => $document->overseasTraining->jenis ?? '-',
                    'KETERANGAN' => $document->overseasTraining->keterangan ?? '-',
                    'UPLOAD DAKUNG' => $document->overseasTraining->upload_dakung ?? '-',
                    'direct link' => $document->overseasTraining->direct_link ?? '-',
                ];
            });

        // Ambil data Purwarupa (jika termasuk KI dengan jenis Purwarupa)
        $purwarupaData = Document::where('document_type', 'intellectual_property')
            ->with('user', 'intellectualProperty')
            ->whereHas('intellectualProperty', function ($q) {
                $q->where('jenis', 'Purwarupa');
            })
            ->latest()
            ->get()
            ->map(function ($document) {
                return [
                    'NO' => $document->id,
                    'Periode Input' => $document->created_at->format('Y-m-d'),
                    'Periode Stamp' => $document->monev_stamp?->format('Y-m-d H:i') ?? '-',
                    'Judul Purwarupa' => $document->title,
                    'KELOMPOK RISET' => $document->kelompok_riset ?? '-',
                    'Inventor 1' => $document->intellectualProperty->inventors[0] ?? '-',
                    'Inventor 2' => $document->intellectualProperty->inventors[1] ?? '-',
                    'Inventor 3' => $document->intellectualProperty->inventors[2] ?? '-',
                    'Inventor 4' => $document->intellectualProperty->inventors[3] ?? '-',
                    'Inventor 5' => $document->intellectualProperty->inventors[4] ?? '-',
                    'NON SIVITAS PRSDI' => implode(', ', $document->intellectualProperty->nonprsdi_inventors ?? []) ?: '-',
                    'JENIS' => $document->intellectualProperty->jenis ?? '-',
                    'STATUS' => $document->intellectualProperty->status ?? '-',
                    'NAMA MITRA' => '-',
                    'UPLOAD GDRIVE' => $document->intellectualProperty->link_upload ?? '-',
                    'LINK' => $document->intellectualProperty->link_dokumen ?? '-',
                ];
            });

        return Inertia::render('details', [
            'publications' => $publications,
            'intellectualProperties' => $intellectualProperties,
            'pksData' => $pksData,
            'furtherStudyData' => $furtherStudyData,
            'overseasTrainingData' => $overseasTrainingData,
            'purwarupaData' => $purwarupaData,
        ]);
    }
}

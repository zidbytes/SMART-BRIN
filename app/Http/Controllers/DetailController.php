<?php

namespace App\Http\Controllers;

use App\Models\DocumentPublication;
use App\Models\DocumentKekayaanIntelektual;
use App\Models\DocumentLoaStudiLanjut;
use App\Models\DocumentPelatihanLuarNegeri;
use App\Models\DocumentPks;
use App\Models\DocumentPurwarupa;
use Inertia\Inertia;

class DetailController extends Controller
{
    public function index()
    {
        // Publikasi
        $publications = DocumentPublication::with('document')
            ->get()
            ->map(function ($pub) {
                return [
                    'No' => $pub->id,
                    'Periode Input' => $pub->document?->created_at?->format('Y-m-d') ?? '-',
                    'Bulan' => $pub->document?->created_at?->format('F') ?? '-',
                    'Monev Stamp' => $pub->document?->monev_stamp?->format('Y-m-d H:i') ?? '-',
                    'Judul Publikasi Global' => $pub->document?->title ?? '-',
                    'Kelompok Riset' => $pub->document?->kelompok_riset ?? '-',
                    'Author 1' => $pub->authors1 ?? '-',
                    'Author 2' => $pub->authors2 ?? '-',
                    'Author 3' => $pub->authors3 ?? '-',
                    'Author 4' => $pub->authors4 ?? '-',
                    'Author 5' => $pub->authors5 ?? '-',
                    'Author 6' => $pub->authors6 ?? '-',
                    'Author 7' => $pub->authors7 ?? '-',
                    'Author Non-PRSDI' => $pub->nonprsdi_authors ?? '-',
                    'Jenis' => $pub->jenis ?? '-',
                    'Status' => $pub->status ?? '-',
                    'Nama Jurnal/Prosiding' => $pub->nama_jurnal ?? '-',
                    'Terindeks Scopus' => $pub->scopus_indexed ? 'Ya' : 'Tidak',
                    'Reputasi' => $pub->reputasi ?? '-',
                    'File di Google Drive' => $pub->file_drive_link ?? '-',
                    'URL' => $pub->url ?? '-',
                    'DOI' => $pub->doi ?? '-',
                ];
            });

        // Kekayaan Intelektual
        $intellectualProperties = DocumentKekayaanIntelektual::with('document')
            ->get()
            ->map(function ($ip) {
                return [
                    'No' => $ip->id,
                    'Periode Input' => $ip->document?->created_at?->format('Y-m-d') ?? '-',
                    'Monev Stamp' => $ip->document?->monev_stamp?->format('Y-m-d H:i') ?? '-',
                    'Judul' => $ip->document?->title ?? '-',
                    'Kelompok Riset' => $ip->document?->kelompok_riset ?? '-',
                    'Inventor 1' => $ip->inventors1 ?? '-',
                    'Inventor 2' => $ip->inventors2 ?? '-',
                    'Inventor 3' => $ip->inventors3 ?? '-',
                    'Inventor 4' => $ip->inventors4 ?? '-',
                    'Inventor 5' => $ip->inventors5 ?? '-',
                    'Inventor 6' => $ip->inventors6 ?? '-',
                    'Inventor 7' => $ip->inventors7 ?? '-',
                    'Inventor 8' => $ip->inventors8 ?? '-',
                    'Non Sivitas PRSDI' => $ip->nonprsdi_inventors ?? '-',
                    'Status' => $ip->status ?? '-',
                    'Jenis' => $ip->jenis ?? '-',
                    'No Pendaftaran' => $ip->no_pendaftaran ?? '-',
                    'Tanggal Daftar' => $ip->tanggal_daftar?->format('Y-m-d') ?? '-',
                    'No Sertifikat' => $ip->no_sertifikat ?? '-',
                    'Tanggal Sertifikasi' => $ip->tanggal_sertifikasi?->format('Y-m-d') ?? '-',
                    'Link Upload' => $ip->link_upload ?? '-',
                    'LINK Dokumen' => $ip->link_dokumen ?? '-',
                ];
            });

        // PKS
        $pksData = DocumentPks::with('document')
            ->get()
            ->map(function ($pks) {
                return [
                    'No' => $pks->id,
                    'Periode Input' => $pks->document?->created_at?->format('Y-m-d') ?? '-',
                    'Periode Stamp' => $pks->document?->monev_stamp?->format('Y-m-d H:i') ?? '-',
                    'JUDUL' => $pks->document?->title ?? '-',
                    'KELOMPOK RISET' => $pks->document?->kelompok_riset ?? '-',
                    '1' => $pks->pic_prsdi1 ?? '-',
                    '2' => $pks->pic_prsdi2 ?? '-',
                    '3' => $pks->pic_prsdi3 ?? '-',
                    'NON SIVITAS PRSDI' => $pks->pic_nonprsdi ?? '-',
                    'TIPE' => $pks->tipe ?? '-',
                    'JENIS' => $pks->jenis ?? '-',
                    'SUMBER' => $pks->sumber ?? '-',
                    'OUTPUT' => $pks->output ?? '-',
                    'PIHAK K3' => $pks->pihak_k3 ?? '-',
                    'NILAI' => $pks->nilai ?? '-',
                    'KETERANGAN' => $pks->keterangan ?? '-',
                    'NO KERJASAMA' => $pks->no_kerjasama ?? '-',
                    'TANGGAL KERJASAMA' => $pks->tanggal_kerjasama?->format('Y-m-d') ?? '-',
                    'NO PERJANJIAN' => $pks->no_perjanjian ?? '-',
                    'TANGGAL PERJANJIAN' => $pks->tanggal_perjanjian?->format('Y-m-d') ?? '-',
                    'LINK UPLOAD' => $pks->link_upload ?? '-',
                    'STATUS UPLOAD' => $pks->status_upload ?? '-',
                    'TAHUN PKS' => $pks->tahun_pks ?? '-',
                    'LINK BUKTI DUKUNG' => $pks->link_bukti_dukung ?? '-',
                    'CATATAN' => $pks->catatan ?? '-',
                    'JUMLAH' => $pks->jumlah_keuangan ?? '-',
                ];
            });

        // SDM Studi PRSDI (LoA Studi Lanjut)
        $furtherStudyData = DocumentLoaStudiLanjut::with('document')
            ->get()
            ->map(function ($fs) {
                return [
                    'No' => $fs->id,
                    'Periode Stamp' => $fs->document?->monev_stamp?->format('Y-m-d H:i') ?? '-',
                    'NAMA SDM IPTEK' => $fs->nama_sdm_iptek ?? '-',
                    'KELOMPOK RISET' => $fs->document?->kelompok_riset ?? '-',
                    'JENJANG PENDIDIKAN DITEMPUH' => $fs->jenjang_pendidikan ?? '-',
                    'NAMA UNIVERSITAS' => $fs->nama_universitas ?? '-',
                    'STATUS' => $fs->status ?? '-',
                    'KETERANGAN' => $fs->keterangan ?? '-',
                    'UPLOAD DAKUNG' => $fs->upload_dakung ?? '-',
                    'tahun masuk' => $fs->tahun_masuk ?? '-',
                    'direct evidence' => $fs->direct_evidence ?? '-',
                ];
            });

        // PDVR (Pelatihan Luar Negeri)
        $overseasTrainingData = DocumentPelatihanLuarNegeri::with('document')
            ->get()
            ->map(function ($ot) {
                return [
                    'No' => $ot->id,
                    'Periode Stamp' => $ot->document?->monev_stamp?->format('Y-m-d H:i') ?? '-',
                    'NAMA SDM PRSDI' => $ot->nama_sdm_prsdi ?? '-',
                    'NON SDM PRSDI' => $ot->non_sdm_prsdi ?? '-',
                    'KELOMPOK RISET' => $ot->kelompok_riset ?? '-',
                    'STATUS' => $ot->status ?? '-',
                    'JENIS' => $ot->jenis ?? '-',
                    'KETERANGAN' => $ot->keterangan ?? '-',
                    'UPLOAD DAKUNG' => $ot->upload_dakung ?? '-',
                    'direct link' => $ot->direct_link ?? '-',
                ];
            });

        // Purwarupa
        $purwarupaData = DocumentPurwarupa::with('document')
            ->get()
            ->map(function ($purwarupa) {
                return [
                    'No' => $purwarupa->id,
                    'Periode Input' => $purwarupa->document?->created_at?->format('Y-m-d') ?? '-',
                    'Periode Stamp' => $purwarupa->document?->monev_stamp?->format('Y-m-d H:i') ?? '-',
                    'Judul Purwarupa' => $purwarupa->judul_purwarupa ?? '-',
                    'KELOMPOK RISET' => $purwarupa->kelompok_riset ?? '-',
                    'Inventor 1' => $purwarupa->inventor1 ?? '-',
                    'Inventor 2' => $purwarupa->inventor2 ?? '-',
                    'Inventor 3' => $purwarupa->inventor3 ?? '-',
                    'Inventor 4' => $purwarupa->inventor4 ?? '-',
                    'Inventor 5' => $purwarupa->inventor5 ?? '-',
                    'NON SIVITAS PRSDI' => $purwarupa->non_sivitas_prsdi ?? '-',
                    'JENIS' => $purwarupa->jenis ?? '-',
                    'STATUS' => $purwarupa->status ?? '-',
                    'NAMA MITRA' => $purwarupa->nama_mitra ?? '-',
                    'UPLOAD GDRIVE' => $purwarupa->upload_gdrive ?? '-',
                    'LINK' => $purwarupa->link ?? '-',
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
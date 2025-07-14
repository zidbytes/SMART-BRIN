export type FieldTemplate = {
    label: string;
    name: string;
    type: 'text' | 'select' | 'date';
    options?: { value: string; label: string }[];
    placeholder?: string;
};

export const fieldTemplates: Record<string, FieldTemplate[]> = {
    // ==============================================
    // PUBLIKASI GLOBAL
    // ==============================================
    Publikasi: [
        { label: 'Judul Publikasi Global', name: 'judul', type: 'text' },
        {
            label: 'Kelompok Riset',
            name: 'kelompokRiset',
            type: 'select',
            options: [
                { value: 'Information Retrieval', label: 'Information Retrieval' },
                { value: 'Human Computer Interaction and Visualisation', label: 'Human Computer Interaction and Visualisation' },
                { value: 'Knowledge and Data Engineering', label: 'Knowledge and Data Engineering' },
                { value: 'Digital Government', label: 'Digital Government' },
                { value: 'Natural Language Processing', label: 'Natural Language Processing' },
            ],
        },
        { label: 'Authors', name: 'authorsCivitasPRSDI', type: 'text', placeholder: 'Kosongkan jika tidak ada' },
        { label: 'Authors Non-PRSDI', name: 'authorsNonCivitasPRSDI', type: 'text', placeholder: 'Kosongkan jika tidak ada' },
        {
            label: 'Jenis Dokumen Publikasi',
            name: 'jenis DokumenJurnalProsidingBagbook',
            type: 'select',
            options: [
                { value: 'Jurnal', label: 'Jurnal' },
                { value: 'Prosiding', label: 'Prosiding' },
                { value: 'Bag Book', label: 'Bag Book' },
            ],
        },
        {
            label: 'Status Dokumen Publikasi',
            name: 'statusDokumen',
            type: 'select',
            options: [
                { value: 'Published', label: 'Published' },
                { value: 'Accepted', label: 'Accepted' },
            ],
        },
        { label: 'Nama Jurnal/Prosiding', name: 'namaJurnal/Prosiding', type: 'text' },
        {
            label: 'Terindeks Scopus',
            name: 'terindeksScopus',
            type: 'select',
            options: [
                { value: 'Ya', label: 'Ya' },
                { value: 'Tidak', label: 'Tidak' },
            ],
        },
        {
            label: 'Reputasi Scopus',
            name: 'reputasiScopus',
            type: 'select',
            options: [
                { value: 'Q1', label: 'Q1' },
                { value: 'Q2', label: 'Q2' },
                { value: 'Q3', label: 'Q3' },
                { value: 'Q4', label: 'Q4' },
                { value: 'Tidak', label: 'Tidak' },
            ],
        },
        { label: 'Link Drive Publikasi', name: 'linkDrivePi', type: 'text', placeholder: 'Contoh: https://drive.google.com/' },
        { label: 'Link URL Dokumen', name: 'linkDokumen', type: 'text', placeholder: 'Contoh: https://drive.google.com/' },
        { label: 'DOI', name: 'linkDOI', type: 'text' },
    ],

    // ==============================================
    // KEKAYAAN INTELEKTUAL (KI)
    // ==============================================
    KI: [
        { label: 'Judul Inovasi/Karya', name: 'judulciptaan', type: 'text' },
        {
            label: 'Kelompok Riset',
            name: 'kelompokRiset',
            type: 'select',
            options: [
                { value: 'Information Retrieval', label: 'Information Retrieval' },
                { value: 'Human Computer Interaction and Visualisation', label: 'Human Computer Interaction and Visualisation' },
                { value: 'Knowledge and Data Engineering', label: 'Knowledge and Data Engineering' },
                { value: 'Digital Government', label: 'Digital Government' },
                { value: 'Natural Language Processing', label: 'Natural Language Processing' },
            ],
        },
        {
            label: 'Status',
            name: 'Status',
            type: 'select',
            options: [
                { value: 'Tersertifikasi', label: 'Tersertifikasi' },
                { value: 'Terdaftar DJKI', label: 'Terdaftar DJKI' },
            ],
        },
        { label: 'Inventor', name: 'PenciptaDariPusatRisetSainsDataDanInformasi', type: 'text' },
        { label: 'Inventor Non Sivitas PRSDI', name: 'PenciptaNonPusatRisetSainsDataDanInformasi', type: 'text' },
        {
            label: 'Jenis Kekayaan Intelektual',
            name: 'JenisKekayaanIntelektual',
            type: 'select',
            options: [
                { value: 'Hak Cipta', label: 'Hak Cipta' },
                { value: 'Paten', label: 'Paten' },
            ],
        },
        { label: 'Nomor Pendaftaran', name: 'nomorPermohonan', type: 'text' },
        { label: 'Tanggal Daftar', name: 'tanggalPermohonan', type: 'date' },
        { label: 'Nomor Sertifikat', name: 'nomorPencatatan', type: 'text' },
        { label: 'Tanggal Sertifikasi', name: 'tanggalSertifikasi', type: 'date', placeholder: 'Contoh: 1 Januari 2025 ' },
        { label: 'Link Drive KI', name: 'linkDriveKi', type: 'text', placeholder: 'Contoh: https://drive.google.com/' },
        { label: 'Link Dokumen', name: 'linkDokumen', type: 'text', placeholder: 'Contoh: https://drive.google.com/' },
    ],

    // ==============================================
    // PERJANJIAN KERJASAMA (PKS) dan DANA EKSTERNAL
    // ==============================================
    PKS: [
        { label: 'Judul', name: 'judul', type: 'text' },
        {
            label: 'Kelompok Riset',
            name: 'kelompokRiset',
            type: 'select',
            options: [
                { value: 'Information Retrieval', label: 'Information Retrieval' },
                { value: 'Human Computer Interaction and Visualisation', label: 'Human Computer Interaction and Visualisation' },
                { value: 'Knowledge and Data Engineering', label: 'Knowledge and Data Engineering' },
                { value: 'Digital Government', label: 'Digital Government' },
                { value: 'Natural Language Processing', label: 'Natural Language Processing' },
            ],
        },
        { label: 'PIC Kegiatan (Sivitas PRSDI)', name: 'PICKegiatanSivitasPRSDI', type: 'text', placeholder: 'Kosongkan jika tidak ada' },
        { label: 'PIC Kegiatan (Non Sivitas PRSDI)', name: 'PICKegiatanNonSivitasPRSDI', type: 'text', placeholder: 'Kosongkan jika tidak ada' },
        {
            label: 'Tipe',
            name: 'tipe',
            type: 'select',
            options: [
                { value: 'Dana Eksternal', label: 'Dana Eksternal' },
                { value: 'Kerjasama', label: 'Kerjasama' },
                { value: 'Dana Eksternal dan Kerjasama', label: 'Dana Eksternal dan Kerjasama' },
            ],
        },
        {
            label: 'Jenis',
            name: 'jenis',
            type: 'select',
            options: [
                { value: 'Dalam Negeri', label: 'Dalam Negeri' },
                { value: 'Luar Negeri', label: 'Luar Negeri' },
            ],
        },
        { label: 'Sumber', name: 'sumber', type: 'text' },
        {
            label: 'Output',
            name: 'output',
            type: 'select',
            options: [
                { value: 'In Cash', label: 'In Cash' },
                { value: 'In Kind', label: 'In Kind' },
            ],
        },
        { label: 'Pihak K3', name: 'pihakK3', type: 'text', placeholder: 'Kosongkan jika tidak ada' },
        { label: 'Nilai', name: 'nilai', type: 'text', placeholder: 'Contoh: 100.000.000, Jika tidak ada tuliskan: 0' },
        { label: 'Keterangan', name: 'keterangan', type: 'text', placeholder: 'Kosongkan jika tidak ada' },
        { label: 'No Kerjasama', name: 'noKerjasama', type: 'text', placeholder: 'Kosongkan jika tidak ada' },
        { label: 'Tanggal Kerjasama', name: 'tglKerjasama', type: 'date' },
        { label: 'No Perjanjian', name: 'noPerjanjian', type: 'text', placeholder: 'Kosongkan jika tidak ada' },
        { label: 'Link Upload', name: 'linkUpload', type: 'text', placeholder: 'Contoh: https://drive.google.com/' },
        {
            label: 'Status Upload',
            name: 'status',
            type: 'select',
            options: [
                { value: 'Sudah', label: 'Sudah' },
                { value: 'Belum', label: 'Belum' },
            ],
        },
        { label: 'Tanggal Perjanjian', name: 'tglPerjanjian', type: 'date' },
        { label: 'Tahun PKS', name: 'tahunPKS', type: 'text', placeholder: 'Kosongkan jika tidak ada' },
        { label: 'Link Data Pendukung', name: 'linkDataPendukung', type: 'text', placeholder: 'Contoh: https://drive.google.com/' },
    ],

    // ==============================================
    // PURWARUPA
    // ==============================================
    Purwarupa: [
        { label: 'Judul Purwarupa', name: 'judulciptaan', type: 'text' },
        {
            label: 'Kelompok Riset',
            name: 'kelompokRiset',
            type: 'select',
            options: [
                { value: 'Information Retrieval', label: 'Information Retrieval' },
                { value: 'Human Computer Interaction and Visualisation', label: 'Human Computer Interaction and Visualisation' },
                { value: 'Knowledge and Data Engineering', label: 'Knowledge and Data Engineering' },
                { value: 'Digital Government', label: 'Digital Government' },
                { value: 'Natural Language Processing', label: 'Natural Language Processing' },
            ],
        },
        { label: 'Inventor', name: 'PenciptaDariPusatRisetSainsDataDanInformasi', type: 'text' },
        { label: 'Inventor Non Sivitas PRSDI', name: 'PenciptaNonPusatRisetSainsDataDanInformasi', type: 'text' },
        {
            label: 'Jenis Purwarupa',
            name: 'jenisPurwarupa',
            type: 'select',
            options: [
                { value: 'Software Prototype', label: 'Software Prototype' },
                { value: 'Lainnya', label: 'Lainnya' },
            ],
        },
        {
            label: 'Status',
            name: 'status',
            type: 'select',
            options: [
                { value: 'Sertifikasi', label: 'Sertifikasi' },
                { value: 'Belum Sertifikasi', label: 'Belum Sertifikasi' },
            ],
        },
        { label: 'Nama Mitra', name: 'namaMitra', type: 'text', placeholder: 'Contoh: Unit Hemodialisis RSUD Cimacan Cianjur ' },
        { label: 'Link Drive PWRP', name: 'linkDrivePWRP', type: 'text', placeholder: 'Contoh: https://drive.google.com/' },
        { label: 'Link Direct Evidence', name: 'linkDirectEvidence', type: 'text', placeholder: 'Contoh: https://drive.google.com/' },
    ],

    // ==============================================
    // Studi Lanjut Dalam dan Luar Negeri
    // ==============================================
    StudiLanjut: [
        { label: 'Nama SDM Studi Lanjut', name: 'namaMahasiswaAtauPeserta', type: 'text' },
        {
            label: 'Kelompok Riset',
            name: 'kelompokRiset',
            type: 'select',
            options: [
                { value: 'Information Retrieval', label: 'Information Retrieval' },
                { value: 'Human Computer Interaction and Visualisation', label: 'Human Computer Interaction and Visualisation' },
                { value: 'Knowledge and Data Engineering', label: 'Knowledge and Data Engineering' },
                { value: 'Digital Government', label: 'Digital Government' },
                { value: 'Natural Language Processing', label: 'Natural Language Processing' },
            ],
        },
        {
            label: 'Jenjang Pendidikan Ditempuh',
            name: 'programPendidikan',
            type: 'select',
            options: [
                { value: 'S2', label: 'S2' },
                { value: 'S3', label: 'S3' },
            ],
        },
        { label: 'Nama Universitas', name: 'namaUniversitasPenerima', type: 'text' },
        {
            label: 'Status',
            name: 'status',
            type: 'select',
            options: [
                { value: 'Tugas Belajar DBR', label: 'Tugas Belajar DBR' },
                { value: 'ongoing S2', label: 'ongoing S2' },
            ],
        },
        { label: 'Keterangan', name: 'keterangan', type: 'text', placeholder: 'Contoh: "Mulai Tugas Belajar bulan Agustus 2025"' },
        { label: 'Link Data Pendukung', name: 'linkDataPendukung', type: 'text', placeholder: 'Contoh: https://drive.google.com/' },
        { label: 'Tahun Masuk', name: 'tahunMasuk', type: 'text' },
        { label: 'Link Direct Evidence ', name: 'linkDirectEvidence', type: 'text', placeholder: 'Contoh: https://drive.google.com/pdf/..' },
    ],

    // ==============================================
    // PDVR ( Postdoctoral dan Visiting Research )
    // ==============================================
    PDVR: [
        { label: 'Nama SDM PRSDI', name: 'namaSdmPRSDI', type: 'text', placeholder: 'Kosongkan jika tidak ada' },
        { label: 'Nama Non SDM PRSDI', name: 'namaSdmNonPRSDI', type: 'text', placeholder: 'Jika kosong isi dengan: - ' },
        {
            label: 'Kelompok Riset',
            name: 'kelompokRiset',
            type: 'select',
            options: [
                { value: 'Information Retrieval', label: 'Information Retrieval' },
                { value: 'Human Computer Interaction and Visualisation', label: 'Human Computer Interaction and Visualisation' },
                { value: 'Knowledge and Data Engineering', label: 'Knowledge and Data Engineering' },
                { value: 'Digital Government', label: 'Digital Government' },
                { value: 'Natural Language Processing', label: 'Natural Language Processing' },
            ],
        },
        {
            label: 'Status',
            name: 'status',
            type: 'select',
            options: [
                { value: 'POSTDOCTORAL', label: 'POSTDOCTORAL' },
                { value: 'VISITING RESEARCH', label: 'VISITING RESEARCH' },
            ],
        },

        {
            label: 'Lokasi Kegiatan',
            name: 'lokasiKegiatan',
            type: 'select',
            options: [
                { value: 'Dalam Negeri', label: 'Dalam Negeri' },
                { value: 'Luar Negeri', label: 'Luar Negeri' },
            ],
        },
        {
            label: 'Keterangan',
            name: 'keterangan',
            type: 'select',
            options: [
                { value: 'SDMI', label: 'SDMI' },
                { value: 'Non SDMI', label: 'Non SDMI' },
            ],
        },
        { label: 'Link Data Pendukung', name: 'linkDataPendukung', type: 'text', placeholder: 'Contoh: https://drive.google.com/' },
        { label: 'Link Direct Evidence ', name: 'linkDirectEvidence', type: 'text', placeholder: 'Contoh: https://drive.google.com/pdf/..' },
    ],
};

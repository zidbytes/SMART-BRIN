import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import patternBg from '../assets/bg-pattern3.png'; // Import background pattern

export default function Details() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Details', href: '/details' },
    ];

    const tabs = [
        { id: 'publikasi', title: 'Capaian Publikasi Global PRSDI' },
        { id: 'ki', title: 'Capaian Kekayaan Intelektual PRSDI' },
        { id: 'dana-eksternal', title: 'CAP DANA EKSTERNAL PRSDI' },
        { id: 'sdm-studi', title: 'CAP SDM Studi PRSDI' },
        { id: 'purwarupa', title: 'Capaian PURWARUPA PRSDI' },
        { id: 'pdvr', title: 'CAP PDVR PRSDI' },
    ];

    const [activeTab, setActiveTab] = useState('publikasi');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Details Capaian PRSDI" />
            <div
                className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6 overflow-x-auto"
                style={{
                    backgroundImage: `url(${patternBg})`,
                    backgroundColor: '#f3f4f6',
                }}
            >
                {/* Header */}
                <div className="mb-4">
                    <h1 className="text-4xl font-extrabold text-[#E62F2A] mb-1">Details Capaian PRSDI</h1>
                    <p className="text-neutral-500 text-md">Rincian capaian PRSDI berdasarkan data terbaru.</p>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200 bg-white rounded-lg shadow-md p-4">
                    <nav className="flex space-x-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 text-sm font-medium ${
                                    activeTab === tab.id
                                        ? 'text-[#E62F2A] border-b-2 border-[#E62F2A]'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.title}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {activeTab === 'publikasi' && (
                        <Table
                            title="Capaian Publikasi Global PRSDI"
                            columns={[
                                'No', 'Periode Input', 'Bulan', 'Monev Stamp', 'Judul Publikasi Global', 'Kelompok Riset',
                                'Author 1', 'Author 2', 'Author 3', 'Author 4', 'Author 5', 'Author 6', 'Author 7',
                                'Author Non-PRSDI', 'Jenis', 'Status', 'Nama Jurnal/Prosiding', 'Terindeks Scopus',
                                'Reputasi', 'File di Google Drive', 'URL', 'DOI',
                            ]}
                            data={[]} // Tambahkan data asli di sini
                        />
                    )}
                    {activeTab === 'ki' && (
                        <Table
                            title="Capaian Kekayaan Intelektual PRSDI"
                            columns={[
                                'No', 'Periode Input', 'Monev Stamp', 'Judul', 'Kelompok Riset', 'Inventor 1', 'Inventor 2',
                                'Inventor 3', 'Inventor 4', 'Inventor 5', 'Inventor 6', 'Inventor 7', 'Inventor 8',
                                'Non Sivitas PRSDI', 'Status', 'Jenis', 'No Pendaftaran', 'Tanggal Daftar', 'No Sertifikat',
                                'Tanggal Sertifikasi', 'Link Upload', 'LINK Dokumen',
                            ]}
                            data={[]} // Tambahkan data asli di sini
                        />
                    )}
                    {activeTab === 'dana-eksternal' && (
                        <Table
                            title="CAP DANA EKSTERNAL PRSDI"
                            columns={[
                                'NO', 'Periode Input', 'Periode Stamp', 'JUDUL', 'KELOMPOK RISET', '1', '2', '3',
                                'NON SIVITAS PRSDI', 'TIPE', 'JENIS', 'SUMBER', 'OUTPUT', 'PIHAK K3', 'NILAI', 'KETERANGAN',
                                'NO KERJASAMA', 'TANGGAL KERJASAMA', 'NO PERJANJIAN', 'TANGGAL PERJANJIAN', 'LINK UPLOAD',
                                'STATUS UPLOAD', 'TAHUN PKS', 'LINK BUKTI DUKUNG', 'CATATAN', 'KEUANGAN', 'JUMLAH',
                            ]}
                            data={[]} // Tambahkan data asli di sini
                        />
                    )}
                    {activeTab === 'sdm-studi' && (
                        <Table
                            title="CAP SDM Studi PRSDI"
                            columns={[
                                'NO', 'Periode Stamp', 'NAMA SDM IPTEK', 'KELOMPOK RISET', 'JENJANG PENDIDIKAN DITEMPUH',
                                'NAMA UNIVERSITAS', 'STATUS', 'KETERANGAN', 'UPLOAD DAKUNG', 'tahun masuk', 'direct evidence',
                            ]}
                            data={[]} // Tambahkan data asli di sini
                        />
                    )}
                    {activeTab === 'purwarupa' && (
                        <Table
                            title="Capaian PURWARUPA PRSDI"
                            columns={[
                                'NO', 'Periode Input', 'Periode Stamp', 'Judul Purwarupa', 'KELOMPOK RISET', 'Inventor 1',
                                'Inventor 2', 'Inventor 3', 'Inventor 4', 'Inventor 5', 'NON SIVITAS PRSDI', 'JENIS',
                                'STATUS', 'NAMA MITRA', 'UPLOAD GDRIVE', 'LINK',
                            ]}
                            data={[]} // Tambahkan data asli di sini
                        />
                    )}
                    {activeTab === 'pdvr' && (
                        <Table
                            title="CAP PDVR PRSDI"
                            columns={[
                                'NO', 'Periode Stamp', 'NAMA SDM PRSDI', 'NON SDM PRSDI', 'KELOMPOK RISET', 'STATUS',
                                'JENIS', 'KETERANGAN', 'UPLOAD DAKUNG', 'direct link',
                            ]}
                            data={[]} // Tambahkan data asli di sini
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

function Table({ title, columns, data }: { title: string; columns: string[]; data: any[] }) {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-bold text-[#E62F2A] mb-4">{title}</h2>
            <div className="overflow-auto max-h-96 rounded-lg border bg-white shadow-md">
                <table className="min-w-full text-sm mb-2 border-collapse">
                    <thead>
                        <tr className="text-left text-black bg-gray-100 border-b border-gray-200">
                            {columns.map((col, index) => (
                                <th key={index} className="px-4 py-2 font-semibold">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={`text-neutral-700 ${
                                        rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    } border-b border-gray-100`}
                                >
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="px-4 py-2">
                                            {row[col] || '-'}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-4 text-neutral-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
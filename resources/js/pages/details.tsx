import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import patternBg from '../assets/bg-pattern3.png';

interface TableRow {
    [key: string]: string | number | null;
}

interface DetailsPageProps {
    publications: TableRow[];
    intellectualProperties: TableRow[];
    pksData: TableRow[];
    furtherStudyData: TableRow[];
    overseasTrainingData: TableRow[];
    purwarupaData: TableRow[];
}

export default function Details(props: DetailsPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        // { title: 'Dashboard', href: '/dashboard' },
        { title: 'Details', href: '/details' },
    ];

    const tabs = [
        { id: 'publikasi', title: 'Publikasi Global PRSDI' },
        { id: 'ki', title: 'Kekayaan Intelektual PRSDI' },
        { id: 'dana-eksternal', title: 'DANA EKSTERNAL PRSDI' },
        { id: 'sdm-studi', title: 'SDM Studi PRSDI' },
        { id: 'purwarupa', title: 'PURWARUPA PRSDI' },
        { id: 'pdvr', title: 'PDVR PRSDI' },
    ];

    const [activeTab, setActiveTab] = useState('publikasi');

    // Ambil data dari Inertia jika props kosong (fallback)
    const page = usePage<{
        publications: TableRow[];
        intellectualProperties: TableRow[];
        pksData: TableRow[];
        furtherStudyData: TableRow[];
        overseasTrainingData: TableRow[];
        purwarupaData: TableRow[];
    }>().props;

    const publications = props.publications || page.publications || [];
    const intellectualProperties = props.intellectualProperties || page.intellectualProperties || [];
    const pksData = props.pksData || page.pksData || [];
    const furtherStudyData = props.furtherStudyData || page.furtherStudyData || [];
    const overseasTrainingData = props.overseasTrainingData || page.overseasTrainingData || [];
    const purwarupaData = props.purwarupaData || page.purwarupaData || [];

    // Pagination state per tab
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // Reset halaman ke 1 jika tab berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    // Pilih data sesuai tab aktif
    let tableProps: { title: string; columns: string[]; data: TableRow[] } = { title: '', columns: [], data: [] };
    if (activeTab === 'publikasi') {
        tableProps = {
            title: 'Publikasi Global PRSDI',
            columns: [
                'No', 'Periode Input', 'Bulan', 'Monev Stamp', 'Judul Publikasi Global', 'Kelompok Riset',
                'Author 1', 'Author 2', 'Author 3', 'Author 4', 'Author 5', 'Author 6', 'Author 7',
                'Author Non-PRSDI', 'Jenis', 'Status', 'Nama Jurnal/Prosiding', 'Terindeks Scopus',
                'Reputasi', 'File di Google Drive', 'URL', 'DOI',
            ],
            data: publications,
        };
    } else if (activeTab === 'ki') {
        tableProps = {
            title: 'Kekayaan Intelektual PRSDI',
            columns: [
                'No', 'Periode Input', 'Monev Stamp', 'Judul', 'Kelompok Riset', 'Inventor 1', 'Inventor 2',
                'Inventor 3', 'Inventor 4', 'Inventor 5', 'Inventor 6', 'Inventor 7', 'Inventor 8',
                'Non Sivitas PRSDI', 'Status', 'Jenis', 'No Pendaftaran', 'Tanggal Daftar', 'No Sertifikat',
                'Tanggal Sertifikasi', 'Link Upload', 'LINK Dokumen',
            ],
            data: intellectualProperties,
        };
    } else if (activeTab === 'dana-eksternal') {
        tableProps = {
            title: 'DANA EKSTERNAL PRSDI',
            columns: [
                'No', 'Periode Input', 'Periode Stamp', 'JUDUL', 'KELOMPOK RISET', '1', '2', '3',
                'NON SIVITAS PRSDI', 'TIPE', 'JENIS', 'SUMBER', 'OUTPUT', 'PIHAK K3', 'NILAI', 'KETERANGAN',
                'NO KERJASAMA', 'TANGGAL KERJASAMA', 'NO PERJANJIAN', 'TANGGAL PERJANJIAN', 'LINK UPLOAD',
                'STATUS UPLOAD', 'TAHUN PKS', 'LINK BUKTI DUKUNG', 'CATATAN', 'JUMLAH',
            ],
            data: pksData,
        };
    } else if (activeTab === 'sdm-studi') {
        tableProps = {
            title: 'SDM Studi PRSDI',
            columns: [
                'NO', 'Periode Stamp', 'NAMA SDM IPTEK', 'KELOMPOK RISET', 'JENJANG PENDIDIKAN DITEMPUH',
                'NAMA UNIVERSITAS', 'STATUS', 'KETERANGAN', 'UPLOAD DAKUNG', 'tahun masuk', 'direct evidence',
            ],
            data: furtherStudyData,
        };
    } else if (activeTab === 'purwarupa') {
        tableProps = {
            title: 'PURWARUPA PRSDI',
            columns: [
                'No', 'Periode Input', 'Periode Stamp', 'Judul Purwarupa', 'KELOMPOK RISET', 'Inventor 1',
                'Inventor 2', 'Inventor 3', 'Inventor 4', 'Inventor 5', 'NON SIVITAS PRSDI', 'JENIS',
                'STATUS', 'NAMA MITRA', 'UPLOAD GDRIVE', 'LINK',
            ],
            data: purwarupaData,
        };
    } else if (activeTab === 'pdvr') {
        tableProps = {
            title: 'PDVR PRSDI',
            columns: [
                'No', 'Periode Stamp', 'NAMA SDM PRSDI', 'NON SDM PRSDI', 'KELOMPOK RISET', 'STATUS',
                'JENIS', 'KETERANGAN', 'UPLOAD DAKUNG', 'direct link',
            ],
            data: overseasTrainingData,
        };
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Capaian PRSDI" />
            <div
                className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6 overflow-x-auto"
                style={{
                    backgroundImage: `url(${patternBg})`,
                }}
            >
                {/* Header */}
                <div className="mb-4">
                    <h1 className="text-4xl font-extrabold text-[#E62F2A] mb-1">Detail Capaian PRSDI</h1>
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
                    <Table
                        title={tableProps.title}
                        columns={tableProps.columns}
                        data={tableProps.data}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        rowsPerPage={rowsPerPage}
                    />
                </div>
            </div>
        </AppLayout>
    );
}

function Table({
    title,
    columns,
    data,
    currentPage,
    setCurrentPage,
    rowsPerPage,
}: {
    title: string;
    columns: string[];
    data: TableRow[];
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    rowsPerPage: number;
}) {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    return (
        <div className="mb-6">
            <h2 className="text-xl font-bold text-[#E62F2A] mb-4">{title}</h2>
            <div className="overflow-auto max-h-150 rounded-lg border bg-white shadow-md">
                <table className="min-w-full text-sm mb-2 border-collapse">
                    <thead className="sticky top-0 z-10 bg-gray-100">
                        <tr className="text-left text-black bg-gray-100 border-b border-gray-200">
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-2 font-semibold"
                                    style={{
                                        background: '#f3f4f6', // bg-gray-100
                                        top: 0,
                                        zIndex: 10,
                                        position: 'sticky',
                                    }}
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, rowIndex) => (
                                <tr
                                    key={startIndex + rowIndex}
                                    className={`text-neutral-700 ${
                                        rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    } border-b border-gray-100`}
                                >
                                    {columns.map((col, colIndex) => {
                                        // Deteksi kolom Status (case-insensitive)
                                        if (col.toLowerCase() === 'status') {
                                            const value = row[col] || '-';
                                            let colorClass = 'bg-gray-200 text-gray-700';
                                            switch (value) {
                                                case 'Submit':
                                                    colorClass = 'bg-blue-100 text-blue-700 font-semibold';
                                                    break;
                                                case 'Accepted':
                                                    colorClass = 'bg-green-100 text-green-700 font-semibold';
                                                    break;
                                                case 'Published':
                                                    colorClass = 'bg-indigo-100 text-indigo-700 font-semibold';
                                                    break;
                                                case 'Review':
                                                    colorClass = 'bg-yellow-100 text-yellow-700 font-semibold';
                                                    break;
                                                case 'Draft':
                                                    colorClass = 'bg-gray-100 text-gray-700 font-semibold';
                                                    break;
                                                case 'Reject':
                                                    colorClass = 'bg-red-100 text-red-700 font-semibold';
                                                    break;
                                                default:
                                                    colorClass = 'bg-gray-200 text-gray-700';
                                            }
                                            return (
                                                <td key={colIndex} className="px-4 py-2">
                                                    <span className={`px-2 py-1 rounded ${colorClass}`}>{value}</span>
                                                </td>
                                            );
                                        }
                                        // Kolom lain tetap
                                        return (
                                            <td key={colIndex} className="px-4 py-2">
                                                {row[col] || '-'}
                                            </td>
                                        );
                                    })}
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
            {/* Pagination Info & Controls */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>
                    Showing data {data.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
                </span>
                <div className="flex gap-2">
                    <button
                        className="px-2 py-1 rounded text-gray-500 hover:bg-gray-100"
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        ‹
                    </button>
                    {/* Numbered page buttons */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                            key={pageNum}
                            className={`px-2 py-1 rounded ${currentPage === pageNum ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                            onClick={() => setCurrentPage(pageNum)}
                        >
                            {pageNum}
                        </button>
                    )).slice(
                        Math.max(0, currentPage - 3),
                        Math.min(totalPages, currentPage + 2)
                    )}
                    {totalPages > currentPage + 2 && (
                        <>
                            <span className="px-2 py-1 text-gray-500">...</span>
                            <button
                                className="px-2 py-1 rounded text-gray-500 hover:bg-gray-100"
                                onClick={() => setCurrentPage(totalPages)}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                    <button
                        className="px-2 py-1 rounded text-gray-500 hover:bg-gray-100"
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        ›
                    </button>
                </div>
            </div>
        </div>
    );
}
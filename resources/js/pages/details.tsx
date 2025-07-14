import AppLayout from '@/layouts/app-layout';
import { transparentScrollbarCSS, transparentScrollbarStyle } from '@/styles/scrollbar';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react'; // Menghapus useRef dan useCallback
import patternBg from '../assets/bg-pattern3.png';

// Definisikan tipe untuk props, termasuk auth
interface User {
    id: number;
    name: string;
    email: string;
    role: 'head' | 'researcher' | 'monev';
}

interface SharedProps {
    auth: {
        user: User | null;
    };
    [key: string]: unknown;
}

interface TableRow {
    [key: string]: string | number | boolean | null | undefined;
    unique_id: string; // Changed from optional to required and ensuring it's a string
    No?: number;
}

interface DetailsPageProps {
    publications: TableRow[];
    intellectualProperties: TableRow[];
    pksData: TableRow[];
    furtherStudyData: TableRow[];
    overseasTrainingData: TableRow[];
    purwarupaData: TableRow[];
}

export default function Details() {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Details', href: '/details' }];

    const tabs = [
        { id: 'publikasi', title: 'Publikasi Global PRSDI', type: 'publication' },
        { id: 'ki', title: 'Kekayaan Intelektual PRSDI', type: 'ki' },
        { id: 'dana-eksternal', title: 'DANA EKSTERNAL PRSDI', type: 'pks' },
        { id: 'sdm-studi', title: 'SDM Studi PRSDI', type: 'loa' },
        { id: 'purwarupa', title: 'PURWARUPA PRSDI', type: 'purwarupa' },
        { id: 'pdvr', title: 'PDVR PRSDI', type: 'pdvr' },
    ];

    const [activeTab, setActiveTab] = useState('publikasi');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const { props: pageProps } = usePage<SharedProps & DetailsPageProps>();
    const {
        publications = [],
        intellectualProperties = [],
        pksData = [],
        furtherStudyData = [],
        overseasTrainingData = [],
        purwarupaData = [],
    } = pageProps;

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    let tableProps: { title: string; columns: string[]; data: TableRow[]; type: string } = { title: '', columns: [], data: [], type: '' };

    // Update definisi kolom untuk setiap tab di komponen Details
    if (activeTab === 'publikasi') {
        tableProps = {
            title: 'Publikasi Global PRSDI',
            columns: [
                'No',
                'Periode Input',
                'Bulan',
                'Monev Stamp',
                'Judul Publikasi Global',
                'Kelompok Riset',
                'Author 1',
                'Author 2',
                'Author 3',
                'Author 4',
                'Author 5',
                'Author 6',
                'Author 7',
                'Author Non-PRSDI',
                'Jenis',
                'Status',
                'Nama Jurnal/Prosiding',
                'Terindeks Scopus',
                'Reputasi',
                'File di Google Drive',
                'URL',
                'DOI',
                'Status Monev', // Tambahkan kolom Status Monev
                'Catatan Monev', // Tambahkan kolom Catatan Monev
            ],
            data: publications,
            type: 'publication',
        };
    } else if (activeTab === 'ki') {
        tableProps = {
            title: 'Kekayaan Intelektual PRSDI',
            columns: [
                'No',
                'Periode Input',
                'Monev Stamp',
                'Judul',
                'Kelompok Riset',
                'Inventor 1',
                'Inventor 2',
                'Inventor 3',
                'Inventor 4',
                'Inventor 5',
                'Inventor 6',
                'Inventor 7',
                'Inventor 8',
                'Non Sivitas PRSDI',
                'Status',
                'Jenis',
                'No Pendaftaran',
                'Tanggal Daftar',
                'No Sertifikat',
                'Tanggal Sertifikasi',
                'Link Upload',
                'LINK Dokumen',
                'Status Monev', // Tambahkan kolom Status Monev
                'Catatan Monev', // Tambahkan kolom Catatan Monev
            ],
            data: intellectualProperties,
            type: 'ki',
        };
    } else if (activeTab === 'dana-eksternal') {
        tableProps = {
            title: 'DANA EKSTERNAL PRSDI',
            columns: [
                'No',
                'Periode Input',
                'Monev Stamp',
                'JUDUL',
                'KELOMPOK RISET',
                '1',
                '2',
                '3',
                'NON SIVITAS PRSDI',
                'TIPE',
                'JENIS',
                'SUMBER',
                'OUTPUT',
                'PIHAK K3',
                'NILAI',
                'KETERANGAN',
                'NO KERJASAMA',
                'TANGGAL KERJASAMA',
                'NO PERJANJIAN',
                'TANGGAL PERJANJIAN',
                'LINK UPLOAD',
                'STATUS UPLOAD',
                'TAHUN PKS',
                'LINK BUKTI DUKUNG',
                'CATATAN',
                'Status Monev', // Tambahkan kolom Status Monev
                'Catatan Monev', // Tambahkan kolom Catatan Monev
            ],
            data: pksData,
            type: 'pks',
        };
    } else if (activeTab === 'sdm-studi') {
        tableProps = {
            title: 'SDM Studi PRSDI',
            columns: [
                'No',
                'Monev Stamp',
                'NAMA SDM IPTEK',
                'KELOMPOK RISET',
                'JENJANG PENDIDIKAN DITEMPUH',
                'NAMA UNIVERSITAS',
                'STATUS',
                'KETERANGAN',
                'UPLOAD DAKUNG',
                'tahun masuk',
                'direct evidence',
                'Status Monev', // Tambahkan kolom Status Monev
                'Catatan Monev', // Tambahkan kolom Catatan Monev
            ],
            data: furtherStudyData,
            type: 'loa',
        };
    } else if (activeTab === 'purwarupa') {
        tableProps = {
            title: 'PURWARUPA PRSDI',
            columns: [
                'No',
                'Periode Input',
                'Monev Stamp',
                'Judul Purwarupa',
                'KELOMPOK RISET',
                'Inventor 1',
                'Inventor 2',
                'Inventor 3',
                'Inventor 4',
                'Inventor 5',
                'NON SIVITAS PRSDI',
                'JENIS',
                'STATUS',
                'NAMA MITRA',
                'UPLOAD GDRIVE',
                'LINK',
                'Status Monev', // Tambahkan kolom Status Monev
                'Catatan Monev', // Tambahkan kolom Catatan Monev
            ],
            data: purwarupaData,
            type: 'purwarupa',
        };
    } else if (activeTab === 'pdvr') {
        tableProps = {
            title: 'PDVR PRSDI',
            columns: [
                'No',
                'Monev Stamp',
                'NAMA SDM PRSDI',
                'NON SDM PRSDI',
                'KELOMPOK RISET',
                'STATUS',
                'JENIS',
                'KETERANGAN',
                'UPLOAD DAKUNG',
                'direct link',
                'Status Monev', // Tambahkan kolom Status Monev
                'Catatan Monev', // Tambahkan kolom Catatan Monev
            ],
            data: overseasTrainingData,
            type: 'pdvr',
        };
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Capaian PRSDI" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6" style={{ backgroundImage: `url(${patternBg})` }}>
                <div className="mb-4">
                    <h1 className="mb-1 text-4xl font-extrabold text-[#E62F2A]">Detail Capaian PRSDI</h1>
                    <p className="text-md text-neutral-500">Rincian capaian PRSDI berdasarkan data terbaru.</p>
                </div>

                <div className="mb-6 rounded-lg border-b border-gray-200 bg-white p-4 shadow-md">
                    <nav className="flex space-x-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 text-sm font-medium ${
                                    activeTab === tab.id ? 'border-b-2 border-[#E62F2A] text-[#E62F2A]' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.title}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-md">
                    <Table
                        title={tableProps.title}
                        columns={tableProps.columns}
                        data={tableProps.data}
                        type={tableProps.type}
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
    type,
    currentPage,
    setCurrentPage,
    rowsPerPage,
}: {
    title: string;
    columns: string[];
    data: TableRow[];
    type: string;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    rowsPerPage: number;
}) {
    const { auth } = usePage<SharedProps>().props;
    const userRole = auth?.user?.role;

    // Menghapus state columnWidths, tableRef, dan thRefs karena tidak lagi diperlukan untuk autofit
    // Menghapus useEffect untuk inisialisasi lebar kolom

    // Menghapus useCallback startResizing karena tidak lagi diperlukan

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    return (
        <div className="mb-6">
            <style>{transparentScrollbarCSS}</style>
            <h2 className="mb-4 text-xl font-bold text-[#E62F2A]">{title}</h2>
            <div className="transparent-scrollbar max-h-150 overflow-auto rounded-lg border bg-white shadow-md" style={transparentScrollbarStyle}>
                {/* Menghapus style tableLayout: 'fixed' dan width: '100%' untuk mengaktifkan autofit */}
                <table className="mb-2 border-collapse text-sm w-full"> {/* Menambahkan w-full untuk memastikan tabel mengisi lebar kontainer */}
                    <thead className="sticky top-0 z-10 bg-gray-100">
                        <tr className="border-b border-gray-200 bg-gray-100 text-left text-black">
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    // Menghapus ref dan style lebar kolom manual
                                    className="px-4 py-2 font-semibold relative whitespace-nowrap" // Memastikan teks tidak wrap
                                    style={{ background: '#f3f4f6', top: 0, zIndex: 10, position: 'sticky' }}
                                >
                                    {col}
                                    {/* Menghapus handle resizer */}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, rowIndex) => (
                                <tr
                                    key={row.unique_id ? String(row.unique_id) : `row-${startIndex + rowIndex}`}
                                    className={`text-neutral-700 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100`}
                                >
                                    {columns.map((col, colIndex) => {
                                        // Render nomor urut untuk kolom 'No'
                                        if (col === 'No') {
                                            return (
                                                <td
                                                    key={colIndex}
                                                    className="px-4 py-2 whitespace-nowrap"
                                                >
                                                    {startIndex + rowIndex + 1}
                                                </td>
                                            );
                                        }

                                        // --- LOGIKA STAMP BARU ---
                                        if (col === 'Monev Stamp' || col === 'Periode Stamp') {
                                            const isChecked = row[col] === true;
                                            return (
                                                <td
                                                    key={colIndex}
                                                    className="px-4 py-2 text-center whitespace-nowrap" // Memastikan teks tidak wrap
                                                >
                                                    {userRole === 'monev' ? (
                                                        <Link
                                                            href={route('details.stamp', { type: type, id: row.No })}
                                                            method="post"
                                                            as="button"
                                                            preserveScroll
                                                            onBefore={() => {
                                                                const confirmMessage = isChecked
                                                                    ? `Apakah Anda yakin ingin menghapus tanda periksa dari item ini?\n\nTindakan ini akan menghapus stempel Monev.`
                                                                    : `Apakah Anda yakin ingin menandai item ini sebagai sudah diperiksa?\n\nTindakan ini akan memberikan stempel Monev.`;

                                                                return window.confirm(confirmMessage);
                                                            }}
                                                            className="flex h-full w-full items-center justify-center"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                readOnly
                                                                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                            />
                                                        </Link>
                                                    ) : (
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            disabled
                                                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                        />
                                                    )}
                                                </td>
                                            );
                                        }

                                        // --- LOGIKA STATUS ---
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
                                            }
                                            
                                            return (
                                                <td
                                                    key={colIndex}
                                                    className="px-4 py-2 whitespace-nowrap"
                                                >
                                                    <span className={`rounded px-2 py-1 ${colorClass}`}>{value}</span>
                                                </td>
                                            );
                                        }
                                        
                                        // --- LOGIKA STATUS MONEV ---
                                        if (col === 'Status Monev') {
                                            const value = String(row[col] || '-');
                                            let colorClass = 'bg-gray-200 text-gray-700';
                                            
                                            switch (value.toLowerCase()) {
                                                case 'approved':
                                                    colorClass = 'bg-green-100 text-green-700 font-semibold';
                                                    break;
                                                case 'rejected':
                                                    colorClass = 'bg-red-100 text-red-700 font-semibold';
                                                    break;
                                                case 'pending':
                                                    colorClass = 'bg-yellow-100 text-yellow-700 font-semibold';
                                                    break;
                                                case 'reviewed':
                                                    colorClass = 'bg-blue-100 text-blue-700 font-semibold';
                                                    break;
                                            }
                                            
                                            return (
                                                <td
                                                    key={colIndex}
                                                    className="px-4 py-2 whitespace-nowrap"
                                                >
                                                    <span className={`rounded px-2 py-1 ${colorClass}`}>{value}</span>
                                                </td>
                                            );
                                        }
                                        
                                        // --- LOGIKA CATATAN MONEV ---
                                        if (col === 'Catatan Monev') {
                                            return (
                                                <td
                                                    key={colIndex}
                                                    className="px-4 py-2"
                                                >
                                                    <div className="break-words max-w-sm">
                                                        {userRole === 'monev' ? (
                                                            <div className="flex flex-col gap-2">
                                                                <textarea
                                                                    className="w-full rounded border border-gray-300 p-2 text-sm"
                                                                    defaultValue={row[col] !== null && row[col] !== undefined ? String(row[col]) : ''}
                                                                    placeholder="Tambahkan catatan..."
                                                                    rows={2}
                                                                    id={`note-${String(row.No || rowIndex)}`}
                                                                />
                                                                <button
                                                                    className="self-end rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                                                                    onClick={() => {
                                                                        try {
                                                                            const noteInput = document.getElementById(`note-${String(row.No || rowIndex)}`) as HTMLTextAreaElement;
                                                                            const noteText = noteInput?.value || '';
                                                                            
                                                                            // Konfirmasi sebelum menyimpan
                                                                            if (confirm('Apakah Anda yakin ingin menyimpan catatan ini?')) {
                                                                                // Log untuk debug
                                                                                console.log(`Menyimpan catatan untuk ${type}/${row.No}: "${noteText}"`);
                                                                                
                                                                                // Ambil XSRF-TOKEN dari cookie (bukan dari meta tag)
                                                                                const getCookie = (name: string) => {
                                                                                    const value = `; ${document.cookie}`;
                                                                                    const parts = value.split(`; ${name}=`);
                                                                                    if (parts.length === 2) return parts.pop()?.split(';').shift();
                                                                                    return null;
                                                                                };
                                                                                
                                                                                const xsrfToken = getCookie('XSRF-TOKEN');
                                                                                
                                                                                if (!xsrfToken) {
                                                                                    console.error('XSRF-TOKEN tidak ditemukan dalam cookie');
                                                                                    alert('Error: XSRF-TOKEN tidak ditemukan. Coba refresh halaman.');
                                                                                    return;
                                                                                }
                                                                                
                                                                                // Gunakan fetch dengan try-catch
                                                                                fetch(route('details.update', { type: type, id: row.No || 0 }), {
                                                                                    method: 'PATCH', // Sesuai dengan route di web.php
                                                                                    headers: {
                                                                                        'Content-Type': 'application/json',
                                                                                        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken), // Gunakan X-XSRF-TOKEN
                                                                                        'Accept': 'application/json',
                                                                                    },
                                                                                    body: JSON.stringify({
                                                                                        notes: noteText,
                                                                                    }),
                                                                                    // Pastikan cookies terkirim dengan request
                                                                                    credentials: 'same-origin'
                                                                                })
                                                                                .then(response => {
                                                                                    // Cek response status
                                                                                    if (!response.ok) {
                                                                                        return response.text().then(text => {
                                                                                            console.error('Response error:', text);
                                                                                            throw new Error(`Server responded with ${response.status}: ${text}`);
                                                                                        });
                                                                                    }
                                                                                    return response.json();
                                                                                })
                                                                                .then(data => {
                                                                                    console.log('Response data:', data);
                                                                                    alert('Catatan berhasil disimpan');
                                                                                })
                                                                                .catch(error => {
                                                                                    console.error('Error saving note:', error);
                                                                                    alert(`Gagal menyimpan catatan: ${error.message}`);
                                                                                });
                                                                            }
                                                                        } catch (error) {
                                                                            console.error('Unexpected error:', error);
                                                                            alert(`Error tak terduga: ${error}`);
                                                                        }
                                                                    }}
                                                                >
                                                                    Simpan
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="whitespace-pre-line">{row[col] !== null && row[col] !== undefined ? String(row[col]) : '-'}</div>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        }

                                        // --- KOLOM LAIN ---
                                        return (
                                            <td
                                                key={colIndex}
                                                className={`px-4 py-2 ${
                                                    col === 'Judul Publikasi Global' || 
                                                    col === 'Judul' || 
                                                    col === 'JUDUL' || 
                                                    col === 'Judul Purwarupa' ? 
                                                    'break-words max-w-sm' : 'whitespace-nowrap'
                                                }`}
                                            >
                                                {row[col] !== null && row[col] !== undefined ? String(row[col]) : '-'}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="py-4 text-center text-neutral-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>
                    Showing data {data.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
                </span>
                <div className="flex gap-2">
                    <button
                        className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100"
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        ‹
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .map((pageNum) => (
                            <button
                                key={pageNum}
                                className={`rounded px-2 py-1 ${currentPage === pageNum ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                                onClick={() => setCurrentPage(pageNum)}
                            >
                                {pageNum}
                            </button>
                        ))
                        .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
                    {totalPages > currentPage + 2 && (
                        <>
                            <span className="px-2 py-1 text-gray-500">...</span>
                            <button className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100" onClick={() => setCurrentPage(totalPages)}>
                                {totalPages}
                            </button>
                        </>
                    )}
                    <button
                        className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100"
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

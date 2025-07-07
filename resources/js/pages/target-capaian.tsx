import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import patternBg from '../assets/bg-pattern3.png';

interface Target {
    id: number;
    tahun: number;
    kekayaan_intelektual: number;
    publikasi_ilmiah_global: number;
    purwarupa: number;
    kerjasama_internasional: number;
    kerjasama_nasional: number;
    dana_eksternal: number;
    sdm_studi_lanjut: number;
    postdoc_visiting: number;
    pelatihan_internasional: number;
}

interface Props {
    targets: Target[];
    success?: string;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
}


const indikatorList = [
    { key: 'kekayaan_intelektual', label: 'Kekayaan Intelektual', satuan: 'KI' },
    { key: 'publikasi_ilmiah_global', label: 'Publikasi Ilmiah Global', satuan: 'Publikasi' },
    { key: 'purwarupa', label: 'Purwarupa', satuan: 'Purwarupa' },
    { key: 'kerjasama_internasional', label: 'Kerjasama Internasional', satuan: 'Kerjasama' },
    { key: 'kerjasama_nasional', label: 'Kerjasama Nasional', satuan: 'Kerjasama' },
    { key: 'dana_eksternal', label: 'Dana Eksternal', satuan: 'Rp' },
    { key: 'sdm_studi_lanjut', label: 'SDM Studi Lanjut', satuan: 'Orang' },
    { key: 'postdoc_visiting', label: 'Postdoc/Visiting', satuan: 'Orang' },
    { key: 'pelatihan_internasional', label: 'Pelatihan Internasional', satuan: 'Pelatihan' },
];

export default function TargetCapaian({ targets, success, auth }: Props) {
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());
    const [isEditPopupVisible, setEditPopupVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editForm, setEditForm] = useState(() =>
        Object.fromEntries(indikatorList.map(i => [i.key, '']))
    );
    const [editTahun, setEditTahun] = useState(new Date().getFullYear());

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted with data:', { tahun: editTahun, ...editForm }); // Debug log
        
        if (isSubmitting) return; // Prevent double submission
        
        // Validate that all required fields are filled
        const emptyFields = indikatorList.filter(indikator => 
            !editForm[indikator.key] || editForm[indikator.key].trim() === ''
        );
        
        if (emptyFields.length > 0) {
            alert(`Mohon isi semua field yang diperlukan: ${emptyFields.map(f => f.label).join(', ')}`);
            return;
        }
        
        const targetToEdit = targets.find(t => t.tahun === filterYear);
        setIsSubmitting(true);
        
        if (targetToEdit) {
            // Update existing target
            console.log('Updating target with ID:', targetToEdit.id); // Debug log
            router.put(`/target-tahunan/update/${targetToEdit.id}`, 
                { tahun: editTahun, ...editForm },
                {
                    onSuccess: () => {
                        console.log('Update successful');
                        setIsSubmitting(false);
                        setEditPopupVisible(false);
                    },
                    onError: (errors) => {
                        console.error('Update failed:', errors);
                        setIsSubmitting(false);
                        alert('Gagal menyimpan data. Silakan coba lagi.');
                    }
                }
            );
        } else {
            // Create new target
            console.log('Creating new target for year:', editTahun); // Debug log
            router.post(`/target-tahunan`, 
                { tahun: editTahun, ...editForm },
                {
                    onSuccess: () => {
                        console.log('Create successful');
                        setIsSubmitting(false);
                        setEditPopupVisible(false);
                    },
                    onError: (errors) => {
                        console.error('Create failed:', errors);
                        setIsSubmitting(false);
                        alert('Gagal menyimpan data. Silakan coba lagi.');
                    }
                }
            );
        }
    };

    return (
        <AppLayout>
            <Head title="Target Tahunan" />
            <div
                className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6 overflow-x-auto"
                style={{
                    backgroundImage: `url(${patternBg})`,
                    // backgroundColor: '#f3f4f6',
                }}
            >
                <div className="max-w-full mx-auto mt-8 p-6 bg-white rounded shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-[#E62F2A]">Target Tahunan</h1>
                        <div className="flex items-center">
                            <label className="mr-2 text-sm font-medium">Filter Tahun:</label>
                            <select
                                className="border rounded px-2 py-1"
                                value={filterYear}
                                onChange={(e) => setFilterYear(Number(e.target.value))}
                            >
                                {Array.from(new Set(targets.map(t => t.tahun))).sort((a, b) => b - a).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {success && (
                        <div className="mb-4 p-2 bg-green-100 text-green-800 border border-green-400 rounded">
                            {success}
                        </div>
                    )}

                    {/* Tabel target tahunan vertikal */}
                    <div className="overflow-x-visible">
                        <table className="w-full border text-sm border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-2 py-1">Kode</th>
                                    <th className="border px-2 py-1">Indikator</th>
                                    <th className="border px-2 py-1">Target</th>
                                    <th className="border px-2 py-1">Satuan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    const kodeList = [
                                        '1.1', '1.2', '1.3',
                                        '2.1', '2.2', '2.3',
                                        '3.1', '3.2', '3.3'
                                    ];
                                    const indikatorListCustom = [
                                        'Jumlah Kekayaan Intelektual yang dihasilkan di bidang Sains Data dan Informasi',
                                        'Jumlah publikasi ilmiah yang dipublikasikan pada jurnal bereputasi global di bidang Sains Data dan Informasi',
                                        'Jumlah purwarupa yang dihasilkan di bidang Sains Data dan Informasi',
                                        'Jumlah kerja sama riset dan inovasi tingkat internasional yang dihasilkan di bidang Sains Data dan Informasi',
                                        'Jumlah kerja sama riset dan inovasi tingkat nasional yang dihasilkan di bidang Sains Data dan Informasi',
                                        'Jumlah dana eksternal dari kerjasama penelitian/riset dan pengembangan iptek di bidang Sains Data dan Informasi',
                                        'Jumlah SDM Iptek yang melanjutkan pendidikan ke jenjang S2 dan S3',
                                        'Jumlah peserta Post Doctoral/Visiting Research',
                                        'Jumlah peserta talenta riset dan inovasi dan sumber daya manusia yang ditingkatkan kompetensinya (pelatihan internasional)'
                                    ];
                                    const satuanList = [
                                        'KI', 'Publikasi', 'Purwarupa', 'Kerjasama', 'Kerjasama', 'Rp', 'Orang', 'Orang', 'Pelatihan'
                                    ];
                                    const targetTahun = targets.find(t => t.tahun === filterYear);

                                    const keyList = [
                                        'kekayaan_intelektual',
                                        'publikasi_ilmiah_global',
                                        'purwarupa',
                                        'kerjasama_internasional',
                                        'kerjasama_nasional',
                                        'dana_eksternal',
                                        'sdm_studi_lanjut',
                                        'postdoc_visiting',
                                        'pelatihan_internasional'
                                    ];

                                    return keyList.map((key, idx) => (
                                        <tr key={key} className="even:bg-gray-50">
                                            <td className="border px-2 py-1">{kodeList[idx]}</td>
                                            <td className="border px-2 py-1">{indikatorListCustom[idx]}</td>
                                            <td className="border px-2 py-1 text-right">
                                                {targetTahun
                                                    ? key === 'dana_eksternal'
                                                        ? Number(targetTahun[key as keyof Target] ?? 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
                                                        : Number(targetTahun[key as keyof Target] ?? 0).toLocaleString('id-ID')
                                                    : '-'}
                                            </td>
                                            <td className="border px-2 py-1">{satuanList[idx]}</td>
                                        </tr>
                                    ));
                                })()}
                            </tbody>
                        </table>
                    </div>

                    {/* Tombol Ubah Target - Hanya untuk role head */}
                    {auth.user.role === 'head' && (
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                className="bg-[#E62F2A] text-white px-6 py-2 rounded-lg hover:bg-red-600 transition shadow-lg hover:shadow-xl"
                                onClick={() => {
                                    const latestTarget = targets.find(t => t.tahun === filterYear);
                                    if (latestTarget) {
                                        // Edit existing target
                                        setEditTahun(latestTarget.tahun);
                                        setEditForm(
                                            Object.fromEntries(
                                                indikatorList.map(indikator => [
                                                    indikator.key, 
                                                    String(latestTarget[indikator.key as keyof Target] || '')
                                                ])
                                            )
                                        );
                                    } else {
                                        // Create new target for this year
                                        setEditTahun(filterYear);
                                        setEditForm(
                                            Object.fromEntries(
                                                indikatorList.map(indikator => [indikator.key, ''])
                                            )
                                        );
                                    }
                                    setEditPopupVisible(true);
                                }}
                            >
                                {targets.find(t => t.tahun === filterYear) ? 'Ubah Target' : 'Tambah Target'}
                            </button>
                        </div>
                    )}

                    {/* Popup Form Ubah Target */}
                    {isEditPopupVisible && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-[#E62F2A]">
                                        {targets.find(t => t.tahun === filterYear) ? 'Ubah Target Tahunan' : 'Tambah Target Tahunan'}
                                    </h2>
                                    <button
                                        type="button"
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={() => setEditPopupVisible(false)}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2">Tahun</label>
                                        <input
                                            type="number"
                                            className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={editTahun}
                                            onChange={e => setEditTahun(Number(e.target.value))}
                                            placeholder="Tahun"
                                            required
                                        />
                                    </div>
                                    {indikatorList.map(indikator => (
                                        <div key={indikator.key}>
                                            <label className="block text-sm font-medium mb-2">{indikator.label}</label>
                                            <input
                                                type="number"
                                                name={indikator.key}
                                                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={editForm[indikator.key]}
                                                onChange={handleEditChange}
                                                placeholder={indikator.label}
                                                required
                                            />
                                        </div>
                                    ))}
                                    <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                                        <button
                                            type="button"
                                            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                                            onClick={() => setEditPopupVisible(false)}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`px-6 py-2 rounded-lg transition ${
                                                isSubmitting 
                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                    : 'bg-[#E62F2A] hover:bg-red-600'
                                            } text-white`}
                                        >
                                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
        </AppLayout>
    );
}

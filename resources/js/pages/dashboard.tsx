import React, { useState, useEffect } from 'react';
// Recharts and lucide-react are still imported, but their components will be replaced with placeholders for charts
// This is done to prevent import errors in a standalone environment without a full module bundler setup.
// If you integrate this into a project with npm/yarn, you can uncomment these and remove placeholders.
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { ChevronDown } from 'lucide-react'; // Using lucide-react for the dropdown icon

// Using actual imports as requested
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import patternBg from '../assets/bg-pattern3.png'; // Import background pattern

// Mockup for AppLayout - NOT USED AS IT'S IMPORTED NOW
// const AppLayout = ({ children, breadcrumbs }) => {
//     return (
//         <div className="min-h-screen bg-gray-100 font-sans flex">
//             <aside className="w-64 bg-white shadow-md p-4 flex flex-col hidden md:flex">
//                 <div className="text-xl font-bold text-[#E62F2A] mb-6">Menu Dashboard</div>
//                 <nav className="space-y-2">
//                     <a href="#" className="block px-3 py-2 rounded-md text-neutral-700 hover:bg-gray-100 transition-colors">
//                         <span className="font-medium">Publikasi</span>
//                     </a>
//                     <a href="#" className="block px-3 py-2 rounded-md text-neutral-700 hover:bg-gray-100 transition-colors">
//                         <span className="font-medium">KI</span>
//                     </a>
//                     <a href="#" className="block px-3 py-2 rounded-md text-neutral-700 hover:bg-gray-100 transition-colors">
//                         <span className="font-medium">Dana Eksternal</span>
//                     </a>
//                     <a href="#" className="block px-3 py-2 rounded-md text-neutral-700 hover:bg-gray-100 transition-colors">
//                         <span className="font-medium">SDM Studi</span>
//                     </a>
//                     <a href="#" className="block px-3 py-2 rounded-md text-neutral-700 hover:bg-gray-100 transition-colors">
//                         <span className="font-medium">Purwarupa</span>
//                     </a>
//                     <a href="#" className="block px-3 py-2 rounded-md text-neutral-700 hover:bg-gray-100 transition-colors">
//                         <span className="font-medium">PDVR</span>
//                     </a>
//                 </nav>
//             </aside>
//             <main className="flex-1 container mx-auto py-6 px-4 md:px-0">
//                 {children}
//             </main>
//         </div>
//     );
// };

// Shadcn UI Card component mockup
const Card = ({ className, children }) => (
    <div className={`rounded-xl border bg-white ${className}`}>
        {children}
    </div>
);

// Shadcn UI CardContent component mockup
const CardContent = ({ className, children }) => (
    <div className={`p-4 ${className}`}>
        {children}
    </div>
);

// Shadcn UI Tabs components mockup
const Tabs = ({ defaultValue, className, children }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);
    return (
        <div className={className}>
            {React.Children.map(children, child => {
                if (child.type === TabsList) {
                    return React.cloneElement(child, { activeTab, setActiveTab });
                }
                return child;
            })}
            {React.Children.map(children, child => {
                if (child.type === TabsContent) {
                    return React.cloneElement(child, { activeTab });
                }
                return null;
            })}
        </div>
    );
};

const TabsList = ({ activeTab, setActiveTab, className, children }) => (
    <div className={`flex p-1 rounded-xl shadow border bg-white ${className}`}>
        {React.Children.map(children, child =>
            React.cloneElement(child, {
                isActive: child.props.value === activeTab,
                onClick: () => setActiveTab(child.props.value)
            })
        )}
    </div>
);

const TabsTrigger = ({ value, className, children, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-[#E62F2A] text-white' : 'text-neutral-600 hover:bg-gray-100'} ${className}`}
    >
        {children}
    </button>
);

const TabsContent = ({ value, activeTab, className, children }) => (
    <div className={`${value === activeTab ? 'block' : 'hidden'} ${className}`}>
        {children}
    </div>
);

// Shadcn UI DropdownMenu components mockup
const DropdownMenu = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            {React.Children.map(children, child => {
                if (child.type === DropdownMenuTrigger) {
                    return React.cloneElement(child, { onClick: () => setIsOpen(!isOpen) });
                }
                if (child.type === DropdownMenuContent) {
                    return isOpen ? React.cloneElement(child, { setIsOpen }) : null;
                }
                return child;
            })}
        </div>
    );
};

const DropdownMenuTrigger = ({ onClick, asChild, children }) => {
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, { onClick });
    }
    return <button onClick={onClick} className="border rounded px-2 py-1 text-sm bg-white flex items-center gap-1">
        {children} <ChevronDown size={16} />
    </button>;
};

const DropdownMenuContent = ({ setIsOpen, children }) => (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {React.Children.map(children, child =>
                React.cloneElement(child, { onClick: () => setIsOpen(false) })
            )}
        </div>
    </div>
);

const DropdownMenuItem = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        role="menuitem"
    >
        {children}
    </button>
);


// Placeholder components for charts
const AreaChartPlaceholder = ({ title, className, dropdown = false, dropdownCaption = "Pilihan" }) => (
    <Card className={`shadow-lg rounded-xl ${className}`}>
        <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
                <div className="font-bold text-lg text-[#E62F2A]">{title}</div>
                {dropdown && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="border rounded px-2 py-1 text-sm bg-white flex items-center gap-1">
                                {dropdownCaption} <ChevronDown size={16} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Opsi 1</DropdownMenuItem>
                            <DropdownMenuItem>Opsi 2</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border border-dashed text-gray-400">
                <span>[Placeholder Area Chart]</span>
            </div>
        </CardContent>
    </Card>
);

const PieChartPlaceholder = ({ title, className }) => {
    return (
        <Card className={`shadow-lg rounded-xl ${className}`}>
            <CardContent className="p-4">
                <div className="font-bold mb-2 text-[#E62F2A]">{title}</div>
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border border-dashed text-gray-400">
                    <span>[Placeholder Pie Chart]</span>
                </div>
            </CardContent>
        </Card>
    );
};

const BarChartPlaceholder = ({ title, className }) => (
    <Card className={`shadow-lg rounded-xl ${className}`}>
        <CardContent className="p-4">
            <div className="font-bold mb-2 text-[#E62F2A]">{title}</div>
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border border-dashed text-gray-400">
                <span>[Placeholder Bar Chart]</span>
            </div>
        </CardContent>
    </Card>
);


// Mock DataTable component
const DataTable = ({ title, data = [], columns = [] }) => {
    // Default mock data if none provided
    const defaultMockData = [
        { id: 1, periset: 'Jane Cooper', judul: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.', catatan: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.', tahun: '2023', jenis: 'Jurnal', status: 'Scopus' },
        { id: 2, periset: 'Floyd Miles', judul: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.', catatan: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.', tahun: '2024', jenis: 'Prosiding', status: 'Non-Scopus' },
        { id: 3, periset: 'Ronald Richards', judul: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.', catatan: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.', tahun: '2023', jenis: 'Buku', status: 'Non-Scopus' },
    ];

    // Default mock columns if none provided
    const defaultMockColumns = [
        { header: 'No.', accessor: 'id' },
        { header: 'Periset', accessor: 'periset' },
        { header: 'Judul', accessor: 'judul' },
        { header: 'Catatan', accessor: 'catatan' },
    ];

    const actualData = data.length > 0 ? data : defaultMockData;
    const actualColumns = columns.length > 0 ? columns : defaultMockColumns;

    return (
        <div className="overflow-auto max-h-96 rounded-lg border">
            <table className="min-w-full text-sm mb-2 border-collapse">
                <thead>
                    <tr className="text-left text-black bg-gray-100 border-b border-gray-200">
                        {actualColumns.map((col, index) => (
                            <th key={index} className="px-4 py-2 font-semibold">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {actualData.map((row, rowIndex) => (
                        <tr key={rowIndex} className={`text-neutral-700 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100`}>
                            {actualColumns.map((col, colIndex) => (
                                <td key={colIndex} className="px-4 py-2">
                                    {row[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Function to get the current day and formatted date
function getFormattedDate() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const day = days[today.getDay()];
    const date = today.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    return `${day}, ${date}`;
}

export default function DashboardPRSDI() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Capaian PRSDI" />
            <div
                className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6 overflow-x-auto"
                style={{
                    backgroundImage: `url(${patternBg})`,
                    backgroundColor: '#f3f4f6',
                }}
            >
                {/* Header */}
                <div className="mb-4">
                    <h1 className="text-4xl font-extrabold text-[#E62F2A] mb-1">Dashboard Capaian PRSDI</h1>
                    <div className="text-neutral-500 text-md">{getFormattedDate()}</div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="rounded-xl border bg-white shadow-lg p-5 flex flex-col gap-3">
                        <div className="font-bold text-lg text-[#E62F2A]">Total Publikasi</div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-neutral-700">1,567</span>
                            <span className="text-green-600 text-sm font-medium">+2.89%</span>
                        </div>
                        <div className="text-gray-500 text-xs">vs. previous month</div>
                        <div className="w-full h-1.5 rounded-full bg-gray-200 mt-2">
                            <div className="bg-[#E62F2A] h-1.5 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-white shadow-lg p-5 flex flex-col gap-3">
                        <div className="font-bold text-lg text-[#E62F2A]">% Terindex Scopus</div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-neutral-700">78%</span>
                            <span className="text-green-600 text-sm font-medium">+2.89%</span>
                        </div>
                        <div className="text-gray-500 text-xs">vs. previous month</div>
                        <div className="w-full h-1.5 rounded-full bg-gray-200 mt-2">
                            <div className="bg-[#E62F2A] h-1.5 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-white shadow-lg p-5 flex flex-col gap-3">
                        <div className="font-bold text-lg text-[#E62F2A]">Publikasi per Penulis</div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-neutral-700">1,567</span>
                            <span className="text-green-600 text-sm font-medium">+2.89%</span>
                        </div>
                        <div className="text-gray-500 text-xs">vs. previous month</div>
                        <div className="w-full h-1.5 rounded-full bg-gray-200 mt-2">
                            <div className="bg-[#E62F2A] h-1.5 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-white shadow-lg p-5 flex flex-col gap-3">
                        <div className="font-bold text-lg text-[#E62F2A]">Jumlah Periset Aktif</div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-neutral-700">1,567</span>
                            <span className="text-green-600 text-sm font-medium">+2.89%</span>
                        </div>
                        <div className="text-gray-500 text-xs">vs. previous month</div>
                        <div className="w-full h-1.5 rounded-full bg-gray-200 mt-2">
                            <div className="bg-[#E62F2A] h-1.5 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Chart Tabs - Using Shadcn Tabs */}
                <Tabs defaultValue="publikasi" className="w-full space-y-4">
                    <TabsList className="bg-white rounded-xl shadow border p-1 w-fit">
                        <TabsTrigger value="publikasi" className="data-[state=active]:bg-[#E62F2A] data-[state=active]:text-white rounded-lg px-4 py-2">Publikasi</TabsTrigger>
                        <TabsTrigger value="ki" className="data-[state=active]:bg-[#E62F2A] data-[state=active]:text-white rounded-lg px-4 py-2">KI</TabsTrigger>
                        <TabsTrigger value="dana" className="data-[state=active]:bg-[#E62F2A] data-[state=active]:text-white rounded-lg px-4 py-2">Dana Eksternal</TabsTrigger>
                        <TabsTrigger value="sdm" className="data-[state=active]:bg-[#E62F2A] data-[state=active]:text-white rounded-lg px-4 py-2">SDM Studi</TabsTrigger>
                        <TabsTrigger value="purwarupa" className="data-[state=active]:bg-[#E62F2A] data-[state=active]:text-white rounded-lg px-4 py-2">Purwarupa</TabsTrigger>
                        <TabsTrigger value="pdvr" className="data-[state=active]:bg-[#E62F2A] data-[state=active]:text-white rounded-lg px-4 py-2">PDVR</TabsTrigger>
                    </TabsList>

                    {/* Tab Content: Publikasi */}
                    <TabsContent value="publikasi" className="space-y-4">
                        <AreaChartPlaceholder title="Perkembangan Publikasi per Bulan" className="w-full h-64" dropdown />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PieChartPlaceholder title="Jenis Publikasi" className="w-full h-72" />
                            <BarChartPlaceholder title="Scopus vs Non-Scopus" className="w-full h-72" />
                        </div>
                    </TabsContent>

                    {/* Tab Content: KI */}
                    <TabsContent value="ki" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <BarChartPlaceholder title="Jumlah KI per Kelompok Riset" className="w-full h-72" />
                            <PieChartPlaceholder title="Status KI" className="w-full h-72" />
                        </div>
                    </TabsContent>

                    {/* Tab Content: Dana Eksternal */}
                    <TabsContent value="dana" className="space-y-4">
                        <BarChartPlaceholder title="Nilai Dana Eksternal per Tahun" className="w-full h-72 mb-4" />
                        <BarChartPlaceholder title="Dana Berdasarkan Kelompok Riset" className="w-full h-72" />
                    </TabsContent>

                    {/* Tab Content: SDM Studi */}
                    <TabsContent value="sdm" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PieChartPlaceholder title="Jenjang Studi SDM" className="w-full h-72" />
                            <BarChartPlaceholder title="Universitas Tujuan" className="w-full h-72" />
                        </div>
                    </TabsContent>

                    {/* Tab Content: Purwarupa */}
                    <TabsContent value="purwarupa" className="space-y-4">
                        <BarChartPlaceholder title="Jumlah Purwarupa per Kelompok Riset" className="w-full h-72" />
                    </TabsContent>

                    {/* Tab Content: PDVR */}
                    <TabsContent value="pdvr" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <BarChartPlaceholder title="Jumlah PDVR per Jenis" className="w-full h-72" />
                            <PieChartPlaceholder title="Keterlibatan SDM vs Non-SDM" className="w-full h-72" />
                        </div>
                    </TabsContent>
                </Tabs>

                {/* DataTable for Publikasi Detail - Using Shadcn Card and custom DataTable */}
                <Card className="shadow-lg rounded-xl">
                    <CardContent className="p-4">
                        <div className="font-bold mb-2 text-[#E62F2A]">Daftar Publikasi Dengan Catatan</div>
                        <DataTable title="Daftar Publikasi" data={[]} columns={[]} />
                        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                            <span>Showing data 1 to 3 of 256 entries</span>
                            <div className="flex gap-2">
                                <button className="px-2 py-1 rounded text-gray-500 hover:bg-gray-100">‹</button>
                                <button className="px-2 py-1 rounded bg-red-500 text-white">1</button>
                                <button className="px-2 py-1 rounded text-gray-500 hover:bg-gray-100">2</button>
                                <button className="px-2 py-1 rounded text-gray-500 hover:bg-gray-100">3</button>
                                <span className="px-2 py-1 text-gray-500">...</span>
                                <button className="px-2 py-1 rounded text-gray-500 hover:bg-gray-100">40</button>
                                <button className="px-2 py-1 rounded text-gray-500 hover:bg-gray-100">›</button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Detail Publikasi Table - This uses the DataTable component you've defined,
                    assuming it can render the complex table structure.
                */}
                <Card className="shadow-lg rounded-xl mb-6">
                    <CardContent className="p-4">
                        <div className="font-bold mb-2 text-[#E62F2A]">Detail Publikasi</div>
                        <DataTable
                            title=""
                            data={[]} // Mock data is handled internally by DataTable
                            columns={[ // Example columns for Detail Publikasi, customize as needed
                                { header: 'No.', accessor: 'id' },
                                { header: 'Periset', accessor: 'periset' },
                                { header: 'Judul Publikasi', accessor: 'judul' },
                                { header: 'Tahun', accessor: 'tahun' },
                                { header: 'Jenis Publikasi', accessor: 'jenis' },
                                { header: 'Scopus/Non-Scopus', accessor: 'status' },
                            ]}
                        />
                        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                            <span>Showing data 1 to 2 of 256K entries</span>
                            <div className="flex gap-2">
                                <button className="px-2 py-1 rounded text-gray-500 hover:bg-gray-100">‹</button>
                                <button className="px-2 py-1 rounded bg-red-500 text-white">1</button>
                                <button className="px-2 py-1 rounded text-gray-500 hover:bg-gray-100">2</button>
                                <button className="px-2 py-1 rounded text-gray-500 hover:bg-gray-100">3</button>
                                <button className="px-2 py-1 rounded text-gray-500 hover:bg-gray-100">4</button>
                                <span className="px-2 py-1 text-gray-500">...</span>
                                <button className="px-2 py-1 rounded text-gray-500 hover:bg-gray-100">40</button>
                                <button className="px-2 py-1 rounded text-gray-500 hover:bg-gray-100">›</button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    );
}
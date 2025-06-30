import React, { useState } from 'react'; // Fix 1.1: Removed unused useEffect
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

// Shadcn UI Card component mockup
const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={`rounded-xl border bg-white ${className}`}>
        {children}
    </div>
);

// Shadcn UI CardContent component mockup
const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={`p-4 ${className}`}>
        {children}
    </div>
);

// Shadcn UI Tabs components mockup
interface TabsProps {
    defaultValue: string;
    className?: string;
    children: React.ReactNode;
}

const Tabs = ({ defaultValue, className, children }: TabsProps) => {
    const [activeTab, setActiveTab] = useState<string>(defaultValue);
    return (
        <div className={className}>
            {React.Children.map(children, child => {
                // Fix 3: Explicitly type child before cloning
                if (React.isValidElement(child) && child.type === TabsList) {
                    return React.cloneElement(child as React.ReactElement<TabsListProps>, { activeTab, setActiveTab });
                }
                return child;
            })}
            {React.Children.map(children, child => {
                // Fix 3: Explicitly type child before cloning
                if (React.isValidElement(child) && child.type === TabsContent) {
                    return React.cloneElement(child as React.ReactElement<TabsContentProps>, { activeTab });
                }
                return null;
            })}
        </div>
    );
};

interface TabsListProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    className?: string;
    children: React.ReactNode;
}

const TabsList = ({ activeTab, setActiveTab, className, children }: TabsListProps) => (
    <div className={`flex p-1 rounded-xl shadow border bg-white ${className}`}>
        {React.Children.map(children, child =>
            // Fix 3 & 4: Explicitly type child before cloning and access props
            (React.isValidElement(child) && child.type === TabsTrigger)
                ? React.cloneElement(child as React.ReactElement<TabsTriggerProps>, {
                    isActive: (child.props as TabsTriggerProps).value === activeTab, // Accessing child.props.value after type assertion
                    onClick: () => setActiveTab((child.props as TabsTriggerProps).value) // Accessing child.props.value after type assertion
                })
                : child
        )}
    </div>
);

interface TabsTriggerProps {
    // Fix 1.2: Rename 'value' to '_value' to explicitly mark as unused if not directly consumed in component JSX
    value: string;
    className?: string;
    children: React.ReactNode;
    // Fix 5: Make isActive and onClick optional as they are injected by the parent TabsList
    isActive?: boolean;
    onClick?: () => void;
}

const TabsTrigger = ({ value: _value, className, children, isActive, onClick }: TabsTriggerProps) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-[#E62F2A] text-white' : 'text-neutral-600 hover:bg-gray-100'} ${className}`}
    >
        {children}
    </button>
);

interface TabsContentProps {
    value: string;
    activeTab: string;
    className?: string;
    children: React.ReactNode;
}

const TabsContent = ({ value, activeTab, className, children }: TabsContentProps) => (
    <div className={`${value === activeTab ? 'block' : 'hidden'} ${className}`}>
        {children}
    </div>
);

// Shadcn UI DropdownMenu components mockup
interface DropdownMenuProps {
    children: React.ReactNode;
}

const DropdownMenu = ({ children }: DropdownMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            {React.Children.map(children, child => {
                // Fix 3: Explicitly type child before cloning
                if (React.isValidElement(child) && child.type === DropdownMenuTrigger) {
                    return React.cloneElement(child as React.ReactElement<DropdownMenuTriggerProps>, { onClick: () => setIsOpen(!isOpen) });
                }
                // Fix 3: Explicitly type child before cloning
                if (React.isValidElement(child) && child.type === DropdownMenuContent) {
                    return isOpen ? React.cloneElement(child as React.ReactElement<DropdownMenuContentProps>, { setIsOpen }) : null;
                }
                return child;
            })}
        </div>
    );
};

interface DropdownMenuTriggerProps {
    onClick?: () => void;
    asChild?: boolean;
    children: React.ReactNode;
}

const DropdownMenuTrigger = ({ onClick, asChild, children }: DropdownMenuTriggerProps) => {
    if (asChild && React.isValidElement(children)) {
        // Fix 3: Explicitly type children as React.ReactElement<any> to allow onClick to be spread
        return React.cloneElement(children, { onClick: onClick });
    }
    return <button onClick={onClick} className="border rounded px-2 py-1 text-sm bg-white flex items-center gap-1">
        {children} <ChevronDown size={16} />
    </button>;
};

interface DropdownMenuContentProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}

const DropdownMenuContent = ({ setIsOpen, children }: DropdownMenuContentProps) => (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {React.Children.map(children, child =>
                // Fix 3: Explicitly type child before cloning
                (React.isValidElement(child) && child.type === DropdownMenuItem)
                    ? React.cloneElement(child as React.ReactElement<DropdownMenuItemProps>, { onClick: () => setIsOpen(false) })
                    : child
            )}
        </div>
    </div>
);

interface DropdownMenuItemProps {
    onClick?: () => void;
    children: React.ReactNode;
}

const DropdownMenuItem = ({ onClick, children }: DropdownMenuItemProps) => (
    <button
        onClick={onClick}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        role="menuitem"
    >
        {children}
    </button>
);


// Placeholder components for charts
interface ChartPlaceholderProps {
    title: string;
    className?: string;
    dropdown?: boolean;
    dropdownCaption?: string;
}

const AreaChartPlaceholder = ({ title, className, dropdown = false, dropdownCaption = "Pilihan" }: ChartPlaceholderProps) => (
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
                        <DropdownMenuContent setIsOpen={() => { }}>
                            <DropdownMenuItem onClick={() => { }}>Opsi 1</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { }}>Opsi 2</DropdownMenuItem>
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

const PieChartPlaceholder = ({ title, className }: ChartPlaceholderProps) => {
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

const BarChartPlaceholder = ({ title, className }: ChartPlaceholderProps) => (
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
interface DataTableColumn {
    header: string;
    accessor: string;
}

interface DataTableProps {
    // Fix 1.3: Removed 'title' prop as it's not used within the component
    // Fix 2: Changed 'any[]' to 'Record<string, any>[]' for better type specificity
    data?: Record<string, any>[];
    columns?: DataTableColumn[];
}

const DataTable = ({ data = [], columns = [] }: DataTableProps) => {
    // Default mock data if none provided
    const defaultMockData = [
        { id: 1, periset: 'Jane Cooper', judul: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.', catatan: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.', tahun: '2023', jenis: 'Jurnal', status: 'Scopus' },
        { id: 2, periset: 'Floyd Miles', judul: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.', catatan: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.', tahun: '2024', jenis: 'Prosiding', status: 'Non-Scopus' },
        { id: 3, periset: 'Ronald Richards', judul: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.', catatan: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.', tahun: '2023', jenis: 'Buku', status: 'Non-Scopus' },
    ];

    // Default mock columns if none provided
    const defaultMockColumns: DataTableColumn[] = [
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

interface DashboardProps {
    kpi: {
        totalPublications: number;
        scopusIndexedCount: number;
        publicationAuthorsCount: number;
        activeResearchers: number;
    };
    charts: {
        publicationsTrend: { name: string; total: number }[];
        publicationTypes: { jenis: string; count: number }[];
        scopusData: { name: string; count: number }[];
        // Tambahkan tipe untuk data chart KI, Dana Eksternal, dll. jika sudah ada di controller
    };
    tables: {
        publicationsWithNotes: Record<string, any>[];
        detailPublications: Record<string, any>[];
    };
}

export default function DashboardPRSDI({ kpi, charts, tables }: DashboardProps) {
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
                            <span className="text-3xl font-bold text-neutral-700">{kpi.totalPublications.toLocaleString()}</span>
                            {/* Persentase ini masih hardcoded, bisa dihitung dari backend juga */}
                            <span className="text-green-600 text-sm font-medium">+2.89%</span>
                        </div>
                        <div className="text-gray-500 text-xs">vs. previous month</div>
                        <div className="w-full h-1.5 rounded-full bg-gray-200 mt-2">
                            <div className="bg-[#E62F2A] h-1.5 rounded-full" style={{ width: '78%' }}></div> {/* ini juga bisa jadi data dinamis */}
                        </div>
                    </div>
                    <div className="rounded-xl border bg-white shadow-lg p-5 flex flex-col gap-3">
                        <div className="font-bold text-lg text-[#E62F2A]">Untuk Terindex Scopus</div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-neutral-700">
                                {((kpi.scopusIndexedCount / kpi.totalPublications) * 100).toFixed(2)}% {/* Hitung persentase */}
                            </span>
                            <span className="text-green-600 text-sm font-medium">+2.89%</span>
                        </div>
                        <div className="text-gray-500 text-xs">vs. previous month</div>
                        <div className="w-full h-1.5 rounded-full bg-gray-200 mt-2">
                            <div className="bg-[#E62F2A] h-1.5 rounded-full" style={{ width: `${((kpi.scopusIndexedCount / kpi.totalPublications) * 100).toFixed(0)}%` }}></div>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-white shadow-lg p-5 flex flex-col gap-3">
                        <div className="font-bold text-lg text-[#E62F2A]">Publikasi per Penulis</div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-neutral-700">{kpi.publicationAuthorsCount.toLocaleString()}</span>
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
                            <span className="text-3xl font-bold text-neutral-700">{kpi.activeResearchers.toLocaleString()}</span>
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
                    {/* Fix 5: Pass required props to TabsList */}
                    <TabsList activeTab={""} setActiveTab={() => { }} className="bg-white rounded-xl shadow border p-1 w-fit">
                        {/* Fix 5: No longer need to pass isActive and onClick here directly, as they are now optional in TabsTriggerProps */}
                        <TabsTrigger value="publikasi" className="data-[state=active]:bg-[#E62F2A] data-[state=active]:text-white rounded-lg px-4 py-2">Publikasi</TabsTrigger>
                        <TabsTrigger value="ki" className="data-[state=active]:bg-[#E62F2A] data-[state=active]:text-white rounded-lg px-4 py-2">KI</TabsTrigger>
                        <TabsTrigger value="dana" className="data-[state=active]:bg-[#E62F2A] data-[state=active]:text-white rounded-lg px-4 py-2">Dana Eksternal</TabsTrigger>
                        <TabsTrigger value="sdm" className="data-[state=active]:bg-[#E62F2A] data-[state=active]:text-white rounded-lg px-4 py-2">SDM Studi</TabsTrigger>
                        <TabsTrigger value="purwarupa" className="data-[state=active]:bg-[#E62F2A] data-[state=active]:text-white rounded-lg px-4 py-2">Purwarupa</TabsTrigger>
                        <TabsTrigger value="pdvr" className="data-[state=active]:bg-[#E62F2A] data-[state=active]:text-white rounded-lg px-4 py-2">PDVR</TabsTrigger>
                    </TabsList>

                    {/* Tab Content: Publikasi */}
                    <TabsContent value="publikasi" activeTab={""} className="space-y-4">
                        <AreaChartPlaceholder title="Perkembangan Publikasi per Bulan" className="w-full h-64" dropdown />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PieChartPlaceholder title="Jenis Publikasi" className="w-full h-72" />
                            <BarChartPlaceholder title="Scopus vs Non-Scopus" className="w-full h-72" />
                        </div>
                    </TabsContent>

                    {/* Tab Content: KI */}
                    <TabsContent value="ki" activeTab={""} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <BarChartPlaceholder title="Jumlah KI per Kelompok Riset" className="w-full h-72" />
                            <PieChartPlaceholder title="Status KI" className="w-full h-72" />
                        </div>
                    </TabsContent>

                    {/* Tab Content: Dana Eksternal */}
                    <TabsContent value="dana" activeTab={""} className="space-y-4">
                        <BarChartPlaceholder title="Nilai Dana Eksternal per Tahun" className="w-full h-72 mb-4" />
                        <BarChartPlaceholder title="Dana Berdasarkan Kelompok Riset" className="w-full h-72" />
                    </TabsContent>

                    {/* Tab Content: SDM Studi */}
                    <TabsContent value="sdm" activeTab={""} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PieChartPlaceholder title="Jenjang Studi SDM" className="w-full h-72" />
                            <BarChartPlaceholder title="Universitas Tujuan" className="w-full h-72" />
                        </div>
                    </TabsContent>

                    {/* Tab Content: Purwarupa */}
                    <TabsContent value="purwarupa" activeTab={""} className="space-y-4">
                        <BarChartPlaceholder title="Jumlah Purwarupa per Kelompok Riset" className="w-full h-72" />
                    </TabsContent>

                    {/* Tab Content: PDVR */}
                    <TabsContent value="pdvr" activeTab={""} className="space-y-4">
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
                        <DataTable data={tables.publicationsWithNotes} columns={[
                            { header: 'No.', accessor: 'id' },
                            { header: 'Periset', accessor: 'periset' },
                            { header: 'Judul', accessor: 'judul' },
                            { header: 'Catatan', accessor: 'catatan' },
                            { header: 'Tahun', accessor: 'tahun' },
                            { header: 'Jenis', accessor: 'jenis' },
                            { header: 'Status', accessor: 'status' },
                        ]} />
                        {/* Update pagination info based on actual data count, if available */}
                        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                            <span>Showing data 1 to {tables.publicationsWithNotes.length} of {kpi.totalPublications} entries</span>
                            {/* ... (pagination buttons remain as mock or implement dynamic pagination logic) */}
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
                            data={tables.detailPublications}
                            columns={[ // Example columns for Detail Publikasi, customize as needed
                                { header: 'No.', accessor: 'id' },
                                { header: 'Periset', accessor: 'periset' },
                                { header: 'Judul Publikasi', accessor: 'judul_publikasi' },
                                { header: 'Tahun', accessor: 'tahun' },
                                { header: 'Jenis Publikasi', accessor: 'jenis' },
                                { header: 'Scopus/Non-Scopus', accessor: 'status' },
                            ]}
                        />
                        {/* Update pagination info based on actual data count, if available */}
                        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                            <span>Showing data 1 to {tables.detailPublications.length} of {kpi.totalPublications} entries</span>
                            {/* ... (pagination buttons remain as mock or implement dynamic pagination logic) */}
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
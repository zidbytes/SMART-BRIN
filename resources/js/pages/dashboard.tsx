// "use client" // Tambahkan ini jika file ini berada di lingkungan Next.js App Router

import React, { useState } from 'react';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Label, Pie, PieChart, Sector, Cell } from 'recharts';
import { PieSectorDataItem } from "recharts/types/polar/Pie"

// Import komponen Shadcn UI yang sebenarnya
// Pastikan path ini sesuai dengan struktur proyek Anda
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartStyle,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart" // <-- Path ini memerlukan shadcn-ui add chart
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Menggunakan import aktual seperti yang diminta
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import patternBg from '../assets/bg-pattern3.png'; // Import background pattern

// Shadcn UI Tabs components mockup (mempertahankan ini karena Anda membuatnya sendiri)
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
                if (React.isValidElement(child) && child.type === TabsList) {
                    return React.cloneElement(child as React.ReactElement<TabsListProps>, { activeTab, setActiveTab });
                }
                return child;
            })}
            {React.Children.map(children, child => {
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
            (React.isValidElement(child) && child.type === TabsTrigger)
                ? React.cloneElement(child as React.ReactElement<TabsTriggerProps>, {
                    isActive: (child.props as TabsTriggerProps).value === activeTab,
                    onClick: () => setActiveTab((child.props as TabsTriggerProps).value)
                })
                : child
        )}
    </div>
);

interface TabsTriggerProps {
    value: string;
    className?: string;
    children: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
}

const TabsTrigger = ({ className, children, isActive, onClick }: TabsTriggerProps) => (
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

// Real Chart Components using database data
interface ChartPlaceholderProps {
    title: string;
    className?: string;
    dropdown?: boolean;
    dropdownCaption?: string;
}

// Line Chart Component for Publications Trend using Recharts
interface LineChartProps {
    title: string;
    data: { name: string; total: number }[];
    className?: string;
    dropdown?: boolean;
}

const PublicationLineChart = ({ title, data, className, dropdown = false }: LineChartProps) => {
    const [selectedYear, setSelectedYear] = useState<string>('2024');
    
    // Transform data for Recharts
    const chartData = data.map(item => ({
        month: item.name,
        publications: item.total,
    }));
    
    // Calculate trend percentage
    const currentTotal = data.reduce((sum, item) => sum + item.total, 0);
    const trendPercentage = data.length > 1 ? 
        ((data[data.length - 1].total - data[0].total) / data[0].total * 100).toFixed(1) : 0;
    
    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-[#E62F2A]">{title}</CardTitle>
                        <CardDescription>January - December 2024</CardDescription>
                    </div>
                    {dropdown && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="border rounded px-3 py-2 text-sm bg-white flex items-center gap-2 hover:bg-gray-50">
                                    {selectedYear} <ChevronDown size={16} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent >
                                <DropdownMenuItem onClick={() => setSelectedYear('2024')}>2024</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSelectedYear('2023')}>2023</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSelectedYear('2022')}>2022</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="w-full h-64">
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 20,
                                }}
                            >
                                <CartesianGrid strokeDashArray="3 3" stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="month" 
                                    stroke="#6b7280"
                                    fontSize={11}
                                    tickFormatter={(value) => value.substring(0, 3)}
                                />
                                <YAxis 
                                    stroke="#6b7280"
                                    fontSize={11}
                                />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white p-3 border rounded-lg shadow-lg">
                                                    <p className="font-medium text-gray-700">{label}</p>
                                                    <p className="text-[#E62F2A]">
                                                        Publikasi: {payload[0].value}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="publications"
                                    stroke="#E62F2A"
                                    strokeWidth={3}
                                    dot={{ 
                                        fill: "#E62F2A", 
                                        strokeWidth: 2, 
                                        r: 4 
                                    }}
                                    activeDot={{ 
                                        r: 6, 
                                        fill: "#E62F2A",
                                        stroke: "#fff",
                                        strokeWidth: 2
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border border-dashed text-gray-400">
                            <span>No data available</span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 items-center font-medium leading-none">
                    {Number(trendPercentage) > 0 ? (
                        <>
                            Trending up by {trendPercentage}% this year 
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </>
                    ) : Number(trendPercentage) < 0 ? (
                        <>
                            Trending down by {Math.abs(Number(trendPercentage))}% this year
                            <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                        </>
                    ) : (
                        <>
                            No change this year
                            <div className="h-4 w-4" />
                        </>
                    )}
                </div>
                <div className="text-gray-500 leading-none">
                    Showing total publications for the last 12 months ({currentTotal} total)
                </div>
            </CardFooter>
        </Card>
    );
};


// Bar Chart Component for Scopus vs Non-Scopus
interface BarChartProps {
    title: string;
    data: { name: string; count: number }[];
    className?: string;
}

const BarChart = ({ title, data, className }: BarChartProps) => {
    const maxValue = Math.max(...data.map(d => d.count), 1);
    const chartHeight = 200;
    const chartWidth = 500;
    const barWidth = 80;
    const barSpacing = 120;
    
    return (
        <Card className={`shadow-lg rounded-xl ${className}`}>
            <CardContent className="p-4">
                <div className="font-bold mb-4 text-[#E62F2A]">{title}</div>
                <div className="w-full h-64 overflow-hidden">
                    {data.length > 0 ? (
                        <div className="w-full h-full">
                            <svg 
                                width="100%" 
                                height="100%" 
                                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                                className="w-full h-full"
                                preserveAspectRatio="xMidYMid meet"
                            >
                                {/* Grid lines */}
                                {[0, 1, 2, 3, 4].map((i) => {
                                    const y = 30 + (i * (chartHeight - 60) / 4);
                                    return (
                                        <line
                                            key={i}
                                            x1="80"
                                            y1={y}
                                            x2={chartWidth - 40}
                                            y2={y}
                                            stroke="#e5e7eb"
                                            strokeWidth="1"
                                        />
                                    );
                                })}
                                
                                {/* Bars */}
                                {data.map((item, index) => {
                                    const barHeight = (item.count / maxValue) * (chartHeight - 60);
                                    const x = 100 + (index * barSpacing);
                                    const y = chartHeight - 30 - barHeight;
                                    const color = index === 0 ? '#E62F2A' : '#94A3B8';
                                    
                                    return (
                                        <g key={index}>
                                            {/* Bar */}
                                            <rect
                                                x={x}
                                                y={y}
                                                width={barWidth}
                                                height={barHeight}
                                                fill={color}
                                                rx="4"
                                            />
                                            
                                            {/* Value label on top of bar */}
                                            <text
                                                x={x + barWidth / 2}
                                                y={y - 8}
                                                textAnchor="middle"
                                                fontSize="12"
                                                fill="#6b7280"
                                                fontWeight="500"
                                            >
                                                {item.count}
                                            </text>
                                            
                                            {/* Category label */}
                                            <text
                                                x={x + barWidth / 2}
                                                y={chartHeight - 10}
                                                textAnchor="middle"
                                                fontSize="12"
                                                fill="#6b7280"
                                            >
                                                {item.name}
                                            </text>
                                        </g>
                                    );
                                })}
                                
                                {/* Y-axis labels */}
                                {[0, 1, 2, 3, 4].map((i) => {
                                    const y = 30 + (i * (chartHeight - 60) / 4);
                                    const value = Math.round(maxValue - (i * maxValue / 4));
                                    return (
                                        <text
                                            key={i}
                                            x="70"
                                            y={y + 4}
                                            textAnchor="end"
                                            fontSize="11"
                                            fill="#6b7280"
                                        >
                                            {value}
                                        </text>
                                    );
                                })}
                            </svg>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border border-dashed text-gray-400">
                            <span>No data available</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const BarChartPlaceholder = ({ title, className }: ChartPlaceholderProps) => (
    <Card className={`shadow-lg rounded-xl ${className}`}>
        <CardContent className="p-4">
            <div className="font-bold mb-4 text-[#E62F2A]">{title}</div>
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md border border-dashed text-gray-400">
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
    data?: Array<Record<string, unknown>>;
    columns?: DataTableColumn[];
}

const DataTable = ({ data = [], columns = [] }: DataTableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Default mock data if none provided
    const defaultMockData = [
        { id: 1, periset: 'Jane Cooper', judul: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.', catatan: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.', tahun: '2023', jenis: 'Jurnal', status: 'Scopus' },
        { id: 2, periset: 'Floyd Miles', judul: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.', catatan: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.', tahun: '2024', jenis: 'Prosiding', status: 'Non-Scopus' },
        { id: 3, periset: 'Ronald Richards', judul: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.', catatan: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.', tahun: '2023', jenis: 'Buku', status: 'Non-Scopus' },
        { id: 4, periset: 'Jane Smith', judul: 'Research on Advanced Data Science Techniques', catatan: 'Comprehensive analysis of modern methodologies.', tahun: '2024', jenis: 'Jurnal', status: 'Scopus' },
        { id: 5, periset: 'John Doe', judul: 'Machine Learning Applications in Healthcare', catatan: 'Innovative approaches to medical diagnosis.', tahun: '2024', jenis: 'Prosiding', status: 'Scopus' },
        { id: 6, periset: 'Alice Johnson', judul: 'Artificial Intelligence in Education', catatan: 'Transforming learning experiences with AI.', tahun: '2023', jenis: 'Buku', status: 'Non-Scopus' },
        { id: 7, periset: 'Bob Wilson', judul: 'Blockchain Technology Overview', catatan: 'Understanding distributed ledger systems.', tahun: '2024', jenis: 'Jurnal', status: 'Scopus' },
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

    // Pagination calculations
    const totalItems = actualData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = actualData.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded text-sm ${
                        i === currentPage
                            ? 'bg-[#E62F2A] text-white'
                            : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                    {i}
                </button>
            );
        }

        return pageNumbers;
    };

    return (
        <div>
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
                        {currentData.map((row, rowIndex) => (
                            <tr key={rowIndex} className={`text-neutral-700 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100`}>
                                {actualColumns.map((col, colIndex) => (
                                    <td key={colIndex} className="px-4 py-2">
                                        {String((row as Record<string, unknown>)[col.accessor] || '')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>
                    Showing data {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
                </span>
                <div className="flex gap-1">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded text-sm ${
                            currentPage === 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        ‹
                    </button>
                    
                    {renderPageNumbers()}
                    
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded text-sm ${
                            currentPage === totalPages
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        ›
                    </button>
                </div>
            </div>
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
    target: {
        publikasi_ilmiah_global: number;
        kekayaan_intelektual: number;
        purwarupa: number;
        kerjasama_internasional: number;
        kerjasama_nasional: number;
        dana_eksternal: number;
        sdm_studi_lanjut: number;
        postdoc_visiting: number;
        pelatihan_internasional: number;
    } | null;
    charts: {
        publicationsTrend: { name: string; total: number }[];
        publicationTypes: { jenis: string; count: number }[];
        scopusData: { name: string; count: number }[];
    };
    tables: {
        publicationsWithNotes: {
            id: number;
            periset: string;
            judul: string;
            catatan: string;
            tahun: number;
            jenis: string;
            status: string;
        }[];
        detailPublications: {
            id: number;
            periset: string;
            judul_publikasi: string;
            tahun: number;
            jenis: string;
            status: string;
        }[];
    };
}

export default function DashboardPRSDI({ kpi, target, charts, tables }: DashboardProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
    ];

    // Debug: Log target data
    console.log('Target data received:', target);
    console.log('Target publikasi_ilmiah_global:', target?.publikasi_ilmiah_global);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Capaian PRSDI" />
            <div
                className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6 overflow-x-auto"
                style={{
                    backgroundImage: `url(${patternBg})`,
                    // backgroundColor: '#f3f4f6',
                }}
            >
                {/* Header */}
                <div className="mb-4">
                    <h1 className="text-4xl font-extrabold text-[#E62F2A] mb-1">Dashboard Capaian PRSDI</h1>
                    <div className="text-neutral-500 text-md">{getFormattedDate()}</div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {/* Total Publikasi */}
                    <div className="rounded-xl border bg-white shadow-lg p-5 flex flex-col gap-3">
                        <div className="font-bold text-lg text-[#E62F2A]">Total Publikasi</div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-neutral-700">{kpi.totalPublications.toLocaleString()}</span>
                            {target && target.publikasi_ilmiah_global > 0 && (
                                <span className={`text-sm font-medium ${kpi.totalPublications >= target.publikasi_ilmiah_global ? 'text-green-600' : 'text-red-600'}`}>
                                    {kpi.totalPublications >= target.publikasi_ilmiah_global ? '+' : ''}{((kpi.totalPublications / target.publikasi_ilmiah_global) * 100 - 100).toFixed(1)}%
                                </span>
                            )}
                        </div>
                        <div className="text-gray-500 text-xs">
                            {target && target.publikasi_ilmiah_global > 0 ? (
                                <>Capaian: {kpi.totalPublications} / {target.publikasi_ilmiah_global} publikasi</>
                            ) : (
                                <>Capaian: {kpi.totalPublications} publikasi (target belum ditetapkan)</>
                            )}
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-gray-200 mt-2">
                            <div className="bg-[#E62F2A] h-1.5 rounded-full transition-all"
                                style={{ 
                                    width: target && target.publikasi_ilmiah_global > 0 
                                        ? `${Math.min(100, (kpi.totalPublications / target.publikasi_ilmiah_global) * 100)}%` 
                                        : '0%' 
                                }}></div>
                        </div>
                    </div>
                    {/* Untuk Terindex Scopus */}
                    <div className="rounded-xl border bg-white shadow-lg p-5 flex flex-col gap-3">
                        <div className="font-bold text-lg text-[#E62F2A]">Untuk Terindex Scopus</div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-neutral-700">
                                {((kpi.scopusIndexedCount / kpi.totalPublications) * 100).toFixed(2)}%
                            </span>
                            <span className="text-green-600 text-sm font-medium">+2.89%</span>
                        </div>
                        <div className="text-gray-500 text-xs">vs. previous month</div>
                        <div className="w-full h-1.5 rounded-full bg-gray-200 mt-2">
                            <div className="bg-[#E62F2A] h-1.5 rounded-full"
                                style={{ width: `${((kpi.scopusIndexedCount / kpi.totalPublications) * 100).toFixed(0)}%` }}></div>
                        </div>
                    </div>
                    {/* Jumlah Periset Aktif */}
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
                    <TabsList activeTab={""} setActiveTab={() => { }} className="bg-white rounded-xl shadow border p-1 w-fit">
                        <TabsTrigger value="publikasi" className="data-[state=active]:bg-[#E62F2A] data-[state=active]:text-white rounded-lg px-4 py-2">Publikasi</TabsTrigger>
                        <TabsTrigger value="ki" className="data-[state=active]:bg-[#E62F2A] data-[state=active]:text-white rounded-lg px-4 py-2">KI</TabsTrigger>
                        <TabsTrigger value="dana" className="data-[state=active]:bg-[#E62F2A] data-[state=active]:text-white rounded-lg px-4 py-2">Dana Eksternal</TabsTrigger>
                        <TabsTrigger value="sdm" className="data-[state=active]:bg-[#E62F2A] data-[state=active]:text-white rounded-lg px-4 py-2">SDM Studi</TabsTrigger>
                        <TabsTrigger value="purwarupa" className="data-[state=active]:bg-[#E62F2A] data-[state=active]:text-white rounded-lg px-4 py-2">Purwarupa</TabsTrigger>
                        <TabsTrigger value="pdvr" className="data-[state=active]:bg-[#E62F2A] data-[state=active]:text-white rounded-lg px-4 py-2">PDVR</TabsTrigger>
                    </TabsList>

                    {/* Tab Content: Publikasi */}
                    <TabsContent value="publikasi" activeTab={""} className="space-y-4">
                        <PublicationLineChart 
                            title="Perkembangan Publikasi per Bulan" 
                            data={charts.publicationsTrend}
                            className="w-full min-h-[400px]" 
                            dropdown 
                        />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Menggunakan ModifiedPieChartPlaceholder untuk Shadcn-like behavior */}
                            <ModifiedPieChartPlaceholder
                                title="Jenis Publikasi"
                                className="w-full min-h-[400px]"
                                data={charts.publicationTypes}
                            />
                            <BarChart 
                                title="Scopus vs Non-Scopus" 
                                data={charts.scopusData}
                                className="w-full min-h-[400px]" 
                            />
                            <ModifiedPieChartPlaceholder
                                title="Status Publikasi"
                                className="w-full min-h-[400px]"
                                data={[
                                    { jenis: "Published", count: 245 },
                                    { jenis: "In Review", count: 89 },
                                    { jenis: "Draft", count: 67 },
                                    { jenis: "Rejected", count: 23 }
                                ]}
                            />
                        </div>
                    </TabsContent>

                    {/* Tab Content: KI */}
                    <TabsContent value="ki" activeTab={""} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <BarChartPlaceholder title="Jumlah KI per Kelompok Riset" className="w-full min-h-[400px]" />
                            {/* Menggunakan ModifiedPieChartPlaceholder untuk Shadcn-like behavior */}
                            <ModifiedPieChartPlaceholder title="Status KI" className="w-full min-h-[400px]" />
                        </div>
                    </TabsContent>

                    {/* Tab Content: Dana Eksternal */}
                    <TabsContent value="dana" activeTab={""} className="space-y-4">
                        <BarChartPlaceholder title="Nilai Dana Eksternal per Tahun" className="w-full min-h-[400px] mb-4" />
                        <BarChartPlaceholder title="Dana Berdasarkan Kelompok Riset" className="w-full min-h-[400px]" />
                    </TabsContent>

                    {/* Tab Content: SDM Studi */}
                    <TabsContent value="sdm" activeTab={""} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Menggunakan ModifiedPieChartPlaceholder untuk Shadcn-like behavior */}
                            <ModifiedPieChartPlaceholder title="Jenjang Studi SDM" className="w-full min-h-[400px]" />
                            <BarChartPlaceholder title="Universitas Tujuan" className="w-full min-h-[400px]" />
                        </div>
                    </TabsContent>

                    {/* Tab Content: Purwarupa */}
                    <TabsContent value="purwarupa" activeTab={""} className="space-y-4">
                        <BarChartPlaceholder title="Jumlah Purwarupa per Kelompok Riset" className="w-full min-h-[400px]" />
                    </TabsContent>

                    {/* Tab Content: PDVR */}
                    <TabsContent value="pdvr" activeTab={""} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <BarChartPlaceholder title="Jumlah PDVR per Jenis" className="w-full min-h-[400px]" />
                            {/* Menggunakan ModifiedPieChartPlaceholder untuk Shadcn-like behavior */}
                            <ModifiedPieChartPlaceholder title="Keterlibatan SDM vs Non-SDM" className="w-full min-h-[400px]" />
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
                            { header: 'Jenis', accessor: 'jenis', },
                            { header: 'Status', accessor: 'status' },
                        ]} />
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
                            columns={[
                                { header: 'No.', accessor: 'id' },
                                { header: 'Periset', accessor: 'periset' },
                                { header: 'Judul Publikasi', accessor: 'judul_publikasi', },
                                { header: 'Tahun', accessor: 'tahun' },
                                { header: 'Jenis Publikasi', accessor: 'jenis' },
                                { header: 'Status', accessor: 'status' },
                            ]}
                        />
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    );
}

// --- KOMPONEN PIECHARTPLACEHOLDER BARU YANG MENGGUNAKAN SHADCN UI ASLI ---
// PASTIKAN HANYA ADA SATU DEKLARASI KOMPONEN INI DI SELURUH FILE
const ModifiedPieChartPlaceholder = ({ title, className, data = [] }: ChartPlaceholderProps & { data?: { jenis: string; count: number }[] }) => {
    // Transform data for Recharts, mirip desktopData dari contoh Shadcn
    const chartData = React.useMemo(() => {
        const defaultMockData = [
            { name: "Jurnal", value: 186 },
            { name: "Prosiding", value: 305 },
            { name: "Buku", value: 237 },
            { name: "Lainnya", value: 173 }
        ];

        const baseData = data.length > 0 ? data : defaultMockData.map(item => ({jenis: item.name, count: item.value}));

        return baseData.map((item) => ({
            name: item.jenis,
            value: item.count,
            // `fill` akan diambil dari variabel CSS `--color-categoryname`
            // yang diatur oleh ChartStyle Shadcn
            fill: `var(--color-${item.jenis.toLowerCase().replace(/ /g, '-')})`
        }));
    }, [data]);
    
    const id = "pie-interactive-modified"; // ID unik untuk ChartContainer dan ChartStyle
    
    // chartConfig harus sesuai dengan ChartConfig dari Shadcn UI
    // dan mencerminkan kategori data yang sebenarnya (jurnal, prosiding, dll.)
    const chartConfig: ChartConfig = React.useMemo(() => {
        const config: ChartConfig = {
            // Definisikan juga 'Total' jika digunakan di Label tengah
            total: {
                label: "Total Publikasi",
                color: "hsl(var(--foreground))", // Warna default atau sesuaikan
            }
        };

        // Definisikan warna spesifik untuk setiap kategori
        // Ini adalah tempat untuk menentukan mapping warna Shadcn Chart
        // ke kategori data Anda. Anda perlu mendefinisikan variabel CSS ini
        // (misalnya, --chart-1, --chart-2, dst.) di file CSS global atau tema Anda.
        const staticColors = [
            "var(--chart-1)", // untuk Jurnal
            "var(--chart-2)", // untuk Prosiding
            "var(--chart-3)", // untuk Buku
            "var(--chart-4)", // untuk Lainnya
            "var(--chart-5)", // jika ada kategori ke-5
            "var(--chart-6)", // jika ada kategori ke-6
        ];

        chartData.forEach((item, index) => {
            const categoryKey = item.name.toLowerCase().replace(/ /g, '-');
            config[categoryKey] = {
                label: item.name,
                color: staticColors[index % staticColors.length] || "hsl(var(--primary))",
            };
        });
        
        return config;
    }, [chartData]);
    
    // State untuk kategori yang aktif, sama seperti di ChartPieInteractive Shadcn
    const [activeCategory, setActiveCategory] = React.useState(chartData.length > 0 ? chartData[0].name : '');
    
    const activeIndex = React.useMemo(
        () => chartData.findIndex((item) => item.name === activeCategory),
        [activeCategory, chartData]
    );

    const categories = React.useMemo(() => chartData.map((item) => item.name), [chartData]);

    // Active shape render function, persis seperti ChartPieInteractive Shadcn
    const renderActiveShape = ({
        outerRadius = 0,
        ...props
    }: PieSectorDataItem) => (
        <g>
            <Sector {...props} outerRadius={outerRadius + 10} />
            <Sector
                {...props}
                outerRadius={outerRadius + 25}
                innerRadius={outerRadius + 12}
            />
        </g>
    );
    
    return (
        <Card data-chart={id} className={`flex flex-col shadow-lg rounded-xl ${className}`}>
            <ChartStyle id={id} config={chartConfig} /> {/* Menggunakan ChartStyle dari Shadcn */}
            
            <CardHeader className="flex flex-row items-start space-y-0 pb-0">
                <div className="grid gap-1">
                    <CardTitle className="text-lg font-semibold text-[#E62F2A]">{title}</CardTitle>
                    <CardDescription>Januari - Desember 2024</CardDescription>
                </div>
                {/* Menggunakan Shadcn Select components */}
                <Select value={activeCategory} onValueChange={setActiveCategory}>
                    <SelectTrigger
                        className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent align="end" className="rounded-xl">
                        {categories.map((key) => {
                            const configItem = chartConfig[key.toLowerCase().replace(/ /g, '-') as keyof typeof chartConfig];

                            if (!configItem) {
                                return null;
                            }

                            return (
                                <SelectItem
                                    key={key}
                                    value={key}
                                    className="rounded-lg [&_span]:flex"
                                >
                                    <div className="flex items-center gap-2 text-xs">
                                        <span
                                            className="flex h-3 w-3 shrink-0 rounded-xs"
                                            style={{
                                                backgroundColor: `var(--color-${key.toLowerCase().replace(/ /g, '-')})`,
                                            }}
                                        />
                                        {configItem?.label}
                                    </div>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </CardHeader>
            
            <CardContent className="flex flex-1 flex-col items-center justify-center p-6 pt-0 pb-6">
                {/* Hapus ResponsiveContainer dari sini */}
                <ChartContainer 
                    id={id} 
                    config={chartConfig} 
                    className="mx-auto" 
                    style={{ height: '300px', width: '300px' }} // Atur tinggi dan lebar tetap
                >
                    {chartData.length > 0 ? (
                        <PieChart width={300} height={300}> {/* DIMENSI LANGSUNG KE PIECHART */}
                                {/* Menggunakan ChartTooltip Shadcn */}
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    strokeWidth={5}
                                    activeShape={renderActiveShape}
                                    // onMouseEnter={(_, index) => setActiveCategory(chartData[index].name)}
                                    // onMouseLeave={() => setActiveCategory(chartData[0].name)}
                                    isAnimationActive={true}
                                >
                                    {/* `Cell` tidak perlu didefinisikan secara eksplisit untuk warna jika `fill` sudah di data */}
                                    {chartData.map((entry, index) => {
                                        // Pastikan properti 'fill' ada di setiap item chartData
                                        // Ini akan diambil dari `fill: var(--color-categoryname)` yang dibuat di atas
                                        return <Cell key={`cell-${index}`} fill={entry.fill} />;
                                    })}
                                    <Label
                                        content={({ viewBox }) => {
                                            // console.log("viewBox for Label:", viewBox); // Bisa dihapus setelah debugging
                                            
                                            // Recharts akan menyediakan viewBox yang valid jika width/height ditetapkan langsung
                                            // cx dan cy seharusnya ada.
                                            const cx = viewBox?.cx ?? 150; // Fallback jika undefined (width/2)
                                            const cy = viewBox?.cy ?? 150; // Fallback jika undefined (height/2)


                                            const currentItem = activeIndex >= 0 ? chartData[activeIndex] : null; // Gunakan activeIndex

                                            return (
                                                <text
                                                    x={cx}
                                                    y={cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={cx}
                                                        y={cy}
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        {currentItem ? currentItem.value.toLocaleString() : '0'}
                                                    </tspan>
                                                    <tspan  
                                                        x={cx}
                                                        y={(cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        {currentItem ? currentItem.name : 'N/A'} {/* PERBAIKAN DI SINI */}
                                                    </tspan>
                                                </text>
                                            );
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        
                    ) : (
                        <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border border-dashed text-gray-400">
                            <span>No data available</span>
                        </div>
                    )}
                </ChartContainer>
                
                {/* Legend horizontal di bawah pie chart - Non-interactive */}
                {chartData.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-4 mt-4 px-4">
                        {chartData.map((entry, index) => {
                            const configItem = chartConfig[entry.name.toLowerCase().replace(/ /g, '-') as keyof typeof chartConfig];
                            
                            return (
                                <div
                                    key={`legend-${index}`}
                                    className="flex items-center gap-2 px-3 py-2 text-sm"
                                >
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{
                                            backgroundColor: `var(--color-${entry.name.toLowerCase().replace(/ /g, '-')})`,
                                        }}
                                    />
                                    <span className="font-medium text-gray-700">
                                        {configItem?.label || entry.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        ({entry.value.toLocaleString()})
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
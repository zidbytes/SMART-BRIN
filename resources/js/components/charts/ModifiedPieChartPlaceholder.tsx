import React from 'react';
import { PieChart, Pie, Cell, Sector, Label } from 'recharts';
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartStyle,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ChartPlaceholderProps {
    title: string;
    className?: string;
    dropdown?: boolean;
    dropdownCaption?: string;
}

// Updated to handle both data formats - either with jenis or name property
const ModifiedPieChartPlaceholder = ({ title, className, data = [] }: ChartPlaceholderProps & { data?: { jenis?: string; name?: string; count: number }[] }) => {
    // Transform data for Recharts, mirip desktopData dari contoh Shadcn
    const chartData = React.useMemo(() => {
        // Use actual data from backend, only fallback to mock data if necessary
        const baseData = data.length > 0 ? data : [];

        return baseData.map((item) => {
            // Use jenis if available, otherwise use name
            const categoryName = item.jenis || item.name || 'Unknown';
            return {
                name: categoryName,
                value: item.count,
                // `fill` akan diambil dari variabel CSS `--color-categoryname`
                // yang diatur oleh ChartStyle Shadcn
                fill: `var(--color-${categoryName.toLowerCase().replace(/ /g, '-')})`
            };
        });
    }, [data]);
    
    const id = "pie-interactive-modified"; // ID unik untuk ChartContainer dan ChartStyle
    
    // chartConfig harus sesuai dengan ChartConfig dari Shadcn UI
    // dan mencerminkan kategori data yang sebenarnya (jurnal, prosiding, dll.)
    const chartConfig: ChartConfig = React.useMemo(() => {
        const config: ChartConfig = {
            // Definisikan juga 'Total' jika digunakan di Label tengah
            total: {
                label: "Total",
                color: "hsl(var(--foreground))", // Warna default atau sesuaikan
            }
        };

        // Definisikan warna spesifik untuk setiap kategori
        // Ini adalah tempat untuk menentukan mapping warna Shadcn Chart
        // ke kategori data Anda. Anda perlu mendefinisikan variabel CSS ini
        // (misalnya, --chart-1, --chart-2, dst.) di file CSS global atau tema Anda.
        const staticColors = [
            "var(--chart-1)", 
            "var(--chart-2)", 
            "var(--chart-3)", 
            "var(--chart-4)", 
            "var(--chart-5)", 
            "var(--chart-6)",
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
    const [activeCategory, setActiveCategory] = React.useState(chartData && chartData.length > 0 ? chartData[0].name : '');
    
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
                    {chartData && chartData.length > 0 ? (
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
                                    activeIndex={activeIndex}
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
                                            // Handle viewBox for different chart types (CartesianViewBox or PolarViewBox)
                                            // Use type assertion to access cx and cy for PolarViewBox type
                                            const polarViewBox = viewBox as { cx?: number; cy?: number } | undefined;
                                            const cx = polarViewBox?.cx ?? 150; // Fallback if undefined (width/2)
                                            const cy = polarViewBox?.cy ?? 150; // Fallback if undefined (height/2)


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
                {chartData && chartData.length > 0 && (
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

export default ModifiedPieChartPlaceholder;

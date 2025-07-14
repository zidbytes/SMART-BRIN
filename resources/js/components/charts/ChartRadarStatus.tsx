import React from 'react';
import { RadarChart, PolarAngleAxis, PolarGrid, Radar } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartRadarStatusProps {
    data: { category: string; count: number }[];
    className?: string;
}

function ChartRadarStatus({ data = [], className }: ChartRadarStatusProps) {
    // Only use the data provided from the backend, no fallback to mock data
    const chartData = React.useMemo(() => {
        return data || [];
    }, [data]);

    // Dynamically create chart config based on the data categories
    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {
            count: {
                label: "Jumlah",
                color: "var(--chart-1)",
            }
        };
        
        // Map specific colors to specific status categories
        const statusColorMap: Record<string, string> = {
            "Submit": "var(--chart-1)",
            "Accepted": "var(--chart-2)",
            "Published": "var(--chart-3)",
            "Review": "var(--chart-4)",
            "Draft": "var(--chart-5)",
            "Reject": "var(--chart-6)",
            "Undefined": "#94A3B8", // Gray color for undefined status
        };
        
        const staticColors = [
            "var(--chart-1)",
            "var(--chart-2)",
            "var(--chart-3)",
            "var(--chart-4)",
            "var(--chart-5)",
            "var(--chart-6)",
        ];

        // Add each category to the config with appropriate color
        chartData.forEach((item, index) => {
            // Use specific color if defined, otherwise use color from static array
            const color = statusColorMap[item.category] || staticColors[index % staticColors.length];
            
            config[item.category] = {
                label: item.category,
                color: color,
            };
        });
        
        return config;
    }, [chartData]);

    const totalCount = React.useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.count, 0);
    }, [chartData]);

    return (
        <Card className={`shadow-lg rounded-xl ${className}`}>
            <CardHeader className="flex flex-row items-start space-y-0 pb-0">
                <div className="grid gap-1">
                    <CardTitle className="text-lg font-semibold text-[#E62F2A]">Status Publikasi</CardTitle>
                    <CardDescription>Distribusi Status Publikasi - {new Date().getFullYear()}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col items-center justify-center p-6 pt-0 pb-6">
                {chartData && chartData.length > 0 && chartData.some(item => item.count > 0) ? (
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square w-full"
                        style={{ maxHeight: '320px' }}
                    >
                        <RadarChart data={chartData}>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <PolarAngleAxis 
                                dataKey="category" 
                                tick={{ fontSize: 10, fill: "#6b7280" }}
                                axisLineType="circle" 
                            />
                            <PolarGrid gridType="circle" stroke="#e5e7eb" strokeDasharray="3 3" />
                            <Radar
                                dataKey="count"
                                fill="#E62F2A"
                                fillOpacity={0.7}
                                stroke="#E62F2A"
                                strokeWidth={2}
                                dot={{
                                    r: 4,
                                    fillOpacity: 1,
                                    fill: "#E62F2A",
                                    stroke: "#fff",
                                }}
                                activeDot={{
                                    r: 6,
                                    fill: "#E62F2A",
                                    stroke: "#fff",
                                    strokeWidth: 2
                                }}
                            />
                        </RadarChart>
                    </ChartContainer>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 w-full bg-gray-50 rounded-md border border-dashed text-gray-400">
                        <span>No status data available</span>
                        <span className="text-xs mt-2">Check the 'status' column in publication records</span>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 items-center font-medium leading-none">
                    Total Publikasi: <span className="font-bold">{totalCount.toLocaleString()}</span>
                </div>
                {chartData && chartData.length > 0 && (
                    <>
                        <div className="text-gray-500 leading-none text-xs mt-1">
                            <span className="font-medium">Status tertinggi:</span> {
                                chartData.filter(item => item.count > 0)
                                    .reduce((prev, current) => (prev.count > current.count) ? prev : current, 
                                        { category: 'Tidak ada', count: 0 }).category
                            } ({totalCount > 0 ? Math.round((chartData.reduce((prev, current) => 
                                (prev.count > current.count) ? prev : current, 
                                { category: 'Tidak ada', count: 0 }).count / totalCount) * 100) : 0}%)
                        </div>
                        <div className="text-gray-500 leading-none text-xs">
                            <span className="font-medium">Status kosong:</span> {
                                chartData.find(item => item.category === 'Undefined')?.count || 0
                            } publikasi
                        </div>
                        <div className="text-gray-500 leading-none text-xs">
                            <span className="font-medium">Keterangan:</span> Data berdasarkan kolom status di database tahun {new Date().getFullYear()}
                        </div>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}

export default ChartRadarStatus;

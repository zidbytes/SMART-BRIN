import React, { useState } from 'react';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Label, Pie, PieChart, Sector, Cell } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

// Mock versions of shadcn chart components
interface ChartConfig {
  [key: string]: {
    label: string;
    color?: string;
  }
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  // Create CSS variables for the chart colors
  const colorVars = Object.entries(config)
    .filter(([, value]) => value.color)
    .map(([key, value]) => `--color-${key}: ${value.color};`)
    .join(' ');

  return <div id={`chart-style-${id}`} style={{ display: 'none' }} data-styles={colorVars}></div>;
};

const ChartContainer = ({ 
  id, 
  className,
  children 
}: { 
  id: string; 
  config?: ChartConfig;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div id={`chart-container-${id}`} className={className}>
      {children}
    </div>
  );
};

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

// Shadcn UI CardHeader component mockup
const CardHeader = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={`p-6 pb-0 ${className}`}>
        {children}
    </div>
);

// Shadcn UI CardTitle component mockup
const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
        {children}
    </h3>
);

// Shadcn UI CardDescription component mockup
const CardDescription = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <p className={`text-sm text-gray-500 ${className}`}>
        {children}
    </p>
);

// Shadcn UI CardFooter component mockup
const CardFooter = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={`p-6 pt-0 ${className}`}>
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
        return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, { onClick: onClick });
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
                            <DropdownMenuContent setIsOpen={() => { }}>
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
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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

// Pie Chart Component for Publication Types - Kept for reference but not used
// interface PieChartProps {
//     title: string;
//     data: { jenis: string; count: number }[];
//     className?: string;
// }

// const PieChart = ({ title, data, className }: PieChartProps) => {
//     const total = data.reduce((sum, item) => sum + item.count, 0);
//     const colors = ['#E62F2A', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'];
//     
//     // Calculate angles for pie slices
//     let currentAngle = 0;
//     const slices = data.map((item, index) => {
//         const percentage = (item.count / total) * 100;
//         const angle = (item.count / total) * 360;
//         const startAngle = currentAngle;
//         const endAngle = currentAngle + angle;
//         currentAngle += angle;
//         
//         // Calculate path for pie slice
//         const radius = 100;
//         const centerX = 140;
//         const centerY = 140;
//         
//         const startAngleRad = (startAngle * Math.PI) / 180;
//         const endAngleRad = (endAngle * Math.PI) / 180;
//         
//         const x1 = centerX + radius * Math.cos(startAngleRad);
//         const y1 = centerY + radius * Math.sin(startAngleRad);
//         const x2 = centerX + radius * Math.cos(endAngleRad);
//         const y2 = centerY + radius * Math.sin(endAngleRad);
//         
//         const largeArcFlag = angle > 180 ? 1 : 0;
//         
//         const pathData = [
//             `M ${centerX} ${centerY}`,
//             `L ${x1} ${y1}`,
//             `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
//             'Z'
//         ].join(' ');
//         
//         return {
//             pathData,
//             color: colors[index % colors.length],
//             percentage: percentage.toFixed(1),
//             label: item.jenis,
//             count: item.count
//         };
//     });
//     
//     return (
//         <Card className={`shadow-lg rounded-xl ${className}`}>
//             <CardContent className="p-4">
//                 <div className="font-bold mb-4 text-[#E62F2A]">{title}</div>
//                 <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
//                     {data.length > 0 ? (
//                         <>
//                             {/* Pie Chart SVG */}
//                             <div className="flex-shrink-0 w-full lg:w-auto flex justify-center">
//                                 <svg width="280" height="280" viewBox="0 0 280 280" className="max-w-full h-auto">
//                                     {slices.map((slice, index) => (
//                                         <path
//                                             key={index}
//                                             d={slice.pathData}
//                                             fill={slice.color}
//                                             stroke="white"
//                                             strokeWidth="2"
//                                         />
//                                     ))}
//                                 </svg>
//                             </div>
//                             
//                             {/* Legend */}
//                             <div className="flex flex-col gap-3 w-full lg:w-auto lg:ml-6 lg:min-w-[200px]">
//                                 {slices.map((slice, index) => (
//                                     <div key={index} className="flex items-center gap-3">
//                                         <div
//                                             className="w-4 h-4 rounded-full flex-shrink-0"
//                                             style={{ backgroundColor: slice.color }}
//                                         />
//                                         <div className="text-sm flex-1">
//                                             <div className="font-medium text-gray-700">{slice.label}</div>
//                                             <div className="text-gray-500">{slice.count} ({slice.percentage}%)</div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </>
//                     ) : (
//                         <div className="flex items-center justify-center w-full h-48 bg-gray-50 rounded-md border border-dashed text-gray-400">
//                             <span>No data available</span>
//                         </div>
//                     )}
//                 </div>
//             </CardContent>
//         </Card>
//     );
// };

const PieChartPlaceholder = ({ title, className, data = [] }: ChartPlaceholderProps & { data?: { jenis: string; count: number }[] }) => {
    // Transform data to the format expected by the interactive pie chart
    const chartData = React.useMemo(() => {
        return data.length > 0 ? 
            data.map((item) => ({
                name: item.jenis,
                value: item.count
            })) : 
            [
                { name: "jurnal", value: 186 },
                { name: "prosiding", value: 305 },
                { name: "buku", value: 237 },
                { name: "lainnya", value: 173 }
            ];
    }, [data]);
    
    const id = "pie-interactive";
    
    // Define color palette
    const colors = React.useMemo(() => ({
        jurnal: "#E62F2A",       // primary
        prosiding: "#FF6B6B",    // secondary
        buku: "#4ECDC4",         // tertiary
        lainnya: "#45B7D1",      // quaternary
        "grant-riset": "#96CEB4", // fifth
        "hibah": "#FECA57"       // sixth
    }), []);
    
    // Create chart config from the data
    const chartConfig = React.useMemo(() => {
        const config: Record<string, { label: string; color?: string }> = {};
        
        // Add entry for each category
        chartData.forEach((item) => {
            const categoryName = item.name.toLowerCase();
            config[categoryName] = {
                label: item.name,
                color: colors[categoryName as keyof typeof colors] || 
                       Object.values(colors)[chartData.indexOf(item) % Object.values(colors).length]
            };
        });
        
        return config;
    }, [chartData, colors]);
    
    const [activeCategory, setActiveCategory] = React.useState(chartData.length > 0 ? chartData[0].name : '');
    
    const activeIndex = React.useMemo(
        () => chartData.findIndex((item) => item.name === activeCategory),
        [activeCategory, chartData]
    );
    
    // Custom tooltip content
    const customTooltipContent = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; }> }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border rounded-lg shadow-lg">
                    <p className="font-medium text-gray-700">{payload[0].name}</p>
                    <p className="text-[#E62F2A]">
                        {payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };
    
    // Custom active shape for the pie chart
    const renderActiveShape = (props: PieSectorDataItem) => {
        const {
            cx = 0,
            cy = 0,
            innerRadius = 0,
            outerRadius = 0,
            startAngle = 0,
            endAngle = 0,
            fill = '#E62F2A'
        } = props;
        
        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 10}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 12}
                    outerRadius={outerRadius + 20}
                    fill={fill}
                />
            </g>
        );
    };
    
    return (
        <Card data-chart={id} className={`flex flex-col shadow-lg rounded-xl ${className}`}>
            <ChartStyle id={id} config={chartConfig} />
            
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold text-[#E62F2A]">{title}</CardTitle>
                    <CardDescription>Januari - Desember 2024</CardDescription>
                </div>
                
                <div className="ml-auto flex items-center space-x-2">
                    <div className="relative inline-block">
                        <select
                            value={activeCategory}
                            onChange={(e) => setActiveCategory(e.target.value)}
                            className="h-8 w-[130px] rounded-md pl-3 pr-8 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#E62F2A]"
                            style={{
                                background: `linear-gradient(90deg, ${chartConfig[activeCategory.toLowerCase()]?.color || '#E62F2A'}22 0%, transparent 100%)`
                            }}
                        >
                            {chartData.map((item) => {
                                const categoryKey = item.name.toLowerCase();
                                const color = chartConfig[categoryKey]?.color;
                                
                                return (
                                    <option 
                                        key={item.name} 
                                        value={item.name}
                                        style={{color: color}}
                                    >
                                        {item.name}
                                    </option>
                                );
                            })}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown size={14} className="text-gray-500" />
                        </div>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="flex flex-1 items-center justify-center p-6 pt-0 pb-6">
                <ChartContainer id={id} config={chartConfig} className="mx-auto aspect-square w-full max-w-[300px]">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip 
                                    cursor={false}
                                    content={customTooltipContent}
                                />
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={1}
                                    activeShape={renderActiveShape}
                                    isAnimationActive={true}
                                    onMouseEnter={(_, index) => setActiveCategory(chartData[index].name)}
                                >
                                    {chartData.map((entry, index) => {
                                        const categoryKey = entry.name.toLowerCase();
                                        const color = chartConfig[categoryKey]?.color || 
                                                       Object.values(colors)[index % Object.values(colors).length];
                                        
                                        return (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={color} 
                                                strokeWidth={0}
                                            />
                                        );
                                    })}
                                    <Label
                                        content={({ viewBox }) => {
                                            if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                                                return null;
                                            }
                                            
                                            const { cx, cy } = viewBox as { cx: number, cy: number };
                                            const activeItem = activeIndex >= 0 ? chartData[activeIndex] : null;
                                            
                                            return (
                                                <text
                                                    x={cx}
                                                    y={cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="central"
                                                >
                                                    <tspan
                                                        x={cx}
                                                        y={cy}
                                                        className="text-3xl font-bold"
                                                        fill="#000"
                                                    >
                                                        {activeItem ? activeItem.value.toLocaleString() : '0'}
                                                    </tspan>
                                                    <tspan
                                                        x={cx}
                                                        y={(cy || 0) + 24}
                                                        fill="#6b7280"
                                                        className="text-sm"
                                                    >
                                                        Total
                                                    </tspan>
                                                </text>
                                            );
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border border-dashed text-gray-400">
                            <span>No data available</span>
                        </div>
                    )}
                </ChartContainer>
            </CardContent>
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
    // Better typing for data
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
                            <span className={`text-sm font-medium ${kpi.totalPublications >= 74 ? 'text-green-600' : 'text-red-600'}`}>
                                {kpi.totalPublications >= 74 ? '+' : ''}{((kpi.totalPublications / 74) * 100 - 100).toFixed(1)}%
                            </span>
                        </div>
                        <div className="text-gray-500 text-xs">
                            Capaian: {kpi.totalPublications} / 74 publikasi
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-gray-200 mt-2">
                            <div className="bg-[#E62F2A] h-1.5 rounded-full transition-all"
                                style={{ width: `${Math.min(100, (kpi.totalPublications / 74) * 100)}%` }}></div>
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
                        <PublicationLineChart 
                            title="Perkembangan Publikasi per Bulan" 
                            data={charts.publicationsTrend}
                            className="w-full min-h-[400px]" 
                            dropdown 
                        />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <PieChartPlaceholder 
                                title="Jenis Publikasi" 
                                className="w-full min-h-[400px]"
                                data={charts.publicationTypes}
                            />
                            <BarChart 
                                title="Scopus vs Non-Scopus" 
                                data={charts.scopusData}
                                className="w-full min-h-[400px]" 
                            />
                        </div>
                    </TabsContent>

                    {/* Tab Content: KI */}
                    <TabsContent value="ki" activeTab={""} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <BarChartPlaceholder title="Jumlah KI per Kelompok Riset" className="w-full min-h-[400px]" />
                            <PieChartPlaceholder title="Status KI" className="w-full min-h-[400px]" />
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
                            <PieChartPlaceholder title="Jenjang Studi SDM" className="w-full min-h-[400px]" />
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
                            <PieChartPlaceholder title="Keterlibatan SDM vs Non-SDM" className="w-full min-h-[400px]" />
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
                                { header: 'Judul Publikasi', accessor: 'judul_publikasi' },
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
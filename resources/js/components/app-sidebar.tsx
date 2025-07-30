import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FileBarChart, FileText, Folder, Goal, LayoutGrid, Upload, Users } from 'lucide-react';
import AppLogo from './app-logo';

// 1. Definisikan tipe untuk objek User
interface User {
    id: number;
    name: string;
    email: string;
    role: 'head' | 'researcher' | 'monev';
}

// 2. Definisikan tipe untuk props yang dibagikan dari backend
interface SharedProps {
    auth: {
        user: User | null;
    };
    name: string;
    quote: {
        message: string;
        author: string;
    };
    ziggy: object;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

// Definisikan semua kemungkinan item menu beserta role yang diizinkan
const allNavItems: (NavItem & { roles: string[] })[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        roles: ['head', 'researcher', 'monev'], // Semua role bisa lihat
    },
    {
        title: 'Details',
        href: '/details',
        icon: FileText,
        roles: ['head', 'researcher', 'monev'], // Semua role bisa lihat
    },
    {
        title: 'Target Tahunan',
        href: '/target-tahunan',
        icon: Goal,
        roles: ['head', 'monev'], // Dilihat oleh Head dan Monev
    },
    {
        title: 'Upload Dokumen',
        href: '/upload-documents',
        icon: Upload,
        roles: ['head', 'researcher'], // Head dan Researcher
    },
    {
        title: 'Laporan Capaian',
        href: '/report-capaian',
        icon: FileBarChart,
        roles: ['head', 'monev'], // Hanya Head
    },
    {
        title: 'Account Management',
        href: '/users',
        icon: Users,
        roles: ['head'], // Hanya Head
    },
];

export function AppSidebar() {
    const { props } = usePage<SharedProps>();
    const userRole = props.auth?.user?.role;

    // Filter menu berdasarkan role pengguna
    const mainNavItems = userRole ? allNavItems.filter((item) => item.roles.includes(userRole)) : [];

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="bg-[--sidebar]" // Menggunakan variabel sidebar
        >
            <SidebarHeader className="bg-[--sidebar] text-[--sidebar-foreground]">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            {/* Menggunakan text-[--sidebar-primary] untuk logo/nama aplikasi agar menonjol */}
                            <Link href="/dashboard" className="text-[--sidebar-primary]">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-[--sidebar] text-[--sidebar-foreground]">
                {/* Tampilkan menu yang sudah difilter */}
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="bg-[--sidebar] text-[--sidebar-foreground]">
                {/* Pastikan NavFooter dan NavUser juga menggunakan warna yang harmonis */}
                <NavUser className="text-[--sidebar-foreground]" />
            </SidebarFooter>
        </Sidebar>
    );
}

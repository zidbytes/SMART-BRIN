import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, FileText, Folder, LayoutGrid, Target } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Details',
        href: '/details',
        icon: FileText,
    },
    {
        title: 'Target Tahunan',
        href: '/target-tahunan',
        icon: Target,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];



export function AppSidebar() {
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
                            <Link href="/dashboard" prefetch className="text-[--sidebar-primary]">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-[--sidebar] text-[--sidebar-foreground]">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="bg-[--sidebar] text-[--sidebar-foreground]">
                {/* Pastikan NavFooter dan NavUser juga menggunakan warna yang harmonis */}
                <NavFooter items={footerNavItems} className="mt-auto text-[--sidebar-foreground]" />
                <NavUser className="text-[--sidebar-foreground]" />
            </SidebarFooter>
        </Sidebar>
    );
}

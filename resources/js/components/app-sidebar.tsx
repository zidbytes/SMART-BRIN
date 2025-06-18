import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, FileText, Folder, LayoutGrid } from 'lucide-react';
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
            className="bg-[#242424]" // Warna latar belakang sidebar
        >
            <SidebarHeader className="bg-[#242424] text-[#E62F2A]"> {/* Warna teks SidebarHeader */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch className="text-[#E62F2A]"> {/* Warna teks link */}
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-[#242424] text-[#E62F2A]"> {/* Warna teks SidebarContent */}
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="bg-[#242424] text-[#E62F2A]"> {/* Warna teks SidebarFooter */}
                <NavFooter items={footerNavItems} className="mt-auto text-[#E62F2A]" /> {/* Warna teks NavFooter */}
                <NavUser className="text-[#E62F2A]" /> {/* Warna teks NavUser */}
            </SidebarFooter>
        </Sidebar>

    );
}

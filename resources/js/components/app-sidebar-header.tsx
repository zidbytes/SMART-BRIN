import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar-trigger';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-[#E62F2A]/50 bg-[#E62F2A] text-white px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 text-white hover:text-gray-200" />
                <Breadcrumbs breadcrumbs={breadcrumbs} className="text-white" />
            </div>
        </header>
    );
}

export default function DashboardPRSDI() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
                <SidebarTrigger />
                <h1 className="text-lg font-bold">Dashboard</h1>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* Content goes here */}
                <p>Welcome to the Dashboard!</p>
            </main>
        </div>
    );
}

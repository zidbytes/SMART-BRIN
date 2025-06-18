// resources/js/components/ui/sidebar-trigger.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useSidebar } from './sidebar'; // Impor useSidebar dari sidebar utama

export function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
    const { state, isMobile, setOpenMobile, setOpen } = useSidebar(); // Dapatkan state dan setter dari context

    const handleToggle = (event) => {
        if (isMobile) {
            setOpenMobile(prev => !prev);
        } else {
            setOpen(prev => !prev);
        }
        onClick?.(event); // Panggil onClick yang mungkin diberikan dari parent
    };

    // Tentukan ikon berdasarkan state sidebar
    const IconComponent = state === 'expanded' ? ChevronLeft : ChevronRight;

    return (
        <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 ${className}`}
            onClick={handleToggle}
            {...props}
        >
            <IconComponent />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    );
}
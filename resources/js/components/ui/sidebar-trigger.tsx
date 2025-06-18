import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Pastikan Anda memiliki komponen Button
import { PanelLeftIcon, ChevronRight, ChevronLeft } from "lucide-react"; // Pastikan Anda memiliki lucide-react untuk ikon

export function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        const sidebar = document.querySelector("#sidebar");
        if (sidebar) {
            sidebar.classList.toggle("hidden");
        }
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 ${className}`}
            onClick={(event) => {
                onClick?.(event);
                toggleSidebar();
            }}
            {...props}
        >
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    );
}
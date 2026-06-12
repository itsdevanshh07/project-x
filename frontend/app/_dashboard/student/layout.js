'use client';

import { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import DashboardTopbar from '@/components/dashboard/Topbar';
import MobileSidebar from '@/components/dashboard/MobileSidebar';

export default function StudentLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <DashboardSidebar />

            {/* Mobile Drawer */}
            <MobileSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
                <DashboardTopbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 p-6 lg:p-10">
                    <div className="max-w-[1200px] mx-auto">
                        {children}
                    </div>
                </main>

                <footer className="px-6 lg:px-10 py-6 border-t border-border bg-muted/20">
                    <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                            © {new Date().getFullYear()} Divya Gyan Dhara Academic Portal
                        </p>
                        <div className="flex items-center space-x-6 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                            <a href="#" className="hover:text-foreground">Support</a>
                            <a href="#" className="hover:text-foreground">Academic Guidelines</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

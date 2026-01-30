'use client';

import { Bell, Search, Menu, User, Calendar } from 'lucide-react';
import { useSelector } from 'react-redux';
import ThemeToggle from '../ThemeToggle';

export default function DashboardTopbar({ onMenuClick }) {
    const { user } = useSelector((state) => state.auth);

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <header className="sticky top-0 z-50 w-full h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 lg:px-10">
            <div className="flex items-center space-x-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-foreground lg:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="hidden sm:flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{today}</span>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center bg-muted/50 border border-border px-3 py-1.5 rounded-lg w-64 focus-within:border-accent-gold transition-all">
                    <Search className="w-4 h-4 text-muted-foreground mr-2" />
                    <input
                        type="text"
                        placeholder="Search curriculum..."
                        className="bg-transparent border-none outline-none text-xs w-full text-foreground placeholder-muted-foreground font-medium"
                    />
                </div>

                <div className="flex items-center space-x-2 lg:space-x-4">
                    <ThemeToggle />

                    <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-accent-gold rounded-full border-2 border-background" />
                    </button>

                    <div className="h-8 w-[1px] bg-border hidden sm:block mx-2" />

                    <div className="flex items-center space-x-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-foreground leading-none">{user?.fullName}</p>
                            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Class {user?.grade || '10'}</p>
                        </div>
                        <div className="w-9 h-9 bg-foreground rounded-lg flex items-center justify-center text-background font-bold text-xs uppercase shadow-sm">
                            {user?.fullName?.charAt(0)}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, Menu, User, Calendar, Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

export default function DashboardTopbar({ onMenuClick }) {
    const { user } = useSelector((state) => state.auth);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const today = mounted ? new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : '';

    return (
        <header className="sticky top-0 z-50 w-full h-24 bg-primary-bg/50 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-10">
            {/* Contextual Awareness */}
            <div className="flex items-center space-x-8">
                <button
                    onClick={onMenuClick}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl text-white lg:hidden hover:bg-white/10 transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
                    <Calendar className="w-3.5 h-3.5 text-secondary-action" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-light/40">{today}</span>
                </div>
            </div>

            {/* Interaction Hub */}
            <div className="flex items-center space-x-6">
                <div className="hidden md:flex items-center bg-white/5 border border-white/5 px-4 py-2.5 rounded-2xl w-80 group focus-within:border-secondary-action/30 transition-all">
                    <Search className="w-4 h-4 text-surface-light/20 group-focus-within:text-secondary-action mr-3 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search curriculum..."
                        className="bg-transparent border-none outline-none text-[11px] font-bold uppercase tracking-widest w-full text-white placeholder-surface-light/20"
                    />
                </div>

                <div className="flex items-center space-x-6">
                    <button className="relative p-3 bg-white/5 border border-white/5 rounded-2xl text-surface-light/40 hover:text-white hover:bg-white/10 transition-all group">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent-highlight rounded-full border-2 border-primary-bg box-content group-hover:scale-125 transition-transform" />
                    </button>

                    <div className="h-10 w-[1px] bg-white/5 hidden sm:block mx-2" />

                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-display font-black text-white tracking-tight">
                                {mounted ? user?.fullName : ''}
                            </p>
                            <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                <Sparkles className="w-2.5 h-2.5 text-accent-highlight" />
                                <p className="text-[9px] text-surface-light/30 font-black uppercase tracking-[0.2em]">
                                    Academic Level {mounted ? (user?.grade || '12') : ''}
                                </p>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="w-12 h-12 bg-secondary-action/20 border border-secondary-action/30 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-2xl shadow-secondary-action/10 group-hover:bg-secondary-action/30 transition-all duration-500">
                                {mounted ? user?.fullName?.charAt(0) : ''}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-primary-bg" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

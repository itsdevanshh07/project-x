'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    BookOpen,
    Video,
    FileText,
    BarChart3,
    User,
    Settings,
    Library,
    LogOut,
    Sparkles,
    Shield
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/slices/authSlice';
import { motion } from 'framer-motion';

const studentMenuItems = [
    { name: 'Overview', href: '/dashboard/student', icon: LayoutDashboard },
    { name: 'Academic Courses', href: '/dashboard/student/courses', icon: BookOpen },
    { name: 'Live Classes', href: '/dashboard/student/live', icon: Video },
    { name: 'Library', href: '/dashboard/student/library', icon: Library },
    { name: 'Assessments', href: '/dashboard/student/tests', icon: FileText },
    { name: 'Academic Reports', href: '/dashboard/student/reports', icon: BarChart3 },
];

const secondaryItems = [
    { name: 'Profile Settings', href: '/dashboard/student/profile', icon: User },
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const menuItems = studentMenuItems;

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-80 bg-primary-bg/80 backdrop-blur-2xl text-surface-light/60 border-r border-white/5 hidden lg:flex flex-col z-[60] p-8">
            {/* Academic Logo */}
            <div className="mb-12">
                <Link href="/" className="flex items-center space-x-4 group">
                    <div className="relative">
                        <div className="bg-secondary-action/20 p-2.5 rounded-xl border border-secondary-action/30 flex items-center justify-center group-hover:bg-secondary-action/30 transition-all duration-500 shadow-xl shadow-secondary-action/10">
                            <Library className="text-secondary-action w-6 h-6" strokeWidth={2} />
                        </div>
                        <motion.div
                            className="absolute -top-1 -right-1"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-3 h-3 text-accent-highlight" />
                        </motion.div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-display font-black text-white tracking-tight leading-none">
                            DGD <span className="text-secondary-action">PORTAL</span>
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-[0.25em] text-surface-light/30 mt-1.5 flex items-center gap-1.5">
                            <Shield className="w-2 h-2 text-secondary-action/50" />
                            Academic Command
                        </span>
                    </div>
                </Link>
            </div>

            {/* Curriculum Hub Navigation */}
            <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar pr-2">
                <div className="mb-8">
                    <p className="px-5 text-[10px] font-black text-surface-light/20 uppercase tracking-[0.3em] mb-6">Core Curriculum</p>
                    <div className="space-y-1.5">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative flex items-center space-x-4 px-5 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-500 group
                                        ${isActive
                                            ? 'text-white bg-white/5 border border-white/10 shadow-2xl'
                                            : 'hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className={`w-4 h-4 transition-colors duration-500 ${isActive ? 'text-secondary-action' : 'group-hover:text-white'}`} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="relative z-10">{item.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="student-sidebar-active"
                                            className="absolute left-2 w-1 h-6 bg-secondary-action rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <p className="px-5 text-[10px] font-black text-surface-light/20 uppercase tracking-[0.3em] mb-6">Personalization</p>
                    <div className="space-y-1.5">
                        {secondaryItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-4 px-5 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-500 group
                                        ${isActive
                                            ? 'text-white bg-white/5 border border-white/10 shadow-2xl'
                                            : 'hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className={`w-4 h-4 transition-colors duration-500 ${isActive ? 'text-secondary-action' : 'group-hover:text-white'}`} strokeWidth={isActive ? 2.5 : 2} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Terminate Protocol */}
            <div className="pt-8 border-t border-white/5">
                <button
                    onClick={() => dispatch(logout())}
                    className="w-full flex items-center space-x-4 px-5 py-4 text-red-400/70 hover:text-red-400 hover:bg-red-500/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group"
                >
                    <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span>Terminate Session</span>
                </button>
            </div>
        </aside>
    );
}

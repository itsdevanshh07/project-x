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
    LogOut
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/slices/authSlice';

const menuItems = [
    { name: 'Overview', href: '/dashboard/student', icon: LayoutDashboard },
    { name: 'Academic Courses', href: '/dashboard/student/courses', icon: BookOpen },
    { name: 'Live Classes', href: '/dashboard/student/live', icon: Video },
    { name: 'Library', href: '/dashboard/student/library', icon: Library },
    { name: 'Assessments', href: '/dashboard/student/tests', icon: FileText },
    { name: 'Academic Reports', href: '/dashboard/student/reports', icon: BarChart3 },
];

const secondaryItems = [
    { name: 'Profile', href: '/dashboard/student/profile', icon: User },
    // { name: 'Support', href: '/dashboard/student/support', icon: Settings },
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    const dispatch = useDispatch();

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0B0F14] text-slate-400 border-r border-slate-800 hidden lg:flex flex-col z-[60]">
            <div className="p-8">
                <Link href="/" className="flex items-center space-x-3">
                    <div className="bg-slate-800 p-2 rounded-lg">
                        <Library className="text-[#F5C542] w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-display font-bold text-white tracking-tight leading-none uppercase">
                            DGD <span className="text-slate-500">Portal</span>
                        </span>
                        <span className="text-[7px] font-medium uppercase tracking-[0.2em] text-slate-500 mt-1">
                            Academic Hub
                        </span>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4 no-scrollbar">
                <p className="px-4 text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-4">Core Studies</p>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center space-x-3 px-4 py-3.5 rounded-lg text-sm font-semibold transition-all ${isActive
                                    ? 'bg-slate-800 text-[#F5C542] shadow-sm'
                                    : 'hover:bg-slate-900 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-4 h-4" strokeWidth={isActive ? 2 : 1.5} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}

                <div className="pt-8 mb-4">
                    <p className="px-4 text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-4">Personalization</p>
                    {secondaryItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-3 px-4 py-3.5 rounded-lg text-sm font-semibold transition-all ${isActive
                                        ? 'bg-slate-800 text-[#F5C542]'
                                        : 'hover:bg-slate-900 hover:text-white'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" strokeWidth={isActive ? 2 : 1.5} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => dispatch(logout())}
                    className="w-full flex items-center space-x-3 px-4 py-3.5 text-red-400 hover:bg-red-400/10 rounded-lg text-sm font-bold transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Terminate Session</span>
                </button>
            </div>
        </aside>
    );
}

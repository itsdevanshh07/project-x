'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Library, LayoutDashboard, BookOpen, Video, FileText, BarChart3, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

export default function MobileSidebar({ isOpen, onClose }) {
    const pathname = usePathname();
    const dispatch = useDispatch();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
                    />
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#0B0F14] z-[80] lg:hidden flex flex-col"
                    >
                        <div className="p-6 flex items-center justify-between border-b border-slate-800">
                            <Link href="/" className="flex items-center space-x-3">
                                <Library className="text-[#F5C542] w-6 h-6" />
                                <span className="text-white font-display font-bold text-lg">DGD</span>
                            </Link>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`flex items-center space-x-4 px-4 py-4 rounded-xl text-sm font-semibold transition-all ${isActive
                                                ? 'bg-slate-800 text-[#F5C542]'
                                                : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-6 border-t border-slate-800">
                            <button
                                onClick={() => {
                                    dispatch(logout());
                                    onClose();
                                }}
                                className="w-full flex items-center space-x-4 px-4 py-4 text-red-400 hover:bg-red-400/10 rounded-xl text-sm font-bold transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Terminate Session</span>
                            </button>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}

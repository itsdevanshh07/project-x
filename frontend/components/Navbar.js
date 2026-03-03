'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    User,
    LogOut,
    LayoutDashboard,
    Library,
    Sparkles
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/slices/authSlice';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const pathname = usePathname();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Programs', href: '/courses' },
        { name: 'Teachers', href: '/teachers' },
        { name: 'About', href: '/about' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-[50] w-full flex justify-center pointer-events-none transition-all duration-300">
            <div className="w-full max-w-7xl px-4 md:px-8 py-4 md:py-6 flex justify-center">
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`
                        pointer-events-auto
                        flex items-center justify-between
                        w-full h-[64px] md:h-[72px] lg:h-[80px] px-4 md:px-8
                        glass-card transition-all duration-500 ease-out
                        ${isScrolled ? 'scale-[0.98] lg:scale-95 opacity-95 lg:opacity-90 translate-y-2' : ''}
                    `}
                >
                    {/* Left: Logo */}
                    <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
                        <div className="relative shrink-0">
                            <div className="bg-secondary-action/20 p-2 rounded-xl border border-secondary-action/30 flex items-center justify-center group-hover:bg-secondary-action/30 transition-colors">
                                <Library className="text-secondary-action w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                            </div>
                        </div>
                        <div className="flex flex-col min-w-0 overflow-hidden">
                            <span className="text-sm md:text-lg font-display font-bold text-white tracking-tight leading-none truncate">
                                Divya Gyan <span className="text-secondary-action">Dhara</span>
                            </span>
                            <span className="text-[7px] md:text-[8px] font-medium uppercase tracking-[0.2em] text-surface-light/40 mt-1 truncate">
                                Future-Ready Education
                            </span>
                        </div>
                    </Link>

                    {/* Center: Navigation links (Desktop Only) */}
                    <div className="hidden lg:flex items-center gap-6 bg-white/5 px-6 py-2 rounded-full border border-white/10 ring-1 ring-white/5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`
                                    relative text-sm font-semibold transition-all duration-300
                                    ${pathname === link.href
                                        ? 'text-white'
                                        : 'text-surface-light/60 hover:text-white'}
                                `}
                            >
                                {link.name}
                                {pathname === link.href && (
                                    <motion.div
                                        layoutId="nav-active"
                                        className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-secondary-action rounded-full"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3 md:gap-6">
                        {mounted && user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 p-1.5 pl-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group lg:min-w-[140px]"
                                >
                                    <span className="hidden sm:inline text-white text-xs lg:text-sm font-bold">{user.fullName.split(' ')[0]}</span>
                                    <div className="w-8 h-8 md:w-9 md:h-9 bg-secondary-action rounded-lg flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition-transform">
                                        {user.fullName.charAt(0)}
                                    </div>
                                </Link>
                                <button
                                    onClick={() => dispatch(logout())}
                                    className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-surface-light/40 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20 transition-all active:scale-90"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 md:gap-6">
                                <Link href="/login" className="hidden lg:block text-sm font-bold text-surface-light/70 hover:text-white transition-colors">
                                    Sign In
                                </Link>
                                <Link
                                    href="/courses"
                                    className="bg-accent-highlight text-primary-bg px-4 md:px-6 h-10 md:h-11 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center justify-center hover:shadow-[0_0_25px_rgba(250,204,21,0.4)] transition-all active:scale-95 whitespace-nowrap shadow-lg shadow-black/20"
                                >
                                    Enroll Now
                                </Link>
                            </div>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            className="lg:hidden text-white p-2.5 hover:bg-white/5 rounded-xl transition-colors shrink-0"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </motion.nav>
            </div>

            {/* Mobile Menu Sidebar */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-primary-bg/80 backdrop-blur-md z-[110] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[280px] bg-primary-bg border-l border-white/10 z-[120] p-8 lg:hidden flex flex-col justify-between pointer-events-auto"
                        >
                            <div className="space-y-12">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-xl font-display font-bold text-white tracking-tight">Divya Gyan</span>
                                        <span className="text-[10px] text-secondary-action font-black uppercase tracking-widest">Navigation Hub</span>
                                    </div>
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-4 bg-white/5 rounded-xl text-white active:scale-90 transition-transform">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="flex flex-col space-y-6">
                                    {navLinks.map((link, idx) => (
                                        <motion.div
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 + idx * 0.1 }}
                                            key={link.name}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`text-2xl font-display font-bold transition-all ${pathname === link.href ? 'text-secondary-action' : 'text-surface-light/40 hover:text-white'}`}
                                            >
                                                {link.name}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {mounted && user ? (
                                    <div className="space-y-3">
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="w-full h-16 glass-card flex items-center gap-4 px-6 border-secondary-action/30"
                                        >
                                            <div className="w-10 h-10 bg-secondary-action rounded-xl flex items-center justify-center text-white font-bold">{user.fullName.charAt(0)}</div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white">{user.fullName.split(' ')[0]}</span>
                                                <span className="text-[10px] text-surface-light/40 uppercase tracking-widest font-black">Student Access</span>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                dispatch(logout());
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center gap-3 text-red-500 font-bold uppercase tracking-widest text-[10px]"
                                        >
                                            <LogOut size={16} />
                                            Logout Session
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 text-center text-surface-light/40 font-bold uppercase tracking-widest text-xs">Sign In</Link>
                                        <Link href="/courses" onClick={() => setIsMobileMenuOpen(false)} className="btn-enroll w-full">Enroll Now</Link>
                                    </>
                                )}
                                <p className="text-center text-[8px] text-surface-light/20 font-black uppercase tracking-[0.3em] mt-8">Institutional Access Mode</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;


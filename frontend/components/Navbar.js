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
        <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-6 pointer-events-none">
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`
                    pointer-events-auto
                    flex items-center justify-between
                    w-full max-w-6xl px-6 py-3
                    glass-card transition-all duration-500 ease-out
                    ${isScrolled ? 'scale-95 opacity-90 translate-y-2' : ''}
                `}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-3 group">
                    <div className="relative">
                        <div className="bg-secondary-action/20 p-2 rounded-xl border border-secondary-action/30 flex items-center justify-center group-hover:bg-secondary-action/30 transition-colors">
                            <Library className="text-secondary-action w-5 h-5" strokeWidth={2} />
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
                        <span className="text-lg font-display font-bold text-white tracking-tight leading-none">
                            Divya Gyan <span className="text-secondary-action">Dhara</span>
                        </span>
                        <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-surface-light/40 mt-1">
                            Future-Ready Education
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`
                                relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300
                                ${pathname === link.href
                                    ? 'text-white bg-white/10 shadow-sm'
                                    : 'text-surface-light/60 hover:text-white hover:bg-white/5'}
                            `}
                        >
                            {link.name}
                            {pathname === link.href && (
                                <motion.div
                                    layoutId="nav-active"
                                    className="absolute inset-0 bg-white/10 rounded-xl -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    {mounted && user ? (
                        <Link
                            href="/dashboard"
                            className="flex items-center space-x-2 p-1 pl-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
                        >
                            <span className="text-white text-xs font-semibold">{user.fullName.split(' ')[0]}</span>
                            <div className="w-8 h-8 bg-secondary-action rounded-lg flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition-transform">
                                {user.fullName.charAt(0)}
                            </div>
                        </Link>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link href="/login" className="text-sm font-medium text-surface-light/70 hover:text-white transition-colors px-4">
                                Sign In
                            </Link>
                            <Link href="/courses" className="bg-accent-highlight text-primary-bg px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all active:scale-95">
                                Enroll Now
                            </Link>
                        </div>
                    )}

                    {/* Mobile Toggle */}
                    <button
                        className="lg:hidden text-white p-2 hover:bg-white/5 rounded-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute top-24 left-6 right-6 glass-card p-6 lg:hidden z-[90]"
                    >
                        <div className="flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-xl font-display font-semibold transition-colors ${pathname === link.href ? 'text-secondary-action' : 'text-surface-light/60'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-white/10 flex flex-col space-y-4">
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-3 text-surface-light/70 font-medium">Sign In</Link>
                                <Link href="/courses" onClick={() => setIsMobileMenuOpen(false)} className="bg-accent-highlight text-primary-bg py-3 rounded-xl text-center font-bold">Enroll Now</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;


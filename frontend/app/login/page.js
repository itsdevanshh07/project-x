'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, GraduationCap, Loader2, User, ShieldCheck, Briefcase, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { login, reset } from '@/slices/authSlice';
import Navbar from '@/components/Navbar';
import SocialAuthButtons from '@/components/SocialAuthButtons';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [selectedRole, setSelectedRole] = useState('student');

    const { email, password } = formData;

    const router = useRouter();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) toast.error(message);
        if (isSuccess || user) {
            if (user?.role === 'teacher' && user?.status === 'pending') {
                router.push('/teacher/waiting-approval');
            } else if (user?.role === 'admin') {
                router.push('/dashboard/admin');
            } else {
                router.push('/');
            }
        }
        dispatch(reset());
    }, [user, isError, isSuccess, message, router, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password, requiredRole: selectedRole }));
    };

    return (
        <main className="min-h-screen bg-primary-bg flex flex-col selection:bg-secondary-action/30 overflow-x-hidden">
            <Navbar />

            <div className="flex-1 flex flex-col lg:flex-row pt-24">
                {/* Left Side - Form Area */}
                <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full"
                    >
                        <div className="mb-10 space-y-2">
                            <h1 className="text-4xl font-display font-bold text-white tracking-tight">Institutional Access</h1>
                            <p className="text-surface-light/40 font-bold uppercase tracking-[0.2em] text-[10px]">Secure Gateway for Managed Learning</p>
                        </div>

                        {/* Role Selector */}
                        <div className="relative flex p-1.5 bg-white/5 border border-white/10 rounded-2xl mb-10 overflow-hidden">
                            {[
                                { id: 'student', label: 'Student', icon: User },
                                { id: 'teacher', label: 'Teacher', icon: Briefcase },
                                { id: 'admin', label: 'Admin', icon: ShieldCheck },
                            ].map((role) => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => setSelectedRole(role.id)}
                                    className={`relative z-10 flex-1 flex items-center justify-center space-x-2 py-3.5 rounded-xl text-[9px] sm:text-xs font-bold transition-all duration-500 ${selectedRole === role.id ? 'text-primary-bg' : 'text-surface-light/40 hover:text-white'
                                        }`}
                                >
                                    <role.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${selectedRole === role.id ? 'text-primary-bg' : 'text-surface-light/20'}`} />
                                    <span className="uppercase tracking-wider">{role.label}</span>
                                    {selectedRole === role.id && (
                                        <motion.div
                                            layoutId="role-active"
                                            className="absolute inset-0 bg-secondary-action rounded-xl -z-10 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="glass-card p-6 md:p-10 relative overflow-hidden">
                            <form onSubmit={onSubmit} className="space-y-6 md:space-y-8">
                                <div className="space-y-3 md:space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-surface-light/20 ml-1">Email Identifier</label>
                                    <div className="relative group">
                                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 transition-colors duration-300 ${formData.email ? 'text-secondary-action' : 'text-white/10'}`} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={onChange}
                                            placeholder="your@email.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 md:pl-12 pr-4 py-3.5 md:py-4 text-white outline-none focus:border-secondary-action/50 focus:ring-4 focus:ring-secondary-action/5 transition-all font-medium placeholder:text-white/5 text-sm md:text-base"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 md:space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-surface-light/20">Security Key</label>
                                        <Link href="#" className="text-[10px] font-bold text-secondary-action hover:text-accent-highlight tracking-widest transition-colors">FORGOT?</Link>
                                    </div>
                                    <div className="relative group">
                                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 transition-colors duration-300 ${formData.password ? 'text-secondary-action' : 'text-white/10'}`} />
                                        <input
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={onChange}
                                            placeholder="••••••••"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 md:pl-12 pr-4 py-3.5 md:py-4 text-white outline-none focus:border-secondary-action/50 focus:ring-4 focus:ring-secondary-action/5 transition-all font-medium placeholder:text-white/5 text-sm md:text-base"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full relative group overflow-hidden bg-secondary-action text-white py-4 md:py-5 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] active:scale-95 disabled:opacity-50"
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <>
                                                <span>Authorize Access</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </button>
                            </form>

                            <div className="mt-8 md:mt-10">
                                <div className="relative flex items-center justify-center mb-8 md:mb-10">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                                    <span className="relative bg-primary-bg px-3 md:px-4 text-[10px] font-bold text-surface-light/10 uppercase tracking-[0.3em]">Single Sign-On</span>
                                </div>
                                <SocialAuthButtons requiredRole={selectedRole} />
                            </div>
                        </div>

                        <div className="mt-10 text-center text-surface-light/20 text-xs font-bold uppercase tracking-widest">
                            No credentials yet?{' '}
                            <Link href="/register" className="text-secondary-action hover:text-white transition-colors underline underline-offset-8 decoration-secondary-action/30">Start Enrollment</Link>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Branding Overlay */}
                <div className="hidden lg:flex flex-[1.2] items-center justify-center relative p-12 overflow-hidden bg-[radial-gradient(circle_at_70%_30%,rgba(99,102,241,0.15),transparent_70%)]">
                    <div className="relative z-10 max-w-xl text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="inline-flex p-4 rounded-3xl bg-secondary-action/10 border border-secondary-action/20 text-secondary-action shadow-2xl">
                                <Sparkles className="w-10 h-10" />
                            </div>
                            <h2 className="text-6xl font-display font-bold text-white tracking-tight leading-[1.1]">
                                Excellence is <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-action to-accent-highlight">Non-Negotiable.</span>
                            </h2>
                            <p className="text-xl text-surface-light/40 font-medium leading-relaxed">
                                Enter your organizational credentials to synchronize your learning path with our advanced academic engine.
                            </p>

                            <div className="pt-8 grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <p className="text-white font-bold text-3xl">99.8%</p>
                                    <p className="text-surface-light/20 text-[10px] font-bold uppercase tracking-widest">Uptime Precision</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-white font-bold text-3xl">AES-256</p>
                                    <p className="text-surface-light/20 text-[10px] font-bold uppercase tracking-widest">Data Encryption</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-20">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary-action/30 rounded-full blur-[120px]" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-highlight/10 rounded-full blur-[120px]" />
                    </div>
                </div>
            </div>
        </main>
    );
}

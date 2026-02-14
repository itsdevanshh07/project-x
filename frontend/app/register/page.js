'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight, GraduationCap, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { register, reset } from '@/slices/authSlice';
import Navbar from '@/components/Navbar';
import SocialAuthButtons from '@/components/SocialAuthButtons';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });

    const { fullName, email, phone, password, confirmPassword, role } = formData;

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
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            dispatch(register({ fullName, email, phone, password, role }));
        }
    };

    return (
        <main className="min-h-screen bg-primary-bg overflow-hidden selection:bg-secondary-action/30">
            <Navbar />

            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Left Branding Area */}
                <div className="hidden lg:flex flex-[0.8] items-center justify-center p-12 relative overflow-hidden bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.1),transparent_70%)]">
                    <div className="relative z-10 max-w-lg space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <h2 className="text-6xl font-display font-bold text-white tracking-tight leading-[1.1]">
                                Master Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-action to-accent-highlight">Future.</span>
                            </h2>
                            <p className="text-lg text-surface-light/40 font-medium leading-relaxed uppercase tracking-[0.2em] text-xs">
                                Institutional Enrollment Standard
                            </p>
                        </motion.div>

                        <div className="space-y-4">
                            {[
                                { title: 'Global Curriculum', desc: 'World-class content designed by academic experts.' },
                                { title: 'Live Mentorship', desc: 'Real-time interaction with subject matter specialists.' },
                                { title: 'Elite Rewards', desc: 'Earn exclusive badges and global certifications.' }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    className="flex items-start space-x-5 p-6 glass-card border-white/5"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-secondary-action/10 flex items-center justify-center text-secondary-action shrink-0 border border-secondary-action/20">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{item.title}</h4>
                                        <p className="text-surface-light/40 text-sm font-medium">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Form Area */}
                <div className="flex-1 flex items-center justify-center p-8 lg:p-24 pt-32 lg:pt-24 border-l border-white/5">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-xl w-full"
                    >
                        <div className="mb-8 space-y-2 text-center lg:text-left">
                            <h1 className="text-4xl font-display font-bold text-white tracking-tight">Create Profile</h1>
                            <p className="text-surface-light/40 font-bold uppercase tracking-[0.2em] text-[10px]">Join the academic ecosystem</p>
                        </div>

                        {/* Role Selection */}
                        <div className="relative flex p-1.5 bg-white/5 border border-white/10 rounded-2xl mb-8 overflow-hidden">
                            {[
                                { id: 'student', label: 'Student', icon: GraduationCap },
                                { id: 'teacher', label: 'Educator', icon: User },
                            ].map((r) => (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: r.id })}
                                    className={`relative z-10 flex-1 flex items-center justify-center space-x-2 py-3.5 rounded-xl text-xs font-bold transition-all duration-500 ${role === r.id ? 'text-primary-bg' : 'text-surface-light/40 hover:text-white'
                                        }`}
                                >
                                    <r.icon className={`w-4 h-4 ${role === r.id ? 'text-primary-bg' : 'text-surface-light/20'}`} />
                                    <span className="uppercase tracking-widest">{r.label}</span>
                                    {role === r.id && (
                                        <motion.div
                                            layoutId="register-role-active"
                                            className="absolute inset-0 bg-secondary-action rounded-xl -z-10 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="glass-card p-6 md:p-10">
                            <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-2 md:space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-surface-light/20 ml-2">Full Identity</label>
                                        <div className="relative group">
                                            <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${fullName ? 'text-secondary-action' : 'text-white/10'}`} />
                                            <input type="text" name="fullName" value={fullName} onChange={onChange} placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 md:py-4 text-white outline-none focus:border-secondary-action/50 focus:ring-4 focus:ring-secondary-action/5 transition-all text-sm font-medium placeholder:text-white/5" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2 md:space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-surface-light/20 ml-2">Secure Link (Phone)</label>
                                        <div className="relative group">
                                            <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${phone ? 'text-secondary-action' : 'text-white/10'}`} />
                                            <input type="tel" name="phone" value={phone} onChange={onChange} placeholder="9876543210" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 md:py-4 text-white outline-none focus:border-secondary-action/50 focus:ring-4 focus:ring-secondary-action/5 transition-all text-sm font-medium placeholder:text-white/5" required />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 md:space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-surface-light/20 ml-2">Electronic Mail Address</label>
                                    <div className="relative group">
                                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${email ? 'text-secondary-action' : 'text-white/10'}`} />
                                        <input type="email" name="email" value={email} onChange={onChange} placeholder="name@domain.com" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 md:py-4 text-white outline-none focus:border-secondary-action/50 focus:ring-4 focus:ring-secondary-action/5 transition-all text-sm font-medium placeholder:text-white/5" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-2 md:space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-surface-light/20 ml-2">Access Key</label>
                                        <div className="relative group">
                                            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${password ? 'text-secondary-action' : 'text-white/10'}`} />
                                            <input type="password" name="password" value={password} onChange={onChange} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 md:py-4 text-white outline-none focus:border-secondary-action/50 focus:ring-4 focus:ring-secondary-action/5 transition-all text-sm font-medium placeholder:text-white/5" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2 md:space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-surface-light/20 ml-2">Confirm Key</label>
                                        <div className="relative group">
                                            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${confirmPassword ? 'text-secondary-action' : 'text-white/10'}`} />
                                            <input type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 md:py-4 text-white outline-none focus:border-secondary-action/50 focus:ring-4 focus:ring-secondary-action/5 transition-all text-sm font-medium placeholder:text-white/5" required />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col gap-6">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full relative group overflow-hidden bg-secondary-action text-white py-4 md:py-5 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] md:text-sm transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] active:scale-95 disabled:opacity-50"
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-3">
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                <>
                                                    <span>{role === 'teacher' ? (
                                                        <span className="hidden sm:inline">Apply for Verification</span>
                                                    ) : (
                                                        <span className="hidden sm:inline">Initialize Account</span>
                                                    )}
                                                        {role === 'teacher' ? (
                                                            <span className="sm:hidden">Apply Now</span>
                                                        ) : (
                                                            <span className="sm:hidden">Join Now</span>
                                                        )}
                                                    </span>
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    </button>

                                    <div className="relative flex items-center justify-center">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                                        <span className="relative bg-[#161d2f] px-3 md:px-4 text-[10px] font-bold text-surface-light/10 uppercase tracking-[0.3em]">Single Sign-On</span>
                                    </div>
                                    <SocialAuthButtons requiredRole={role} />
                                </div>
                            </form>
                        </div>

                        <div className="mt-10 text-center text-surface-light/20 text-xs font-bold uppercase tracking-widest">
                            Already part of the community?{' '}
                            <Link href="/login" className="text-secondary-action hover:text-white transition-colors underline underline-offset-8 decoration-secondary-action/30">Authenticate</Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

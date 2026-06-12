'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Clock, ShieldAlert, LogOut, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

export default function WaitingApproval() {
    const { user } = useSelector((state) => state.auth);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (user?.role === 'teacher' && user?.status === 'approved') {
            router.push('/dashboard/teacher');
        } else if (user?.role !== 'teacher') {
            router.push('/dashboard');
        }
    }, [user, router]);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl w-full mx-4"
                >
                    <div className="bg-bg-card rounded-[3rem] p-12 shadow-2xl shadow-brand-primary/10 border border-border-main text-center relative overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                        {user?.status === 'pending' ? (
                            <>
                                <div className="w-24 h-24 bg-brand-reward/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-brand-reward animate-pulse">
                                    <Clock className="w-12 h-12" />
                                </div>
                                <h1 className="text-3xl font-display font-black text-text-primary mb-4">
                                    Approval <span className="text-brand-reward">Pending</span>
                                </h1>
                                <p className="text-text-secondary text-lg font-medium mb-8 leading-relaxed">
                                    Hello, <span className="text-text-primary font-bold">{user?.fullName}</span>. Your instructor application is currently under review by our administration team.
                                </p>
                                <div className="bg-bg-section rounded-2xl p-6 mb-8 border border-border-main italic text-text-muted text-sm">
                                    "We typically review applications within 24-48 hours. Keep an eye on your dashboard!"
                                </div>
                            </>
                        ) : user?.status === 'rejected' ? (
                            <>
                                <div className="w-24 h-24 bg-danger/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-danger">
                                    <ShieldAlert className="w-12 h-12" />
                                </div>
                                <h1 className="text-3xl font-display font-black text-text-primary mb-4">
                                    Application <span className="text-danger">Rejected</span>
                                </h1>
                                <p className="text-text-secondary text-lg font-medium mb-8 leading-relaxed">
                                    We're sorry, <span className="text-text-primary font-bold">{user?.fullName}</span>. Your application for a teacher account has been rejected as it did not meet our current requirements.
                                </p>
                            </>
                        ) : null}

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => router.push('/')}
                                className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary/90 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-brand-primary/20"
                            >
                                <span>Go Home</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

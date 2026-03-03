'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLiveClasses } from '@/slices/studentSlice';
import { Video, Calendar, Clock, ArrowRight, Loader2, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function StudentLiveClasses() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { liveClasses, isLoading } = useSelector((state) => state.student);

    useEffect(() => {
        dispatch(getLiveClasses());
    }, [dispatch]);

    return (
        <div className="space-y-10 pb-20">
            <header>
                <h1 className="text-4xl font-display font-black text-white tracking-tight uppercase">Live Learning Hub</h1>
                <p className="text-surface-light/40 text-sm mt-2 font-medium tracking-wide">Sync with your instructors for real-time academic sessions.</p>
            </header>

            {isLoading ? (
                <div className="py-32 flex justify-center">
                    <Loader2 className="w-12 h-12 text-secondary-action animate-spin" />
                </div>
            ) : (
                <div className="grid gap-10">
                    {/* Live and Upcoming Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 space-y-8">
                            <h2 className="text-xs font-black text-surface-light/20 uppercase tracking-[0.4em] mb-6">Active & Upcoming Sessions</h2>
                            {liveClasses.length > 0 ? (
                                <div className="space-y-6">
                                    {liveClasses.map((session, idx) => (
                                        <motion.div
                                            key={session._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="glass-card p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-white/5 hover:border-secondary-action/20 transition-all group"
                                        >
                                            <div className="flex items-center gap-8 w-full md:w-auto">
                                                <div className="w-20 h-20 rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-white/5">
                                                    <span className="text-[10px] font-black text-secondary-action uppercase">MAR</span>
                                                    <span className="text-2xl font-black text-white">{new Date(session.scheduledTime).getDate()}</span>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="px-2 py-0.5 rounded-lg bg-white/5 text-[8px] font-black uppercase text-surface-light/40 border border-white/5">{session.course?.title || 'General'}</span>
                                                        {session.status === 'live' && (
                                                            <span className="text-[8px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 rounded-lg">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live Now
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-xl font-black text-white group-hover:text-secondary-action transition-colors">{session.title}</h3>
                                                    <div className="flex items-center gap-6 text-surface-light/30">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span className="text-[10px] font-bold uppercase">{new Date(session.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Video className="w-3.5 h-3.5" />
                                                            <span className="text-[10px] font-bold uppercase">{session.instructor?.fullName || 'Senior Faculty'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => router.push(`/live/${session._id}`)}
                                                className={`w-full md:w-auto px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${session.status === 'live'
                                                        ? 'bg-secondary-action text-white shadow-2xl shadow-secondary-action/20 hover:scale-105'
                                                        : 'bg-white/5 text-surface-light/40 border border-white/5 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                {session.status === 'live' ? 'Join Ceremony' : 'Remind Me'}
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-32 glass-card border-dashed border-white/10 text-center space-y-6">
                                    <Video className="w-16 h-16 text-white/5 mx-auto" />
                                    <p className="text-[10px] font-black text-surface-light/10 uppercase tracking-[0.4em]">No Live Classes Scheduled</p>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-4 space-y-8">
                            <h2 className="text-xs font-black text-surface-light/20 uppercase tracking-[0.4em] mb-6">Guidelines</h2>
                            <div className="glass-card p-8 border-indigo-500/10 bg-indigo-500/5 space-y-8">
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-secondary-action font-black text-xs">01</div>
                                        <p className="text-xs text-surface-light/60 font-medium leading-relaxed">Join at least 5 minutes before the session starts to check your connection.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-secondary-action font-black text-xs">02</div>
                                        <p className="text-xs text-surface-light/60 font-medium leading-relaxed">Keep your microphone muted unless you have a doubt to ask.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-secondary-action font-black text-xs">03</div>
                                        <p className="text-xs text-surface-light/60 font-medium leading-relaxed">Use the 'Raise Hand' feature during interactive Q&A segments.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

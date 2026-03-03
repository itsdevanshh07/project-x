'use client';

import { FileText, Trophy, Clock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentAssessments() {
    return (
        <div className="space-y-12 pb-20">
            <header>
                <h1 className="text-4xl font-display font-black text-white tracking-tight uppercase">Assessments</h1>
                <p className="text-surface-light/40 text-sm mt-2 font-medium tracking-wide">Validate your knowledge through scheduled examinations and mock series.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    <div className="space-y-6">
                        <h2 className="text-xs font-black text-surface-light/20 uppercase tracking-[0.4em]">Upcoming Assessments</h2>
                        {[
                            { title: 'Full Syllabus Mock Test - I', date: 'March 15, 2026', time: '10:00 AM', duration: '3 Hours', status: 'upcoming' },
                            { title: 'Weekly Assessment - Physics', date: 'March 10, 2026', time: '04:00 PM', duration: '1.5 Hours', status: 'urgent' },
                        ].map((test, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-8 md:p-10 border-white/5 hover:border-secondary-action/20 transition-all group flex flex-col md:flex-row items-center justify-between gap-8"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Trophy className={`w-5 h-5 ${test.status === 'urgent' ? 'text-accent-highlight' : 'text-secondary-action/50'}`} />
                                        <h3 className="text-xl font-black text-white">{test.title}</h3>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex items-center gap-2 text-surface-light/30">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase">{test.time} ({test.duration})</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-surface-light/30">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase">{test.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all w-full md:w-auto ${test.status === 'urgent' ? 'bg-secondary-action text-white shadow-2xl shadow-secondary-action/20' : 'bg-white/5 text-surface-light/40 border border-white/5 hover:bg-white/10'}`}>
                                    {test.status === 'urgent' ? 'Prepare Now' : 'View Details'}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    <div className="glass-card p-10 bg-indigo-500/5 border-indigo-500/10 space-y-8">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/5">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-black text-white uppercase tracking-tight">Academic Integrity</h4>
                        <p className="text-xs text-surface-light/40 font-bold leading-relaxed italic">
                            "Our assessments utilize AI Proctoring. Any detection of cross-protocol activities during active sessions will result in a session termination."
                        </p>
                        <button className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-3 hover:gap-5 transition-all">
                            Review Protocols <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

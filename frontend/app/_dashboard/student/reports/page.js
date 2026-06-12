'use client';

import { BarChart3, TrendingUp, Target, Shield, ArrowRight, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentReports() {
    return (
        <div className="space-y-12 pb-20">
            <header>
                <h1 className="text-4xl font-display font-black text-white tracking-tight uppercase">Academic Reports</h1>
                <p className="text-surface-light/40 text-sm mt-2 font-medium tracking-wide">Detailed analytical breakdown of your performance across all learning sectors.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { label: 'Course Completion', value: '78%', change: '+5.4%', icon: Target, color: 'text-secondary-action' },
                    { label: 'Active Mastery', value: 'Core', change: 'Stable', icon: Shield, color: 'text-accent-highlight' },
                    { label: 'Weekly Learning', value: '42h', change: '+12%', icon: BarChart3, color: 'text-emerald-400' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-10 group relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{stat.change}</span>
                        </div>
                        <h4 className="text-[10px] font-black text-surface-light/20 uppercase tracking-[0.3em] mb-3">{stat.label}</h4>
                        <p className="text-4xl font-display font-black text-white">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="glass-card p-12 space-y-10 border-white/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">Quarterly Performance Insight</h2>
                    <button className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-surface-light/40 hover:text-white transition-all">
                        <Download className="w-4 h-4" /> Download Full Analytics
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <p className="text-[10px] font-black text-surface-light/20 uppercase tracking-[0.4em] mb-4">Strengths</p>
                        <div className="space-y-4">
                            {['Logical Reasoning', 'Mathematical Deduction', 'Physics Conceptualization'].map((skill) => (
                                <div key={skill} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase">
                                        <span>{skill}</span>
                                        <span className="text-secondary-action">Optimal</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '90%' }} className="h-full bg-secondary-action" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <p className="text-[10px] font-black text-surface-light/20 uppercase tracking-[0.4em] mb-4">Focus Areas</p>
                        <p className="text-sm text-surface-light/40 font-medium leading-[2] italic">
                            "AI Analysis suggests increasing focus on <span className="text-white font-bold">Organic Chemistry reaction kinetics</span>. Your last assessment showed a 12% delay in response time for these modules."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

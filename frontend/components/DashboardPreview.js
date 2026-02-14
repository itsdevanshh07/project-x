"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Brain, Trophy, ArrowRight, Play } from 'lucide-react';

const DashboardPreview = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-secondary-action font-bold uppercase tracking-[0.2em] text-xs"
                        >
                            Experience the Platform
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-display font-bold text-white"
                        >
                            Intelligence that <br />
                            <span className="text-surface-light/40">Grows with you.</span>
                        </motion.h2>
                    </div>
                </div>

                {/* Bento Grid */}
                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Progress Tracker (Large) */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="md:col-span-2 lg:col-span-2 glass-card p-6 md:p-8 flex flex-col justify-between group"
                    >
                        <div className="flex justify-between items-start">
                            <div className="p-3 rounded-2xl bg-secondary-action/20 border border-secondary-action/30">
                                <TrendingUp className="text-secondary-action w-6 h-6" />
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-white">84%</div>
                                <div className="text-[10px] text-surface-light/40 uppercase font-bold tracking-widest">Global Rank: Top 2%</div>
                            </div>
                        </div>
                        <div className="space-y-6 mt-8 md:mt-0">
                            <h3 className="text-2xl font-bold text-white">Learning Progress</h3>
                            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '84%' }}
                                    className="absolute inset-y-0 left-0 bg-secondary-action"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-xl font-bold text-white">12</div>
                                    <div className="text-xs text-surface-light/40">Modules Done</div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-xl font-bold text-white">48h</div>
                                    <div className="text-xs text-surface-light/40">Focus Time</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Upcoming Live Class */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="col-span-1 glass-card p-6 md:p-8 flex flex-col justify-between relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4">
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="px-2 py-1 rounded bg-red-500/20 border border-red-500/30 text-red-500 text-[8px] font-bold uppercase"
                            >
                                Live
                            </motion.div>
                        </div>
                        <div className="space-y-6">
                            <div className="p-3 w-fit rounded-2xl bg-accent-highlight/20 border border-accent-highlight/30">
                                <Calendar className="text-accent-highlight w-6 h-6" />
                            </div>
                            <div className="py-4 md:py-0">
                                <h3 className="text-xl font-bold text-white">Quantum Mechanics</h3>
                                <p className="text-sm text-surface-light/40 mt-1">Starting in 15 mins</p>
                            </div>
                        </div>
                        <button className="w-full py-4 mt-6 md:mt-0 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-all flex items-center justify-center gap-2">
                            <Play className="w-4 h-4 fill-white" />
                            Join Session
                        </button>
                    </motion.div>

                    {/* AI Recommendations */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="col-span-1 glass-card p-6 md:p-8 flex flex-col gap-6"
                    >
                        <div className="p-3 w-fit rounded-2xl bg-purple-500/20 border border-purple-500/30">
                            <Brain className="text-purple-400 w-6 h-6" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white">AI Insights</h3>
                            <div className="space-y-3">
                                {[1, 2].map((i) => (
                                    <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-surface-light/60 italic">
                                        Focus more on <span className="text-white font-bold">Vector Calculus</span> based on your last test.
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Achievements */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="col-span-1 md:col-span-2 lg:col-span-4 glass-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between group gap-6"
                    >
                        <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-6">
                            <div className="p-4 rounded-2xl bg-accent-highlight/20 border border-accent-highlight/30 group-hover:rotate-12 transition-transform">
                                <Trophy className="text-accent-highlight w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-display font-bold text-white">Academic Milestone</h3>
                                <p className="text-surface-light/40 text-sm">You've maintained a 7-day streak with 95%+ accuracy!</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 text-accent-highlight font-bold uppercase tracking-widest text-[10px] hover:gap-4 transition-all">
                            View All <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary-action/5 rounded-full blur-[200px] -z-10" />
        </section>
    );
};

export default DashboardPreview;

"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Brain, Users } from 'lucide-react';

const KeyHighlights = () => {
    const highlights = [
        {
            title: "Board Exam Focus",
            desc: "Dedicated preparation for board exams with extensive answer writing practice.",
            icon: Target,
            color: "text-blue-400"
        },
        {
            title: "Foundation Setup",
            desc: "Early stage conceptual building blocks for future competitive aspirations.",
            icon: Brain,
            color: "text-purple-400"
        },
        {
            title: "Structured Material",
            desc: "Curated notes, daily practice papers (DPPs), and revision guides.",
            icon: BookOpen,
            color: "text-green-400"
        },
        {
            title: "1-on-1 Mentorship",
            desc: "Regular doubt clearing sessions and individual performance tracking.",
            icon: Users,
            color: "text-yellow-400"
        }
    ];

    return (
        <section className="py-24 bg-primary-bg relative border-t border-b border-white/5">
            <div className="container max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-secondary-action font-bold uppercase tracking-[0.2em] text-xs"
                        >
                            Our Methodology
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-5xl font-display font-bold text-white max-w-2xl"
                        >
                            Practical Learning for <span className="text-surface-light/40 font-medium">Real Results.</span>
                        </motion.h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {highlights.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                        >
                            <div className="mb-6 p-4 rounded-xl bg-primary-bg/50 inline-block w-fit">
                                <item.icon className={`w-8 h-8 ${item.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-surface-light/40 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default KeyHighlights;

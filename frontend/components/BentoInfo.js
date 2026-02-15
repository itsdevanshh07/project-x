"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, BookOpen, Microscope, Globe, Lightbulb } from 'lucide-react';

const BentoInfo = () => {
    const features = [
        {
            title: "Teacher-Led Learning",
            desc: "Direct mentorship from industry veterans and academic scholars.",
            icon: Users,
            color: "secondary-action",
            size: "md:col-span-2"
        },
        {
            title: "Parental Trust",
            desc: "Real-time tracking and collaborative growth monitoring for parents.",
            icon: ShieldCheck,
            color: "green-400",
            size: "md:col-span-1"
        },
        {
            title: "Structured Pedagogy",
            desc: "Scientifically proven learning paths tailored to individual pace.",
            icon: BookOpen,
            color: "accent-highlight",
            size: "md:col-span-1"
        },
        {
            title: "Lab Experiments",
            desc: "Virtual simulations to bring complex concepts to life.",
            icon: Microscope,
            color: "purple-400",
            size: "md:col-span-1"
        },
        {
            title: "Global Standards",
            desc: "Curriculum aligned with international academic benchmarks.",
            icon: Globe,
            color: "blue-400",
            size: "md:col-span-2"
        },
        {
            title: "Creative Thinking",
            desc: "Fostering innovation beyond the textbook boundaries.",
            icon: Lightbulb,
            color: "yellow-400",
            size: "md:col-span-1"
        }
    ];

    return (
        <section className="py-24 bg-primary-bg/50">
            <div className="container max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-display font-bold text-white"
                    >
                        Why Choose <span className="text-secondary-action">Divya Gyan Dhara?</span>
                    </motion.h2>
                    <p className="text-surface-light/40 text-lg">
                        We don't just teach. We engineer success through a unique blend of tradition and technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-6">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className={`${f.size === 'md:col-span-2' ? 'md:col-span-3 lg:col-span-4' : 'md:col-span-3 lg:col-span-2'} glass-card p-6 md:p-8 group cursor-default`}
                        >
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 w-fit group-hover:bg-secondary-action/20 group-hover:border-secondary-action/30 transition-colors mb-6">
                                <f.icon className="w-8 h-8 text-surface-light/60 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-secondary-action transition-colors">{f.title}</h3>
                            <p className="text-surface-light/40 text-sm leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BentoInfo;

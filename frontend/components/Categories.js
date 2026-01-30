'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, Microscope, Calculator } from 'lucide-react';

const programs = [
    {
        id: 1,
        title: 'Middle School',
        level: 'Classes 5–8',
        icon: BookOpen,
        desc: 'Focusing on building strong foundations in core subjects with structured learning paths.'
    },
    {
        id: 2,
        title: 'High School',
        level: 'Classes 9–10',
        icon: Calculator,
        desc: 'Advanced conceptual understanding and preparation for first major academic assessments.'
    },
    {
        id: 3,
        title: 'Senior Secondary',
        level: 'Classes 11–12',
        icon: Microscope,
        desc: 'Specialized academic streams (Science, Commerce, Humanities) with deep-dive curriculum.'
    },
    {
        id: 4,
        title: 'Academic Foundation',
        level: 'Competitive Prep',
        icon: GraduationCap,
        desc: 'Bridge courses for Olympiads, NTSE, and early-stage competitive excellence.'
    }
];

const Categories = () => {
    return (
        <section className="py-24 bg-muted/30">
            <div className="max-w-[1280px] mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div className="max-w-xl">
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-accent-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-3 block"
                        >
                            Our Educational Scope
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-display font-bold text-foreground"
                        >
                            Structured Academic <span className="text-muted-foreground font-medium">Programs</span>
                        </motion.h2>
                    </div>
                    <Link href="/courses" className="text-sm font-semibold text-foreground border-b-2 border-accent-gold pb-1 hover:text-accent-gold transition-colors">
                        View Full Curriculum
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {programs.map((prog, idx) => (
                        <motion.div
                            key={prog.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group"
                        >
                            <div className="h-full bg-card border border-border p-8 rounded-xl transition-all duration-300 group-hover:shadow-md group-hover:border-accent-gold/30">
                                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#0B0F14] transition-colors duration-300">
                                    <prog.icon className="w-6 h-6 text-foreground group-hover:text-accent-gold transition-colors duration-300" />
                                </div>
                                <div className="mb-4">
                                    <span className="text-[10px] font-bold text-accent-gold uppercase tracking-widest">{prog.level}</span>
                                    <h3 className="text-xl font-display font-bold text-foreground mt-1">
                                        {prog.title}
                                    </h3>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                                    {prog.desc}
                                </p>
                                <Link
                                    href={`/courses?level=${prog.level}`}
                                    className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-foreground hover:text-accent-gold transition-colors"
                                >
                                    <span>Learn More</span>
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;

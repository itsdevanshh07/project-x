"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Mountain, Target, Zap, GraduationCap, Compass, Globe, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Reveal = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay, ease: [0.21, 0.45, 0.32, 0.9] }}
    >
        {children}
    </motion.div>
);

const AboutCard = ({ icon: Icon, title, desc, delay }) => (
    <Reveal delay={delay}>
        <motion.div
            whileHover={{ scale: 1.02, y: -6 }}
            className="glass-card p-10 h-full border-white/10 group transition-all duration-500 hover:border-secondary-action/40"
        >
            <div className="w-14 h-14 rounded-2xl bg-secondary-action/10 border border-secondary-action/20 flex items-center justify-center mb-8 group-hover:bg-secondary-action transition-all duration-500">
                <Icon className="w-7 h-7 text-secondary-action group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-secondary-action transition-colors">{title}</h3>
            <p className="text-surface-light/40 leading-relaxed text-sm">
                {desc}
            </p>
        </motion.div>
    </Reveal>
);

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-primary-bg overflow-x-hidden selection:bg-secondary-action/30">
            <Navbar />

            {/* Background Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary-action/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary-action/5 blur-[120px] rounded-full" />
            </div>

            {/* Hero Section */}
            <header className="relative pt-48 pb-32 container max-w-7xl mx-auto px-6 z-10">
                <div className="max-w-4xl space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                    >
                        <Sparkles className="w-4 h-4 text-accent-highlight" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-surface-light/60">
                            Beyond Rote Learning
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-step-4 md:text-8xl font-display font-bold text-white tracking-tight leading-[0.95]"
                    >
                        Redefining the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-action via-accent-highlight to-secondary-action bg-[length:200%_auto] animate-gradient-x">
                            Academic Blueprint.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl md:text-2xl text-surface-light/40 font-medium leading-relaxed max-w-3xl"
                    >
                        We are not a coaching center. We are a movement dedicated to deep intellectual clarity and structured academic evolution.
                    </motion.p>
                </div>
            </header>

            {/* Section 1: The Origin Story */}
            <section className="py-32 relative z-10 border-t border-white/5">
                <div className="container max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <Reveal>
                            <div className="space-y-8">
                                <div className="inline-block p-3 rounded-2xl bg-white/5 border border-white/10">
                                    <Mountain className="w-8 h-8 text-secondary-action" />
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                    From the Peaks of Uttarakhand to a <span className="text-secondary-action">Pan-India Future.</span>
                                </h2>
                                <p className="text-lg text-surface-light/40 leading-relaxed">
                                    Divya Gyan Dhara began in the serene heights of Uttarakhand with a single, uncompromising vision: to bring precision, depth, and structural integrity back to education.
                                </p>
                                <p className="text-lg text-surface-light/40 leading-relaxed">
                                    What started as a regional commitment to excellence has now evolved into a national mission. We are expanding across the length and breadth of India, proving that high-standard academic mentorship isn't bound by geography—it is bound by truth and discipline.
                                </p>
                                <div className="flex items-center gap-6 pt-4 text-white font-bold uppercase tracking-widest text-xs">
                                    <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-accent-highlight" /> 16+ States</span>
                                    <span className="flex items-center gap-2"><Target className="w-4 h-4 text-secondary-action" /> Unlimited Vision</span>
                                </div>
                            </div>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary-bg via-transparent to-transparent z-10" />
                                <div className="absolute inset-0 border border-white/10 rounded-[2.5rem] z-20 pointer-events-none" />
                                <img
                                    src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop"
                                    alt="Education Movement"
                                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                                />
                                <div className="absolute bottom-10 left-10 z-30">
                                    <div className="glass-card p-6 border-white/20 backdrop-blur-3xl">
                                        <p className="text-white font-bold text-xl">The Movement</p>
                                        <p className="text-surface-light/60 text-sm">Founded on Academic Integrity</p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Section 2: The New Pattern */}
            <section className="py-32 relative z-10 bg-secondary-action/5">
                <div className="container max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                        <Reveal>
                            <span className="text-accent-highlight font-bold uppercase tracking-[0.3em] text-[10px]">Methodology</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white">The Disruptive <span className="text-secondary-action">"New Pattern"</span></h2>
                            <p className="text-lg text-surface-light/40">
                                Traditional coaching is a factory of memorization. We are the laboratory of understanding.
                            </p>
                        </Reveal>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <Reveal>
                            <div className="space-y-8 glass-card p-12 py-16 border-white/10">
                                <div className="flex items-center gap-4 text-white/20">
                                    <X className="w-10 h-10" />
                                    <span className="text-xl font-bold line-through">Traditional Coaching</span>
                                </div>
                                <ul className="space-y-6">
                                    {['Rote Memorization', 'Pattern Recognition over logic', 'One-size-fits-all Speed', 'Formula Dependency'].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-4 text-surface-light/30">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                            <span className="font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <div className="space-y-8 glass-card p-12 py-16 border-secondary-action/20 bg-secondary-action/10">
                                <div className="flex items-center gap-4 text-secondary-action">
                                    <Zap className="w-10 h-10" />
                                    <span className="text-xl font-bold">The Dhara Way</span>
                                </div>
                                <ul className="space-y-6">
                                    {[
                                        'Conceptual First-principles',
                                        'Lateral Problem Solving',
                                        'Adaptive Socratic Pedagogy',
                                        'Logical Derivation Skills'
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-4 text-white">
                                            <CheckCircle2 className="w-5 h-5 text-accent-highlight" />
                                            <span className="font-semibold">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Section 3: Target & Philosophy */}
            <section className="py-32 relative z-10 border-b border-white/5">
                <div className="container max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-24">
                        <Reveal className="flex-1">
                            <div className="relative">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        rotate: [0, 5, 0]
                                    }}
                                    transition={{ duration: 10, repeat: Infinity }}
                                    className="absolute -top-10 -left-10 w-40 h-40 bg-secondary-action/20 blur-[60px] rounded-full"
                                />
                                <div className="relative glass-card p-16 border-white/10">
                                    <span className="text-8xl font-display font-bold text-white/5 absolute top-4 left-4">5-12</span>
                                    <div className="space-y-12">
                                        <div className="space-y-4">
                                            <h3 className="text-3xl font-bold text-white">Strategic Horizon</h3>
                                            <p className="text-surface-light/40 leading-relaxed">
                                                By focusing exclusively on Classes 5–12, we capture the most critical window of neural and academic plasticity.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <p className="text-accent-highlight text-3xl font-bold">100%</p>
                                                <p className="text-surface-light/30 text-[10px] font-bold uppercase tracking-widest">Foundational Focus</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-secondary-action text-3xl font-bold">∞</p>
                                                <p className="text-surface-light/30 text-[10px] font-bold uppercase tracking-widest">Cognitive Depth</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                        <Reveal delay={0.2} className="flex-1 space-y-8">
                            <div className="inline-block p-3 rounded-2xl bg-white/5 border border-white/10">
                                <Compass className="w-8 h-8 text-accent-highlight" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                Deep Knowledge Over <span className="text-surface-light/40">Short-Term Gains.</span>
                            </h2>
                            <p className="text-lg text-surface-light/40 leading-relaxed">
                                We believe confidence is a byproduct of competence. Students at Divya Gyan Dhara do not fear competition because they have mastered the foundation upon which competition is built.
                            </p>
                            <p className="text-lg text-surface-light/40 leading-relaxed">
                                Our philosophy is simple: Long-term understanding scales. Memorization expires. We build for the long-term academic authority of every student.
                            </p>
                            <button className="flex items-center gap-2 group text-white font-bold uppercase tracking-widest text-xs pt-4">
                                Experience Our Pedagogy <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Summary Grid */}
            <section className="py-32 relative z-10">
                <div className="container max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <AboutCard
                            icon={Mountain}
                            title="The Origin Story"
                            desc="Born in Uttarakhand, engineered for India. A movement transforming education from regional excellence to a national standard."
                            delay={0}
                        />
                        <AboutCard
                            icon={Zap}
                            title="The New Pattern"
                            desc="Disrupting traditional coaching through conceptual clarity and logical first-principles. We don't teach to test—we teach to master."
                            delay={0.1}
                        />
                        <AboutCard
                            icon={GraduationCap}
                            title="Classes 5–12 Focus"
                            desc="Strategic focus on the foundational years. Building deep knowledge and confidence before competition."
                            delay={0.2}
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

// Simple X icon replacement since it was missing from imports
const X = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);

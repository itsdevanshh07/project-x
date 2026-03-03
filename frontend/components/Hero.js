'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, Award, ShieldCheck, Zap } from 'lucide-react';
import Hyperspeed from './react-bits/Hyperspeed';
import TrueFocus from './react-bits/TrueFocus';
import Magnetic from './utils/Magnetic';
import VideoModal from './VideoModal';

const Hero = () => {
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-32 md:pt-44 pb-16 md:pb-24 overflow-hidden">
            {/* Background Effect */}
            <Hyperspeed />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-bg via-transparent to-primary-bg z-[1]" />

            <div className="container max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                    >
                        <Zap className="w-4 h-4 text-accent-highlight" />
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-widest text-surface-light/80 text-center">
                            The Future of Learning is Here
                        </span>
                    </motion.div>

                    {/* Main Headline */}
                    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.8 }}
                            className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold text-white tracking-tighter leading-[1.1] md:leading-[1.05]"
                        >
                            Elevating Minds <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-action via-accent-highlight to-secondary-action bg-[length:200%_auto] animate-gradient-x">
                                Beyond Limits.
                            </span>
                        </motion.h1>

                        <div className="max-w-2xl mx-auto">
                            <TrueFocus text="Classes 5–11 | Conceptual • Structured • Trusted" />
                        </div>
                    </div>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full sm:w-auto px-4 sm:px-0"
                    >
                        <Magnetic strength={0.3} className="w-full sm:w-auto">
                            <Link href="/courses" className="btn-enroll group w-full sm:w-auto py-5 md:py-4">
                                <span className="text-lg md:text-base">Enroll Now</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Magnetic>
                        <Magnetic strength={0.3} className="w-full sm:w-auto">
                            <button
                                onClick={() => setIsVideoOpen(true)}
                                className="btn-demo group w-full sm:w-auto py-5 md:py-4 flex items-center justify-center gap-3"
                            >
                                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-accent-highlight group-hover:text-primary-bg transition-colors">
                                    <Play className="w-4 h-4" />
                                </div>
                                <span className="text-lg md:text-base">Book Free Demo</span>
                            </button>
                        </Magnetic>
                    </motion.div>


                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 md:gap-8 pt-12 border-t border-white/5 w-full max-w-4xl"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <Award className="w-6 md:w-8 h-6 md:h-8 text-accent-highlight" />
                            <span className="text-sm md:text-base font-semibold text-white">Elite Pedagogy</span>
                            <span className="text-[10px] text-surface-light/40 uppercase tracking-widest text-center">Top Tier Results</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ShieldCheck className="w-6 md:w-8 h-6 md:h-8 text-secondary-action" />
                            <span className="text-sm md:text-base font-semibold text-white">Verified Trust</span>
                            <span className="text-[10px] text-surface-light/40 uppercase tracking-widest text-center">Parent Approved</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 col-span-2 md:col-span-1">
                            <Zap className="w-6 md:w-8 h-6 md:h-8 text-accent-highlight" />
                            <span className="text-sm md:text-base font-semibold text-white">AI-Driven Insights</span>
                            <span className="text-[10px] text-surface-light/40 uppercase tracking-widest text-center">Personalized Growth</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Decorative Gradients */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-secondary-action/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent-highlight/10 rounded-full blur-[120px] pointer-events-none" />

            <VideoModal
                isOpen={isVideoOpen}
                onClose={() => setIsVideoOpen(false)}
                videoId="dQw4w9WgXcQ"
            />
        </section>
    );
};

export default Hero;


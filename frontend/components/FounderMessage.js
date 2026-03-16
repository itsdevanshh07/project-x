"use client";
import React from 'react';
import { motion } from 'framer-motion';

const FounderMessage = () => {
    return (
        <section className="py-24 bg-primary-bg relative overflow-hidden">
            <div className="container max-w-4xl mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="glass-card p-10 md:p-16 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-md"
                >
                    <div className="mb-6 text-secondary-action/40">
                        <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                    </div>
                    <blockquote className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white leading-relaxed mb-8">
                        "Our mission is not just marks — <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-action via-accent-highlight to-secondary-action bg-[length:200%_auto] animate-gradient-x">
                            we aim to build confident, skilled and aware youth.
                        </span>"
                    </blockquote>
                    <cite className="text-surface-light/60 font-semibold uppercase tracking-widest text-sm block">
                        — Founder, Divya Gyan Dhara
                    </cite>
                </motion.div>
            </div>

            {/* Decorative blurs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-action/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-highlight/10 blur-[100px] pointer-events-none" />
        </section>
    );
};

export default FounderMessage;

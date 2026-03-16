"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const SocialFollow = () => {
    return (
        <section className="py-16 md:py-24 bg-primary-bg/50 border-t border-b border-white/5">
            <div className="container max-w-7xl mx-auto px-6 text-center">
                <div className="mb-12 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-display font-bold text-white"
                    >
                        Join Our <span className="text-secondary-action">Community</span>
                    </motion.h2>
                    <p className="text-surface-light/40 text-sm md:text-base max-w-xl mx-auto">
                        Stay updated with our latest announcements, learning tips, and community events.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Link href="#" className="btn-enroll group flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-xl transition-all">
                            <Instagram className="w-5 h-5 text-pink-500" />
                            <span className="font-semibold tracking-wide">Instagram</span>
                            <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link href="#" className="btn-enroll group flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-xl transition-all">
                            <Youtube className="w-5 h-5 text-red-500" />
                            <span className="font-semibold tracking-wide">YouTube</span>
                            <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link href="#" className="btn-enroll group flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-xl transition-all">
                            <MessageCircle className="w-5 h-5 text-green-500" />
                            <span className="font-semibold tracking-wide">WhatsApp Community</span>
                            <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default SocialFollow;

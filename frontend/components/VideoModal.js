'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const VideoModal = ({ isOpen, onClose, videoId = 'dQw4w9WgXcQ' }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-primary-bg/90 backdrop-blur-xl transition-all"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-5xl glass-card overflow-hidden rounded-3xl shadow-2xl border-white/10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-95 z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="aspect-video w-full bg-black">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                title="Academic Demo Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <div className="p-8 md:p-10 border-t border-white/5 bg-white/5 backdrop-blur-md">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-display font-bold text-white tracking-tight">Academic Experience Demo</h3>
                                    <p className="text-surface-light/40 text-sm font-medium uppercase tracking-widest">Mastering the Fundamentals of Advanced Science</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="bg-accent-highlight text-primary-bg px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all active:scale-95"
                                >
                                    Experience Full Platform
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default VideoModal;

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, Award, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Hyperspeed from './react-bits/Hyperspeed';
import TrueFocus from './react-bits/TrueFocus';
import Magnetic from './utils/Magnetic';
import VideoModal from './VideoModal';

const Hero = () => {
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        studentName: '',
        studentClass: '',
        parentPhone: '',
        city: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const apiUrl = (process.env.NODE_ENV === 'development') ? 'http://localhost:5000/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');
            const res = await axios.post(`${apiUrl}/early-access`, formData);
            if (res.data.success) {
                toast.success('Early access registered successfully!');
                setFormData({ studentName: '', studentClass: '', parentPhone: '', city: '' });
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            Launching August 2026
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
                            Education that <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-action via-accent-highlight to-secondary-action bg-[length:200%_auto] animate-gradient-x">
                                Builds Future Leaders.
                            </span>
                        </motion.h1>

                        <div className="max-w-2xl mx-auto">
                            <TrueFocus text="A new learning ecosystem for Classes 5–12 focused on concept clarity, skills and real growth." />
                        </div>
                    </div>

                    {/* Early Access Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="w-full max-w-2xl mx-auto px-4 sm:px-0 mt-8"
                    >
                        <form onSubmit={handleFormSubmit} className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-md space-y-4 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-surface-light/80 uppercase tracking-wider">Student Name</label>
                                    <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} placeholder="Enter student name" className="w-full bg-primary-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-surface-light/40 focus:outline-none focus:border-accent-highlight focus:ring-1 focus:ring-accent-highlight transition-all" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-surface-light/80 uppercase tracking-wider">Class</label>
                                    <select name="studentClass" value={formData.studentClass} onChange={handleInputChange} className="w-full bg-primary-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-highlight focus:ring-1 focus:ring-accent-highlight transition-all appearance-none" required>
                                        <option value="" disabled>Select Class</option>
                                        <option value="5">Class 5</option>
                                        <option value="6">Class 6</option>
                                        <option value="7">Class 7</option>
                                        <option value="8">Class 8</option>
                                        <option value="9">Class 9</option>
                                        <option value="10">Class 10</option>
                                        <option value="11">Class 11</option>
                                        <option value="12">Class 12</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-surface-light/80 uppercase tracking-wider">Parent Phone</label>
                                    <input type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleInputChange} placeholder="Enter parent phone" className="w-full bg-primary-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-surface-light/40 focus:outline-none focus:border-accent-highlight focus:ring-1 focus:ring-accent-highlight transition-all" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-surface-light/80 uppercase tracking-wider">City</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter city" className="w-full bg-primary-bg/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-surface-light/40 focus:outline-none focus:border-accent-highlight focus:ring-1 focus:ring-accent-highlight transition-all" required />
                                </div>
                            </div>
                            <div className="pt-4">
                                <Magnetic strength={0.3} className="w-full">
                                    <button type="submit" disabled={isSubmitting} className="btn-enroll group w-full py-4 text-center justify-center disabled:opacity-70 disabled:cursor-not-allowed">
                                        <span className="text-lg md:text-base">{isSubmitting ? 'Submitting...' : 'Join Early Access'}</span>
                                        {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                        {isSubmitting && <Loader2 className="w-5 h-5 animate-spin ml-2" />}
                                    </button>
                                </Magnetic>
                            </div>
                        </form>
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


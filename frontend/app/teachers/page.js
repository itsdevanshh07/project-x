"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, Clock, Mail, Search, Award, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import axios from 'axios';

const TeacherCard = ({ teacher, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="group relative"
        >
            <div className="glass-card p-8 h-full flex flex-col transition-all duration-500 hover:border-secondary-action/40 hover:translate-y-[-8px]">
                {/* Profile Section */}
                <div className="flex items-start gap-6 mb-8">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-secondary-action/50 transition-colors duration-500">
                            <img
                                src={teacher.avatar && teacher.avatar !== 'no-photo.jpg' ? teacher.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.fullName)}&background=6366F1&color=fff&size=128`}
                                alt={teacher.fullName}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-accent-highlight text-primary-bg p-1.5 rounded-lg shadow-lg">
                            <Award className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-white group-hover:text-secondary-action transition-colors">
                            {teacher.fullName}
                        </h3>
                        <p className="text-secondary-action font-semibold text-sm tracking-wide">
                            {teacher.expertise?.join(' • ') || 'Senior Faculty'}
                        </p>
                    </div>
                </div>

                {/* Info Pills */}
                <div className="flex gap-4 mb-8">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-surface-light/60">
                        <Clock className="w-3.5 h-3.5 text-accent-highlight" />
                        <span>{teacher.experience || 5}+ Years Exp</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-surface-light/60">
                        <BookOpen className="w-3.5 h-3.5 text-secondary-action" />
                        <span>{teacher.courses?.length || 0} Courses</span>
                    </div>
                </div>

                {/* Bio Snippet */}
                <p className="text-sm text-surface-light/40 leading-relaxed mb-8 line-clamp-3">
                    {teacher.bio || "Dedicated academic professional committed to fostering conceptual clarity and nurturing the next generation of scholars."}
                </p>

                {/* Assigned Courses */}
                <div className="mt-auto space-y-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-light/20 flex items-center gap-2">
                        Teaching Specialized Batches
                        <div className="h-[1px] flex-1 bg-white/5" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {teacher.courses?.slice(0, 3).map((course, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-lg bg-secondary-action/10 text-secondary-action text-[10px] font-bold border border-secondary-action/20">
                                {course.title}
                            </span>
                        ))}
                        {teacher.courses?.length > 3 && (
                            <span className="px-2 py-1 text-[10px] font-bold text-surface-light/20">
                                +{teacher.courses.length - 3} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Action */}
                <button className="mt-8 flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white hover:bg-secondary-action hover:border-secondary-action transition-all duration-300">
                    Connect with Faculty <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};

export default function TeachersPage() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
            const response = await axios.get(`${API_URL}/auth/teachers/public`);
            setTeachers(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching teachers:', err);
            // Dynamic Fallback
            setTeachers([
                {
                    _id: 't1',
                    fullName: 'Dr. Amitabh Sharma',
                    expertise: ['Physics', 'Astronomy'],
                    experience: 15,
                    bio: 'PhD from Oxford in Theoretical Physics. Specializes in making complex quantum mechanics accessible to high schoolers.',
                    courses: [
                        { title: 'Advanced Thermodynamics' },
                        { title: 'Modern Physics 101' }
                    ]
                },
                {
                    _id: 't2',
                    fullName: 'Prof. Rajesh Khanna',
                    expertise: ['Mathematics', 'Statistics'],
                    experience: 12,
                    bio: 'Former senior educator at IIT. Known for unique problem-solving frameworks and mental math techniques.',
                    courses: [
                        { title: 'Calculus: Limits & Integration' },
                        { title: 'Competitive Geometry' }
                    ]
                },
                {
                    _id: 't3',
                    fullName: 'Meera Deshmukh',
                    expertise: ['Organic Chemistry', 'Molecular Biology'],
                    experience: 8,
                    bio: 'Passion for chemical reactions. Focuses on visualized learning and lab-to-theory integration.',
                    courses: [
                        { title: 'Organic Chemistry Decoded' }
                    ]
                }
            ]);
            setLoading(false);
        }
    };

    const filtered = teachers.filter(t =>
        t.fullName.toLowerCase().includes(search.toLowerCase()) ||
        t.expertise?.some(e => e.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <main className="min-h-screen bg-primary-bg overflow-x-hidden">
            <Navbar />

            {/* Header Section */}
            <header className="pt-40 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(99,102,241,0.15),transparent_50%)]" />
                <div className="container max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-3xl space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                        >
                            <Sparkles className="w-4 h-4 text-accent-highlight" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-surface-light/60">
                                Guided by the Best Minds
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-step-4 md:text-7xl font-display font-bold text-white tracking-tight"
                        >
                            Meet the <span className="text-secondary-action">Principal Faculty.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-surface-light/40 leading-relaxed max-w-2xl"
                        >
                            Our educators aren't just teachers; they are mentors, industry veterans, and researchers dedicated to unlocking your intellectual potential.
                        </motion.p>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative max-w-xl group"
                        >
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-light/20 group-focus-within:text-secondary-action transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name or subject (e.g. Physics)..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 outline-none focus:border-secondary-action/50 focus:ring-4 focus:ring-secondary-action/10 transition-all text-white font-medium shadow-2xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* Teacher Grid */}
            <section className="pb-32 container max-w-7xl mx-auto px-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="relative">
                            <Loader2 className="w-16 h-16 text-secondary-action animate-spin" />
                            <div className="absolute inset-0 bg-secondary-action/20 blur-xl animate-pulse" />
                        </div>
                        <p className="text-surface-light/30 font-bold uppercase tracking-[0.3em] text-[10px]">Verifying Faculty Credentials...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filtered.map((teacher, idx) => (
                                <TeacherCard key={teacher._id} teacher={teacher} index={idx} />
                            ))}
                        </AnimatePresence>

                        {filtered.length === 0 && (
                            <div className="col-span-full py-40 text-center glass-card border-dashed">
                                <Users className="w-12 h-12 text-surface-light/10 mx-auto mb-6" />
                                <h4 className="text-white font-bold text-xl mb-2">No Faculty Found</h4>
                                <p className="text-surface-light/30">We couldn't find any teacher matching your criteria. Try another specialization.</p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}

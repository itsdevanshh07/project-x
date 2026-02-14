'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, List, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import axios from 'axios';

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [view, setView] = useState('grid');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await axios.get(`${API_URL}/courses`);
            setCourses(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching courses:', err.message);
            if (err.response) {
                console.error('Response data:', err.response.data);
            } else if (err.request) {
                console.error('No response received (Network Error):', err.request);
            }
            // Fallback for demo
            setCourses([
                { _id: '1', title: 'Advanced Thermodynamics', category: 'Foundation', price: 4999, description: 'Master the laws of thermodynamics with conceptual clarity and numerical practice.', enrolledCount: '1.2k', duration: '12 Weeks' },
                { _id: '2', title: 'Pure Mathematics: Calculus', category: 'Senior Secondary', price: 3999, description: 'From limits to integration, understand the language of change with visual proofs.', enrolledCount: '2.5k', duration: '10 Weeks' },
                { _id: '3', title: 'Organic Chemistry Decoded', category: 'High School', price: 4500, description: 'Mechanisms made easy. Visualize molecular structures like never before.', enrolledCount: '900+', duration: '14 Weeks' },
                { _id: '4', title: 'Molecular Biology', category: 'Middle School', price: 4200, description: 'Explore the blueprint of life at the cellular level with AI-assisted visuals.', enrolledCount: '1.5k', duration: '12 Weeks' },
            ]);
            setLoading(false);
        }
    };

    const categories = ['All', 'Middle School', 'High School', 'Senior Secondary', 'Foundation'];

    const filtered = courses.filter(course =>
        (activeCategory === 'All' || course.category === activeCategory) &&
        (course.title.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <main className="min-h-screen bg-primary-bg text-surface-light">
            <Navbar />

            {/* Academic Header */}
            <header className="pt-40 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-secondary-action/5 via-transparent to-transparent" />
                <div className="container max-w-6xl mx-auto px-6 relative z-10 text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                    >
                        <span className="w-2 h-2 rounded-full bg-accent-highlight animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-surface-light/60">
                            Academic Enrollment 2026-27
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-display font-bold text-white tracking-tight"
                    >
                        Master Your <span className="text-secondary-action">Curriculum.</span>
                    </motion.h1>

                    <div className="w-full max-w-2xl mx-auto relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-surface-light/30 w-5 h-5 group-focus-within:text-secondary-action transition-colors" />
                        <input
                            type="text"
                            placeholder="Search specializations or courses..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 outline-none focus:border-secondary-action/50 focus:ring-4 focus:ring-secondary-action/10 transition-all text-white font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* Curriculum Filter */}
            <div className="sticky top-24 z-40 flex justify-center px-6">
                <div className="glass-card px-8 py-3 flex items-center justify-between gap-8 max-w-4xl w-full border border-white/5">
                    <div className="flex items-center space-x-8 overflow-x-auto no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap relative py-2 ${activeCategory === cat ? 'text-white' : 'text-surface-light/40 hover:text-white'}`}
                            >
                                {cat}
                                {activeCategory === cat && (
                                    <motion.div layoutId="cat-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-highlight" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="hidden md:flex bg-white/5 p-1 rounded-xl border border-white/5">
                        <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white/10 text-white' : 'text-surface-light/30'}`}>
                            <Grid className="w-4 h-4" />
                        </button>
                        <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white/10 text-white' : 'text-surface-light/30'}`}>
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Course Directory */}
            <section className="py-20 min-h-[600px]">
                <div className="container max-w-7xl mx-auto px-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <Loader2 className="w-12 h-12 text-secondary-action animate-spin" />
                            <p className="text-surface-light/40 font-bold uppercase tracking-[0.2em] text-[10px]">Accessing Academic Archives...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            <AnimatePresence mode='popLayout'>
                                {filtered.length > 0 ? filtered.map((course, idx) => (
                                    <CourseCard key={course._id} course={course} index={idx} />
                                )) : (
                                    <div className="col-span-full py-32 text-center glass-card border-dashed">
                                        <p className="text-surface-light/40 font-bold uppercase tracking-widest text-sm">No programs found matching your focus.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}


'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Trophy, Star, Loader2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import axios from 'axios';
import Link from 'next/link';

export default function TestSeriesPage() {
    const [testSeries, setTestSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        fetchTestSeries();
    }, []);

    const fetchTestSeries = async () => {
        try {
            const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth').replace(/\/auth$/, '');
            const response = await axios.get(`${API_BASE_URL}/test-series`);
            setTestSeries(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching test series:', err);
            setError('Failed to load test series.');
            setLoading(false);
        }
    };

    const categories = ['All', 'SSC', 'Railway', 'Defence', 'Banking', 'State'];

    const filtered = testSeries.filter(ts =>
        (activeCategory === 'All' || ts.category === activeCategory) &&
        (ts.title.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <main className="min-h-screen bg-[var(--bg-main)]">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-[var(--brand-black)] pt-48 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[var(--brand-yellow)]/5 -z-10" />
                <div className="container mx-auto px-6 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-display font-black text-white mb-8"
                    >
                        Elite <span className="text-[var(--brand-yellow)]">Test</span> Series
                    </motion.h1>
                    <div className="max-w-2xl mx-auto relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 w-6 h-6" />
                        <input
                            type="text"
                            placeholder="Search for a test series..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-8 py-5 outline-none focus:ring-4 focus:ring-[var(--brand-yellow)]/20 focus:bg-white/10 transition-all text-white text-lg font-medium placeholder:text-white/20"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-20 container mx-auto px-6">
                <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat
                                    ? 'bg-[var(--brand-black)] text-white shadow-xl'
                                    : 'bg-white text-[var(--text-secondary)] hover:text-[var(--brand-black)] border border-[var(--border-light)]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-[var(--brand-yellow)] animate-spin mb-4" />
                        <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs">Loading Test Series...</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((ts) => (
                            <motion.div
                                key={ts._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card-premium flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <span className="px-3 py-1 bg-[var(--brand-yellow)]/10 text-[var(--brand-black)] text-[10px] font-black uppercase tracking-widest rounded-lg border border-[var(--brand-yellow)]/20">
                                        {ts.category}
                                    </span>
                                    <div className="flex items-center space-x-1 text-[var(--brand-yellow)]">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-xs font-black text-[var(--brand-black)]">4.8</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-[var(--brand-black)] mb-4 group-hover:text-[var(--brand-yellow-hover)] transition-colors">
                                    {ts.title}
                                </h3>
                                <p className="text-[var(--text-secondary)] mb-8 line-clamp-2 font-medium">
                                    {ts.description}
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-subtle)]">
                                        <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Total Tests</div>
                                        <div className="text-xl font-black text-[var(--brand-black)]">{ts.numberOfTests}</div>
                                    </div>
                                    <div className="p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-subtle)]">
                                        <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Validity</div>
                                        <div className="text-xl font-black text-[var(--brand-black)]">{ts.validity} Days</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-6 border-t border-[var(--border-subtle)] mt-auto">
                                    <div>
                                        <span className="text-2xl font-black text-[var(--brand-black)]">₹{ts.price}</span>
                                    </div>
                                    <button className="btn-primary !px-6 !py-3 !text-xs">Buy Now</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-[var(--border-light)]">
                        <Trophy className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-bold text-[var(--text-secondary)]">No test series found.</p>
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}

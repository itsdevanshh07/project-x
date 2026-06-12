'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Tag, ArrowRight, Loader2, Newspaper, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import axios from 'axios';
import Link from 'next/link';

export default function CurrentAffairsPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        fetchCurrentAffairs();
    }, []);

    const fetchCurrentAffairs = async () => {
        try {
            const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth').replace(/\/auth$/, '');
            const response = await axios.get(`${API_BASE_URL}/current-affairs`);
            setArticles(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching current affairs:', err);
            setError('Failed to load current affairs.');
            setLoading(false);
        }
    };

    const categories = ['All', 'National', 'International', 'Sports', 'Science', 'Economy'];

    const filtered = articles.filter(article =>
        (activeCategory === 'All' || article.category === activeCategory) &&
        (article.title.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <main className="min-h-screen bg-bg-main">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-bg-section pt-40 pb-20 relative overflow-hidden border-b border-border-main">
                <div className="absolute inset-0 bg-brand-primary/5 -z-10" />
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-black text-text-primary mb-6"
                    >
                        Daily <span className="text-brand-primary">Current</span> Affairs
                    </motion.h1>
                    <p className="text-text-secondary max-w-2xl mx-auto mb-10 text-lg font-medium">
                        Stay updated with the latest national and international news curated specifically for competitive exams.
                    </p>
                    <div className="max-w-2xl mx-auto relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-secondary w-6 h-6" />
                        <input
                            type="text"
                            placeholder="Search for news, topics or dates..."
                            className="w-full bg-bg-card border border-border-main rounded-[2rem] pl-16 pr-8 py-5 outline-none focus:ring-4 focus:ring-brand-primary/40 focus:bg-bg-card transition-all text-text-primary text-lg font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-20 container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' : 'bg-bg-card text-text-secondary hover:text-brand-primary border border-border-main'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-brand-primary animate-spin mb-4" />
                        <p className="text-text-muted font-bold uppercase tracking-widest text-xs">Loading Articles...</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {filtered.map((article) => (
                            <motion.div
                                key={article._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-bg-card rounded-[3rem] border border-border-main overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row"
                            >
                                <div className="md:w-2/5 relative overflow-hidden">
                                    <img src={article.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={article.title} />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                </div>
                                <div className="p-10 md:w-3/5 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
                                                {article.category}
                                            </span>
                                            <div className="flex items-center text-text-muted text-[10px] font-black uppercase tracking-widest">
                                                <Calendar className="w-3 h-3 mr-2" />
                                                <span>{new Date(article.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-display font-black text-text-primary mb-4 group-hover:text-brand-primary transition-colors leading-tight">
                                            {article.title}
                                        </h3>
                                        <p className="text-text-secondary line-clamp-3 font-medium mb-8">
                                            {article.content}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/current-affairs/${article._id}`}
                                        className="inline-flex items-center space-x-2 text-brand-primary font-black text-xs uppercase tracking-widest group/btn"
                                    >
                                        <span>Read Full Article</span>
                                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-bg-card rounded-[3rem] border border-border-main">
                        <Newspaper className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-bold text-text-secondary">No articles found.</p>
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}

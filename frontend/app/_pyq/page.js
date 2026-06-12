'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Download, Calendar, Loader2, BookOpen, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import axios from 'axios';

export default function PYQPage() {
    const [pyqs, setPyqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [activeExam, setActiveExam] = useState('All');

    useEffect(() => {
        fetchPYQs();
    }, []);

    const fetchPYQs = async () => {
        try {
            const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth').replace(/\/auth$/, '');
            const response = await axios.get(`${API_BASE_URL}/pyq`);
            setPyqs(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching PYQs:', err);
            setError('Failed to load PYQs.');
            setLoading(false);
        }
    };

    const exams = ['All', 'SSC', 'Railway', 'Defence', 'Banking', 'State'];

    const filtered = pyqs.filter(p =>
        (activeExam === 'All' || p.examType === activeExam) &&
        (p.title.toLowerCase().includes(search.toLowerCase()))
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
                        Previous Year <span className="text-brand-primary">Questions</span>
                    </motion.h1>
                    <p className="text-text-secondary max-w-2xl mx-auto mb-10 text-lg font-medium">
                        Master the exam pattern by practicing with authentic previous year question papers.
                    </p>
                    <div className="max-w-2xl mx-auto relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-secondary w-6 h-6" />
                        <input
                            type="text"
                            placeholder="Search for PYQs (e.g. SSC CGL 2023)..."
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
                    {exams.map((exam) => (
                        <button
                            key={exam}
                            onClick={() => setActiveExam(exam)}
                            className={`px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all ${activeExam === exam ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' : 'bg-bg-card text-text-secondary hover:text-brand-primary border border-border-main'
                                }`}
                        >
                            {exam}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-brand-primary animate-spin mb-4" />
                        <p className="text-text-muted font-bold uppercase tracking-widest text-xs">Loading PYQs...</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((pyq) => (
                            <motion.div
                                key={pyq._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-bg-card rounded-[2.5rem] border border-border-main overflow-hidden group hover:shadow-2xl transition-all duration-500"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img src={pyq.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={pyq.title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
                                    <div className="absolute bottom-4 left-6">
                                        <span className="px-3 py-1 bg-brand-primary/20 backdrop-blur-md border border-brand-primary/30 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
                                            {pyq.examType}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-display font-black text-text-primary mb-4 group-hover:text-brand-primary transition-colors">
                                        {pyq.title}
                                    </h3>
                                    <div className="flex items-center space-x-6 mb-8 text-text-secondary text-sm font-bold uppercase tracking-widest">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-brand-primary" />
                                            <span>{pyq.year}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FileText className="w-4 h-4 mr-2 text-brand-secondary" />
                                            <span>PDF</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-6 border-t border-border-main">
                                        <span className="text-lg font-black text-brand-accent">{pyq.isFree ? 'FREE' : `₹${pyq.price}`}</span>
                                        <a
                                            href={pyq.pdfUrl}
                                            target="_blank"
                                            className="flex items-center space-x-2 text-brand-primary font-black text-xs uppercase tracking-widest hover:underline"
                                        >
                                            <span>Download</span>
                                            <Download className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-bg-card rounded-[3rem] border border-border-main">
                        <BookOpen className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-bold text-text-secondary">No PYQs found.</p>
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}

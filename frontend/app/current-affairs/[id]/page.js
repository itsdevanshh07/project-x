'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowLeft, Loader2, Share2, Download, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';

export default function CurrentAffairsDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth').replace(/\/auth$/, '');
                const response = await axios.get(`${API_BASE_URL}/current-affairs/${id}`);
                setArticle(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching article:', err);
                setError('Article not found.');
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
        </div>
    );

    if (error || !article) return (
        <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-6">
            <h2 className="text-2xl font-black text-text-primary mb-4">{error}</h2>
            <button onClick={() => router.push('/current-affairs')} className="btn-primary px-8 py-3">Back to News</button>
        </div>
    );

    return (
        <main className="min-h-screen bg-bg-main">
            <Navbar />

            <article className="pt-40 pb-32 container mx-auto px-4 max-w-4xl">
                <button
                    onClick={() => router.back()}
                    className="flex items-center space-x-2 text-text-muted font-bold hover:text-brand-primary transition-colors mb-10 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Current Affairs</span>
                </button>

                <div className="mb-12">
                    <div className="flex items-center space-x-4 mb-6">
                        <span className="px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-xs font-black uppercase tracking-widest rounded-xl">
                            {article.category}
                        </span>
                        <div className="flex items-center text-text-muted text-sm font-bold">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-text-primary leading-tight mb-8">
                        {article.title}
                    </h1>
                </div>

                <div className="relative aspect-video rounded-[3rem] overflow-hidden mb-16 shadow-2xl">
                    <img src={article.image} className="w-full h-full object-cover" alt={article.title} />
                </div>

                <div className="prose prose-xl prose-slate max-w-none">
                    <div className="text-text-secondary leading-relaxed whitespace-pre-wrap font-medium text-lg">
                        {article.content}
                    </div>
                </div>

                {article.pdfUrl && (
                    <div className="mt-20 p-10 bg-bg-section rounded-[3rem] border border-border-main flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-text-primary mb-1">Download Study Material</h3>
                                <p className="text-text-secondary font-medium">Get the PDF version of this article for offline reading.</p>
                            </div>
                        </div>
                        <a
                            href={article.pdfUrl}
                            target="_blank"
                            className="btn-primary px-10 py-4 flex items-center space-x-3 shadow-xl shadow-brand-primary/20"
                        >
                            <Download className="w-5 h-5" />
                            <span className="font-black uppercase tracking-widest text-xs">Download PDF</span>
                        </a>
                    </div>
                )}
            </article>

            <Footer />
        </main>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import CourseCard from './CourseCard';

const CoursePreview = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
                const response = await axios.get(`${API_URL}/courses`);
                setCourses(response.data.slice(0, 4));
            } catch (err) {
                console.error('Error fetching courses:', err.message);
                // Fallback for demo
                setCourses([
                    { _id: '1', title: 'Advanced Thermodynamics', category: 'Physics', price: 4999, description: 'Master the laws of thermodynamics with conceptual clarity and numerical practice.', enrolledCount: '1.2k', duration: '12 Weeks' },
                    { _id: '2', title: 'Pure Mathematics: Calculus', category: 'Maths', price: 3999, description: 'From limits to integration, understand the language of change with visual proofs.', enrolledCount: '2.5k', duration: '10 Weeks' },
                    { _id: '3', title: 'Organic Chemistry Decoded', category: 'Chemistry', price: 4500, description: 'Mechanisms made easy. Visualize molecular structures like never before.', enrolledCount: '900+', duration: '14 Weeks' },
                    { _id: '4', title: 'Molecular Biology', category: 'Biology', price: 4200, description: 'Explore the blueprint of life at the cellular level with AI-assisted visuals.', enrolledCount: '1.5k', duration: '12 Weeks' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <section className="py-24 relative">
            <div className="container max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-accent-highlight font-bold uppercase tracking-[0.2em] text-xs"
                        >
                            Academic Programs
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-display font-bold text-white"
                        >
                            Structured for <span className="text-surface-light/40 font-medium">Excellence.</span>
                        </motion.h2>
                    </div>
                    <Link href="/courses" className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-xs hover:text-secondary-action transition-all">
                        Explore Full Catalog <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                        <Loader2 className="w-12 h-12 text-secondary-action animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {courses.map((course, idx) => (
                            <CourseCard key={course._id} course={course} index={idx} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CoursePreview;


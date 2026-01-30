'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, addToWishlist } from '@/slices/studentSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, Clock, Users, CheckCircle2,
    Play, BookOpen, Share2, Award,
    ChevronDown, ArrowRight, Shield, Loader2, Library
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function CourseDetailPage() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('curriculum');
    const [expandedSection, setExpandedSection] = useState(0);

    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth').replace(/\/auth$/, '');
                const response = await axios.get(`${API_BASE_URL}/courses/${id}`);
                setCourse(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching course:', err);
                setError('Program details not found.');
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleEnroll = () => {
        if (!user) {
            router.push('/login');
            return;
        }
        dispatch(addToCart({ itemId: course._id, itemType: 'Course' }));
        router.push('/cart');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-foreground animate-spin mb-4" />
                <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">Retrieving Academic Dossier...</p>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <div className="max-w-md text-center">
                    <h2 className="text-2xl font-display font-bold text-foreground mb-4">Notification</h2>
                    <p className="text-muted-foreground mb-8 text-sm">{error || 'The requested academic program is currently unavailable.'}</p>
                    <button onClick={() => router.push('/courses')} className="btn-outline">Return to Directory</button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Institutional Header */}
            <header className="bg-muted/40 pt-32 pb-48 border-b border-border">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="max-w-3xl space-y-6">
                        <div className="flex items-center space-x-4">
                            <span className="bg-background px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest text-[#1E3A8A] dark:text-[#A5B4FC] border border-border shadow-sm">
                                {course.category} Program
                            </span>
                            <span className="text-muted-foreground font-semibold text-xs uppercase tracking-widest">Academic Year 2026-27</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
                            {course.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 pt-4">
                            <div className="flex items-center space-x-2">
                                <Star className="w-4 h-4 text-accent-gold fill-accent-gold" />
                                <span className="text-sm font-bold text-foreground">{course.rating || '4.8'}</span>
                                <span className="text-xs text-muted-foreground font-medium">/ 5.0 (Peer Rated)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-bold text-foreground">{course.enrollmentCount || 0}</span>
                                <span className="text-xs text-muted-foreground font-medium">Students Registered</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-bold text-foreground">{course.validity} Days</span>
                                <span className="text-xs text-muted-foreground font-medium">Access Period</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 pt-6">
                            <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-background font-bold text-sm">
                                {course.instructor?.fullName?.charAt(0) || 'D'}
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Principal Faculty</p>
                                <p className="text-foreground font-bold">{course.instructor?.fullName || 'Academic Collective'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <section className="max-w-[1280px] mx-auto px-6 -mt-32 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Academic Narrative & Structure */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tabbed Navigation */}
                        <div className="bg-card border border-border p-1.5 rounded-xl flex items-center shadow-sm">
                            {['curriculum', 'overview', 'faculty'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-3.5 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-all ${activeTab === tab
                                            ? 'bg-foreground text-background shadow-md'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Content Pane */}
                        <div className="bg-card border border-border rounded-xl p-8 md:p-12 shadow-sm min-h-[600px]">
                            {activeTab === 'overview' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-display font-bold text-foreground">Program Scope</h3>
                                        <p className="text-base text-muted-foreground leading-relaxed font-medium">
                                            {course.description}
                                        </p>
                                    </div>

                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-display font-bold text-foreground">Learning Outcomes</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {course.features?.length > 0 ? course.features.map((point, i) => (
                                                <div key={i} className="flex items-start space-x-4">
                                                    <div className="mt-1 w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center text-[#1E3A8A] dark:text-[#A5B4FC] shrink-0">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-sm text-muted-foreground font-medium leading-relaxed">{point}</span>
                                                </div>
                                            )) : (
                                                <p className="text-muted-foreground italic text-sm">Course features are currently being documented.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-8 bg-muted/50 rounded-xl border border-border flex items-center space-x-8">
                                        <div className="w-16 h-16 bg-background rounded-lg border border-border flex items-center justify-center text-foreground shadow-sm">
                                            <Award className="w-8 h-8" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-display font-bold text-foreground mb-1">Institutional Accreditation</h4>
                                            <p className="text-sm text-muted-foreground font-medium">Upon successful completion and assessment, a certificate of academic excellence is awarded.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'curriculum' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-display font-bold text-foreground">Program Structure</h3>
                                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{course.modules?.length || 0} Academic Units</span>
                                    </div>

                                    {course.modules && course.modules.length > 0 ? (
                                        course.modules.map((module, idx) => (
                                            <div key={idx} className="border border-border rounded-xl overflow-hidden bg-muted/20">
                                                <button
                                                    onClick={() => setExpandedSection(expandedSection === idx ? -1 : idx)}
                                                    className="w-full px-8 py-6 flex items-center justify-between hover:bg-background transition-colors"
                                                >
                                                    <div className="flex items-center space-x-6">
                                                        <span className="text-sm font-bold text-muted-foreground">0{idx + 1}</span>
                                                        <h4 className="text-lg font-display font-bold text-foreground text-left">{module.title}</h4>
                                                    </div>
                                                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedSection === idx ? 'rotate-180' : ''}`} />
                                                </button>
                                                <AnimatePresence>
                                                    {expandedSection === idx && (
                                                        <motion.div
                                                            initial={{ height: 0 }}
                                                            animate={{ height: 'auto' }}
                                                            exit={{ height: 0 }}
                                                            className="overflow-hidden border-t border-border bg-background"
                                                        >
                                                            <div className="p-2">
                                                                {module.lessons?.map((lesson, lidx) => (
                                                                    <div key={lidx} className="flex items-center justify-between p-4 hover:bg-muted rounded-lg transition-all group">
                                                                        <div className="flex items-center space-x-4">
                                                                            <Play className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
                                                                            <span className="text-sm text-muted-foreground font-medium group-hover:text-foreground">{lesson.title}</span>
                                                                        </div>
                                                                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-1 bg-muted rounded">
                                                                            {lesson.isFree ? 'Preview' : `${lesson.duration || 'Session'}`}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 text-muted-foreground space-y-4">
                                            <Library className="w-12 h-12 mx-auto opacity-20" />
                                            <p className="text-sm font-semibold uppercase tracking-widest">Syllabus documentation in progress.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'faculty' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                                        <div className="w-48 h-60 rounded-xl overflow-hidden border border-border flex-shrink-0 bg-muted">
                                            <img
                                                src={course.instructor?.avatar || `https://i.pravatar.cc/200?u=${course.instructor?._id}`}
                                                className="w-full h-full object-cover grayscale-[0.2]"
                                                alt="Faculty"
                                            />
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-3xl font-display font-bold text-foreground mb-1">{course.instructor?.fullName || 'Senior Academician'}</h3>
                                                <p className="text-accent-gold font-bold uppercase tracking-[0.2em] text-[10px]">Division Head & Educator</p>
                                            </div>
                                            <p className="text-base text-muted-foreground leading-relaxed font-medium">
                                                {course.instructor?.bio || 'Expert faculty with a distinguished career in academic mentorship, specializing in conceptual depth and student assessment strategies.'}
                                            </p>
                                            <div className="pt-4 border-t border-border flex gap-6">
                                                <div className="text-center">
                                                    <p className="text-lg font-bold text-foreground">15+</p>
                                                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Years Experience</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-lg font-bold text-foreground">50k+</p>
                                                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Students Mentored</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Enrollment Card */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl">
                                <div className="relative aspect-video bg-muted group overflow-hidden">
                                    <img src={course.thumbnail} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" alt="Preview" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <button className="w-16 h-16 bg-background rounded-full flex items-center justify-center text-foreground shadow-2xl hover:scale-105 transition-transform">
                                            <Play className="w-6 h-6 ml-1 fill-current" />
                                        </button>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-widest text-foreground border border-border">Preview Unit</span>
                                    </div>
                                </div>

                                <div className="p-8 space-y-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Comprehensive Enrollment Fee</p>
                                        <div className="flex items-baseline space-x-3">
                                            <span className="text-4xl font-display font-bold text-foreground">₹{course.discountedPrice || course.price}</span>
                                            {course.discountedPrice && (
                                                <span className="text-lg text-muted-foreground line-through font-medium">₹{course.price}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <button
                                            onClick={handleEnroll}
                                            className="w-full btn-gold !py-4"
                                        >
                                            Secure Enrollment
                                        </button>
                                        <p className="text-[9px] text-center text-muted-foreground font-medium">Annual academic fee, includes all assessments and digital resources.</p>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-border">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Institutional Benefits:</p>
                                        <ul className="space-y-4">
                                            {[
                                                { icon: BookOpen, text: 'Digital Curriculum Access' },
                                                { icon: Shield, text: 'Periodic Academic Reports' },
                                                { icon: Share2, text: 'Discussion Forums' },
                                                { icon: Users, text: 'Peer Interaction' }
                                            ].map((feature, i) => (
                                                <li key={i} className="flex items-center space-x-3">
                                                    <feature.icon className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
                                                    <span className="text-xs font-semibold text-foreground">{feature.text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Counseling Support */}
                            <div className="p-8 bg-muted border border-border rounded-xl text-center space-y-6">
                                <div>
                                    <h4 className="text-foreground font-display font-bold text-lg mb-2">Academic Counseling</h4>
                                    <p className="text-muted-foreground text-xs font-medium leading-relaxed">Speak with our administrators regarding program specifics or enrollment procedures.</p>
                                </div>
                                <button className="w-full py-3.5 rounded-lg border border-border bg-background text-foreground text-xs font-bold uppercase tracking-widest hover:bg-muted transition-all">
                                    Contact Admissions
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            <Footer />
        </main>
    );
}

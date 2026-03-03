'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, addToWishlist } from '@/slices/studentSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, Clock, Users, CheckCircle2,
    Play, BookOpen, Share2, Award,
    ChevronDown, ArrowRight, Shield, Loader2, Library,
    MessageSquare, Sparkles
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { loadRazorpayScript } from '@/lib/razorpay';

export default function CourseDetailPage() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('curriculum');
    const [expandedSection, setExpandedSection] = useState(0);

    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/auth$/, '');
                const response = await axios.get(`${API_BASE_URL}/courses/${id}`);
                setCourse(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching course:', err);
                setError('Course details not found.');
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handlePayment = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        try {
            setIsProcessing(true);
            const resScript = await loadRazorpayScript();

            if (!resScript) {
                toast.error('Razorpay SDK failed to load. Are you online?');
                setIsProcessing(false);
                return;
            }

            const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/auth$/, '');

            // Create Order
            const { data } = await axios.post(`${API_BASE_URL}/payments/create-order`,
                { courseId: id },
                { withCredentials: true }
            );

            if (!data.success) {
                throw new Error('Could not create order');
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'Academy',
                description: `Enrollment for ${course.title}`,
                image: '/logo.png', // Add your logo path
                order_id: data.order.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await axios.post(`${API_BASE_URL}/payments/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            courseId: id
                        }, { withCredentials: true });

                        if (verifyRes.data.success) {
                            toast.success('Successfully Enrolled!');
                            router.push(`/courses/${id}/learn`);
                        }
                    } catch (err) {
                        console.error('Verification Error:', err);
                        toast.error('Payment verification failed.');
                    }
                },
                prefill: {
                    name: user.fullName,
                    email: user.email,
                    contact: user.phone || ''
                },
                theme: {
                    color: '#6366f1' // Adjust to your theme color
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            setIsProcessing(false);

        } catch (err) {
            console.error('Payment Error:', err);
            toast.error(err.response?.data?.message || 'Something went wrong');
            setIsProcessing(false);
        }
    };

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
                <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">Loading Course Details...</p>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <div className="max-w-md text-center">
                    <h2 className="text-2xl font-display font-bold text-foreground mb-4">Error</h2>
                    <p className="text-muted-foreground mb-8 text-sm">{error || 'The requested course is currently unavailable.'}</p>
                    <button onClick={() => router.push('/courses')} className="btn-outline">Return to Courses</button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Institutional Header */}
            <header className="relative pt-28 md:pt-32 pb-40 md:pb-48 overflow-hidden bg-primary-bg">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary-action/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary-action/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-[1280px] mx-auto px-6 relative z-10">
                    <div className="max-w-3xl space-y-8">
                        <div className="flex items-center gap-4">
                            <span className="bg-secondary-action/20 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-secondary-action border border-secondary-action/30">
                                {course.category}
                            </span>
                            <div className="h-1 w-1 rounded-full bg-white/20" />
                            <span className="text-surface-light/40 font-bold text-[10px] uppercase tracking-[0.2em]">Academic Year 2026-27</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-7xl font-display font-black text-white leading-[1.1] md:leading-[0.9] tracking-tighter">
                            {course.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 pt-4">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-accent-highlight/10 rounded-lg">
                                    <Star className="w-4 h-4 text-accent-highlight fill-accent-highlight" />
                                </div>
                                <div>
                                    <span className="block text-sm font-black text-white leading-none">{course.rating || '4.8'} <span className="text-surface-light/40 font-bold ml-1">/ 5.0</span></span>
                                    <span className="text-[9px] text-surface-light/20 font-black uppercase tracking-widest mt-1 block">Peer Rated</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-secondary-action/10 rounded-lg">
                                    <Users className="w-4 h-4 text-secondary-action" />
                                </div>
                                <div>
                                    <span className="block text-sm font-black text-white leading-none">{course.enrollmentCount || 0}</span>
                                    <span className="text-[9px] text-surface-light/20 font-black uppercase tracking-widest mt-1 block">Students Enrolled</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                                    <Clock className="w-4 h-4 text-surface-light/40" />
                                </div>
                                <div>
                                    <span className="block text-sm font-black text-white leading-none">{course.validity} Days</span>
                                    <span className="text-[9px] text-surface-light/20 font-black uppercase tracking-widest mt-1 block">Access Period</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-6 group">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-secondary-action/20 border border-secondary-action/30 flex items-center justify-center text-white font-display font-black text-lg shadow-2xl shadow-secondary-action/20 group-hover:bg-secondary-action/30 transition-all overflow-hidden text-center">
                                    {course.instructor?.avatar && course.instructor?.avatar !== 'no-photo.jpg' ? (
                                        <img src={course.instructor.avatar} className="w-full h-full object-cover" />
                                    ) : (course.instructor?.fullName?.charAt(0) || 'D')}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-accent-highlight w-4 h-4 rounded-full border-2 border-primary-bg flex items-center justify-center">
                                    <Sparkles className="w-2 h-2 text-primary-bg" />
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] text-surface-light/20 font-black uppercase tracking-[0.2em]">Lead Instructor</p>
                                <p className="text-white font-black text-lg tracking-tight">{course.instructor?.fullName || 'Senior Faculty'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-6 -mt-16 md:-mt-32 pb-24 md:pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Academic Narrative & Structure */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tabbed Navigation */}
                        <div className="bg-white/5 border border-white/5 p-1.5 rounded-2xl flex items-center shadow-2xl backdrop-blur-xl">
                            {['curriculum', 'overview', 'faculty'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 ${activeTab === tab
                                        ? 'bg-secondary-action text-white shadow-xl shadow-secondary-action/20'
                                        : 'text-surface-light/30 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {tab === 'curriculum' ? 'Syllabus' : tab === 'faculty' ? 'Teacher' : tab}
                                </button>
                            ))}
                        </div>

                        {/* Content Pane */}
                        <div className="glass-card p-6 md:p-10 lg:p-14 border border-white/5 relative overflow-hidden group min-h-[400px] md:min-h-[600px] shadow-2xl">
                            {activeTab === 'overview' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                                    <div className="space-y-4 md:space-y-6">
                                        <h3 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight">Course Overview</h3>
                                        <p className="text-sm md:text-base text-surface-light/40 leading-relaxed font-medium">
                                            {course.description}
                                        </p>
                                    </div>

                                    <div className="space-y-8">
                                        <h3 className="text-3xl font-display font-black text-white tracking-tight">Learning Outcomes</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {course.features?.length > 0 ? course.features.map((point, i) => (
                                                <div key={i} className="flex items-start space-x-4 group/item">
                                                    <div className="mt-1 w-6 h-6 rounded-lg bg-secondary-action/10 border border-secondary-action/20 flex items-center justify-center text-secondary-action shrink-0 transition-all group-hover/item:bg-secondary-action group-hover/item:text-white">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-sm text-surface-light/40 font-medium leading-relaxed group-hover/item:text-surface-light transition-colors">{point}</span>
                                                </div>
                                            )) : (
                                                <p className="text-surface-light/20 italic text-sm">Course features will be added soon.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-8 bg-white/5 rounded-2xl border border-white/5 flex items-center space-x-8 hover:border-white/10 transition-all">
                                        <div className="w-16 h-16 bg-secondary-action/10 rounded-xl border border-secondary-action/20 flex items-center justify-center text-secondary-action shadow-2xl shadow-secondary-action/10">
                                            <Award className="w-8 h-8" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-display font-black text-white mb-1">Institutional Certification</h4>
                                            <p className="text-sm text-surface-light/40 font-medium">Secure a verified certificate of completion recognized in academic records.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'curriculum' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h3 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight">Course Syllabus</h3>
                                            <p className="text-[10px] text-surface-light/30 font-bold uppercase tracking-[0.2em]">Academic Roadmap</p>
                                        </div>
                                        <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] text-surface-light/40 font-black uppercase tracking-widest">{course.modules?.length || 0} Modules</span>
                                    </div>

                                    <div className="space-y-4">
                                        {course.modules && course.modules.length > 0 ? (
                                            course.modules.map((module, idx) => (
                                                <div key={idx} className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                                                    <button
                                                        onClick={() => setExpandedSection(expandedSection === idx ? -1 : idx)}
                                                        className="w-full px-5 md:px-8 py-5 md:py-7 flex items-center justify-between transition-colors text-left"
                                                    >
                                                        <div className="flex items-center space-x-4 md:space-x-6">
                                                            <div className="w-8 md:w-10 h-8 md:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] md:text-xs font-black text-surface-light/20 shrink-0">
                                                                0{idx + 1}
                                                            </div>
                                                            <h4 className="text-lg md:text-xl font-display font-black text-white tracking-tight">{module.title}</h4>
                                                        </div>
                                                        <div className={`p-1.5 md:p-2 rounded-lg bg-white/5 border border-white/10 transition-all shrink-0 ${expandedSection === idx ? 'bg-secondary-action border-secondary-action text-white rotate-180' : 'text-surface-light/30'}`}>
                                                            <ChevronDown className="w-4 h-4" />
                                                        </div>
                                                    </button>
                                                    <AnimatePresence>
                                                        {expandedSection === idx && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden border-t border-white/5 bg-black/20"
                                                            >
                                                                <div className="p-4 space-y-2">
                                                                    {module.lessons?.map((lesson, lidx) => (
                                                                        <div key={lidx} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-all group">
                                                                            <div className="flex items-center space-x-4">
                                                                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-secondary-action/20 transition-colors">
                                                                                    <Play className="w-3.5 h-3.5 text-surface-light/20 group-hover:text-secondary-action" />
                                                                                </div>
                                                                                <span className="text-sm text-surface-light/40 font-bold group-hover:text-white transition-colors">{lesson.title}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-4">
                                                                                <span className="text-[9px] font-black uppercase tracking-widest text-surface-light/20 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg group-hover:border-secondary-action/30 group-hover:text-secondary-action">
                                                                                    {lesson.isFree ? 'Free Preview' : `${lesson.duration || 'Session'}`}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-20 text-surface-light/20 space-y-6">
                                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                                                    <Library className="w-10 h-10 opacity-20" />
                                                </div>
                                                <p className="text-sm font-black uppercase tracking-[0.3em]">Curriculum under development.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'faculty' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                                    <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
                                        <div className="w-56 h-72 rounded-3xl overflow-hidden border border-white/5 flex-shrink-0 bg-white/5 relative group">
                                            <img
                                                src={course.instructor?.avatar || `https://i.pravatar.cc/400?u=${course.instructor?._id}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                alt="Faculty"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <div className="absolute bottom-4 left-4 right-4 text-center">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-highlight">Award Winning</p>
                                            </div>
                                        </div>
                                        <div className="flex-grow space-y-8">
                                            <div className="space-y-4 text-center md:text-left">
                                                <div className="flex flex-col md:flex-row items-center gap-3">
                                                    <h3 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight">{course.instructor?.fullName || 'Senior Instructor'}</h3>
                                                    <CheckCircle2 className="w-5 h-5 text-secondary-action" />
                                                </div>
                                                <p className="text-secondary-action font-black uppercase tracking-[0.3em] text-[10px]">Lead Academic Mentor</p>
                                            </div>
                                            <p className="text-lg text-surface-light/40 leading-relaxed font-medium italic">
                                                "{course.instructor?.bio || 'Dedicated to simplifying complex concepts through intuitive teaching methodologies and rigorous academic assessment.'}"
                                            </p>
                                            <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-8">
                                                <div className="glass-card p-6 border border-white/5">
                                                    <p className="text-3xl font-display font-black text-white leading-none mb-2">15+</p>
                                                    <p className="text-[10px] text-surface-light/20 font-black uppercase tracking-[0.2em]">Years Experience</p>
                                                </div>
                                                <div className="glass-card p-6 border border-white/5">
                                                    <p className="text-3xl font-display font-black text-white leading-none mb-2">50k+</p>
                                                    <p className="text-[10px] text-surface-light/20 font-black uppercase tracking-[0.2em]">Students Mentored</p>
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
                            <div className="glass-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative group/card">
                                <div className="absolute inset-0 bg-gradient-to-b from-secondary-action/5 to-transparent pointer-events-none" />

                                <div className="relative aspect-video bg-white/5 overflow-hidden">
                                    <img src={course.thumbnail} className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110" alt="Preview" />
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <button className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform">
                                            <Play className="w-8 h-8 ml-1 fill-current" />
                                        </button>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-secondary-action/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white border border-white/10">Academic Preview</span>
                                    </div>
                                </div>

                                <div className="p-8 space-y-8 relative z-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-surface-light/40 uppercase tracking-[0.2em] font-black">Comprehensive Enrollment Fee</p>
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-5xl font-display font-black text-white tracking-tighter">₹{course.discountedPrice || course.price}</span>
                                            {course.discountedPrice && (
                                                <span className="text-xl text-surface-light/20 line-through font-bold">₹{course.price}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <button
                                            onClick={handlePayment}
                                            disabled={isProcessing}
                                            className="w-full btn-enroll flex items-center justify-center gap-2"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Secure Enrollment <ArrowRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                        <p className="text-[10px] text-center text-surface-light/30 font-bold uppercase tracking-widest">Fixed Annual Fee • No Hidden Costs</p>
                                    </div>

                                    <div className="space-y-5 pt-8 border-t border-white/5">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-light/20">Institutional Assets Included:</p>
                                        <ul className="grid grid-cols-1 gap-4">
                                            {[
                                                { icon: BookOpen, text: 'Digital Curriculum Access', color: 'text-blue-400' },
                                                { icon: Shield, text: 'Real-time Progress Shield', color: 'text-purple-400' },
                                                { icon: Share2, text: 'Priority Doubt Resolution', color: 'text-pink-400' },
                                                { icon: Users, text: 'Peer Learning Community', color: 'text-emerald-400' }
                                            ].map((feature, i) => (
                                                <li key={i} className="flex items-center space-x-4 group/item">
                                                    <div className={`p-2 rounded-lg bg-white/5 border border-white/5 transition-all group-hover/item:bg-white/10 ${feature.color}`}>
                                                        <feature.icon className="w-4 h-4" strokeWidth={2} />
                                                    </div>
                                                    <span className="text-xs font-bold text-surface-light/40 group-hover/item:text-white transition-colors">{feature.text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Counseling Support */}
                            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl text-center space-y-6 backdrop-blur-sm">
                                <div className="space-y-2">
                                    <h4 className="text-white font-display font-black text-xl tracking-tight">Academic Counseling</h4>
                                    <p className="text-surface-light/40 text-xs font-medium leading-relaxed">Need technical or academic guidance? Our mentors are available for immediate consultation.</p>
                                </div>
                                <button className="w-full py-4 rounded-xl border border-white/10 bg-white/5 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    Contact Support
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

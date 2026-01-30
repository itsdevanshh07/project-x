'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    BookOpen,
    Video,
    MessageSquare,
    Users,
    Settings,
    LogOut,
    Plus,
    Play,
    TrendingUp,
    IndianRupee,
    Calendar,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function TeacherDashboard() {
    const { user } = useSelector((state) => state.auth);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, liveClasses: 12, earnings: '42,500' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        if (user?.role !== 'teacher') {
            router.push('/dashboard');
            return;
        }
        fetchTeacherData();
    }, [user, router]);

    const fetchTeacherData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth').replace(/\/auth$/, '');
            const [coursesRes, statsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/teacher/courses`, config),
                axios.get(`${API_BASE_URL}/teacher/stats`, config)
            ]);
            setCourses(coursesRes.data.data);
            setStats({ ...stats, totalCourses: statsRes.data.data.totalCourses, totalStudents: statsRes.data.data.totalStudents });
        } catch (error) {
            console.error('Error fetching teacher data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'courses', label: 'My Courses', icon: BookOpen },
        { id: 'live', label: 'Live Classes', icon: Video },
        { id: 'doubts', label: 'Doubts/Q&A', icon: MessageSquare },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'settings', label: 'Profile Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />

            <div className="flex flex-col lg:flex-row pt-24 h-screen overflow-hidden">
                {/* Sidebar */}
                <div className="w-full lg:w-72 bg-white border-r border-border-light flex flex-col p-6 overflow-y-auto h-[30vh] lg:h-full">
                    <div className="mb-8 px-4">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">
                                {user?.fullName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-text-primary leading-tight">{user?.fullName}</h3>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Verified Instructor</p>
                            </div>
                        </div>
                    </div>

                    <nav className="space-y-2 flex-grow">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold transition-all duration-300 ${activeTab === item.id
                                        ? 'bg-text-primary text-white shadow-xl shadow-text-primary/10'
                                        : 'text-text-secondary hover:bg-bg-section hover:text-text-primary'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <button className="flex items-center space-x-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all mt-auto">
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-grow overflow-y-auto p-6 lg:p-10 h-[70vh] lg:h-full">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'blue' },
                                        { label: 'Courses Active', value: stats.totalCourses, icon: BookOpen, color: 'purple' },
                                        { label: 'Live Classes', value: stats.liveClasses, icon: Video, color: 'pink' },
                                        { label: 'Total Earnings', value: `₹${stats.earnings}`, icon: IndianRupee, color: 'emerald' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white p-6 rounded-3xl border border-border-light shadow-sm relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                                <stat.icon className="w-12 h-12" />
                                            </div>
                                            <div className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1">Global</div>
                                            <div className="text-text-muted text-xs font-bold uppercase tracking-wider mb-4">{stat.label}</div>
                                            <div className="text-3xl font-black text-text-primary">{stat.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-border-light shadow-sm">
                                        <div className="flex items-center justify-between mb-10">
                                            <h2 className="text-2xl font-display font-black text-text-primary">Recent Courses</h2>
                                            <button className="text-primary font-black text-xs uppercase tracking-widest hover:underline">View All</button>
                                        </div>
                                        <div className="space-y-6">
                                            {courses.slice(0, 3).map(course => (
                                                <div key={course._id} className="flex items-center justify-between p-4 hover:bg-bg-section rounded-2xl transition-all group">
                                                    <div className="flex items-center space-x-4">
                                                        <img src={course.thumbnail} className="w-16 h-12 object-cover rounded-lg" />
                                                        <div>
                                                            <h4 className="font-bold text-text-primary">{course.title}</h4>
                                                            <p className="text-xs text-text-muted">{course.category} • {course.enrollmentCount} Students</p>
                                                        </div>
                                                    </div>
                                                    <button className="p-2 text-text-muted hover:text-primary transition-colors">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-text-primary rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-10">
                                                <h2 className="text-2xl font-display font-black">Upcoming Live</h2>
                                                <Video className="w-6 h-6 text-white/50" />
                                            </div>
                                            <div className="space-y-8">
                                                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Starting in 15m</p>
                                                    <h4 className="font-bold mb-4">SSC CGL Mathematics - Advanced Geometry</h4>
                                                    <button className="w-full py-3 bg-white text-text-primary rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all">Go Live</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

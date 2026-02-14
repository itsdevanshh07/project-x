'use client';

import { useEffect, useState, useRef } from 'react';
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
    ChevronRight,
    Sparkles,
    CircleDashed,
    Activity,
    Upload,
    FileText,
    Camera,
    Save,
    X,
    ExternalLink,
    CheckCircle2,
    Lock,
    ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import MuxPlayer from '@mux/mux-player-react';
import MuxUploader from '@mux/mux-uploader-react';

// New functional components
import UploadVideoModal from '@/components/UploadVideoModal';
import LiveClassPanel from '@/components/LiveClassPanel';
import DoubtMeetingModal from '@/components/DoubtMeetingModal';
import MuxVideoPlayer from '@/components/MuxVideoPlayer';
import { logout } from '@/slices/authSlice';

export default function TeacherDashboard() {
    const { user } = useSelector((state) => state.auth);
    const router = useRouter();
    const dispatch = useDispatch();
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    // Data States
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, liveClasses: 0, earnings: '0' });
    const [liveClasses, setLiveClasses] = useState([]);
    const [doubts, setDoubts] = useState([]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);

    // UI States (Modals)
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showLiveModal, setShowLiveModal] = useState(false);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showDoubtModal, setShowDoubtModal] = useState(false);
    const [selectedDoubt, setSelectedDoubt] = useState(null);
    const [doubtReply, setDoubtReply] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showMeetingModal, setShowMeetingModal] = useState(false);
    const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);

    const handleAnswerDoubt = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_BASE_URL}/teacher/doubts/${selectedDoubt._id}/answer`, { text: doubtReply }, config);
            toast.success('Response sent to student');
            setShowDoubtModal(false);
            setDoubtReply('');
            fetchTeacherData();
        } catch (error) {
            toast.error('Failed to send response');
        }
    };

    // Form States
    const [courseForm, setCourseForm] = useState({ title: '', description: '', price: '', category: 'Class 10', validity: '365', thumbnail: '' });
    const [liveForm, setLiveForm] = useState({ title: '', scheduledTime: '', dayOfWeek: '', startTime: '', endTime: '', platform: 'mux', courseId: '' });
    const [lessonForm, setLessonForm] = useState({ title: '', content: '', muxAssetId: '', muxPlaybackId: '', pdfUrl: '' });
    const [profileForm, setProfileForm] = useState({ fullName: '', bio: '', expertise: '', experience: '' });

    const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/auth$/, '');

    useEffect(() => {
        setMounted(true);
        if (user) {
            if (user.role !== 'teacher') {
                router.push('/dashboard');
                return;
            }
            setProfileForm({
                fullName: user.fullName || '',
                bio: user.bio || '',
                expertise: user.expertise?.join(', ') || '',
                experience: user.experience || 0
            });
            fetchTeacherData();
        } else {
            router.push('/login');
        }
    }, [user, router]);

    const fetchTeacherData = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [coursesRes, statsRes, liveRes, doubtsRes, studentsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/teacher/courses`, config),
                axios.get(`${API_BASE_URL}/teacher/stats`, config),
                axios.get(`${API_BASE_URL}/teacher/live-classes`, config),
                axios.get(`${API_BASE_URL}/teacher/courses/all/doubts`, config).catch(() => ({ data: { data: [] } })),
                axios.get(`${API_BASE_URL}/teacher/students`, config).catch(() => ({ data: { data: [] } }))
            ]);

            setCourses(coursesRes.data.data || []);
            setStats({
                totalCourses: statsRes.data.data?.totalCourses || 0,
                totalStudents: statsRes.data.data?.totalStudents || 0,
                liveClasses: liveRes.data.data?.length || 0,
                earnings: '42,500' // Placeholder revenue metric
            });
            setLiveClasses(liveRes.data.data || []);
            setDoubts(doubtsRes.data.data || []);
            setEnrolledStudents(studentsRes.data.data || []);
        } catch (error) {
            console.error('Error fetching teacher data:', error);
            toast.error('Failed to sync data with server');
        } finally {
            setLoading(false);
        }
    };

    // --- Course Actions ---
    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_BASE_URL}/teacher/courses`, courseForm, config);
            toast.success('Course created successfully');
            setShowCourseModal(false);
            fetchTeacherData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create course');
        }
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_BASE_URL}/teacher/lessons`, {
                ...lessonForm,
                courseId: selectedCourse._id,
                moduleId: selectedCourse.modules?.[0]?._id // Simplification: add to first module if exists
            }, config);
            toast.success('Lesson added');
            setShowLessonModal(false);
            setLessonForm({ title: '', content: '', muxAssetId: '', muxPlaybackId: '', pdfUrl: '' });
        } catch (error) {
            toast.error('Failed to add lesson');
        }
    };

    // --- Video Upload (Mux) ---
    const getMuxUploadUrl = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get(`${API_BASE_URL}/teacher/mux/upload-url`, config);
            return res.data.data.url;
        } catch (error) {
            toast.error('Failed to start video upload');
        }
    };

    // --- PDF Upload (R2/S3) ---
    const handlePdfUpload = async (file) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const presignedRes = await axios.post(`${API_BASE_URL}/teacher/storage/upload-url`, {
                fileName: file.name,
                contentType: file.type
            }, config);

            const { uploadUrl, publicUrl } = presignedRes.data.data;
            await axios.put(uploadUrl, file, {
                headers: { 'Content-Type': file.type }
            });

            setLessonForm({ ...lessonForm, pdfUrl: publicUrl });
            toast.success('Course notes uploaded');
        } catch (error) {
            console.error(error);
            toast.error('File upload failed');
        }
    };

    // --- Live Class ---
    const handleScheduleLive = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_BASE_URL}/teacher/live-classes`, liveForm, config);
            toast.success(`Live class scheduled via ${liveForm.platform.toUpperCase()}`);
            setShowLiveModal(false);
            fetchTeacherData();
        } catch (error) {
            toast.error('Failed to schedule live class');
        }
    };

    // --- Profile Updates ---
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const expertiseArray = profileForm.expertise.split(',').map(s => s.trim());
            await axios.put(`${API_BASE_URL}/teacher/profile`, {
                ...profileForm,
                expertise: expertiseArray
            }, config);
            toast.success('Profile updated');
        } catch (error) {
            toast.error('Profile update failed');
        }
    };

    if (!mounted) return null;

    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'courses', label: 'Courses', icon: BookOpen },
        { id: 'live', label: 'Live Classes', icon: Video },
        { id: 'doubts', label: 'Doubts', icon: MessageSquare },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'settings', label: 'Profile Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-primary-bg overflow-hidden flex flex-col">
            <Navbar />

            <div className="flex flex-col lg:flex-row pt-28 h-screen overflow-hidden">
                {/* Fixed Premium Sidebar */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-full lg:w-80 bg-primary-bg/50 backdrop-blur-2xl border-r border-white/5 flex flex-col p-8 overflow-y-auto h-[40vh] lg:h-full z-20"
                >
                    <div className="mb-12">
                        <div className="flex items-center gap-4 group">
                            <div className="relative">
                                <div className="w-14 h-14 bg-secondary-action/20 rounded-2xl flex items-center justify-center text-white border border-secondary-action/30 group-hover:bg-secondary-action/30 transition-all duration-500 shadow-2xl shadow-secondary-action/20 overflow-hidden text-xl font-display font-black">
                                    {user?.avatar && user?.avatar !== 'no-photo.jpg' ? (
                                        <img src={user?.avatar} className="w-full h-full object-cover" />
                                    ) : user?.fullName?.charAt(0) || 'T'}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-accent-highlight w-4 h-4 rounded-full border-2 border-primary-bg flex items-center justify-center">
                                    <Sparkles className="w-2 h-2 text-primary-bg" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-display font-bold text-white tracking-tight">{user?.fullName}</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-action animate-pulse" />
                                    <p className="text-[10px] font-black text-secondary-action uppercase tracking-[0.2em]">Active Teacher</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <nav className="space-y-2 flex-grow">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-500 relative group
                                    ${activeTab === item.id
                                        ? 'text-white bg-white/5 border border-white/10 shadow-2xl'
                                        : 'text-surface-light/30 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 transition-colors duration-500 ${activeTab === item.id ? 'text-secondary-action' : 'group-hover:text-secondary-action'}`} />
                                <span className="relative z-10">{item.label}</span>
                                {activeTab === item.id && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-2 w-1 h-6 bg-secondary-action rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </nav>

                    <button
                        onClick={() => {
                            dispatch(logout());
                            router.push('/');
                        }}
                        className="flex items-center space-x-4 px-5 py-4 text-red-500/50 hover:text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500/5 rounded-2xl transition-all mt-auto group"
                    >
                        <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </motion.div>

                {/* Dynamic Main Content */}
                <div className="flex-grow overflow-y-auto p-6 lg:p-12 h-[60vh] lg:h-full custom-scrollbar relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-action/5 blur-[120px] rounded-full pointer-events-none" />

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-4">
                                <CircleDashed className="w-12 h-12 text-secondary-action animate-spin-slow" />
                                <p className="text-[10px] font-black text-surface-light/20 uppercase tracking-[0.3em]">Loading Dashboard Data...</p>
                            </div>
                        ) : activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-12 max-w-7xl mx-auto"
                            >
                                {/* Stat Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                                        { label: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                                        { label: 'Live Classes', value: stats.liveClasses, icon: Video, color: 'text-pink-400', bg: 'bg-pink-400/10' },
                                        { label: 'Earnings', value: `₹${stats.earnings}`, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                                    ].map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="glass-card p-8 group hover:border-white/20 transition-all duration-500"
                                        >
                                            <div className="flex items-center justify-between mb-8">
                                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:rotate-12 transition-transform duration-500`}>
                                                    <stat.icon className="w-6 h-6" />
                                                </div>
                                                <span className="text-[10px] font-black text-surface-light/20 uppercase tracking-[0.2em]">Verified</span>
                                            </div>
                                            <p className="text-surface-light/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                                            <h4 className="text-3xl font-display font-black text-white">{stat.value}</h4>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    <div className="lg:col-span-8 glass-card p-10 border border-white/5 relative overflow-hidden group">
                                        <div className="flex items-center justify-between mb-12">
                                            <div className="space-y-1">
                                                <h2 className="text-2xl font-display font-black text-white">Course Progress</h2>
                                                <p className="text-xs text-surface-light/40 font-medium tracking-tight">Real-time status of current course delivery.</p>
                                            </div>
                                            <button
                                                onClick={() => setActiveTab('courses')}
                                                className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-surface-light/60 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
                                            >
                                                Manage Courses
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            {courses.length > 0 ? courses.slice(0, 3).map((course, idx) => (
                                                <div key={course._id} className="flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all group/item border border-transparent hover:border-white/5">
                                                    <div className="flex items-center space-x-6">
                                                        <div className="relative">
                                                            <img src={course.thumbnail || '/placeholder-course.jpg'} className="w-24 h-16 object-cover rounded-xl shadow-2xl bg-white/5" />
                                                            <div className="absolute inset-0 bg-secondary-action/20 opacity-0 group-hover/item:opacity-100 transition-opacity rounded-xl" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-white mb-1 group-hover/item:text-secondary-action transition-colors">{course.title}</h4>
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-[10px] font-bold text-surface-light/30 uppercase tracking-widest">{course.category}</span>
                                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-secondary-action uppercase tracking-widest">
                                                                    <Users className="w-3 h-3" />
                                                                    {course.enrolledCount || 0} Students
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => { setSelectedCourse(course); setActiveTab('courses'); }}
                                                        className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-surface-light/30 hover:text-white hover:bg-secondary-action transition-all"
                                                    >
                                                        <ChevronRight className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )) : (
                                                <div className="py-20 text-center space-y-4">
                                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                                        <CircleDashed className="w-8 h-8 text-surface-light/10 animate-spin-slow" />
                                                    </div>
                                                    <p className="text-surface-light/30 font-bold uppercase tracking-widest text-xs">No active courses found.</p>
                                                    <button onClick={() => setShowCourseModal(true)} className="px-6 py-3 bg-secondary-action text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Create Course</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="lg:col-span-4 relative">
                                        <div className="sticky top-0 bg-secondary-action rounded-[2.5rem] p-10 text-white shadow-3xl shadow-secondary-action/20 overflow-hidden min-h-[450px] flex flex-col group">
                                            <div className="relative z-10 flex-grow">
                                                <div className="flex items-center justify-between mb-12">
                                                    <h2 className="text-2xl font-display font-black tracking-tight">Live Classes</h2>
                                                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                                                        <Video className="w-5 h-5" />
                                                    </div>
                                                </div>

                                                <div className="space-y-8">
                                                    {liveClasses.length > 0 ? (
                                                        <div className="p-8 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md hover:bg-white/15 transition-all">
                                                            <div className="flex items-center gap-2 mb-4">
                                                                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Next Live Class</p>
                                                            </div>
                                                            <h4 className="text-xl font-bold mb-8 leading-tight">{liveClasses[0].title}</h4>
                                                            <button
                                                                onClick={() => setShowLiveModal(true)}
                                                                className="w-full py-5 bg-white text-secondary-action rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-3"
                                                            >
                                                                <Play className="w-4 h-4 fill-current" />
                                                                Start / Manage Live
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                                                            <p className="text-white/60 text-sm font-medium">No live classes scheduled.</p>
                                                            <button onClick={() => setShowLiveModal(true)} className="bg-white/20 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-all border border-white/10">Start Live Class</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-8 pt-8 border-t border-white/10 text-white/60">
                                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                                                    <span>Stream Quality</span>
                                                    <span className="text-white">ULTRA-HD</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'students' && (
                            <motion.div key="students" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-12">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-4xl font-display font-black text-white">Enrolled <span className="text-secondary-action">Students</span></h2>
                                    <div className="flex gap-4">
                                        <div className="px-5 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-surface-light/40">
                                            {enrolledStudents.length} Active Enrollments
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-card overflow-hidden border border-white/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/5">
                                                <th className="p-6 text-[10px] font-black text-surface-light/20 uppercase tracking-widest">Student</th>
                                                <th className="p-6 text-[10px] font-black text-surface-light/20 uppercase tracking-widest">Course Title</th>
                                                <th className="p-6 text-[10px] font-black text-surface-light/20 uppercase tracking-widest">Enrollment Date</th>
                                                <th className="p-6 text-[10px] font-black text-surface-light/20 uppercase tracking-widest">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {enrolledStudents.length > 0 ? enrolledStudents.map((enrollment, idx) => (
                                                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-secondary-action/10 flex items-center justify-center text-secondary-action font-black">
                                                                {enrollment.student?.fullName.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-white group-hover:text-secondary-action transition-colors">{enrollment.student?.fullName}</p>
                                                                <p className="text-[10px] text-surface-light/20 font-black tracking-widest">{enrollment.student?.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className="text-xs font-bold text-surface-light/60">{enrollment.course?.title}</span>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className="text-xs font-bold text-surface-light/30">{new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="flex gap-2">
                                                            <button className="p-2.5 bg-white/5 rounded-xl text-surface-light/30 hover:text-white transition-all">
                                                                <MessageSquare className="w-4 h-4" />
                                                            </button>
                                                            <button className="p-2.5 bg-white/5 rounded-xl text-red-500/30 hover:text-red-500 transition-all">
                                                                <Lock className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" className="py-20 text-center">
                                                        <Users className="w-12 h-12 text-surface-light/10 mx-auto mb-4" />
                                                        <p className="text-surface-light/20 font-black uppercase tracking-widest">No enrolled students found.</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'doubts' && (
                            <motion.div key="doubts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-12">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-4xl font-display font-black text-white">Student <span className="text-secondary-action">Doubts</span></h2>
                                    <div className="px-5 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-surface-light/40">
                                        {doubts.length} Records
                                    </div>
                                </div>
                                <div className="grid gap-6">
                                    {doubts.length > 0 ? doubts.map(doubt => (
                                        <div key={doubt._id} className="glass-card p-8 flex items-center justify-between group">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-secondary-action/10 border border-secondary-action/20 flex items-center justify-center text-secondary-action font-black">
                                                        {doubt.student?.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white">{doubt.student?.fullName || 'Anonymous Student'}</h4>
                                                        <p className="text-[10px] text-surface-light/20 font-black uppercase tracking-widest">Question on {new Date(doubt.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <p className="text-white/60 font-medium italic">"{doubt.question}"</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => { setSelectedDoubt(doubt); setShowMeetingModal(true); }}
                                                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-surface-light/40 hover:text-white transition-all flex items-center gap-2"
                                                >
                                                    <Video size={12} /> Live Session
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedDoubt(doubt); setShowDoubtModal(true); }}
                                                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${doubt.status === 'pending' ? 'bg-secondary-action text-white shadow-xl shadow-secondary-action/20' : 'bg-emerald-500/10 text-emerald-500 cursor-default'}`}
                                                >
                                                    {doubt.status === 'pending' ? 'Answer' : 'Resolved'}
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="py-32 text-center glass-card border-dashed border-white/10">
                                            <MessageSquare className="w-12 h-12 text-surface-light/10 mx-auto mb-6" />
                                            <p className="text-surface-light/20 font-black uppercase tracking-widest">No student doubts found.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'courses' && (
                            <motion.div key="courses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-12">
                                {!selectedCourseDetails ? (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-4xl font-display font-black text-white">Manage <span className="text-secondary-action">Courses</span></h2>
                                            <button onClick={() => setShowCourseModal(true)} className="px-8 py-4 bg-secondary-action text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-secondary-action/20 flex items-center gap-3">
                                                <Plus className="w-4 h-4" /> Create Course
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {courses.map(course => (
                                                <div key={course._id} className="glass-card group hover:border-white/20 transition-all duration-500 overflow-hidden flex flex-col">
                                                    <div className="relative h-48">
                                                        <img src={course.thumbnail || '/placeholder-course.jpg'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-primary-bg to-transparent opacity-60" />
                                                        <div className="absolute top-4 right-4 bg-accent-highlight text-primary-bg px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                            {course.category}
                                                        </div>
                                                    </div>
                                                    <div className="p-8 space-y-4 flex-grow">
                                                        <h3 className="text-xl font-bold text-white group-hover:text-secondary-action transition-colors">{course.title}</h3>
                                                        <div className="flex items-center gap-6 text-[10px] font-bold text-surface-light/30 uppercase tracking-widest">
                                                            <span className="flex items-center gap-2"><Users className="w-3 h-3" /> {course.enrolledCount || 0}</span>
                                                            <span className="flex items-center gap-2"><IndianRupee className="w-3 h-3" /> {course.price}</span>
                                                        </div>
                                                        <div className="pt-6 border-t border-white/5 flex gap-3">
                                                            <button
                                                                onClick={() => setSelectedCourseDetails(course)}
                                                                className="flex-1 py-3 bg-white/5 border border-white/5 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                                                            >
                                                                Manage Course
                                                            </button>
                                                            <button
                                                                onClick={() => window.open(`/courses/${course._id}`, '_blank')}
                                                                className="p-3 bg-white/5 text-surface-light/60 rounded-xl hover:text-white transition-all"
                                                            >
                                                                <ExternalLink className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-12">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <button onClick={() => setSelectedCourseDetails(null)} className="p-3 bg-white/5 rounded-xl text-surface-light/40 hover:text-white transition-all">
                                                    <ChevronRight className="w-5 h-5 rotate-180" />
                                                </button>
                                                <div>
                                                    <h2 className="text-3xl font-display font-black text-white">{selectedCourseDetails.title}</h2>
                                                    <p className="text-xs text-secondary-action font-bold uppercase tracking-widest mt-1">Course Management Hub</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => { setSelectedCourse(selectedCourseDetails); setShowUploadModal(true); }}
                                                className="px-8 py-4 bg-secondary-action text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-secondary-action/20 flex items-center gap-3 hover:scale-105 transition-all"
                                            >
                                                <Plus className="w-4 h-4" /> Upload Recorded Lecture
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2 space-y-8">
                                                <div className="glass-card p-8">
                                                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                                        <BookOpen className="w-5 h-5 text-secondary-action" /> Course Content
                                                    </h3>
                                                    {/* Modules and Lessons list goes here */}
                                                    <div className="space-y-4">
                                                        {selectedCourseDetails.modules?.length > 0 ? selectedCourseDetails.modules.map(module => (
                                                            <div key={module._id} className="border border-white/5 rounded-2xl p-6 bg-white/2">
                                                                <h4 className="font-bold text-white mb-4 uppercase text-[10px] tracking-widest text-surface-light/40">{module.title}</h4>
                                                                <div className="space-y-2">
                                                                    {module.lessons?.map(lesson => (
                                                                        <div key={lesson._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl group hover:bg-white/10 transition-all">
                                                                            <div className="flex items-center gap-4">
                                                                                <div className="w-8 h-8 rounded-lg bg-secondary-action/20 flex items-center justify-center text-secondary-action">
                                                                                    <Play size={14} fill="currentColor" />
                                                                                </div>
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-sm font-medium text-white/80">{lesson.title}</span>
                                                                                    {lesson.videoUrl === 'uploading...' && (
                                                                                        <span className="text-[8px] font-black text-secondary-action uppercase tracking-widest animate-pulse">Uploading to Mux...</span>
                                                                                    )}
                                                                                    {lesson.videoUrl === 'processing...' && (
                                                                                        <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest animate-pulse">Processing Video...</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <button className="text-[10px] font-black uppercase tracking-widest text-surface-light/20 hover:text-red-500 transition-colors">Remove</button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )) : (
                                                            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                                                <p className="text-surface-light/20 font-bold uppercase tracking-widest text-xs">No modules found. Start by uploading a lecture.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-8">
                                                <div className="glass-card p-8">
                                                    <h3 className="text-lg font-bold text-white mb-6">Course Stats</h3>
                                                    <div className="space-y-6">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-surface-light/40">Total Students</span>
                                                            <span className="text-sm font-bold text-white">{selectedCourseDetails.enrolledCount || 0}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-surface-light/40">Price</span>
                                                            <span className="text-sm font-bold text-white">₹{selectedCourseDetails.price}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'live' && (
                            <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-12">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-4xl font-display font-black text-white">Live <span className="text-secondary-action">Classes</span></h2>
                                    <button
                                        onClick={() => setShowLiveModal(true)}
                                        className="px-8 py-4 bg-secondary-action text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-secondary-action/20 flex items-center gap-3 hover:scale-105 transition-all"
                                    >
                                        <Video className="w-4 h-4" /> Start Live Class
                                    </button>
                                </div>

                                <div className="grid gap-6">
                                    {liveClasses.length > 0 ? liveClasses.map(live => (
                                        <div key={live._id} className="glass-card p-8 flex items-center justify-between group">
                                            <div className="flex items-center gap-8">
                                                <div className="w-20 h-20 bg-secondary-action/10 rounded-2xl flex items-center justify-center text-secondary-action border border-secondary-action/20 group-hover:bg-secondary-action/20 transition-all">
                                                    <Video size={32} />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="text-xl font-bold text-white">{live.title}</h4>
                                                        {live.status === 'live' && (
                                                            <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse border border-red-500/20">Live Now</span>
                                                        )}
                                                        {live.status === 'ended' && (
                                                            <span className="px-3 py-1 bg-surface-light/10 text-surface-light/40 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">Live Ended</span>
                                                        )}
                                                        {live.status === 'scheduled' && (
                                                            <span className="px-3 py-1 bg-secondary-action/10 text-secondary-action rounded-full text-[10px] font-black uppercase tracking-widest border border-secondary-action/20">Upcoming</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-surface-light/40 font-medium">Scheduled for: {new Date(live.scheduledTime).toLocaleString()}</p>
                                                    <div className="flex items-center gap-4 text-[10px] font-bold text-secondary-action uppercase tracking-widest">
                                                        <span>{live.course?.title}</span>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                                        <span>Platform: {live.platform}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setShowLiveModal(true)}
                                                className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                                            >
                                                Manage Stream
                                            </button>
                                        </div>
                                    )) : (
                                        <div className="py-32 text-center glass-card border-dashed border-white/10">
                                            <Video className="w-12 h-12 text-surface-light/10 mx-auto mb-6" />
                                            <p className="text-surface-light/20 font-black uppercase tracking-widest">No live classes scheduled.</p>
                                            <button onClick={() => setShowLiveModal(true)} className="mt-8 px-8 py-4 bg-secondary-action text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Create First Live Session</button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
                                <div className="glass-card p-12 space-y-12">
                                    <div className="flex items-center gap-8">
                                        <div className="w-24 h-24 rounded-3xl bg-secondary-action/20 border border-secondary-action/30 flex items-center justify-center overflow-hidden">
                                            {user.avatar && user.avatar !== 'no-photo.jpg' ? <img src={user.avatar} className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-secondary-action" />}
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-display font-black text-white">Profile Details</h3>
                                            <p className="text-xs text-surface-light/40 font-medium italic">Update your public profile and expertise.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-surface-light/20 uppercase tracking-[0.2em] ml-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={profileForm.fullName}
                                                onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-secondary-action/30 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-surface-light/20 uppercase tracking-[0.2em] ml-2">Experience (Years)</label>
                                            <input
                                                type="number"
                                                value={profileForm.experience}
                                                onChange={e => setProfileForm({ ...profileForm, experience: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-secondary-action/30 transition-all"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-surface-light/20 uppercase tracking-[0.2em] ml-2">Bio</label>
                                            <textarea
                                                value={profileForm.bio}
                                                onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-3xl px-6 py-4 text-white focus:ring-2 focus:ring-secondary-action/30 transition-all h-32"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-surface-light/20 uppercase tracking-[0.2em] ml-2">Areas of Expertise (Comma Separated)</label>
                                            <input
                                                type="text"
                                                value={profileForm.expertise}
                                                onChange={e => setProfileForm({ ...profileForm, expertise: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-secondary-action/30 transition-all"
                                            />
                                        </div>
                                        <button type="submit" className="md:col-span-2 py-5 bg-secondary-action text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:shadow-3xl shadow-secondary-action/20 transition-all flex items-center justify-center gap-4">
                                            <Save className="w-4 h-4" /> Save Profile
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showCourseModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 grayscale-0">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-primary-bg/80 backdrop-blur-xl" onClick={() => setShowCourseModal(false)} />
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass-card w-full max-w-2xl p-10 relative z-10">
                            <h2 className="text-3xl font-display font-black text-white mb-8">Create <span className="text-secondary-action">New Course</span></h2>
                            <form onSubmit={handleCreateCourse} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-surface-light/20 uppercase tracking-widest pl-2">Course Title</label>
                                        <input placeholder="e.g. Class 10 Physics Masterclass" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold" onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-surface-light/20 uppercase tracking-widest pl-2">Course Category</label>
                                        <div className="relative">
                                            <select
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold cursor-pointer appearance-none outline-none focus:border-secondary-action/50 transition-all"
                                                value={courseForm.category}
                                                onChange={e => setCourseForm({ ...courseForm, category: e.target.value })}
                                                required
                                            >
                                                <option value="Class 9" className="bg-[#1e293b]">Class 9</option>
                                                <option value="Class 10" className="bg-[#1e293b]">Class 10</option>
                                                <option value="Class 11" className="bg-[#1e293b]">Class 11</option>
                                                <option value="Class 12" className="bg-[#1e293b]">Class 12</option>
                                                <option value="Mathematics" className="bg-[#1e293b]">Mathematics</option>
                                                <option value="Physics" className="bg-[#1e293b]">Physics</option>
                                                <option value="Chemistry" className="bg-[#1e293b]">Chemistry</option>
                                                <option value="Biology" className="bg-[#1e293b]">Biology</option>
                                                <option value="JEE" className="bg-[#1e293b]">JEE</option>
                                                <option value="NEET" className="bg-[#1e293b]">NEET</option>
                                                <option value="Board Exam" className="bg-[#1e293b]">Board Exam</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-light/20 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-surface-light/20 uppercase tracking-widest pl-2">Course Validity (in days)</label>
                                        <input placeholder="e.g. 180" type="number" min="1" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold" onChange={e => setCourseForm({ ...courseForm, validity: e.target.value })} required />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-surface-light/20 uppercase tracking-widest pl-2">Base Price (₹)</label>
                                        <input placeholder="0" type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold" onChange={e => setCourseForm({ ...courseForm, price: e.target.value })} required />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-surface-light/20 uppercase tracking-widest pl-2">Course Description</label>
                                        <textarea placeholder="Explain what students will learn..." className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white h-32 font-medium" onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} required />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-5 bg-secondary-action text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-secondary-action/20">Create Course</button>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Custom Course Form remains here as it is functional */}
            </AnimatePresence>

            {/* Finalized Functional Modals */}
            <UploadVideoModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                courses={courses}
                initialCourseId={selectedCourse?._id}
                onUploadComplete={fetchTeacherData}
            />

            <LiveClassPanel
                isOpen={showLiveModal}
                onClose={() => setShowLiveModal(false)}
                courses={courses}
            />

            <DoubtMeetingModal
                isOpen={showMeetingModal}
                onClose={() => setShowMeetingModal(false)}
                doubtId={selectedDoubt?._id}
                onComplete={fetchTeacherData}
            />

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.2); }
                input[type="datetime-local"]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.5; }
            `}</style>
        </div>
    );
}

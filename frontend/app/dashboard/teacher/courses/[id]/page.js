'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    Plus,
    Video,
    FileText,
    MoreVertical,
    Play,
    Trash2,
    GripVertical,
    CheckCircle,
    Eye,
    Edit3,
    ChevronDown,
    ChevronUp,
    Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function CourseDetail() {
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [expandedModules, setExpandedModules] = useState({});

    const [newModule, setNewModule] = useState({ title: '', order: 0 });
    const [newLesson, setNewLesson] = useState({
        title: '',
        videoUrl: '',
        pdfUrl: '',
        duration: '',
        isFree: false,
        order: 0
    });

    useEffect(() => {
        setMounted(true);
        if (user?.role !== 'teacher' || user?.status !== 'approved') {
            router.push('/dashboard');
            return;
        }
        fetchCourseDetails();
    }, [user, router, id]);

    const fetchCourseDetails = async () => {
        try {
            const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth').replace(/\/auth$/, '');
            const res = await axios.get(`${API_BASE_URL}/courses/${id}`);
            setCourse(res.data);
            // Expand all modules by default
            const expanded = {};
            res.data.modules.forEach(m => expanded[m._id] = true);
            setExpandedModules(expanded);
        } catch (error) {
            console.error('Error fetching course details:', error);
            toast.error('Failed to load course details');
        } finally {
            setLoading(false);
        }
    };

    const handleAddModule = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth').replace(/\/auth$/, '');
            await axios.post(`${API_BASE_URL}/courses/modules`, { ...newModule, courseId: id }, config);
            toast.success('Module added');
            setShowModuleModal(false);
            setNewModule({ title: '', order: 0 });
            fetchCourseDetails();
        } catch (error) {
            toast.error('Failed to add module');
        }
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth').replace(/\/auth$/, '');
            await axios.post(`${API_BASE_URL}/courses/lessons`, { ...newLesson, moduleId: selectedModuleId, courseId: id }, config);
            toast.success('Lesson added');
            setShowLessonModal(false);
            setNewLesson({ title: '', videoUrl: '', pdfUrl: '', duration: '', isFree: false, order: 0 });
            fetchCourseDetails();
        } catch (error) {
            toast.error('Failed to add lesson');
        }
    };

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    if (!mounted || loading) return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />

            <div className="pt-24 pb-20 container mx-auto px-4 md:px-6 max-w-6xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="flex-grow">
                        <button
                            onClick={() => router.push('/dashboard/teacher')}
                            className="flex items-center space-x-2 text-slate-500 font-bold hover:text-slate-900 transition-colors mb-4 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Dashboard</span>
                        </button>
                        <h1 className="text-4xl font-display font-black text-slate-900 leading-tight">
                            {course?.title}
                        </h1>
                        <div className="flex items-center space-x-4 mt-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                {course?.category}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowModuleModal(true)}
                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center space-x-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Module</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Content List */}
                    <div className="lg:col-span-2 space-y-6">
                        {course?.modules?.length > 0 ? (
                            course.modules.map((module) => (
                                <div key={module._id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                                    <div
                                        className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                        onClick={() => toggleModule(module._id)}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                                <Layout className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900">{module.title}</h3>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{module.lessons?.length || 0} Lessons</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedModuleId(module._id);
                                                    setShowLessonModal(true);
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                            {expandedModules[module._id] ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {expandedModules[module._id] && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-slate-50"
                                            >
                                                <div className="p-4 space-y-2">
                                                    {module.lessons?.length > 0 ? (
                                                        module.lessons.map((lesson, idx) => (
                                                            <div key={lesson._id} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-white hover:shadow-md transition-all rounded-2xl group border border-transparent hover:border-slate-100">
                                                                <div className="flex items-center space-x-4">
                                                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm">
                                                                        <Play className="w-3 h-3 fill-current" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LESSON {idx + 1}</div>
                                                                        <div className="font-bold text-slate-900 text-sm">{lesson.title}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-3">
                                                                    {lesson.pdfUrl && <FileText className="w-4 h-4 text-slate-300" />}
                                                                    <span className="text-[10px] font-black text-slate-400 uppercase">{lesson.duration}</span>
                                                                    <button className="p-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all">
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-8 text-slate-400 text-sm font-medium">No lessons in this module</div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                                <Layout className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <h3 className="text-xl font-black text-slate-900 mb-2">Build Your Curriculum</h3>
                                <p className="text-slate-500 max-w-xs mx-auto mb-8">Create modules to organize your lessons and provide a structured learning path.</p>
                                <button
                                    onClick={() => setShowModuleModal(true)}
                                    className="text-blue-600 font-black text-sm uppercase tracking-widest hover:underline"
                                >
                                    Add Your First Module
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
                            <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-6">Course Info</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-2xl font-black text-blue-400">₹{course?.discountedPrice || course?.price}</div>
                                    <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Current Price</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="text-xl font-bold">{course?.enrollmentCount || 0}</div>
                                    <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Total Students</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Module Modal */}
            <AnimatePresence>
                {showModuleModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModuleModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-3xl">
                            <h2 className="text-2xl font-display font-black text-slate-900 mb-8">Add <span className="text-blue-600">Module</span></h2>
                            <form onSubmit={handleAddModule} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Module Title</label>
                                    <input
                                        required
                                        value={newModule.title}
                                        onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                                        placeholder="e.g. Introduction to Calculus"
                                    />
                                </div>
                                <div className="pt-4 flex space-x-3">
                                    <button type="button" onClick={() => setShowModuleModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Cancel</button>
                                    <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100">Create Module</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Lesson Modal */}
            <AnimatePresence>
                {showLessonModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLessonModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-3xl">
                            <h2 className="text-2xl font-display font-black text-slate-900 mb-8">Add <span className="text-blue-600">Lesson</span></h2>
                            <form onSubmit={handleAddLesson} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Lesson Title</label>
                                    <input required value={newLesson.title} onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" placeholder="e.g. 1.1 What is Calculus?" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Video URL</label>
                                    <input required value={newLesson.videoUrl} onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" placeholder="YouTube or Cloudinary link" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Duration</label>
                                        <input value={newLesson.duration} onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" placeholder="10:00" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">PDF URL</label>
                                        <input value={newLesson.pdfUrl} onChange={(e) => setNewLesson({ ...newLesson, pdfUrl: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" placeholder="Notes link" />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 p-1">
                                    <input type="checkbox" id="isFree" checked={newLesson.isFree} onChange={(e) => setNewLesson({ ...newLesson, isFree: e.target.checked })} className="w-5 h-5 rounded-md border-slate-300 text-blue-600" />
                                    <label htmlFor="isFree" className="text-sm font-bold text-slate-600">Free Preview</label>
                                </div>
                                <div className="pt-4 flex space-x-3">
                                    <button type="button" onClick={() => setShowLessonModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Cancel</button>
                                    <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100">Add Lesson</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

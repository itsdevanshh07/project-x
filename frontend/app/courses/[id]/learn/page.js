'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Play, CheckCircle, ChevronLeft, ChevronRight, FileText, MessageSquare, Download, Loader2, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function LearningPage() {
    const { id } = useParams();
    const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isStudyMode, setIsStudyMode] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth').replace(/\/auth$/, '');
                const token = user?.token;
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

                const response = await axios.get(`${API_BASE_URL}/courses/${id}`, config);
                setCourse(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching course:', err);
                setError('Failed to load course content. Make sure you are enrolled.');
                setIsLoading(false);
            }
        };

        if (user) {
            fetchCourse();
        } else {
            router.push('/login');
        }
    }, [id, user, router]);

    const allLessons = course?.modules?.flatMap(m => m.lessons) || [];
    const activeLesson = allLessons[currentLessonIdx];

    const handleProgressUpdate = async (pct) => {
        if (!activeLesson || !user) return;
        try {
            const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth').replace(/\/auth$/, '');
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post(`${API_BASE_URL}/student/progress`, {
                courseId: id,
                lessonId: activeLesson._id,
                percentage: pct
            }, config);
        } catch (error) {
            console.error('Failed to update progress', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-brand-primary animate-spin mb-4" />
                <p className="text-text-muted font-bold uppercase tracking-widest text-xs">Loading Classroom...</p>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md bg-bg-card p-12 rounded-[3rem] border border-border-main shadow-2xl">
                    <h2 className="text-2xl font-black text-text-primary mb-4">Access Denied</h2>
                    <p className="text-text-secondary mb-8 font-medium">{error || 'Unable to load course'}</p>
                    <Link href="/dashboard" className="btn-primary px-8 py-3 flex items-center justify-center">
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isStudyMode ? 'bg-bg-section study-mode' : 'bg-bg-main'}`}>
            {/* Header */}
            <div className={`h-16 border-b border-border-main flex items-center justify-between px-6 shrink-0 relative z-50 transition-all duration-500 ${isStudyMode ? 'bg-bg-section border-transparent opacity-50 hover:opacity-100' : 'bg-bg-card shadow-lg'}`}>
                <Link href="/dashboard" className="flex items-center space-x-2 text-text-muted hover:text-text-primary transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-bold hidden md:inline">Dashboard</span>
                </Link>
                <div className="flex-1 text-center truncate px-10">
                    <h1 className={`font-bold truncate max-w-sm mx-auto transition-colors ${isStudyMode ? 'text-text-muted' : 'text-text-primary'}`}>{course.title}</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsStudyMode(!isStudyMode)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${isStudyMode ? 'bg-text-primary text-white border-transparent' : 'bg-transparent text-text-muted border-border-main hover:text-text-primary'}`}
                    >
                        {isStudyMode ? 'Exit Focus' : 'Focus Mode'}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Video Area */}
                <div className="flex-1 overflow-y-auto bg-black flex flex-col relative">
                    {activeLesson ? (
                        <>
                            <div className={`w-full bg-black relative group transition-all duration-500 ${isStudyMode ? 'h-full max-h-screen' : 'aspect-video max-h-[70vh]'}`}>
                                <video
                                    key={activeLesson._id}
                                    controls
                                    className="w-full h-full object-contain"
                                    onEnded={() => handleProgressUpdate(100)}
                                    poster={course.thumbnail}
                                >
                                    <source src={activeLesson.videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>

                            {!isStudyMode && (
                                <div className="p-8 bg-bg-main flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                                        <h2 className="text-2xl font-black text-text-primary">{activeLesson.title}</h2>
                                        <div className="flex items-center space-x-4">
                                            {activeLesson.pdfUrl && (
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth').replace(/\/auth$/, '');
                                                            const response = await axios.get(`${API_BASE_URL}/student/download-notes/${activeLesson._id}`, {
                                                                headers: { Authorization: `Bearer ${user.token}` },
                                                                responseType: 'blob'
                                                            });
                                                            const url = window.URL.createObjectURL(new Blob([response.data]));
                                                            const link = document.createElement('a');
                                                            link.href = url;
                                                            link.setAttribute('download', `${activeLesson.title}_Notes.pdf`);
                                                            document.body.appendChild(link);
                                                            link.click();
                                                        } catch (error) {
                                                            toast.error('Failed to download notes');
                                                        }
                                                    }}
                                                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-bg-card border border-border-main text-text-primary hover:border-brand-primary transition-all font-bold text-sm"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    <span>Notes PDF</span>
                                                </button>
                                            )}
                                            <button className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-bg-card border border-border-main text-text-primary hover:border-brand-primary transition-all font-bold text-sm">
                                                <MessageSquare className="w-4 h-4" />
                                                <span>Ask Doubt</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="max-w-3xl">
                                        <h4 className="text-xs font-black uppercase text-text-muted tracking-widest mb-4">Lesson Overview</h4>
                                        <p className="text-text-secondary font-medium leading-relaxed">
                                            You are currently watching "{activeLesson.title}". This lesson is part of the "{course.title}" batch.
                                            Ensure you complete the video and check the associated resources for better understanding.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-bg-main">
                            <Play className="w-20 h-20 text-bg-section mb-6" />
                            <h2 className="text-2xl font-black text-text-primary mb-2">No Content Available</h2>
                            <p className="text-text-muted">The instructor hasn't uploaded any lessons to this course yet.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar Curriculum */}
                {!isStudyMode && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 384, opacity: 1 }}
                        className="bg-bg-card border-l border-border-main overflow-y-auto shrink-0 hidden lg:block"
                    >
                        <div className="p-6 border-b border-border-main bg-bg-card sticky top-0 z-10">
                            <h3 className="text-text-primary font-black uppercase tracking-widest text-xs flex items-center">
                                <Layout className="w-4 h-4 mr-2 text-brand-primary" />
                                Course Content
                            </h3>
                        </div>
                        {course.modules?.map((module) => (
                            <div key={module._id} className="border-b border-border-main">
                                <div className="px-6 py-4 bg-bg-section">
                                    <h4 className="text-text-muted font-bold text-sm uppercase tracking-wide">{module.title}</h4>
                                </div>
                                {module.lessons?.map((lesson) => {
                                    const globalIdx = allLessons.findIndex(l => l._id === lesson._id);
                                    const isActive = currentLessonIdx === globalIdx;
                                    return (
                                        <button
                                            key={lesson._id}
                                            onClick={() => {
                                                setCurrentLessonIdx(globalIdx);
                                                handleProgressUpdate(Math.floor((globalIdx / allLessons.length) * 100));
                                            }}
                                            className={`w-full px-6 py-5 flex items-center space-x-4 hover:bg-bg-main transition-all text-left group ${isActive ? 'bg-brand-primary/5 border-l-4 border-brand-primary' : 'border-l-4 border-transparent'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-bg-main text-text-muted border border-border-main'}`}>
                                                <Play className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-bold truncate ${isActive ? 'text-brand-primary' : 'text-text-primary'}`}>{lesson.title}</p>
                                                <div className="flex items-center space-x-3 mt-1 text-[10px] text-text-muted font-black tracking-widest uppercase">
                                                    <span>{lesson.duration || '0:00'}</span>
                                                    {lesson.isFree && <span className="text-brand-secondary font-black">Free</span>}
                                                </div>
                                            </div>
                                            {isActive && <div className="animate-pulse w-2 h-2 rounded-full bg-brand-primary" />}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

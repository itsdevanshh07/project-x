'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Play, CheckCircle, ChevronLeft, ChevronRight, FileText, MessageSquare, Download, Loader2, Layout, Zap } from 'lucide-react';
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
            <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-[var(--brand-yellow)] animate-spin mb-4" />
                <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs">Loading Classroom...</p>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md bg-white p-12 rounded-[3rem] border border-[var(--border-light)] shadow-2xl">
                    <h2 className="text-2xl font-black text-[var(--brand-black)] mb-4">Access Denied</h2>
                    <p className="text-[var(--text-secondary)] mb-8 font-medium">{error || 'Unable to load course'}</p>
                    <Link href="/dashboard" className="btn-primary w-full">
                        <ChevronLeft className="w-5 h-5" />
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex flex-col bg-[var(--bg-main)]`}>
            {/* Header */}
            <div className={`h-20 border-b border-[var(--border-light)] flex items-center justify-between px-8 shrink-0 z-50 bg-white`}>
                <Link href="/dashboard" className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-[var(--brand-black)] transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-bold hidden md:inline">Back to Dashboard</span>
                </Link>
                <div className="flex-1 text-center truncate px-10">
                    <h1 className="font-display font-black text-[var(--brand-black)] truncate max-w-sm mx-auto">{course.title}</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="hidden sm:flex items-center space-x-2 bg-[var(--brand-yellow)]/10 px-4 py-2 rounded-full border border-[var(--brand-yellow)]/20">
                        <Zap className="w-4 h-4 text-[var(--brand-yellow)] fill-current" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-black)]">Learning Mode</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Video Area */}
                <div className="flex-1 overflow-y-auto flex flex-col bg-[var(--brand-charcoal)]">
                    {activeLesson ? (
                        <>
                            <div className="w-full bg-[var(--brand-black)] relative aspect-video shadow-2xl">
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

                            <div className="p-10 bg-[var(--bg-main)] flex-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                                    <div>
                                        <div className="text-[10px] font-black text-[var(--brand-yellow)] uppercase tracking-[0.2em] mb-2">Currently Playing</div>
                                        <h2 className="text-3xl font-display font-black text-[var(--brand-black)]">{activeLesson.title}</h2>
                                    </div>
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
                                                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white border border-[var(--border-light)] text-[var(--brand-black)] hover:border-[var(--brand-yellow)] transition-all font-bold text-sm shadow-sm"
                                            >
                                                <FileText className="w-4 h-4 text-[var(--brand-yellow)]" />
                                                <span>Download Notes</span>
                                            </button>
                                        )}
                                        <button className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-[var(--brand-black)] text-white hover:bg-[var(--brand-charcoal)] transition-all font-bold text-sm shadow-xl">
                                            <MessageSquare className="w-4 h-4 text-[var(--brand-yellow)]" />
                                            <span>Ask Doubt</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="max-w-4xl bg-white p-8 rounded-[2rem] border border-[var(--border-light)]">
                                    <h4 className="text-xs font-black uppercase text-[var(--text-muted)] tracking-widest mb-4">Lesson Description</h4>
                                    <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
                                        {activeLesson.description || `Welcome to this session on ${activeLesson.title}. In this lecture, we will cover the core concepts required for your upcoming exams. Make sure to take notes and participate in the doubt sessions.`}
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[var(--bg-main)]">
                            <Play className="w-20 h-20 text-[var(--border-light)] mb-6" />
                            <h2 className="text-2xl font-black text-[var(--brand-black)] mb-2">No Content Available</h2>
                            <p className="text-[var(--text-muted)]">The instructor hasn't uploaded any lessons yet.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar Curriculum */}
                <div className="w-96 bg-white border-l border-[var(--border-light)] overflow-y-auto shrink-0 hidden lg:block">
                    <div className="p-8 border-b border-[var(--border-light)] bg-white sticky top-0 z-10">
                        <h3 className="text-[var(--brand-black)] font-display font-black uppercase tracking-widest text-xs flex items-center">
                            <Layout className="w-4 h-4 mr-2 text-[var(--brand-yellow)]" />
                            Course Curriculum
                        </h3>
                    </div>
                    {course.modules?.map((module) => (
                        <div key={module._id} className="border-b border-[var(--border-light)]">
                            <div className="px-8 py-4 bg-[var(--bg-main)]">
                                <h4 className="text-[var(--brand-black)] font-black text-[10px] uppercase tracking-[0.2em]">{module.title}</h4>
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
                                        className={`w-full px-8 py-6 flex items-center space-x-4 hover:bg-[var(--bg-main)] transition-all text-left group ${isActive ? 'bg-[var(--brand-yellow)]/5 border-l-4 border-[var(--brand-yellow)]' : 'border-l-4 border-transparent'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'bg-[var(--brand-black)] text-[var(--brand-yellow)] shadow-xl' : 'bg-white text-[var(--text-muted)] border border-[var(--border-light)]'}`}>
                                            <Play className={`w-4 h-4 ${isActive ? 'fill-current' : ''}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-bold truncate ${isActive ? 'text-[var(--brand-black)]' : 'text-[var(--text-secondary)]'}`}>{lesson.title}</p>
                                            <div className="flex items-center space-x-3 mt-1 text-[10px] text-[var(--text-muted)] font-black tracking-widest uppercase">
                                                <span>{lesson.duration || 'Video'}</span>
                                                {lesson.isFree && <span className="text-[var(--brand-yellow)] font-black">Free</span>}
                                            </div>
                                        </div>
                                        {isActive && <div className="w-2 h-2 rounded-full bg-[var(--brand-yellow)] shadow-[0_0_10px_var(--brand-yellow)]" />}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

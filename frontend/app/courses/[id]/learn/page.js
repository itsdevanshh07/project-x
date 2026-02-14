'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Play,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    FileText,
    MessageSquare,
    Download,
    Loader2,
    Layout,
    Lock,
    Sparkles,
    Focus,
    ArrowLeft,
    CheckCircle2,
    Clock,
    Layers,
    Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import MuxPlayer from '@mux/mux-player-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LearningPage() {
    const { id } = useParams();
    const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
    const [content, setContent] = useState(null); // { course, modules: [{ lessons }] }
    const [isLoading, setIsLoading] = useState(true);
    const [isStudyMode, setIsStudyMode] = useState(false);
    const [showDoubtModal, setShowDoubtModal] = useState(false);
    const [doubtText, setDoubtText] = useState('');
    const [isSubmittingDoubt, setIsSubmittingDoubt] = useState(false);

    const { user } = useSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchContent();
    }, [id, user]);

    const fetchContent = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const response = await axios.get(`${API_BASE_URL}/student/courses/${id}/content`, config);
            setContent(response.data);
            setIsLoading(false);
        } catch (err) {
            console.error('Content Load Error:', err);
            toast.error('Course content unavailable. Please try again.');
            setIsLoading(false);
        }
    };

    const allLessons = content?.modules?.flatMap(m => m.lessons) || [];
    const activeLesson = allLessons[currentLessonIdx];

    const handleProgressUpdate = async (pct) => {
        if (!activeLesson || !user) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_BASE_URL}/student/progress`, {
                courseId: id,
                lessonId: activeLesson._id,
                percentage: pct
            }, config);
        } catch (error) {
            console.error('Progress sync failure:', error);
        }
    };

    const handleDownloadNotes = async () => {
        if (!activeLesson?.pdfUrl) return;
        toast.info('Preparing your notes...');
        try {
            const response = await axios.get(`${API_BASE_URL}/student/download-notes/${activeLesson._id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${activeLesson.title}_Protected_Notes.pdf`);
            document.body.appendChild(link);
            link.click();
            toast.success('Notes downloaded successfully.');
        } catch (error) {
            toast.error('Failed to download notes.');
        }
    };

    const handleSubmitDoubt = async () => {
        if (!doubtText.trim()) return;
        setIsSubmittingDoubt(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_BASE_URL}/student/doubts`, {
                courseId: id,
                lessonId: activeLesson?._id,
                question: doubtText
            }, config);
            toast.success('Your question has been sent to the teacher.');
            setDoubtText('');
            setShowDoubtModal(false);
        } catch (error) {
            toast.error('Failed to send question.');
        } finally {
            setIsSubmittingDoubt(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="w-20 h-20 border-2 border-secondary-action/20 rounded-full animate-pulse" />
                    <Loader2 className="w-10 h-10 text-secondary-action animate-spin absolute inset-0 m-auto" />
                </div>
                <p className="mt-8 text-[10px] font-black text-surface-light/20 uppercase tracking-[0.3em]">Loading Course Content...</p>
            </div>
        );
    }

    if (!content) {
        return (
            <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 text-center">
                <div className="glass-card p-12 max-w-md">
                    <Lock className="w-12 h-12 text-red-500/50 mx-auto mb-6" />
                    <h2 className="text-2xl font-display font-black text-white mb-4">Access Denied</h2>
                    <p className="text-surface-light/40 mb-8 font-medium">Please ensure you are enrolled in this course to view its content.</p>
                    <Link href="/dashboard/student" className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">
                        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-[#0A0A0B] flex flex-col transition-all duration-700 ${isStudyMode ? 'grayscale-0' : ''}`}>
            {/* Elite Learning Header */}
            <header className={`h-20 border-b border-white/5 flex items-center justify-between px-8 shrink-0 relative z-[100] transition-all duration-500 ${isStudyMode ? 'bg-[#0A0A0B]/80 backdrop-blur-xl translate-y-[-100%] opacity-0 hover:translate-y-0 hover:opacity-100' : 'bg-[#0A0A0B]/50 backdrop-blur-md'}`}>
                <div className="flex items-center gap-6">
                    <Link href="/dashboard/student" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-surface-light/40 hover:text-white hover:bg-white/10 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="h-6 w-[1px] bg-white/10" />
                    <div>
                        <p className="text-[10px] font-black text-secondary-action uppercase tracking-widest mb-0.5">Course</p>
                        <h1 className="text-sm font-black text-white truncate max-w-[200px] md:max-w-md uppercase tracking-tight">{content.course.title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsStudyMode(!isStudyMode)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${isStudyMode ? 'bg-secondary-action text-white' : 'bg-white/5 text-surface-light/40 hover:text-white hover:bg-white/10 border border-white/5'}`}
                    >
                        <Focus className="w-3.5 h-3.5" /> {isStudyMode ? 'Focus Mode On' : 'Enable Focus Mode'}
                    </button>
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">CDN Synced</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Immersive Player Area */}
                <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-black">
                    <div className={`w-full relative transition-all duration-1000 ease-in-out ${isStudyMode ? 'h-full' : 'aspect-video'}`}>
                        {activeLesson ? (
                            <div className="w-full h-full">
                                {activeLesson.muxPlaybackId ? (
                                    <MuxPlayer
                                        playbackId={activeLesson.muxPlaybackId}
                                        metadata={{
                                            video_title: activeLesson.title,
                                            course_title: content.course.title,
                                        }}
                                        accentColor="#6366f1"
                                        primaryColor="#ffffff"
                                        style={{ height: '100%', width: '100%' }}
                                        onEnded={() => handleProgressUpdate(100)}
                                    />
                                ) : (
                                    <video
                                        src={activeLesson.videoUrl}
                                        controls
                                        className="w-full h-full"
                                        onEnded={() => handleProgressUpdate(100)}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-6 bg-[#0F0F10]">
                                <Layers className="w-20 h-20 text-white/5 animate-bounce" />
                                <div>
                                    <h3 className="text-xl font-display font-black text-white uppercase tracking-widest">Lesson Unavailable</h3>
                                    <p className="text-xs text-surface-light/20 font-medium">Course materials are not yet available for this lesson.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {!isStudyMode && content && activeLesson && (
                        <div className="p-12 max-w-6xl mx-auto w-full space-y-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="px-3 py-1 rounded-lg bg-secondary-action/10 border border-secondary-action/20 text-[9px] font-black text-secondary-action uppercase tracking-widest">
                                            Current Lesson
                                        </div>
                                        <span className="text-[10px] text-surface-light/20 font-black uppercase tracking-widest flex items-center gap-2">
                                            <Clock className="w-3 h-3" /> {activeLesson.duration || '00:00'}
                                        </span>
                                    </div>
                                    <h2 className="text-4xl font-display font-black text-white tracking-tight">{activeLesson.title}</h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    {activeLesson.pdfUrl && (
                                        <button
                                            onClick={handleDownloadNotes}
                                            className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all shadow-xl"
                                        >
                                            <Download className="w-4 h-4" /> Download Notes
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowDoubtModal(true)}
                                        className="px-6 py-4 rounded-2xl bg-secondary-action text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-secondary-action/20"
                                    >
                                        <MessageSquare className="w-4 h-4" /> Ask a Doubt
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                <div className="lg:col-span-2 space-y-8">
                                    <section className="space-y-6">
                                        <h4 className="text-[10px] font-black text-surface-light/20 uppercase tracking-[0.3em]">Lesson Description</h4>
                                        <p className="text-surface-light/60 font-medium leading-[2] text-lg italic">
                                            {activeLesson.content || "No description available for this lesson. Please watch the video for full details."}
                                        </p>
                                    </section>
                                </div>
                                <div className="space-y-6">
                                    <div className="glass-card p-8 bg-gradient-to-br from-secondary-action/5 to-transparent border-secondary-action/10">
                                        <Sparkles className="w-6 h-6 text-secondary-action mb-4" />
                                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Learning Milestone</h4>
                                        <p className="text-xs text-surface-light/40 leading-relaxed font-bold italic">
                                            Completing this lesson helps you master the course. Take notes carefully.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                {/* Intelligent Curriculum Drawer */}
                {!isStudyMode && (
                    <aside className="w-[450px] bg-[#0A0A0B] border-l border-white/5 flex flex-col hidden xl:flex">
                        <div className="p-8 border-b border-white/5 bg-[#0A0A0B]/80 sticky top-0 z-10">
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                                <Layers className="w-4 h-4 text-secondary-action" /> Course Content
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {content.modules.map((module, mIdx) => (
                                <div key={module._id} className="border-b border-white/5">
                                    <div className="px-8 py-5 bg-white/[0.02] flex items-center justify-between">
                                        <span className="text-[10px] font-black text-surface-light/20 uppercase tracking-widest">Module {mIdx + 1}: {module.title}</span>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/30" />
                                    </div>
                                    <div className="divide-y divide-white/5">
                                        {module.lessons.map((lesson) => {
                                            const globalIdx = allLessons.findIndex(l => l._id === lesson._id);
                                            const isActive = currentLessonIdx === globalIdx;
                                            return (
                                                <button
                                                    key={lesson._id}
                                                    onClick={() => {
                                                        setCurrentLessonIdx(globalIdx);
                                                        handleProgressUpdate(Math.floor((globalIdx / allLessons.length) * 100));
                                                    }}
                                                    className={`w-full px-8 py-6 flex items-start gap-5 hover:bg-white/5 transition-all text-left relative group ${isActive ? 'bg-secondary-action/5' : ''}`}
                                                >
                                                    {isActive && <motion.div layoutId="curriculum-active" className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-action shadow-[0_0_15px_rgba(99,102,241,0.5)]" />}
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${isActive ? 'bg-secondary-action border-secondary-action text-white shadow-lg' : 'bg-white/5 border-white/10 text-surface-light/20 group-hover:border-white/30'}`}>
                                                        {isActive ? <Play className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-bold leading-tight mb-2 ${isActive ? 'text-white' : 'text-surface-light/40 group-hover:text-surface-light/60'}`}>{lesson.title}</p>
                                                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-surface-light/20">
                                                            <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {lesson.duration || '00:00'}</span>
                                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                                            {lesson.muxPlaybackId ? "CDN Optimized" : "Standard Stream"}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                )}
            </div>

            {/* Resolution Enquiry Modal */}
            <AnimatePresence>
                {showDoubtModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                            onClick={() => setShowDoubtModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="glass-card w-full max-w-xl p-10 relative z-10 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                <MessageSquare className="w-32 h-32 text-secondary-action" />
                            </div>
                            <h2 className="text-2xl font-display font-black text-white mb-8">Ask a <span className="text-secondary-action">Doubt</span></h2>
                            <div className="space-y-6">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-[10px] font-black text-surface-light/20 uppercase tracking-widest mb-1">Target Lesson</p>
                                    <p className="text-xs font-bold text-white italic">"{activeLesson?.title}"</p>
                                </div>
                                <textarea
                                    placeholder="Type your question here..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white h-48 focus:ring-2 focus:ring-secondary-action/30 outline-none transition-all placeholder:text-surface-light/10 font-medium"
                                    value={doubtText}
                                    onChange={(e) => setDoubtText(e.target.value)}
                                />
                                <button
                                    onClick={handleSubmitDoubt}
                                    disabled={isSubmittingDoubt}
                                    className="w-full py-5 bg-secondary-action text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-secondary-action/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {isSubmittingDoubt ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Submit Question
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.2); }
                .study-mode video { cursor: none; }
            `}</style>
        </div>
    );
}

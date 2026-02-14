'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getMyCourses, getStudentStats, getLiveClasses } from '@/slices/studentSlice';
import {
    BookOpen,
    PlayCircle,
    Clock,
    Calendar,
    ArrowRight,
    Loader2,
    Star,
    CheckCircle2,
    Sparkles,
    Library,
    Trophy,
    Target,
    Zap,
    Video
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentDashboard() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);
    const { myCourses, stats, liveClasses, isLoading } = useSelector((state) => state.student);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!user) {
            router.push('/login');
            return;
        }
        dispatch(getMyCourses());
        dispatch(getStudentStats());
        dispatch(getLiveClasses());
    }, [dispatch, user, router]);

    if (!mounted || !user) {
        return (
            <div className="flex items-center justify-center py-32 bg-[#0A0A0B] min-h-screen">
                <Loader2 className="w-12 h-12 text-secondary-action animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20 max-w-7xl mx-auto px-6">
            {/* Elite Academic Welcome */}
            <header className="relative p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-secondary-action/5 border border-white/5 overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-secondary-action/10 blur-[60px] md:blur-[100px] -mr-32 md:-mr-48 -mt-32 md:-mt-48 rounded-full" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 md:gap-12">
                    <div className="space-y-4 md:space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/5 border border-white/10"
                        >
                            <Sparkles className="w-3 md:w-3.5 h-3 md:h-3.5 text-secondary-action" />
                            <span className="text-[8px] md:text-[10px] font-black text-secondary-action uppercase tracking-[0.3em]">Verification Complete</span>
                        </motion.div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-white tracking-tight leading-tight md:leading-none">
                            Greetings, <span className="text-secondary-action font-black">{user.fullName.split(' ')[0]}.</span>
                        </h1>
                        <p className="text-surface-light/40 font-medium max-w-md italic border-l-2 border-secondary-action/30 pl-4 md:pl-6 text-sm md:text-lg">
                            "The pursuit of knowledge is the blueprint for future excellence."
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-12 pt-6 md:pt-0 border-t sm:border-t-0 border-white/5">
                        <div className="text-left sm:text-right group-hover:translate-x-[-10px] transition-transform duration-700">
                            <p className="text-[8px] md:text-[10px] font-black text-surface-light/20 uppercase tracking-[0.3em] mb-2 md:mb-4">Academic Tier</p>
                            <p className="text-xl md:text-3xl font-display font-black text-white flex items-center gap-3 sm:justify-end">
                                <Trophy className="w-5 md:w-6 h-5 md:h-6 text-secondary-action" />
                                {stats?.tier || 'Tier A'}
                            </p>
                        </div>
                        <div className="w-[1px] h-12 md:h-16 bg-white/10 hidden sm:block" />
                        <div className="text-left sm:text-right group-hover:translate-x-[-10px] transition-transform duration-700 delay-100">
                            <p className="text-[8px] md:text-[10px] font-black text-surface-light/20 uppercase tracking-[0.3em] mb-2 md:mb-4">Aggregate Accuracy</p>
                            <p className="text-xl md:text-3xl font-display font-black text-white">{stats?.aggregateScore || '84.2%'}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Performance Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {[
                    { label: 'Active Programs', value: stats?.activePrograms || 0, icon: BookOpen, color: 'text-indigo-400', progress: 75 },
                    { label: 'Intellectual Hours', value: stats?.intellectualHours || '0.0', icon: Clock, color: 'text-secondary-action', sub: 'Calculated' },
                    { label: 'Conceptual Units', value: stats?.conceptualUnits || 0, icon: Zap, color: 'text-emerald-400', sub: 'Synced' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 md:p-10 group hover:border-white/10 transition-all duration-700 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] -mr-12 -mt-12 rounded-full group-hover:bg-secondary-action/5 transition-colors" />
                        <div className="flex items-center justify-between mb-8 md:mb-10">
                            <div className={`p-3 md:p-4 rounded-2xl bg-white/5 border border-white/5 ${stat.color} group-hover:scale-110 transition-all duration-500 shadow-2xl`}>
                                <stat.icon className="w-5 md:w-6 h-5 md:h-6" />
                            </div>
                            <div className="w-2 h-2 rounded-full bg-white/10" />
                        </div>
                        <h3 className="text-[10px] font-black text-surface-light/20 uppercase tracking-[0.3em] mb-3">{stat.label}</h3>
                        <div className="flex items-baseline gap-3">
                            <p className="text-3xl md:text-4xl font-display font-black text-white tracking-tight">{stat.value}</p>
                            {stat.sub && <span className="text-[8px] md:text-[10px] font-black text-surface-light/10 uppercase tracking-widest">{stat.sub}</span>}
                        </div>
                        {stat.progress && (
                            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/5">
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stat.progress}%` }}
                                        className="h-full bg-secondary-action rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                    />
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Core Learning Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Curriculum Journey */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="flex items-center justify-between border-b border-white/5 pb-8">
                        <div className="flex items-center gap-4">
                            <Target className="w-6 h-6 text-secondary-action" />
                            <h2 className="text-3xl font-display font-black text-white tracking-tight uppercase">My Courses</h2>
                        </div>
                        <Link href="/dashboard/student/courses" className="text-[10px] font-black text-surface-light/40 hover:text-white transition-all uppercase tracking-[0.2em] px-6 py-3 bg-white/5 rounded-2xl border border-white/5">
                            Manage All Courses
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="py-32 glass-card flex flex-col items-center justify-center space-y-6 border-dashed border-white/10">
                            <Loader2 className="w-10 h-10 animate-spin text-secondary-action" />
                            <p className="text-[10px] font-black text-surface-light/20 uppercase tracking-[0.4em]">Loading Your Courses...</p>
                        </div>
                    ) : myCourses.length > 0 ? (
                        <div className="grid gap-8">
                            {myCourses.slice(0, 4).map((course, idx) => (
                                <motion.div
                                    key={course._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group glass-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-10 hover:border-secondary-action/20 transition-all duration-700 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all">
                                        <Sparkles className="w-5 h-5 text-secondary-action/20" />
                                    </div>

                                    <div className="w-full md:w-40 h-32 md:h-28 rounded-2xl md:rounded-3xl bg-white/5 overflow-hidden shrink-0 border border-white/10 group-hover:border-secondary-action/30 transition-all duration-700 relative">
                                        <img src={course.thumbnail} alt="" className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] to-transparent opacity-60" />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-4 md:space-y-5 w-full">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="min-w-0">
                                                <h4 className="text-lg md:text-xl font-black text-white truncate group-hover:text-secondary-action transition-colors mb-1">{course.title}</h4>
                                                <p className="text-[8px] md:text-[10px] font-black text-surface-light/20 uppercase tracking-widest italic">{course.instructor?.fullName || 'Senior Faculty'}</p>
                                            </div>
                                            <span className="shrink-0 text-[8px] md:text-[10px] font-black text-secondary-action uppercase tracking-widest bg-secondary-action/10 px-2.5 py-1 rounded-lg">
                                                {course.progress || 0}%
                                            </span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${course.progress || 0}%` }}
                                                className="h-full bg-gradient-to-r from-secondary-action to-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                                            />
                                        </div>
                                    </div>
                                    <Link
                                        href={`/courses/${course._id}/learn`}
                                        className="w-full md:w-16 h-14 md:h-16 bg-secondary-action/5 rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-secondary-action hover:bg-secondary-action hover:text-white transition-all shadow-2xl group-hover:scale-110 mt-4 md:mt-0"
                                    >
                                        <PlayCircle className="w-6 h-6 md:w-7 md:h-7" />
                                        <span className="md:hidden ml-3 font-black text-[10px] uppercase tracking-[0.2em]">Resume Journey</span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 glass-card border-dashed border-white/10 space-y-8">
                            <Library className="w-16 h-16 text-white/5 mx-auto" />
                            <div className="space-y-3">
                                <h3 className="text-xl font-display font-black text-white uppercase tracking-widest">No Courses Found</h3>
                                <p className="text-xs text-surface-light/20 font-medium max-w-xs mx-auto">You haven't enrolled in any courses yet.</p>
                            </div>
                            <Link href="/courses" className="inline-flex items-center gap-3 px-10 py-4 bg-secondary-action text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-secondary-action/20 transition-all">
                                Explore Courses <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Academic Schedule Sidebar */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="flex items-center gap-4 px-4 h-[3.25rem]">
                        <Video className="w-6 h-6 text-secondary-action" />
                        <h2 className="text-2xl font-display font-black text-white tracking-tight uppercase">Live Classes</h2>
                    </div>

                    <div className="glass-card p-6 md:p-10 space-y-8 md:space-y-10 relative overflow-hidden group border border-white/5">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-secondary-action/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />

                        {liveClasses.length > 0 ? liveClasses.map((item, i) => (
                            <div key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-8 relative group/item">
                                <div className="flex flex-row sm:flex-col items-center sm:items-start gap-3 shrink-0">
                                    <span className="text-[10px] font-black text-surface-light/20 min-w-[5rem] sm:w-20 uppercase tracking-widest pt-1">
                                        {new Date(item.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="space-y-2 md:space-y-3 relative pb-8 md:pb-10 border-l border-white/5 pl-6 md:pl-8 sm:ml-[-1px]">
                                    <div className={`absolute -left-1 top-2 w-2 h-2 rounded-full ${item.status === 'live' ? 'bg-red-500 animate-pulse' : 'bg-secondary-action'} shadow-[0_0_15px_currentColor] group-hover/item:scale-125 transition-transform`} />
                                    <h5 className="text-sm md:text-base font-black text-white group-hover/item:text-secondary-action transition-colors leading-tight">{item.title}</h5>
                                    <div className="flex items-center gap-3">
                                        <span className="inline-block text-[8px] font-black uppercase tracking-[0.2em] text-surface-light/30 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                                            {item.course?.title || 'General'}
                                        </span>
                                        {item.status === 'live' && (
                                            <span className="text-[8px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1">
                                                <div className="w-1 h-1 rounded-full bg-red-500" /> Live Now
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => router.push(`/live/${item._id}`)}
                                        className="mt-3 md:mt-4 text-[9px] font-black text-secondary-action uppercase tracking-[0.3em] flex items-center gap-2 group-hover/item:gap-4 transition-all"
                                    >
                                        Join Class <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center space-y-4">
                                <Video className="w-10 h-10 text-white/5 mx-auto" />
                                <p className="text-[10px] font-black text-surface-light/10 uppercase tracking-[0.3em]">No Live Classes Scheduled</p>
                            </div>
                        )}

                        <button className="w-full py-5 rounded-2xl bg-white/5 text-surface-light/40 text-[10px] font-black uppercase tracking-[0.4em] border border-white/5 hover:bg-white/10 hover:text-white transition-all shadow-2xl">
                            View Full Schedule
                        </button>
                    </div>

                    {/* Quick Support Card */}
                    <div className="glass-card p-10 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/10 space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400">
                            <Target className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Academic Support</h4>
                        <p className="text-xs text-surface-light/40 font-bold leading-[1.8] italic">
                            Get guidance on your learning path with 1-on-1 sessions from senior teachers.
                        </p>
                        <button className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-3 hover:gap-5 transition-all">
                            Book Session <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
            `}</style>
        </div>
    );
}

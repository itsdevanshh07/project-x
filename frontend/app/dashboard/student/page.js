'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getMyCourses } from '@/slices/studentSlice';
import { BookOpen, PlayCircle, Clock, Calendar, ArrowRight, Loader2, Star, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);
    const { myCourses, isLoading } = useSelector((state) => state.student);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!user) {
            router.push('/login');
            return;
        }
        dispatch(getMyCourses());
    }, [dispatch, user, router]);

    if (!mounted || !user) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-foreground animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Academic Welcome */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
                <div className="space-y-2">
                    <span className="text-[10px] font-bold text-accent-gold uppercase tracking-[0.2em]">Academic Session 2026-27</span>
                    <h1 className="text-3xl font-display font-bold text-foreground">
                        Greetings, {user.fullName.split(' ')[0]}.
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">Continue your structured learning journey today.</p>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Current Progress</p>
                        <p className="text-lg font-bold text-foreground">A- Level</p>
                    </div>
                    <div className="h-10 w-[1px] bg-border" />
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Assessments</p>
                        <p className="text-lg font-bold text-foreground">84% Avg.</p>
                    </div>
                </div>
            </header>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border p-6 rounded-xl space-y-4">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-[#1E3A8A] dark:text-[#A5B4FC]">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-foreground">Active Programs</h3>
                        <p className="text-2xl font-display font-bold text-foreground">{myCourses.length}</p>
                    </div>
                    <div className="pt-2">
                        <div className="h-1 w-full bg-muted rounded-full">
                            <div className="h-1 bg-[#1E3A8A] dark:bg-[#A5B4FC] rounded-full w-[65%]" />
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border p-6 rounded-xl space-y-4">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-accent-gold">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-foreground">Study Hours</h3>
                        <p className="text-2xl font-display font-bold text-foreground">124.5 <span className="text-xs text-muted-foreground font-medium uppercase">Hrs</span></p>
                    </div>
                    <div className="pt-2">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">+12.4% From last month</p>
                    </div>
                </div>

                <div className="bg-card border border-border p-6 rounded-xl space-y-4">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-foreground">Lessons Completed</h3>
                        <p className="text-2xl font-display font-bold text-foreground">42 <span className="text-xs text-muted-foreground font-medium uppercase">Units</span></p>
                    </div>
                    <div className="pt-2">
                        <Link href="/dashboard/student/reports" className="text-[10px] text-[#1E3A8A] dark:text-[#A5B4FC] font-bold uppercase tracking-widest hover:underline underline-offset-4">View Full Report</Link>
                    </div>
                </div>
            </div>

            {/* Secondary Content: Study Focus */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Continuing Studies */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-display font-bold text-foreground">Continuing Studies</h2>
                        <Link href="/dashboard/student/courses" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">All Enrolled</Link>
                    </div>

                    {isLoading ? (
                        <div className="py-20 flex justify-center border border-dashed border-border rounded-xl">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : myCourses.length > 0 ? (
                        <div className="space-y-4">
                            {myCourses.slice(0, 3).map((course) => (
                                <div key={course._id} className="group bg-card border border-border p-5 rounded-xl flex items-center gap-6 hover:shadow-md transition-all">
                                    <div className="w-24 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
                                        <img src={course.thumbnail} alt="" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-foreground truncate">{course.title}</h4>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <div className="flex-1 h-1 bg-muted rounded-full">
                                                <div className="h-1 bg-accent-gold rounded-full" style={{ width: `${course.progress || 0}%` }} />
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground">{course.progress || 0}%</span>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/courses/${course._id}/learn`}
                                        className="w-10 h-10 border border-border rounded-lg flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-all"
                                    >
                                        <PlayCircle className="w-5 h-5" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border border-dashed border-border rounded-xl space-y-4">
                            <Library className="w-10 h-10 mx-auto opacity-10" />
                            <p className="text-sm text-muted-foreground font-medium">No active program found.</p>
                            <Link href="/courses" className="btn-outline !py-2 !px-4 !text-[10px] !uppercase">Browse Curriculum</Link>
                        </div>
                    )}
                </div>

                {/* Academic Calendar / Schedule */}
                <div className="space-y-6">
                    <h2 className="text-xl font-display font-bold text-foreground">Schedule</h2>
                    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                        {[
                            { time: '10:00 AM', title: 'Mathematics: Calculus II', type: 'Live Class', color: 'text-accent-gold' },
                            { time: '02:00 PM', title: 'Physics: Thermodynamics', type: 'Self Study', color: 'text-slate-400' },
                            { time: '04:30 PM', title: 'Group Discussion', type: 'Seminar', color: 'text-green-600' }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <span className="text-[10px] font-bold text-muted-foreground w-16 pt-1">{item.time}</span>
                                <div className="space-y-1">
                                    <h5 className="text-xs font-bold text-foreground leading-tight">{item.title}</h5>
                                    <p className={`text-[9px] font-bold uppercase tracking-widest ${item.color}`}>{item.type}</p>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-3 rounded-lg bg-muted text-foreground text-[10px] font-bold uppercase tracking-widest border border-border hover:bg-background transition-all mt-4">
                            Full Calendar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

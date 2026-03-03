'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyCourses } from '@/slices/studentSlice';
import { BookOpen, PlayCircle, Loader2, Library, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function StudentCourses() {
    const dispatch = useDispatch();
    const { myCourses, isLoading } = useSelector((state) => state.student);

    useEffect(() => {
        dispatch(getMyCourses());
    }, [dispatch]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-12 h-12 text-secondary-action animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-display font-black text-white tracking-tight uppercase">Academic Courses</h1>
                    <p className="text-surface-light/40 text-sm mt-2 font-medium tracking-wide">Manage and access your enrolled learning programs.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-secondary-action uppercase tracking-[0.2em]">
                        {myCourses.length} Active Courses
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {myCourses.map((course, idx) => (
                    <motion.div
                        key={course._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card group hover:border-secondary-action/20 transition-all duration-500 overflow-hidden"
                    >
                        <div className="aspect-video relative overflow-hidden bg-white/5">
                            <img src={course.thumbnail} alt="" className="w-full h-full object-cover transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                                <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">{course.category}</span>
                                <div className="text-right">
                                    <div className="text-xl font-black text-white">{course.progress || 0}%</div>
                                    <div className="text-[7px] font-black text-secondary-action uppercase tracking-[0.3em]">Completed</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <h4 className="text-xl font-black text-white group-hover:text-secondary-action transition-colors truncate">{course.title}</h4>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${course.progress || 0}%` }}
                                    className="h-full bg-secondary-action shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                />
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <p className="text-[9px] font-black text-surface-light/20 uppercase tracking-widest">{course.instructor?.fullName || 'Senior Faculty'}</p>
                                <Link
                                    href={`/courses/${course._id}/learn`}
                                    className="px-6 py-3 bg-secondary-action text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-secondary-action/20"
                                >
                                    Continue Learning
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {myCourses.length === 0 && (
                    <div className="col-span-full py-40 glass-card border-dashed border-white/10 flex flex-col items-center justify-center space-y-8">
                        <Library className="w-16 h-16 text-white/5" />
                        <div className="text-center">
                            <h3 className="text-2xl font-display font-black text-white uppercase tracking-widest">No Active Courses</h3>
                            <p className="text-sm text-surface-light/20 mt-2">Start your journey by exploring our available courses.</p>
                        </div>
                        <Link href="/courses" className="px-10 py-4 bg-secondary-action text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-2xl hover:shadow-secondary-action/20 transition-all">
                            Browse All Courses
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

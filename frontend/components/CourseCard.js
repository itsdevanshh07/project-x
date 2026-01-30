"use client";
import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Clock, Users, Star } from 'lucide-react';
import Link from 'next/link';

const CourseCard = ({ course, index }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="relative group h-full"
        >
            <Link href={`/courses/${course._id}`}>
                <div className="glass-card p-6 h-full flex flex-col gap-4 group-hover:border-secondary-action/50 transition-colors duration-500 overflow-hidden">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-[radial-gradient(circle_at_var(--x)_var(--y),#6366F1_0%,transparent_70%)] pointer-events-none"
                        style={{ '--x': `${(x.get() + 0.5) * 100}%`, '--y': `${(y.get() + 0.5) * 100}%` }}
                    />

                    <div className="relative h-48 rounded-xl overflow-hidden mb-2">
                        <img
                            src={course.thumbnail || "/placeholder-course.jpg"}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-bg/80 to-transparent" />
                        <div className="absolute top-3 right-3 bg-accent-highlight text-primary-bg px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {course.category}
                        </div>
                    </div>

                    <div className="flex-1 space-y-3">
                        <h3 className="text-xl font-bold text-white group-hover:text-secondary-action transition-colors">
                            {course.title}
                        </h3>
                        <p className="text-sm text-surface-light/50 line-clamp-2">
                            {course.description}
                        </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-[10px] text-surface-light/40 uppercase tracking-widest font-bold">
                            <span className="flex items-center gap-1.5 font-bold">
                                <Clock className="w-3 h-3 text-secondary-action" />
                                {course.duration || "12 Weeks"}
                            </span>
                            <span className="flex items-center gap-1.5 font-bold">
                                <Users className="w-3 h-3 text-secondary-action" />
                                {course.enrolledCount || "2.4k"}
                            </span>
                        </div>
                        <div className="text-accent-highlight font-bold">
                            ₹{course.price}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default CourseCard;

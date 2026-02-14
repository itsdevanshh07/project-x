'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Link, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoubtMeetingModal = ({ isOpen, onClose, doubtId, onComplete }) => {
    const [meetingLink, setMeetingLink] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleSubmit = async () => {
        if (!meetingLink) {
            toast.error('Please enter a meeting link');
            return;
        }

        setIsLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/mux/doubt-meeting`, {
                doubtId,
                meetingLink
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setIsDone(true);
            toast.success('Meeting link shared with the student!');
            setTimeout(() => {
                onComplete();
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Doubt Meeting Error:', err);
            toast.error('Failed to save meeting link');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-primary-bg/80 backdrop-blur-xl"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-lg glass-card p-8"
                >
                    <button onClick={onClose} className="absolute top-6 right-6 text-surface-light/40 hover:text-white">
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-secondary-action/20 rounded-2xl border border-secondary-action/30 text-secondary-action">
                            <Video size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Schedule Doubt Session</h2>
                            <p className="text-[10px] text-surface-light/40 uppercase font-black tracking-widest mt-1">Direct Academic Intervention</p>
                        </div>
                    </div>

                    {!isDone ? (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-light/40 uppercase tracking-widest">Meeting Platform Link</label>
                                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-4 group focus-within:border-secondary-action/50 transition-all">
                                    <Link size={18} className="text-surface-light/20 group-focus-within:text-secondary-action transition-colors" />
                                    <input
                                        type="url"
                                        value={meetingLink}
                                        onChange={(e) => setMeetingLink(e.target.value)}
                                        placeholder="Paste Zoom, Google Meet, or Teams URL"
                                        className="bg-transparent flex-1 text-white font-medium outline-none placeholder:text-surface-light/10"
                                    />
                                </div>
                                <p className="text-[9px] text-surface-light/20 ml-1">The student will receive a notification with this direct link.</p>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full py-4 bg-secondary-action text-white rounded-xl font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-secondary-action/20 flex items-center justify-center gap-3"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : 'Deploy Meeting Link'}
                            </button>
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center gap-4">
                            <CheckCircle2 className="text-emerald-500 w-16 h-16 animate-bounce" />
                            <p className="text-white font-bold tracking-tight">Link Successfully Distributed</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DoubtMeetingModal;

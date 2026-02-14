'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Copy, Check, ExternalLink, Shield, MonitorPlay, Loader2, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import MuxPlayer from '@mux/mux-player-react';

const LiveClassPanel = ({ isOpen, onClose, courses }) => {
    const [title, setTitle] = useState('');
    const [courseId, setCourseId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [liveData, setLiveData] = useState(null);
    const [copiedKey, setCopiedKey] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState(false);

    const handleCreateStream = async () => {
        if (!title || !courseId) {
            toast.error('Please name your class and select a course');
            return;
        }

        setIsLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/mux/live`, {
                title,
                courseId,
                scheduledTime: new Date()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setLiveData(res.data);
            toast.success('Live class architecture initialized!');
        } catch (err) {
            console.error('Mux Live Error:', err);
            toast.error('Failed to create live class');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        if (type === 'key') {
            setCopiedKey(true);
            setTimeout(() => setCopiedKey(false), 2000);
        } else {
            setCopiedUrl(true);
            setTimeout(() => setCopiedUrl(false), 2000);
        }
        toast.info('Copied to clipboard');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-primary-bg/90 backdrop-blur-2xl"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    className="relative w-full max-w-4xl glass-card overflow-hidden flex flex-col md:flex-row min-h-[500px]"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-20 text-surface-light/40 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* Left Side: Controls/Status */}
                    <div className="w-full md:w-1/2 p-8 border-r border-white/5 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/20 rounded-2xl border border-red-500/30">
                                <Video className="text-red-500 w-6 h-6 animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Command Center</h2>
                                <p className="text-[10px] text-surface-light/40 uppercase tracking-[0.3em] font-bold">Ultra-Low Latency Nexus</p>
                            </div>
                        </div>

                        {!liveData ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-light/40 uppercase tracking-widest">Select Course Pipeline</label>
                                    <div className="relative">
                                        <select
                                            value={courseId}
                                            onChange={(e) => setCourseId(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-bold outline-none focus:border-red-500/50 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-[#1e293b]">Choose Academic Source</option>
                                            {courses.map(course => (
                                                <option key={course._id} value={course._id} className="bg-[#1e293b]">
                                                    {course.title}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-light/40 uppercase tracking-widest">Session Designation</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Weekly Advanced Physics Deep-Dive"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-bold outline-none focus:border-red-500/50 transition-all"
                                    />
                                </div>

                                <button
                                    onClick={handleCreateStream}
                                    disabled={isLoading}
                                    className="w-full py-5 bg-red-500 text-white rounded-2xl font-black uppercase tracking-[0.25em] shadow-2xl shadow-red-500/20 hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : <Shield size={18} />}
                                    Initiate Live Protocol
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="flex items-center gap-3 text-emerald-500 mb-2">
                                        <Check size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Pipeline Operational</span>
                                    </div>
                                    <p className="text-sm text-surface-light/60">Connect your broadcasting software (OBS/vMix) using the credentials below.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-surface-light/40 uppercase tracking-widest">RTMP Endpoint URL</label>
                                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 group">
                                            <input readOnly value={liveData.rtmpUrl} className="bg-transparent flex-1 text-xs text-white outline-none" />
                                            <button onClick={() => copyToClipboard(liveData.rtmpUrl, 'url')} className="text-surface-light/40 hover:text-white transition-colors">
                                                {copiedUrl ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-surface-light/40 uppercase tracking-widest">Secret Stream Key</label>
                                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 group">
                                            <input readOnly type="password" value={liveData.streamKey} className="bg-transparent flex-1 text-xs text-white outline-none" />
                                            <button onClick={() => copyToClipboard(liveData.streamKey, 'key')} className="text-surface-light/40 hover:text-white transition-colors">
                                                {copiedKey ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
                                    <p className="text-[9px] text-surface-light/20 uppercase font-black tracking-widest">Transmission Status: Waiting for OBS...</p>
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                        <span className="text-[10px] font-bold text-red-500 uppercase">Live Preview Ready</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Preview/Instructions */}
                    <div className="w-full md:w-1/2 bg-black/40 p-8 flex flex-col justify-center">
                        {!liveData ? (
                            <div className="space-y-8">
                                <div className="p-8 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center text-center space-y-6">
                                    <MonitorPlay className="w-16 h-16 text-surface-light/10" />
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-white/40">Broadcasting Preview</h3>
                                        <p className="text-xs text-surface-light/20">The stream preview will initialize here once the academic pipeline is established.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/2 border border-white/5">
                                        <p className="text-[8px] font-black text-white/20 uppercase mb-2">Max. Resolution</p>
                                        <p className="text-xs font-bold text-white/40">1080p | 60FPS</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/2 border border-white/5">
                                        <p className="text-[8px] font-black text-white/20 uppercase mb-2">Security</p>
                                        <p className="text-xs font-bold text-white/40">SSL Encrypted</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black group relative">
                                    <MuxPlayer
                                        playbackId={liveData.liveClass.playbackId}
                                        streamType="live"
                                        placeholder=""
                                        className="w-full h-full"
                                    />
                                    <div className="absolute top-4 left-4 bg-red-500 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-white">Live Preview</div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-surface-light/40 uppercase tracking-widest">Transmission Controls</p>
                                    <div className="flex gap-4">
                                        <button className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase transition-all flex items-center justify-center gap-2">
                                            <ExternalLink size={12} />
                                            Open OBS Guide
                                        </button>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase transition-all"
                                        >
                                            Reset Pipeline
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LiveClassPanel;

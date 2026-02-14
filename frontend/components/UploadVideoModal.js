'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle2, Loader2, BookOpen, ChevronDown } from 'lucide-react';
import MuxUploader from '@mux/mux-uploader-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UploadVideoModal = ({ isOpen, onClose, courses, onUploadComplete, initialCourseId = '', initialModuleId = '' }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [courseId, setCourseId] = useState(initialCourseId);
    const [moduleId, setModuleId] = useState(initialModuleId);
    const [modules, setModules] = useState([]);
    const [uploadUrl, setUploadUrl] = useState('');
    const [isPreparing, setIsPreparing] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCourseId(initialCourseId);
            setModuleId(initialModuleId);
            setUploadUrl('');
            setIsUploaded(false);
            setTitle('');
            setDescription('');
        }
    }, [isOpen, initialCourseId, initialModuleId]);

    useEffect(() => {
        if (courseId) {
            const fetchModules = async () => {
                try {
                    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                    const user = JSON.parse(localStorage.getItem('user'));
                    const token = user?.token;
                    const res = await axios.get(`${API_URL}/courses/${courseId}/modules`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setModules(res.data);
                } catch (err) {
                    console.error('Error fetching modules:', err);
                }
            };
            fetchModules();
        }
    }, [courseId]);

    const handleStartUpload = async () => {
        if (!title || !courseId) {
            toast.error('Please fill all mandatory fields (Title and Course)');
            return;
        }

        setIsPreparing(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;

            let finalModuleId = moduleId;

            // If no module is selected but we have modules available, error out
            if (!finalModuleId && modules.length > 0) {
                toast.error('Please select a module');
                setIsPreparing(false);
                return;
            }

            // If absolutely no modules exist for this course, create a default one
            if (!finalModuleId && modules.length === 0) {
                toast.info('Creating default module...');
                const modRes = await axios.post(`${API_URL}/courses/modules`, {
                    title: 'General Modules',
                    courseId: courseId,
                    order: 1
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                finalModuleId = modRes.data._id;
            }

            const res = await axios.post(`${API_URL}/mux/upload`, {
                title,
                description,
                courseId,
                moduleId: finalModuleId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUploadUrl(res.data.uploadUrl);
            toast.info('Ready for upload. Select your file.');
        } catch (err) {
            console.error('Mux Init Error:', err);
            const errorMsg = err.response?.data?.message || 'Failed to initialize upload';
            const detail = err.response?.data?.error;
            toast.error(detail ? `${errorMsg} (${detail})` : errorMsg);
        } finally {
            setIsPreparing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 sm:p-12">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-primary-bg/80 backdrop-blur-xl"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl glass-card p-6 md:p-8 overflow-y-auto max-h-[90vh]"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-surface-light/40 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-secondary-action/20 rounded-2xl border border-secondary-action/30">
                            <Upload className="text-secondary-action w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-display font-black text-white">Upload Recorded Lecture</h2>
                            <p className="text-xs text-surface-light/40 uppercase tracking-widest mt-1">Divya Gyan Dhara Academic Archiving</p>
                        </div>
                    </div>

                    {!isUploaded ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-light/40 uppercase tracking-widest">Select Course</label>
                                    <div className="relative">
                                        <select
                                            value={courseId}
                                            onChange={(e) => setCourseId(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary-action/50 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-[#1e293b]">Choose Course</option>
                                            {courses.map(course => (
                                                <option key={course._id} value={course._id} className="bg-[#1e293b]">
                                                    {course.title}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-light/20 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-light/40 uppercase tracking-widest">Select Module</label>
                                    <div className="relative">
                                        <select
                                            value={moduleId}
                                            onChange={(e) => setModuleId(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary-action/50 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50"
                                            disabled={!courseId}
                                        >
                                            <option value="" className="bg-[#1e293b]">Choose Module</option>
                                            {modules.map(mod => (
                                                <option key={mod._id} value={mod._id} className="bg-[#1e293b]">
                                                    {mod.title}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-light/20 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-light/40 uppercase tracking-widest">Lecture Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Intro to Quantum Mechanics"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary-action/50 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-light/40 uppercase tracking-widest">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Educational objectives and overview..."
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary-action/50 outline-none transition-all resize-none"
                                />
                            </div>

                            {!uploadUrl ? (
                                <button
                                    onClick={handleStartUpload}
                                    disabled={isPreparing}
                                    className="w-full py-4 bg-secondary-action text-white rounded-2xl font-bold uppercase tracking-[0.2em] shadow-lg shadow-secondary-action/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {isPreparing ? <Loader2 className="animate-spin" /> : <BookOpen size={18} />}
                                    Initialize Academic Upload
                                </button>
                            ) : (
                                <div className="p-8 border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
                                    <MuxUploader
                                        endpoint={uploadUrl}
                                        onSuccess={() => {
                                            setIsUploaded(true);
                                            toast.success('Lecture uploaded successfully!');
                                            setTimeout(() => {
                                                onUploadComplete();
                                                onClose();
                                            }, 2000);
                                        }}
                                        onError={(err) => {
                                            toast.error('Upload failed. Please try again.');
                                            console.error(err);
                                        }}
                                        className="academic-uploader"
                                    />
                                    <style jsx global>{`
                                        mux-uploader {
                                            --progress-bar-fill-color: #6366F1;
                                            --progress-bar-background-color: rgba(255,255,255,0.05);
                                            --button-background-color: #6366F1;
                                            --button-border-radius: 12px;
                                            color: white;
                                        }
                                    `}</style>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center text-center space-y-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30"
                            >
                                <CheckCircle2 className="text-emerald-500 w-10 h-10" />
                            </motion.div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">Lecture Added Successfully</h3>
                                <p className="text-surface-light/40 mt-2">The academic archives have been updated.</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UploadVideoModal;

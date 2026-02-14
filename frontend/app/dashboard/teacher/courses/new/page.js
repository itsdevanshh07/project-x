'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Upload,
    CheckCircle,
    Save,
    Book,
    Tag,
    IndianRupee,
    Calendar,
    Sparkles,
    Image as ImageIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function CreateCourse() {
    const { user } = useSelector((state) => state.auth);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Class 10',
        price: '',
        discountedPrice: '',
        validity: '365',
        features: '',
        thumbnail: '',
        isActive: true
    });

    useEffect(() => {
        setMounted(true);
        if (user?.role !== 'teacher' || user?.status !== 'approved') {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            // Format features as array
            const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f !== '');

            const payload = {
                ...formData,
                features: featuresArray,
                price: Number(formData.price),
                discountedPrice: formData.discountedPrice ? Number(formData.discountedPrice) : undefined,
                validity: Number(formData.validity)
            };

            const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth').replace(/\/auth$/, '');
            await axios.post(`${API_BASE_URL}/teacher/courses`, payload, config);

            toast.success('Course created successfully!');
            router.push('/dashboard/teacher');
        } catch (error) {
            console.error('Error creating course:', error);
            toast.error(error.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />

            <div className="pt-24 pb-20 container mx-auto px-4 md:px-6 max-w-5xl">
                <button
                    onClick={() => router.back()}
                    className="flex items-center space-x-2 text-slate-500 font-bold hover:text-slate-900 transition-colors mb-8 group"
                >
                    <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md border border-slate-100 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span>Back to Dashboard</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Main Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-blue-100/30 border border-slate-100">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-display font-black text-slate-900">New <span className="text-blue-600">Course</span></h1>
                                    <p className="text-slate-500 font-medium">Define your educational journey.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Course Title</label>
                                    <div className="relative group">
                                        <Book className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                        <input
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. Master Mathematics for SSC CGL"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Detailed Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        placeholder="Explain what students will learn and why they should join your course..."
                                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Category</label>
                                        <div className="relative">
                                            <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 appearance-none transition-all"
                                            >
                                                <option value="Class 9">Class 9</option>
                                                <option value="Class 10">Class 10</option>
                                                <option value="Class 11">Class 11</option>
                                                <option value="Class 12">Class 12</option>
                                                <option value="Mathematics">Mathematics</option>
                                                <option value="Physics">Physics</option>
                                                <option value="Chemistry">Chemistry</option>
                                                <option value="Biology">Biology</option>
                                                <option value="JEE">JEE</option>
                                                <option value="NEET">NEET</option>
                                                <option value="Board Exam">Board Exam</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Course Validity (in days)</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                name="validity"
                                                type="number"
                                                min="1"
                                                value={formData.validity}
                                                onChange={handleChange}
                                                required
                                                placeholder="e.g. 180"
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Base Price (₹)</label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                name="price"
                                                type="number"
                                                value={formData.price}
                                                onChange={handleChange}
                                                required
                                                placeholder="0"
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Discounted Price (₹)</label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                name="discountedPrice"
                                                type="number"
                                                value={formData.discountedPrice}
                                                onChange={handleChange}
                                                placeholder="Optional"
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Target Features (Comma separated)</label>
                                    <textarea
                                        name="features"
                                        value={formData.features}
                                        onChange={handleChange}
                                        rows="2"
                                        placeholder="Live Classes, PDF Notes, Test Series, Weekly Doubt Clearings..."
                                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center space-x-3"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/50 border-t-white" />
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            <span>Publish Course</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right: Media & Preview */}
                    <div className="space-y-8">
                        {/* Thumbnail Upload Placeholder */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 text-center">
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Course Thumbnail</h2>
                            <div className="aspect-video bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 hover:bg-white hover:border-blue-300 transition-all cursor-pointer group">
                                {formData.thumbnail ? (
                                    <img src={formData.thumbnail} className="w-full h-full object-cover rounded-2xl" />
                                ) : (
                                    <>
                                        <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                            <ImageIcon className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div className="text-xs font-bold text-slate-500 mb-1">Upload JPG, PNG (1280x720)</div>
                                        <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Max Size: 2MB</div>
                                        <input
                                            type="text"
                                            placeholder="Thumbnail URL (temporary)"
                                            className="mt-4 w-full p-3 text-xs border rounded-xl"
                                            name="thumbnail"
                                            onChange={handleChange}
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Real-time Card Preview */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/30 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-600/50 transition-colors" />
                            <h2 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Card Preview</h2>
                            <div className="font-display font-black text-2xl mb-4 line-clamp-2">
                                {formData.title || "Your Course Title Will Appear Here"}
                            </div>
                            <div className="flex items-center space-x-3 mb-6">
                                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {formData.category}
                                </span>
                                <span className="text-blue-400 font-black">
                                    ₹{formData.discountedPrice || formData.price || "0"}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-white/50 text-xs font-bold">
                                <CheckCircle className="w-4 h-4 text-blue-500" />
                                <span>Includes Lifetime Access</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

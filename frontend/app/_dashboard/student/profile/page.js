'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, getProfile } from '@/slices/studentSlice';
import { User, Mail, Phone, Camera, Shield, Save, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export default function StudentProfile() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { profile, isLoading } = useSelector((state) => state.student);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        grade: '',
    });

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch]);

    useEffect(() => {
        if (profile) {
            setFormData({
                fullName: profile.fullName || '',
                email: profile.email || '',
                phone: profile.phone || '',
                grade: profile.grade || '',
            });
        } else if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                grade: user.grade || '',
            });
        }
    }, [profile, user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(updateProfile(formData));
        if (updateProfile.fulfilled.match(result)) {
            toast.success('Profile Evolved Successfully');
        } else {
            toast.error(result.payload || 'Evolution Failed');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <header className="text-center space-y-4">
                <div className="relative inline-block group">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-secondary-action/20 border-2 border-secondary-action/30 rounded-[2.5rem] flex items-center justify-center text-5xl md:text-6xl text-white font-black shadow-2xl transition-all duration-700 group-hover:bg-secondary-action/30">
                        {formData.fullName?.charAt(0)}
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-4 bg-primary-bg border border-white/10 rounded-2xl text-secondary-action hover:scale-110 active:scale-90 transition-all shadow-2xl shadow-black/40">
                        <Camera className="w-6 h-6" />
                    </button>
                </div>
                <div>
                    <h1 className="text-4xl font-display font-black text-white tracking-tight uppercase">Identity Protocol</h1>
                    <p className="text-surface-light/40 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Personalize Your Academic Fingerprint</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="glass-card p-8 md:p-12 border-white/5 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-surface-light/20 uppercase tracking-[0.3em] flex items-center gap-3">
                                <User className="w-3.5 h-3.5 text-secondary-action" /> Full Name
                            </label>
                            <input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white text-sm font-bold tracking-wide outline-none focus:border-secondary-action/30 transition-all"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-surface-light/20 uppercase tracking-[0.3em] flex items-center gap-3">
                                <Mail className="w-3.5 h-3.5 text-secondary-action" /> Email Identifier
                            </label>
                            <input
                                name="email"
                                value={formData.email}
                                disabled
                                className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white/40 text-sm font-bold tracking-wide cursor-not-allowed"
                                placeholder="email@address.com"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-surface-light/20 uppercase tracking-[0.3em] flex items-center gap-3">
                                <Phone className="w-3.5 h-3.5 text-secondary-action" /> Phone Number
                            </label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white text-sm font-bold tracking-wide outline-none focus:border-secondary-action/30 transition-all"
                                placeholder="+91 1234567890"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-surface-light/20 uppercase tracking-[0.3em] flex items-center gap-3">
                                <Shield className="w-3.5 h-3.5 text-secondary-action" /> Academic Grade
                            </label>
                            <select
                                name="grade"
                                value={formData.grade}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white text-sm font-bold tracking-wide outline-none focus:border-secondary-action/30 transition-all appearance-none"
                            >
                                <option value="" disabled className="bg-primary-bg">Select Grade</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(g => (
                                    <option key={g} value={g} className="bg-primary-bg">Class {g}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-white/5 flex items-center justify-between gap-8">
                        <div className="flex items-center gap-4 text-surface-light/20">
                            <Sparkles className="w-5 h-5" />
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] max-w-[200px]">Profile changes are synced across your DGD academic ecosystem.</p>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-4 px-12 py-5 bg-secondary-action text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:shadow-2xl hover:shadow-secondary-action/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                            Synchronize Profile
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile } from '@/slices/studentSlice';
import { User, Mail, Phone, ShoppingBag, History, Settings, Camera, ShieldCheck, Save, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { profile, isLoading } = useSelector((state) => state.student);
    const { user } = useSelector((state) => state.auth);
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
    });

    useEffect(() => {
        setMounted(true);
        if (user) {
            dispatch(getProfile());
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (profile) {
            setFormData({
                fullName: profile.fullName || '',
                phone: profile.phone || '',
            });
        }
    }, [profile]);

    const handleUpdate = (e) => {
        e.preventDefault();
        dispatch(updateProfile(formData));
        setIsEditing(false);
    };

    if (!mounted || isLoading || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'orders', label: 'Purchase History', icon: ShoppingBag },
        { id: 'progress', label: 'Learning Progress', icon: History },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <main className="min-h-screen bg-bg-main">
            <Navbar />
            <div className="pt-32 pb-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-10">
                            {/* Sidebar */}
                            <div className="w-full md:w-80 space-y-6">
                                <div className="glass rounded-[2.5rem] p-8 text-center border border-border-main overflow-hidden relative">
                                    <div className="absolute top-0 left-0 right-0 h-24 bg-brand-primary/10" />
                                    <div className="relative pt-4">
                                        <div className="relative inline-block group">
                                            <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-bg-card shadow-2xl relative">
                                                <img
                                                    src={profile.avatar !== 'no-photo.jpg' ? profile.avatar : 'https://ui-avatars.com/api/?name=' + profile.fullName}
                                                    alt={profile.fullName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button className="absolute -bottom-2 -right-2 p-3 bg-bg-card rounded-2xl shadow-xl text-brand-primary hover:scale-110 transition-transform border border-border-main">
                                                <Camera className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <h2 className="mt-6 text-2xl font-display font-black text-text-primary">{profile.fullName}</h2>
                                        <p className="text-brand-primary font-bold text-sm uppercase tracking-widest mt-1">{profile.role}</p>
                                        <div className="mt-4 flex items-center justify-center space-x-2 text-brand-secondary bg-brand-secondary/10 py-2 px-4 rounded-xl">
                                            <ShieldCheck className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Verified Account</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass rounded-[2rem] p-2 border border-border-main">
                                    <nav className="space-y-1">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center space-x-3 p-4 rounded-2xl font-bold transition-all text-left ${activeTab === tab.id
                                                        ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
                                                        : 'text-text-secondary hover:bg-bg-card'
                                                    }`}
                                            >
                                                <tab.icon className="w-5 h-5" />
                                                <span>{tab.label}</span>
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'personal' && (
                                        <motion.div
                                            key="personal"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="glass rounded-[2.5rem] p-10 border border-border-main"
                                        >
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="text-2xl font-display font-black text-text-primary">Personal Details</h3>
                                                <button
                                                    onClick={() => setIsEditing(!isEditing)}
                                                    className="flex items-center space-x-2 px-4 py-2 bg-bg-card hover:bg-bg-section rounded-xl transition-all text-text-secondary font-bold text-sm border border-border-main"
                                                >
                                                    {isEditing ? <User className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                                                    <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                                                </button>
                                            </div>

                                            <form onSubmit={handleUpdate} className="space-y-8">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-2">Full Name</label>
                                                        <div className="relative group">
                                                            <div className="absolute inset-y-0 left-4 flex items-center text-text-muted group-focus-within:text-brand-primary transition-colors">
                                                                <User className="w-5 h-5" />
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={formData.fullName}
                                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                                readOnly={!isEditing}
                                                                className={`w-full pl-12 pr-6 py-4 border border-border-main rounded-2xl font-bold text-text-primary outline-none transition-all ${isEditing ? 'bg-bg-card ring-2 ring-brand-primary/20' : 'bg-bg-section'
                                                                    }`}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-2">Email Address</label>
                                                        <div className="relative group opacity-50">
                                                            <div className="absolute inset-y-0 left-4 flex items-center text-text-muted">
                                                                <Mail className="w-5 h-5" />
                                                            </div>
                                                            <input
                                                                type="email"
                                                                value={profile.email}
                                                                readOnly
                                                                className="w-full pl-12 pr-6 py-4 bg-bg-section border border-border-main rounded-2xl font-bold text-text-primary outline-none cursor-not-allowed"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-2">Phone Number</label>
                                                        <div className="relative group">
                                                            <div className="absolute inset-y-0 left-4 flex items-center text-text-muted group-focus-within:text-brand-primary transition-colors">
                                                                <Phone className="w-5 h-5" />
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={formData.phone}
                                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                                readOnly={!isEditing}
                                                                placeholder="Not linked"
                                                                className={`w-full pl-12 pr-6 py-4 border border-border-main rounded-2xl font-bold text-text-primary outline-none transition-all ${isEditing ? 'bg-bg-card ring-2 ring-brand-primary/20' : 'bg-bg-section'
                                                                    }`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {isEditing && (
                                                    <div className="flex justify-end">
                                                        <button
                                                            type="submit"
                                                            className="btn-primary px-8 py-4 flex items-center space-x-2"
                                                        >
                                                            <Save className="w-5 h-5" />
                                                            <span>Save Changes</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </form>

                                            <div className="mt-12 pt-12 border-t border-border-main">
                                                <h4 className="text-xl font-bold text-slate-900 mb-6">Learning Overview</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div className="bg-slate-50 p-6 rounded-3xl text-center">
                                                        <div className="text-3xl font-display font-black text-blue-600">{profile.enrolledCourses?.length || 0}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Courses</div>
                                                    </div>
                                                    <div className="bg-slate-50 p-6 rounded-3xl text-center">
                                                        <div className="text-3xl font-display font-black text-indigo-600">{profile.purchasedTests?.length || 0}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tests</div>
                                                    </div>
                                                    <div className="bg-slate-50 p-6 rounded-3xl text-center">
                                                        <div className="text-3xl font-display font-black text-pink-600">{profile.wishlist?.length || 0}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Wishlist</div>
                                                    </div>
                                                    <div className="bg-slate-50 p-6 rounded-3xl text-center">
                                                        <div className="text-3xl font-display font-black text-amber-600">{profile.cart?.length || 0}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cart</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'orders' && (
                                        <motion.div
                                            key="orders"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="glass rounded-[2.5rem] p-10 border border-white/40 min-h-[500px]"
                                        >
                                            <h3 className="text-2xl font-display font-black text-slate-900 mb-8">Purchase History</h3>
                                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
                                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                                                    <ShoppingBag className="w-8 h-8" />
                                                </div>
                                                <h4 className="text-xl font-bold text-slate-900">No orders yet</h4>
                                                <p className="text-slate-500 font-medium max-w-xs">Start your learning journey by enrolling in our premium courses today.</p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'progress' && (
                                        <motion.div
                                            key="progress"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="glass rounded-[2.5rem] p-10 border border-white/40 min-h-[500px]"
                                        >
                                            <h3 className="text-2xl font-display font-black text-slate-900 mb-8">Learning Progress</h3>
                                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
                                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                                                    <History className="w-8 h-8" />
                                                </div>
                                                <h4 className="text-xl font-bold text-slate-900">No progress tracked</h4>
                                                <p className="text-slate-500 font-medium max-w-xs">Jump into your courses and start watching to see your progress here.</p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'settings' && (
                                        <motion.div
                                            key="settings"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="glass rounded-[2.5rem] p-10 border border-white/40 min-h-[500px]"
                                        >
                                            <h3 className="text-2xl font-display font-black text-slate-900 mb-8">Account Settings</h3>
                                            <div className="space-y-6">
                                                <div className="p-6 bg-slate-50 rounded-3xl flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">Email Notifications</h4>
                                                        <p className="text-xs font-medium text-slate-500">Receive updates about your courses.</p>
                                                    </div>
                                                    <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                                                    </div>
                                                </div>
                                                <div className="p-6 bg-slate-50 rounded-3xl flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">Change Password</h4>
                                                        <p className="text-xs font-medium text-slate-500">Keep your account secure.</p>
                                                    </div>
                                                    <button className="text-sm font-bold text-blue-600 uppercase tracking-widest">Update</button>
                                                </div>
                                                <div className="p-6 bg-red-50 rounded-3xl flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-red-600">Delete Account</h4>
                                                        <p className="text-xs font-medium text-red-400">Permanently delete your profile.</p>
                                                    </div>
                                                    <button className="text-sm font-bold text-red-600 uppercase tracking-widest">Delete</button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
};

export default ProfilePage;

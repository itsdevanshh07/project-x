'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTeacherRequests, updateTeacherStatus, getAllUsers } from '@/slices/authSlice';
import {
    UserCheck,
    UserX,
    Clock,
    Users,
    ShieldCheck,
    Search,
    Filter,
    Shield,
    User as UserIcon,
    AlertCircle,
    ChevronRight,
    Activity,
    ShieldAlert
} from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
    const dispatch = useDispatch();
    const { user, teacherRequests, allUsers, isLoading } = useSelector((state) => state.auth);
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('approvals');
    const [search, setSearch] = useState('');

    useEffect(() => {
        setMounted(true);
        if (user?.role === 'admin') {
            dispatch(getTeacherRequests());
            dispatch(getAllUsers());
        }
    }, [dispatch, user]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await dispatch(updateTeacherStatus({ id, status })).unwrap();
            toast.success(`Teacher ${status === 'approved' ? 'Approved' : 'Rejected'} successfully`);
        } catch (error) {
            toast.error(error);
        }
    };

    if (!mounted) return null;

    if (user?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary-bg overflow-hidden relative">
                <div className="absolute inset-0 bg-secondary-action/5 blur-[120px]" />
                <div className="text-center relative z-10 space-y-4">
                    <ShieldAlert className="w-16 h-16 text-red-500 mx-auto animate-pulse" />
                    <h1 className="text-3xl font-display font-black text-white">Access Denied</h1>
                    <p className="text-surface-light/40 font-medium">You do not have permission to access the Command Center.</p>
                </div>
            </div>
        );
    }

    const filteredUsers = allUsers.filter(u =>
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const stats = [
        { label: 'Total Users', value: allUsers.length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Active Teachers', value: allUsers.filter(u => u.role === 'teacher').length, icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { label: 'Pending Requests', value: teacherRequests.length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { label: 'Platform Admins', value: allUsers.filter(u => u.role === 'admin').length, icon: Shield, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    ];

    return (
        <main className="min-h-screen bg-primary-bg text-surface-light">
            <Navbar />

            <div className="container max-w-7xl mx-auto px-6 pt-40 pb-20 relative">
                {/* Decorative BG */}
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-secondary-action/5 blur-[150px] rounded-full pointer-events-none" />
                <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-accent-highlight/5 blur-[150px] rounded-full pointer-events-none" />

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-action/10 border border-secondary-action/20"
                        >
                            <Activity className="w-3 h-3 text-secondary-action" />
                            <span className="text-[10px] font-black text-secondary-action uppercase tracking-[0.2em]">Operational Command Center</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-display font-black text-white"
                        >
                            Platform <span className="text-secondary-action">Oversight.</span>
                        </motion.h1>
                    </div>
                </div>

                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-8 group hover:border-white/20 transition-all duration-500"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-surface-light/10 uppercase tracking-[0.2em]">Real-time</span>
                            </div>
                            <h3 className="text-surface-light/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</h3>
                            <p className="text-3xl font-display font-black text-white">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="glass-card overflow-hidden border border-white/5">
                    <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02]">
                        <div className="flex items-center p-1 bg-white/5 rounded-2xl border border-white/5 w-fit">
                            <button
                                onClick={() => setActiveTab('approvals')}
                                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'approvals' ? 'bg-secondary-action text-white shadow-xl shadow-secondary-action/20' : 'text-surface-light/40 hover:text-white'}`}
                            >
                                Teacher Approvals
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-secondary-action text-white shadow-xl shadow-secondary-action/20' : 'text-surface-light/40 hover:text-white'}`}
                            >
                                User Registry
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-light/20 group-focus-within:text-secondary-action transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Query record..."
                                    className="pl-12 pr-6 py-3 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-secondary-action/20 outline-none w-full md:w-64 transition-all"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <button className="p-3 bg-white/5 text-surface-light/40 rounded-2xl hover:bg-white/10 hover:text-white border border-white/5 transition-all">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/[0.01]">
                                    <th className="px-8 py-6 text-[10px] font-black text-surface-light/20 uppercase tracking-[0.2em]">Credential</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-surface-light/20 uppercase tracking-[0.2em]">Contact Records</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-surface-light/20 uppercase tracking-[0.2em]">Clearance Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-surface-light/20 uppercase tracking-[0.2em] text-center">Protocol Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-32 text-center">
                                            <div className="animate-spin w-10 h-10 border-2 border-secondary-action border-t-transparent rounded-full mx-auto mb-6"></div>
                                            <p className="text-surface-light/20 font-bold uppercase tracking-widest text-xs">Accessing Secure Records...</p>
                                        </td>
                                    </tr>
                                ) : activeTab === 'approvals' ? (
                                    teacherRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-32 text-center">
                                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-surface-light/10">
                                                    <Users className="w-8 h-8" />
                                                </div>
                                                <p className="text-surface-light/40 font-bold text-lg mb-2 tracking-tight">Zero Pending Approvals</p>
                                                <p className="text-surface-light/20 text-sm font-medium">All faculty requests have been processed.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        teacherRequests.map((req) => (
                                            <tr key={req._id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-8 py-8">
                                                    <div className="flex items-center space-x-5">
                                                        <div className="w-14 h-14 bg-secondary-action/20 rounded-2xl flex items-center justify-center text-secondary-action font-black text-xl border border-secondary-action/20">
                                                            {req.fullName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white mb-1">{req.fullName}</div>
                                                            <div className="text-[10px] font-black text-secondary-action uppercase tracking-[0.2em]">{req.role}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <div className="text-xs font-bold text-surface-light/60 mb-1">{req.email}</div>
                                                    <div className="text-[10px] text-surface-light/20 font-bold uppercase tracking-widest leading-none">{req.phone}</div>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <span className="px-4 py-1.5 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                                                        {req.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <button
                                                            onClick={() => handleStatusUpdate(req._id, 'approved')}
                                                            className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                                                            title="Authorize Access"
                                                        >
                                                            <UserCheck className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(req._id, 'rejected')}
                                                            className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                                            title="Deny Access"
                                                        >
                                                            <UserX className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                ) : (
                                    filteredUsers.map((u) => (
                                        <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-8">
                                                <div className="flex items-center space-x-5">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border ${u.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20' : u.role === 'teacher' ? 'bg-secondary-action/20 text-secondary-action border-secondary-action/20' : 'bg-white/5 text-surface-light/40 border-white/5'}`}>
                                                        {u.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white mb-1">{u.fullName}</div>
                                                        <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${u.role === 'admin' ? 'text-indigo-400' : u.role === 'teacher' ? 'text-secondary-action' : 'text-surface-light/20'}`}>
                                                            {u.role}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="text-xs font-bold text-surface-light/60 mb-1">{u.email}</div>
                                                <div className="text-[10px] text-surface-light/20 font-bold uppercase tracking-widest leading-none">{u.phone || 'NO RECORD'}</div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${u.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : u.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="flex items-center justify-center space-x-3">
                                                    {u.role !== 'admin' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(u._id, u.status === 'approved' ? 'suspended' : 'approved')}
                                                            className={`p-3 rounded-2xl transition-all border ${u.status === 'approved' ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white'}`}
                                                            title={u.status === 'approved' ? 'Suspend Record' : 'Reactivate Record'}
                                                        >
                                                            {u.status === 'approved' ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}

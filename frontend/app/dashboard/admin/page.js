'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTeacherRequests, updateTeacherStatus, getAllUsers } from '@/slices/authSlice';
import { UserCheck, UserX, Clock, Users, ShieldCheck, Search, Filter, Shield, User as UserIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';

export default function AdminDashboard() {
    const dispatch = useDispatch();
    const { user, teacherRequests, allUsers, isLoading } = useSelector((state) => state.auth);
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('approvals');

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
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
                    <p className="text-slate-500">You do not have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8FAFF]">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider font-sans">Total</span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1 font-sans">Users</h3>
                        <p className="text-3xl font-black text-slate-900 font-display">{allUsers.length}</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider font-sans">Active</span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1 font-sans">Teachers</h3>
                        <p className="text-3xl font-black text-slate-900 font-display">{allUsers.filter(u => u.role === 'teacher').length}</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                                <Clock className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider font-sans">Pending</span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1 font-sans">Requests</h3>
                        <p className="text-3xl font-black text-slate-900 font-display">{teacherRequests.length}</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                <Shield className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider font-sans">Security</span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1 font-sans">Admins</h3>
                        <p className="text-3xl font-black text-slate-900 font-display">{allUsers.filter(u => u.role === 'admin').length}</p>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={() => setActiveTab('approvals')}
                                className={`text-2xl font-display font-black transition-all ${activeTab === 'approvals' ? 'text-slate-900' : 'text-slate-300 hover:text-slate-400'}`}
                            >
                                Teacher Approvals
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`text-2xl font-display font-black transition-all ${activeTab === 'users' ? 'text-slate-900' : 'text-slate-300 hover:text-slate-400'}`}
                            >
                                All Users
                            </button>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input type="text" placeholder="Search..." className="pl-11 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 font-medium" />
                            </div>
                            <button className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-colors">
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest font-sans">User</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest font-sans">Contact</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest font-sans">Status</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest font-sans text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-sans">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                                            <p className="text-slate-500 font-medium">Loading...</p>
                                        </td>
                                    </tr>
                                ) : activeTab === 'approvals' ? (
                                    teacherRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-20 text-center">
                                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                                                    <Users className="w-8 h-8" />
                                                </div>
                                                <p className="text-slate-500 font-medium text-lg">No pending requests found.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        teacherRequests.map((req) => (
                                            <tr key={req._id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg">
                                                            {req.fullName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900">{req.fullName}</div>
                                                            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">{req.role}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="text-sm font-bold text-slate-600">{req.email}</div>
                                                    <div className="text-xs text-slate-400">{req.phone}</div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-black uppercase tracking-wider">
                                                        {req.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <button
                                                            onClick={() => handleStatusUpdate(req._id, 'approved')}
                                                            className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                                            title="Approve Teacher"
                                                        >
                                                            <UserCheck className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(req._id, 'rejected')}
                                                            className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                            title="Reject Teacher"
                                                        >
                                                            <UserX className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                ) : (
                                    allUsers.map((u) => (
                                        <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : u.role === 'teacher' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                                                        {u.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{u.fullName}</div>
                                                        <div className={`text-xs font-bold uppercase tracking-wider ${u.role === 'admin' ? 'text-indigo-600' : u.role === 'teacher' ? 'text-blue-600' : 'text-slate-400'}`}>
                                                            {u.role}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-bold text-slate-600">{u.email}</div>
                                                <div className="text-xs text-slate-400">{u.phone}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${u.status === 'approved' ? 'bg-green-50 text-green-600' : u.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-center space-x-3">
                                                    {u.role !== 'admin' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(u._id, u.status === 'approved' ? 'suspended' : 'approved')}
                                                            className={`p-3 rounded-2xl transition-all shadow-sm ${u.status === 'approved' ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'}`}
                                                            title={u.status === 'approved' ? 'Suspend Account' : 'Approve Account'}
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

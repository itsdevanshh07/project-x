'use client';

import { Library, Search, FileText, Download, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentLibrary() {
    return (
        <div className="space-y-12 pb-20">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-display font-black text-white tracking-tight uppercase">Resource Library</h1>
                    <p className="text-surface-light/40 text-sm mt-2 font-medium tracking-wide">Archived research, lecture notes, and academic assets.</p>
                </div>
                <div className="flex items-center bg-white/5 border border-white/5 px-6 py-4 rounded-2xl w-full lg:w-96 group focus-within:border-secondary-action/30 transition-all">
                    <Search className="w-4 h-4 text-surface-light/20 group-focus-within:text-secondary-action mr-4 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="bg-transparent border-none outline-none text-[11px] font-bold uppercase tracking-widest w-full text-white placeholder-surface-light/20"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { name: 'Physics Notes', type: 'PDF', size: '2.4 MB', date: 'Oct 12, 2025' },
                    { name: 'Organic Chem Formulas', type: 'Excel', size: '1.1 MB', date: 'Oct 15, 2025' },
                    { name: 'Calculus Guide', type: 'PDF', size: '4.8 MB', date: 'Oct 20, 2025' },
                    { name: 'Academic Regulations', type: 'PDF', size: '0.5 MB', date: 'Sep 01, 2025' },
                ].map((asset, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card p-8 group hover:border-white/10 transition-all relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-100 transition-opacity">
                            <Download className="w-5 h-5 text-secondary-action" />
                        </div>
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-surface-light/20 mb-8 border border-white/5 group-hover:bg-secondary-action/10 group-hover:text-secondary-action transition-all duration-500">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-white group-hover:text-secondary-action transition-colors">{asset.name}</h4>
                            <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-surface-light/20">
                                <span>{asset.type} • {asset.size}</span>
                                <span>{asset.date}</span>
                            </div>
                        </div>
                        <button className="mt-8 w-full py-4 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-surface-light/40 group-hover:bg-secondary-action group-hover:text-white transition-all">
                            Secure Access
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="py-24 glass-card border-dashed border-white/10 flex flex-col items-center justify-center space-y-8 bg-black/20">
                <Lock className="w-16 h-16 text-white/5" />
                <div className="text-center space-y-4">
                    <h3 className="text-xl font-display font-black text-white uppercase tracking-widest">Premium Repository</h3>
                    <p className="text-xs text-surface-light/20 font-medium max-w-sm mx-auto leading-relaxed italic">
                        "Some archival materials are restricted to specific academic tiers. Please contact your faculty for clearance codes."
                    </p>
                </div>
                <button className="px-10 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all">
                    Request Credentials
                </button>
            </div>
        </div>
    );
}

import Link from 'next/link';
import { Library, Facebook, Instagram, Twitter, Youtube, Mail, MapPin, ChevronRight, Sparkles } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary-bg text-surface-light border-t border-white/5 pt-24 pb-12">
            <div className="container max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16 mb-20 px-2 md:px-0">
                    {/* Brand Identity */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative">
                                <div className="bg-secondary-action/20 p-2.5 rounded-xl border border-secondary-action/30 flex items-center justify-center group-hover:bg-secondary-action/40 transition-all duration-500">
                                    <Library className="text-secondary-action w-6 h-6" strokeWidth={2} />
                                </div>
                                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-accent-highlight animate-pulse" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-display font-bold text-white tracking-tight leading-none">
                                    Divya Gyan <span className="text-secondary-action">Dhara</span>
                                </span>
                                <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-surface-light/30 mt-1">
                                    Future-Ready Education
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed text-surface-light/40 font-medium">
                            A premium academic institution dedicated to deep understanding, assessment-driven learning, and long-term academic success for the next generation.
                        </p>
                        <div className="flex space-x-4">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-surface-light/30 hover:bg-secondary-action hover:text-white hover:border-secondary-action transition-all duration-300">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Academic Programs */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8">Academic Programs</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Middle School (5-8)', href: '/courses' },
                                { name: 'High School (9-10)', href: '/courses' },
                                { name: 'Senior Secondary (11-12)', href: '/courses' },
                                { name: 'Academic Foundation', href: '/courses' }
                            ].map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-surface-light/40 hover:text-white transition-all text-sm flex items-center group">
                                        <ChevronRight className="w-4 h-4 text-accent-highlight opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Resources */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8">Quick Resources</h4>
                        <ul className="space-y-4">
                            {['Teacher Profiles', 'Parent Portal', 'Academic Calendar', 'Study Materials', 'AI Recommendations'].map(link => (
                                <li key={link}>
                                    <Link href="#" className="text-surface-light/40 hover:text-white transition-all text-sm">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Official Contact */}
                    <div className="space-y-8">
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8">Official Contact</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start space-x-4">
                                <div className="p-2 rounded-lg bg-white/5 text-accent-highlight">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span className="text-sm text-surface-light/40 leading-relaxed font-medium">Suddhonwala, Dehradun, Uttarakhand</span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <div className="p-2 rounded-lg bg-white/5 text-secondary-action">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className="text-sm text-surface-light/40 font-medium">registrar@divyagyandhara.edu</span>
                            </li>
                        </ul>
                        <Link href="/contact" className="inline-flex items-center gap-2 text-accent-highlight font-bold uppercase tracking-widest text-[10px] group">
                            <span>Relink Database</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <p className="text-[10px] font-medium text-surface-light/20 uppercase tracking-[0.3em] max-w-xs md:max-w-none">
                        © {new Date().getFullYear()} Divya Gyan Dhara. Redefining Academic Excellence.
                    </p>
                    <div className="flex items-center space-x-6 md:space-x-10 text-[10px] font-bold uppercase tracking-[0.2em] text-surface-light/20">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Academic Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;


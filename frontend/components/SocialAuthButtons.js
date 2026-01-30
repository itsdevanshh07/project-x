'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { auth, googleProvider, microsoftProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { socialLogin } from '@/slices/authSlice';
import { toast } from 'react-toastify';

export default function SocialAuthButtons({ requiredRole }) {
    const [loadingProvider, setLoadingProvider] = useState(null);
    const dispatch = useDispatch();
    const popupInProgress = useRef(false);

    const handleSocialLogin = async (providerName) => {
        if (popupInProgress.current) return;
        popupInProgress.current = true;
        setLoadingProvider(providerName);
        const provider = providerName === 'google' ? googleProvider : microsoftProvider;

        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            // Dispatch to our backend via Redux action
            await dispatch(socialLogin({ idToken, provider: providerName, requiredRole })).unwrap();

            toast.success(`Successfully signed in with ${providerName.charAt(0).toUpperCase() + providerName.slice(1)}`);
        } catch (error) {
            console.error('Social Auth Error:', error);
            if (error.code === 'auth/popup-blocked') {
                toast.error('Popup blocked by browser. Please allow popups for this site.');
            } else if (error.code === 'auth/cancelled-popup-request') {
                // User closed the popup, ignore
            } else {
                toast.error(error.message || `Failed to sign in with ${providerName}`);
            }
        } finally {
            setLoadingProvider(null);
            popupInProgress.current = false;
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="space-y-4">
                {/* Google Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSocialLogin('google')}
                    disabled={loadingProvider !== null}
                    className="w-full flex items-center justify-center gap-4 py-4 px-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-all font-bold text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                    {loadingProvider === 'google' ? (
                        <Loader2 className="w-5 h-5 animate-spin text-surface-light/20" />
                    ) : (
                        <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 4.21 1.66z"
                                fill="#EA4335"
                            />
                        </svg>
                    )}
                    <span className="relative z-10 tracking-widest">{loadingProvider === 'google' ? 'INTERCONNECTING...' : 'CONTINUE WITH GOOGLE'}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.button>

                {/* Microsoft Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSocialLogin('microsoft')}
                    disabled={loadingProvider !== null}
                    className="w-full flex items-center justify-center gap-4 py-4 px-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-all font-bold text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                    {loadingProvider === 'microsoft' ? (
                        <Loader2 className="w-5 h-5 animate-spin text-surface-light/20" />
                    ) : (
                        <svg className="w-5 h-5 relative z-10 flex-shrink-0" viewBox="0 0 23 23">
                            <rect width="10.5" height="10.5" fill="#f25022" />
                            <rect x="11.5" width="10.5" height="10.5" fill="#7fbb00" />
                            <rect y="11.5" width="10.5" height="10.5" fill="#00a1f1" />
                            <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#ffbb00" />
                        </svg>
                    )}
                    <span className="relative z-10 tracking-widest">{loadingProvider === 'microsoft' ? 'INTERCONNECTING...' : 'CONTINUE WITH MICROSOFT'}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.button>
            </div>

            <p className="text-center text-[9px] text-surface-light/20 font-bold uppercase tracking-[0.3em] mt-8">
                Military-Grade Authentication Standards
            </p>
        </div>

    );
}

// 5. PREVENT FAST REFRESH POPUP BREAK
if (typeof window !== 'undefined' && import.meta?.hot) {
    import.meta.hot.accept();
}

// 5. PREVENT FAST REFRESH POPUP BREAK
if (typeof window !== 'undefined' && import.meta?.hot) {
    import.meta.hot.accept();
}

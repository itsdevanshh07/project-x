'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, removeFromCart } from '@/slices/studentSlice';
import { ShoppingCart, Trash2, ArrowRight, BookOpen, CreditCard } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const CartPage = () => {
    const dispatch = useDispatch();
    const { cart, isLoading } = useSelector((state) => state.student);
    const { user } = useSelector((state) => state.auth);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (user) {
            dispatch(getProfile());
        }
    }, [dispatch, user]);

    const totalAmount = cart.reduce((acc, item) => {
        const price = item.itemId.discountedPrice || item.itemId.price;
        return acc + price;
    }, 0);

    const handleRemove = (id) => {
        dispatch(removeFromCart(id));
    };

    const handleCheckout = async () => {
        try {
            const items = cart.map(item => ({
                itemType: item.itemType,
                itemId: item.itemId._id
            }));

            // Mock payment details
            const payload = {
                items,
                paymentId: 'pay_' + Math.random().toString(36).substr(2, 9),
                orderId: 'ord_' + Math.random().toString(36).substr(2, 9)
            };

            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/payments/checkout`, payload, config);

            if (response.data.success) {
                alert('Purchase successful!');
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error(error);
            alert('Checkout failed');
        }
    };

    if (!mounted || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-main">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-bg pt-28 md:pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-display font-black text-white mb-10">
                        Your <span className="text-secondary-action">Inventory.</span>
                    </h1>

                    {cart.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                {cart.map((item) => (
                                    <div key={item.itemId._id} className="glass-card p-5 md:p-6 rounded-3xl flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 border border-white/5 group hover:shadow-xl transition-all relative overflow-hidden">
                                        <div className="absolute inset-0 bg-secondary-action/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0 relative z-10">
                                            <img src={item.itemId.thumbnail} alt={item.itemId.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex-1 text-center sm:text-left relative z-10 w-full sm:w-auto">
                                            <div className="text-[9px] font-black text-secondary-action uppercase tracking-widest mb-1">{item.itemType} specialization</div>
                                            <h3 className="text-lg font-bold text-white leading-tight mb-2 line-clamp-1">{item.itemId.title}</h3>
                                            <div className="flex items-center justify-center sm:justify-start space-x-3">
                                                <span className="text-xl font-black text-white">₹{item.itemId.discountedPrice || item.itemId.price}</span>
                                                {item.itemId.discountedPrice && (
                                                    <span className="text-sm font-bold text-surface-light/20 line-through">₹{item.itemId.price}</span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(item.itemId._id)}
                                            className="p-3 text-surface-light/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-white/5 relative z-10"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 sticky top-32">
                                    <h3 className="text-xl font-bold text-white mb-6 font-display">Enrollment Summary</h3>
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-surface-light/40 font-bold text-xs uppercase tracking-widest">
                                            <span>Tier Access Fee</span>
                                            <span>₹{totalAmount}</span>
                                        </div>
                                        <div className="flex justify-between text-surface-light/40 font-bold text-xs uppercase tracking-widest">
                                            <span>Institutional Grant</span>
                                            <span className="text-accent-highlight">-₹0</span>
                                        </div>
                                        <div className="h-px bg-white/5 my-4" />
                                        <div className="flex justify-between text-xl font-black text-white px-2 py-4 bg-white/5 rounded-xl border border-white/5">
                                            <span>Total</span>
                                            <span className="text-secondary-action">₹{totalAmount}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        className="w-full py-5 bg-secondary-action text-white rounded-2xl font-black text-lg shadow-2xl shadow-secondary-action/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3"
                                    >
                                        <CreditCard className="w-6 h-6" />
                                        <span>Secure Checkout</span>
                                    </button>

                                    <p className="text-center text-[8px] text-surface-light/20 font-black uppercase tracking-[0.3em] mt-6">
                                        Institutional Security Protocols Active
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card rounded-[3rem] p-12 md:p-20 text-center border border-white/5 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-secondary-action/5 blur-[100px] pointer-events-none" />
                            <div className="w-20 h-20 bg-secondary-action/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-secondary-action border border-secondary-action/20">
                                <ShoppingCart className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-display font-black text-white mb-4">Inventory Empty</h2>
                            <p className="text-surface-light/40 max-w-md mx-auto mb-10 font-medium text-sm md:text-base italic leading-relaxed">
                                Your academic inventory is currently unallocated. Access the curriculum to specialize.
                            </p>
                            <Link href="/courses" className="btn-enroll inline-flex items-center space-x-3 px-12">
                                <span>Browse Curriculum</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartPage;

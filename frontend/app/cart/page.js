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
        <div className="min-h-screen bg-bg-main pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-display font-black text-text-primary mb-10">
                        Your <span className="text-brand-primary">Cart</span>
                    </h1>

                    {cart.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                {cart.map((item) => (
                                    <div key={item.itemId._id} className="glass p-6 rounded-3xl flex items-center space-x-6 border border-border-main group hover:shadow-xl transition-all">
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-bg-card flex-shrink-0">
                                            <img src={item.itemId.thumbnail} alt={item.itemId.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-1">{item.itemType}</div>
                                            <h3 className="text-lg font-bold text-text-primary leading-tight mb-2 line-clamp-1">{item.itemId.title}</h3>
                                            <div className="flex items-center space-x-3">
                                                <span className="text-xl font-black text-text-primary">₹{item.itemId.discountedPrice || item.itemId.price}</span>
                                                {item.itemId.discountedPrice && (
                                                    <span className="text-sm font-bold text-text-muted line-through">₹{item.itemId.price}</span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(item.itemId._id)}
                                            className="p-3 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-xl transition-all border border-border-main"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <div className="glass p-8 rounded-[2.5rem] border border-border-main sticky top-32">
                                    <h3 className="text-xl font-bold text-text-primary mb-6 font-display">Order Summary</h3>
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-text-secondary font-bold">
                                            <span>Subtotal</span>
                                            <span>₹{totalAmount}</span>
                                        </div>
                                        <div className="flex justify-between text-text-secondary font-bold">
                                            <span>Discount</span>
                                            <span className="text-brand-secondary">-₹0</span>
                                        </div>
                                        <div className="h-px bg-border-main my-4" />
                                        <div className="flex justify-between text-xl font-black text-text-primary">
                                            <span>Total</span>
                                            <span>₹{totalAmount}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3"
                                    >
                                        <CreditCard className="w-6 h-6" />
                                        <span>Checkout Now</span>
                                    </button>

                                    <p className="text-center text-[10px] text-text-muted font-bold uppercase tracking-widest mt-6">
                                        Secure Payment Guaranteed
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass rounded-[3rem] p-20 text-center border border-border-main">
                            <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand-primary">
                                <ShoppingCart className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-display font-black text-text-primary mb-4">Your cart is empty</h2>
                            <p className="text-text-secondary max-w-md mx-auto mb-8 font-medium">
                                Looks like you haven't added anything to your cart yet. Find some amazing courses to start!
                            </p>
                            <Link href="/courses" className="btn-primary inline-flex items-center space-x-2">
                                <span>Start Shopping</span>
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

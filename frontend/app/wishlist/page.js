'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, removeFromWishlist, addToCart } from '@/slices/studentSlice';
import { Heart, ShoppingCart, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

const WishlistPage = () => {
    const dispatch = useDispatch();
    const { wishlist, isLoading } = useSelector((state) => state.student);
    const { user } = useSelector((state) => state.auth);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (user) {
            dispatch(getProfile());
        }
    }, [dispatch, user]);

    const handleRemove = (id) => {
        dispatch(removeFromWishlist(id));
    };

    const handleMoveToCart = (item) => {
        dispatch(addToCart({ itemId: item.itemId._id, itemType: item.itemType }));
        dispatch(removeFromWishlist(item.itemId._id));
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
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-display font-black text-text-primary mb-10">
                        Your <span className="text-brand-reward">Wishlist</span>
                    </h1>

                    {wishlist.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {wishlist.map((item) => (
                                <div key={item.itemId._id} className="glass p-6 rounded-[2.5rem] border border-border-main flex items-center space-x-6 hover:shadow-2xl transition-all duration-500 group">
                                    <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-lg flex-shrink-0">
                                        <img src={item.itemId.thumbnail} alt={item.itemId.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-bold text-brand-reward uppercase tracking-widest mb-1">{item.itemType}</div>
                                        <h3 className="text-xl font-bold text-text-primary mb-2 line-clamp-1">{item.itemId.title}</h3>
                                        <div className="flex items-center space-x-4 mb-4">
                                            <span className="text-xl font-black text-text-primary">₹{item.itemId.discountedPrice || item.itemId.price}</span>
                                            {item.itemId.discountedPrice && (
                                                <span className="text-sm font-bold text-text-muted line-through">₹{item.itemId.price}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleMoveToCart(item)}
                                                className="flex-1 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primary/90 transition-colors flex items-center justify-center space-x-2"
                                            >
                                                <ShoppingCart className="w-3.5 h-3.5" />
                                                <span>Add to Cart</span>
                                            </button>
                                            <button
                                                onClick={() => handleRemove(item.itemId._id)}
                                                className="p-2.5 bg-bg-card text-text-secondary hover:bg-danger hover:text-white rounded-xl transition-all border border-border-main"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass rounded-[3rem] p-20 text-center border border-border-main">
                            <div className="w-20 h-20 bg-brand-reward/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand-reward">
                                <Heart className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-display font-black text-text-primary mb-4">Wishlist is empty</h2>
                            <p className="text-text-secondary max-w-md mx-auto mb-8 font-medium">
                                Save things you're interested in for later! Explore our courses and click the heart icon.
                            </p>
                            <Link href="/courses" className="btn-primary inline-flex items-center space-x-2">
                                <span>Discover Courses</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;

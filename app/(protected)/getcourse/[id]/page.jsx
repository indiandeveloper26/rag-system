"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Script from 'next/script';
import api from '../../../../src/lib/api';
import { useUserStore } from '../../../../src/lib/store/authStore';
import { Loader2, User, Globe, BookOpen, Users, Sparkles, Shield, CheckCircle, ArrowLeft } from 'lucide-react';

export default function Page() {
    const { id } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const { user } = useUserStore();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                setError(null);
                const { data } = await api.get(`/courses/select/${id}`);

                console.log('datatat', data)

                if (data.success) {
                    setCourse(data.course);
                } else {
                    setError("Course data load nahi ho paya.");
                }
            } catch (error) {
                console.error(error);
                setError("Course fetch karne me server error aayi.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCourse();
        }
    }, [id]);

    const handleBuyNow = async () => {
        try {
            setPaymentLoading(true);

            const orderResponse = await api.post('/payment/checkout', { courseId: course._id });

            if (!orderResponse.data.success) {
                alert("Order create karne me dikkat aayi");
                setPaymentLoading(false);
                return;
            }

            const { amount, id: order_id, currency } = orderResponse.data.order;

            const options = {
                key: 'rzp_test_T6acFMA7nhT3y9',
                amount: amount,
                currency: currency,
                name: "Aapki Coding Academy",
                description: `Purchase: ${course.title}`,
                image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200",
                order_id: order_id,
                handler: async function (response) {
                    try {
                        const verifyResponse = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            courseId: course._id,
                            userId: user?._id
                        });

                        console.log('Payment verification response:', verifyResponse.data);

                        if (verifyResponse.data.success) {
                            alert("🎉 Badhai ho! Payment successful.");
                            router.push('/mycourse');
                        } else {
                            alert("❌ Payment verification fail ho gayi.");
                        }
                    } catch (err) {
                        console.error(err);
                        alert("Verification error!");
                    }
                },
                prefill: {
                    name: user?.name || "Anonymous User",
                    email: user?.email || "user@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#4f46e5",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("Checkout Error:", err);
            alert("Something went wrong with the payment gateway.");
        } finally {
            setPaymentLoading(false);
        }
    };

    // Shimmer/Skeleton Loading UI
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 p-4">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 size={36} className="animate-spin text-indigo-500" />
                    <p className="text-sm font-medium tracking-wide">Fetching premium course details...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-3 sm:p-4">
                <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
                    <span className="text-3xl sm:text-4xl">⚠️</span>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-200 mt-3 sm:mt-4">Oops! Course Not Found</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1.5 sm:mt-2">{error || "The link might be broken or expired."}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-4 sm:mt-6 px-4 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-medium transition-all w-full sm:w-auto"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-8 sm:py-10 lg:py-12 px-3 sm:px-6 lg:px-8 font-sans antialiased">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            {/* Back Button */}
            <div className="max-w-6xl mx-auto mb-4 sm:mb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs sm:text-sm"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">

                {/* Left Section: Meta Data & Media */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                    {/* Course Heading */}
                    <div>
                        <span className="inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider mb-3 sm:mb-4">
                            <Sparkles size={12} className="mr-1" />
                            {course.category || "General"}
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3 sm:mb-4 capitalize">
                            {course.title || "Untitled Course"}
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed max-w-3xl">
                            {course.description || "No description provided for this course."}
                        </p>
                    </div>

                    {/* Meta Specifications Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 bg-slate-900/60 p-3 sm:p-4 rounded-xl border border-slate-800/80">
                        <div className="p-1 sm:p-2">
                            <p className="text-[10px] sm:text-xs text-slate-500 font-medium flex items-center gap-1">
                                <Globe size={12} /> Language
                            </p>
                            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5 capitalize">{course.language || "English"}</p>
                        </div>
                        <div className="p-1 sm:p-2">
                            <p className="text-[10px] sm:text-xs text-slate-500 font-medium flex items-center gap-1">
                                <BookOpen size={12} /> Level
                            </p>
                            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5 capitalize">{course.level || "Beginner"}</p>
                        </div>
                        <div className="p-1 sm:p-2">
                            <p className="text-[10px] sm:text-xs text-slate-500 font-medium flex items-center gap-1">
                                <User size={12} /> Lessons
                            </p>
                            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">{course.totalLessons || 0} Modules</p>
                        </div>
                        <div className="p-1 sm:p-2">
                            <p className="text-[10px] sm:text-xs text-slate-500 font-medium flex items-center gap-1">
                                <Users size={12} /> Students
                            </p>
                            <p className="text-xs sm:text-sm font-semibold text-emerald-400 mt-0.5">{course.totalStudents || 0} Active</p>
                        </div>
                    </div>

                    {/* Course Image Banner - No Video */}
                    <div className="space-y-3">
                        <h3 className="text-sm sm:text-md font-bold tracking-wide text-slate-300 flex items-center gap-2">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Course Preview
                        </h3>
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner">
                            <img
                                src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500"}
                                alt={course.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>

                            {/* Play Icon Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-indigo-600/80 backdrop-blur-sm flex items-center justify-center shadow-2xl border border-indigo-400/30">
                                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                                </div>
                            </div>

                            {/* Course Badge */}
                            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                                <span className="text-[10px] sm:text-xs font-bold text-white bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-700/50">
                                    📚 {course.totalLessons || 0} Lessons
                                </span>
                                <span className="text-[10px] sm:text-xs font-bold text-emerald-400 bg-emerald-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-emerald-500/30">
                                    ⭐ Premium
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Course Features */}
                    <div className="bg-slate-900/40 rounded-xl p-4 sm:p-6 border border-slate-800/60">
                        <h4 className="text-sm sm:text-base font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                            <Shield size={18} className="text-indigo-400" />
                            What You'll Learn
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            {[
                                "Complete course curriculum",
                                "Hands-on projects",
                                "Expert instructor support",
                                "Lifetime access",
                                "Certificate on completion",
                                "Community access"
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                                    <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Absolute Dynamic Pricing Checkout Card */}
                <div className="lg:sticky lg:top-8">
                    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl p-4 sm:p-6 backdrop-blur-sm">
                        {/* Card Thumbnail */}
                        <div className="relative h-36 sm:h-40 lg:h-48 w-full bg-slate-800 rounded-xl overflow-hidden mb-4 sm:mb-6 border border-slate-700/30">
                            <img
                                src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500"}
                                alt={course.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                            <div className="absolute bottom-2 left-2 right-2">
                                <span className="text-[8px] sm:text-[10px] font-bold text-white bg-indigo-600/80 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                                    {course.category || "Course"}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                                <span className="text-xs sm:text-sm font-medium text-slate-400">Total Course Fee</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                        ₹{course.price ? course.price.toLocaleString('en-IN') : 0}
                                    </span>
                                </div>
                            </div>

                            <div className="h-[1px] bg-slate-800 w-full"></div>

                            {/* Feature Bullet points */}
                            <ul className="text-[10px] sm:text-xs text-slate-400 space-y-2 sm:space-y-2.5">
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <span>Full lifetime access to streaming dashboard</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <span>Access on mobile, tablet, and desktop</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <span>Verified Certificate on Completion</span>
                                </li>
                            </ul>

                            {/* Interactive Dynamic Buy Button */}
                            <button
                                onClick={handleBuyNow}
                                disabled={paymentLoading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 font-bold text-xs sm:text-sm py-3.5 sm:py-4 px-4 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 border border-indigo-500/20 disabled:border-slate-700"
                            >
                                {paymentLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Opening Gateway...</span>
                                    </>
                                ) : (
                                    "🚀 Buy Now & Start Learning"
                                )}
                            </button>

                            <p className="text-[8px] sm:text-[10px] text-slate-500 text-center">
                                🔒 Secure payment via Razorpay
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
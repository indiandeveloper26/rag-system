"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Script from 'next/script';
import api from '../../../src/lib/api';
import { useUserStore } from '../../../src/lib/store/authStore';

export default function page() {
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
                setLoading(false); // 💡 Fix: Loading ko false karna zaroori hai
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
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium tracking-wide">Fetching premium course details...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md text-center shadow-2xl">
                    <span className="text-4xl">⚠️</span>
                    <h2 className="text-xl font-bold text-slate-200 mt-4">Oops! Course Not Found</h2>
                    <p className="text-sm text-slate-400 mt-2">{error || "The link might be broken or expired."}</p>
                    <button onClick={() => router.push('/')} className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-all">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left Section: Meta Data & Media */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Course Heading */}
                    <div>
                        <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider mb-4">
                            ⚡ {course.category || "General"}
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 capitalize">
                            {course.title || "Untitled Course"}
                        </h1>
                        <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-3xl">
                            {course.description || "No description provided for this course."}
                        </p>
                    </div>

                    {/* Meta Specifications Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                        <div className="p-2">
                            <p className="text-xs text-slate-500 font-medium">Language</p>
                            <p className="text-sm font-semibold text-slate-200 mt-0.5 capitalize">{course.language || "English"}</p>
                        </div>
                        <div className="p-2">
                            <p className="text-xs text-slate-500 font-medium">Difficulty Level</p>
                            <p className="text-sm font-semibold text-slate-200 mt-0.5 capitalize">{course.level || "Beginner"}</p>
                        </div>
                        <div className="p-2">
                            <p className="text-xs text-slate-500 font-medium">Lessons</p>
                            <p className="text-sm font-semibold text-slate-200 mt-0.5">{course.totalLessons || 0} Modules</p>
                        </div>
                        <div className="p-2">
                            <p className="text-xs text-slate-500 font-medium">Enrolled Students</p>
                            <p className="text-sm font-semibold text-emerald-400 mt-0.5">{course.totalStudents || 0} Active</p>
                        </div>
                    </div>

                    {/* Premium Live Video URL Integration */}
                    {course.liveVideoUrl && (
                        <div className="space-y-3">
                            <h3 className="text-md font-bold tracking-wide text-slate-300 flex items-center gap-2">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                </span>
                                Course Trailer & Preview
                            </h3>
                            <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner">
                                <video
                                    src={course.liveVideoUrl}
                                    controls
                                    className="w-full h-full object-cover"
                                    poster={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500"}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Absolute Dynamic Pricing Checkout Card */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl p-6 lg:sticky lg:top-8 backdrop-blur-sm">
                    {/* Card Thumbnail if Video doesn't take priority */}
                    <div className="relative h-48 w-full bg-slate-800 rounded-xl overflow-hidden mb-6 border border-slate-700/30">
                        <img
                            src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500"}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-400">Total Course Fee</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-white tracking-tight">
                                    ₹{course.price ? course.price.toLocaleString('en-IN') : 0}
                                </span>
                            </div>
                        </div>

                        <div className="h-[1px] bg-slate-800 w-full"></div>

                        {/* Feature Bullet points */}
                        <ul className="text-xs text-slate-400 space-y-2.5 my-2">
                            <li className="flex items-center gap-2">✔ Full lifetime access to streaming dashboard</li>
                            <li className="flex items-center gap-2">✔ Access on mobile, tablet, and desktop TV</li>
                            <li className="flex items-center gap-2">✔ Verified Certificate on Completion</li>
                        </ul>

                        {/* Interactive Dynamic Buy Button */}
                        <button
                            onClick={handleBuyNow}
                            disabled={paymentLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 font-bold text-sm py-4 px-4 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 border border-indigo-500/20 disabled:border-slate-700"
                        >
                            {paymentLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                    <span>Opening Secured Gateway...</span>
                                </>
                            ) : (
                                "🚀 Buy Now & Start Instant Learning"
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
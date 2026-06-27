"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Script from 'next/script'; // 👈 Script load karne ke liye
import api from '../../../src/lib/api';
import { useUserStore } from '../../../src/lib/store/authStore';

export default function CourseDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false); // 👈 Payment processing state

    const { user } = useUserStore();

    useEffect(() => {
        if (!id) return;
        const fetchCourseDetails = async () => {
            try {
                const response = await api.get(`/courses/get/${id}`);
                if (response.data && response.data.success) {
                    setCourse(response.data.course);
                }
            } catch (err) {
                setError("Course load karne mein error aayi");
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetails();
    }, [id]);

    // 🚀 RAZERPAY PAYMENT FUNCTION
    const handleBuyNow = async () => {
        try {
            setPaymentLoading(true);

            // 1. Backend se Razorpay Order ID mangwayein
            const orderResponse = await api.post('/payment/checkout', { courseId: course._id });


            console.log('resdtatata', orderResponse)

            if (!orderResponse.data.success) {
                alert("Order create karne me dikkat aayi");
                setPaymentLoading(false);
                return;
            }

            const { amount, id: order_id, currency } = orderResponse.data.order;

            // 2. Razorpay Checkout Modal ke options configure karein
            const options = {
                key: 'rzp_test_T6acFMA7nhT3y9', // Frontend Public Key (.env.local se)
                amount: amount,
                currency: currency,
                name: "Aapki Coding Academy",
                description: `Purchase: ${course.title}`,
                image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200", // Logo URL
                order_id: order_id,
                // Jab payment successful ho jaye tab ye handler chalega
                handler: async function (response) {
                    try {
                        // 3. Signature verify karne ke liye data backend bhejein
                        const verifyResponse = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            courseId: course._id,
                            userId: user?._id
                        });

                        if (verifyResponse.data.success) {
                            alert("🎉 Badhai ho! Payment successful.");
                            router.push('/dashboard'); // Success ke baad dashboard bhej dein
                        } else {
                            alert("❌ Payment verification fail ho gayi.");
                        }
                    } catch (err) {
                        console.error(err);
                        alert("Verification error!");
                    }
                },
                prefill: {
                    name: "John Doe", // Yahan logged-in user ka naam dal sakte ho
                    email: "johndoe@example.com",
                    contact: "9999999999",
                },
                notes: {
                    address: "Corporate Office",
                },
                theme: {
                    color: "#4f46e5", // Indigo color modal theme ke liye
                },
            };

            // 3. Razorpay Modal Open Karein
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("Checkout Error:", err);
            alert("Something went wrong with the payment gateway.");
        } finally {
            setPaymentLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error || !course) return <div className="text-center py-20">Course not found!</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Razorpay SDK Script Inject Kar Rahe Hain */}
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left Side: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase block mb-2">{course.category}</span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">{course.title}</h1>
                        <p className="text-slate-600 leading-relaxed">{course.description}</p>
                    </div>
                </div>

                {/* Right Side: Checkout Card */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-md p-6 sticky top-8">
                    <div className="relative h-44 w-full bg-slate-200 rounded-xl overflow-hidden mb-6">
                        <img src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500"} alt={course.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900">₹{course.price ? course.price.toLocaleString('en-IN') : 0}</span>
                        </div>

                        {/* Updated Buy Now Button */}
                        <button
                            onClick={handleBuyNow}
                            disabled={paymentLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-base py-3.5 px-4 rounded-xl shadow-sm transition-all text-center"
                        >
                            {paymentLoading ? "🔄 Opening Gateway..." : "🚀 Buy Now & Start Learning"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
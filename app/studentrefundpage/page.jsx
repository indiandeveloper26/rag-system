'use client'

import React, { useState, useEffect } from 'react';
import api from '../../src/lib/api';
import { useUserStore } from '../../src/lib/store/authStore';

export default function page() {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useUserStore();

    useEffect(() => {
        const fetchStudentRefunds = async () => {
            if (!user?._id) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const response = await api.get(`/refund/student/${user._id}`);
                console.log('response student', response.data);

                if (response.data.success) {
                    setRefunds(response.data.data);
                } else {
                    setError("Refund details load nahi ho payi.");
                }
            } catch (err) {
                console.error("Error fetching student refunds:", err);
                setError(err.response?.data?.message || err.message || "Server issue");
            } finally {
                setLoading(false);
            }
        };

        fetchStudentRefunds();
    }, [user?._id]);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center p-6">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                <p className="ml-3 text-slate-500 font-medium">Checking your refund status...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto my-8 max-w-2xl rounded-xl border border-rose-100 bg-rose-50 p-4 text-rose-700">
                <p className="font-semibold">Error loading data</p>
                <p className="text-sm opacity-90">{error}</p>
            </div>
        );
    }

    if (refunds.length === 0) {
        return (
            <div className="mx-auto my-12 max-w-md text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 2.24c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 0 1 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664 0 .414-.336.75-.75.75h-4.5a.75.75 0 0 1-.75-.75 2.25 2.25 0 0 1 .1-.664m-5.8 0A2.251 2.251 0 0 0 13.5 2.25H12c-1.03 0-1.9.693-2.166 1.638" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">No Refunds Found</h3>
                <p className="text-sm text-slate-500 mt-1">Aapne abhi tak kisi bhi course ke liye refund request submit nahi ki hai.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl p-4 sm:p-6 font-sans">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Refund Requests</h1>
                <p className="text-sm text-slate-500">Apne applied refunds ka live status aur history track karein.</p>
            </div>

            <div className="flex flex-col gap-6">
                {refunds.map((refund) => (
                    <div key={refund._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">

                        {/* Upper Info Row */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold uppercase text-lg shadow-inner">
                                    {refund.courseId?.title?.substring(0, 2) || "CO"}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg capitalize">{refund.courseId?.title || "Course"}</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Requested on: {new Date(refund.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:text-right gap-4">
                                <div>
                                    <span className="text-xs text-slate-400 block">Amount</span>
                                    <span className="font-bold text-slate-900 text-lg">₹{refund.courseId?.price || 0}</span>
                                </div>

                                {/* Status Badges - Added 'admin_approved' support */}
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${refund.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                    refund.status === 'admin_approved' || refund.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                        'bg-rose-50 text-rose-700 border border-rose-200'
                                    }`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${refund.status === 'pending' ? 'bg-amber-500' :
                                        refund.status === 'admin_approved' || refund.status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'
                                        }`} />
                                    {refund.status === 'admin_approved' ? 'Approved' : refund.status}
                                </span>
                            </div>
                        </div>

                        {/* Middle Section: Reason Provided */}
                        <div className="my-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                            <span className="font-semibold text-slate-500 block text-xs uppercase tracking-wide mb-1">Reason for Refund:</span>
                            "{refund.reason}"
                        </div>

                        {/* Live Progress Timeline */}
                        <div className="mt-8 px-4">
                            <div className="relative flex items-center justify-between before:absolute before:left-0 before:right-0 before:top-1/2 before:h-0.5 before:-translate-y-1/2 before:bg-slate-100 before:content-['']">

                                {/* Step 1: Request Raised */}
                                <div className="relative z-10 flex flex-col items-center bg-white px-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white font-semibold text-xs shadow">
                                        ✓
                                    </div>
                                    <span className="mt-2 text-xs font-medium text-slate-600 whitespace-nowrap">Request Sent</span>
                                </div>

                                {/* Step 2: Under Review */}
                                <div className="relative z-10 flex flex-col items-center bg-white px-2">
                                    <div className={`flex h-7 w-7 items-center justify-center rounded-full font-semibold text-xs shadow ${refund.status === 'pending' ? 'bg-amber-500 text-white animate-pulse' : 'bg-indigo-600 text-white'
                                        }`}>
                                        {refund.status === 'pending' ? '●' : '✓'}
                                    </div>
                                    <span className="mt-2 text-xs font-medium text-slate-600 whitespace-nowrap">Under Review</span>
                                </div>

                                {/* Step 3: Final Decision - Added 'admin_approved' support */}
                                <div className="relative z-10 flex flex-col items-center bg-white px-2">
                                    <div className={`flex h-7 w-7 items-center justify-center rounded-full font-semibold text-xs shadow ${refund.status === 'admin_approved' || refund.status === 'approved' ? 'bg-emerald-500 text-white' :
                                        refund.status === 'rejected' ? 'bg-rose-500 text-white' :
                                            'bg-slate-200 text-slate-400'
                                        }`}>
                                        {refund.status === 'admin_approved' || refund.status === 'approved' ? '✓' : refund.status === 'rejected' ? '✕' : '3'}
                                    </div>
                                    <span className="mt-2 text-xs font-medium text-slate-600 whitespace-nowrap">
                                        {refund.status === 'rejected' ? 'Rejected' : refund.status === 'admin_approved' || refund.status === 'approved' ? 'Approved' : 'Processed'}
                                    </span>
                                </div>

                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
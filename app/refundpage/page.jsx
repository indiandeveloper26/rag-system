'use client'

import React, { useState, useEffect } from 'react';
import api from '../../src/lib/api';
import { useUserStore } from '../../src/lib/store/authStore';

export default function RefundDashboard() {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, } = useUserStore();

    console.log('user data', user);

    // 1. Fetch data from Backend on Component Mount
    useEffect(() => {
        if (!user?._id) return;

        const fetchRefunds = async () => {
            try {
                setLoading(true);

                const response = await api.get(`/refund/admin/${user._id}`);

                console.log(response.data);

                if (response.data.success) {
                    setRefunds(response.data.data);
                } else {
                    setError("Data fetch nahi ho paya");
                }
            } catch (err) {
                console.error("Error fetching refunds:", err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRefunds();
    }, [user]);









    const approveRefund = async (refundId) => {



        try {
            const res = await api.put(
                `/refund/approve/${refundId}`,
                {
                    adminId: user._id,
                    comment: "Approved by admin"
                }
            );

            console.log(res.data);
        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };








    // 2. Handle Approve / Reject Actions
    const handleAction = async (id, newStatus) => {
        try {
            // Backend status update route (Maan kar chal rahe hain ki aapka route /refund/:id ya /refund/update hai)
            const response = await axios.put(`http://localhost:5000/refund/${id}`, {
                status: newStatus
            });

            if (response.data.success) {
                // State update taaki UI bina reload kiye change ho jaye
                setRefunds(prev =>
                    prev.map(item => item._id === id ? { ...item, status: newStatus } : item)
                );
                alert(`Refund request ${newStatus} successfully!`);
            }
        } catch (err) {
            console.error("Action error:", err);
            alert("Status update karne me error aayi: " + err.message);
        }
    };

    // Loading State
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                <p className="ml-3 font-medium text-slate-600">Loading refund data...</p>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 text-rose-600 font-medium">
                Error: {error}. Please ensure your backend is running on port 5000.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">

            {/* Header Section */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Refund Requests</h1>
                    <p className="text-sm text-slate-500">Manage student course refund claims and applications.</p>
                </div>

                {/* Total Refunds Card */}
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:w-64">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.854-1.106-2.24 0-3.093.563-.434 1.285-.65 2.003-.651.157 0 .311.003.463.008M12 6V3m0 15v3m0-18c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9Z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Requests</p>
                        <p className="text-xl font-bold text-slate-900">{refunds.length}</p>
                    </div>
                </div>
            </div>

            {/* Main Table Container */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Course Info</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Requested Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {refunds.map((refund) => (
                                <tr key={refund._id} className="hover:bg-slate-50/70 transition-colors">

                                    {/* Student Details */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={refund.studentId?.avatar}
                                                alt={refund.studentId?.name}
                                                className="h-9 w-9 rounded-full bg-slate-100 object-cover"
                                                onError={(e) => { e.currentTarget.src = 'https://avatar.iran.liara.run/public' }}
                                            />
                                            <div>
                                                <div className="font-semibold text-slate-900">{refund.studentId?.name || 'Unknown Student'}</div>
                                                <div className="text-xs text-slate-400">{refund.studentId?.email}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Course Details */}
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-slate-900 capitalize">{refund.courseId?.title}</div>
                                            <div className="text-xs font-semibold text-indigo-600">₹{refund.courseId?.price}</div>
                                        </div>
                                    </td>

                                    {/* Reason */}
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="truncate text-slate-600" title={refund.reason}>
                                            {refund.reason}
                                        </p>
                                    </td>

                                    {/* Date */}
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                        {new Date(refund.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>

                                    {/* Status Badges */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${refund.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                            refund.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                'bg-rose-50 text-rose-700 border border-rose-200'
                                            }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${refund.status === 'pending' ? 'bg-amber-500' :
                                                refund.status === 'approved' ? 'bg-emerald-500' :
                                                    'bg-rose-500'
                                                }`} />
                                            {refund.status}
                                        </span>
                                    </td>

                                    {/* Actions Button */}
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        {refund.status === 'pending' ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleAction(refund._id, 'rejected')}
                                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition-all"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => approveRefund(refund._id, 'approved')}
                                                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm transition-all"
                                                >
                                                    Approve Refund
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">No actions needed</span>
                                        )}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {refunds.length === 0 && (
                    <div className="p-8 text-center text-slate-400">
                        No refund requests found.
                    </div>
                )}
            </div>

        </div>
    );
}
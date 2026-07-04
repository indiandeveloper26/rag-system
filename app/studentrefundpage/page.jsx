'use client'

import React, { useState, useEffect } from 'react';
import api from '../../src/lib/api';
import { useUserStore } from '../../src/lib/store/authStore';
import {
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    BookOpen,
    DollarSign,
    Calendar,
    User,
    RefreshCw,
    Layers,
    ChevronRight,
    FileText,
    TrendingUp
} from 'lucide-react';

export default function Page() {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRefund, setExpandedRefund] = useState(null);

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

    // Get status config
    const getStatusConfig = (status) => {
        const configs = {
            'pending': {
                icon: Clock,
                color: 'amber',
                bg: 'bg-amber-500/10',
                border: 'border-amber-500/20',
                text: 'text-amber-400',
                dot: 'bg-amber-400 animate-pulse',
                label: 'Pending Review'
            },
            'approved': {
                icon: CheckCircle,
                color: 'emerald',
                bg: 'bg-emerald-500/10',
                border: 'border-emerald-500/20',
                text: 'text-emerald-400',
                dot: 'bg-emerald-400',
                label: 'Approved'
            },
            'admin_approved': {
                icon: CheckCircle,
                color: 'emerald',
                bg: 'bg-emerald-500/10',
                border: 'border-emerald-500/20',
                text: 'text-emerald-400',
                dot: 'bg-emerald-400',
                label: 'Approved'
            },
            'rejected': {
                icon: XCircle,
                color: 'rose',
                bg: 'bg-rose-500/10',
                border: 'border-rose-500/20',
                text: 'text-rose-400',
                dot: 'bg-rose-400',
                label: 'Rejected'
            }
        };
        return configs[status] || configs['pending'];
    };

    // Calculate stats
    const stats = {
        total: refunds.length,
        pending: refunds.filter(r => r.status === 'pending').length,
        approved: refunds.filter(r => r.status === 'approved' || r.status === 'admin_approved').length,
        rejected: refunds.filter(r => r.status === 'rejected').length,
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative inline-block">
                        <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <RefreshCw className="w-6 h-6 text-indigo-400 animate-pulse" />
                        </div>
                    </div>
                    <p className="mt-4 text-slate-400 font-medium">Checking your refund status...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700">
                    <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                        <AlertCircle className="w-8 h-8 text-rose-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 text-center mb-2">Error Loading Data</h3>
                    <p className="text-slate-400 text-center text-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (refunds.length === 0) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-700">
                        <FileText className="w-12 h-12 text-slate-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">No Refund Requests</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        You haven't submitted any refund requests yet.
                    </p>
                    <button
                        onClick={() => window.location.href = '/getcourse'}
                        className="mt-6 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25"
                    >
                        Browse Courses
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/10 text-indigo-400 text-xs font-semibold mb-3 tracking-wider uppercase border border-indigo-500/20">
                                <Layers className="w-3.5 h-3.5" />
                                Student Portal
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
                                Refund <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Requests</span>
                            </h1>
                            <p className="mt-2 text-sm text-slate-400">
                                Track and manage all your refund applications
                            </p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-slate-800 rounded-xl px-4 py-3 border border-slate-700">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total</p>
                                <p className="text-xl font-black text-slate-100">{stats.total}</p>
                            </div>
                            <div className="bg-amber-500/10 rounded-xl px-4 py-3 border border-amber-500/20">
                                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Pending</p>
                                <p className="text-xl font-black text-amber-400">{stats.pending}</p>
                            </div>
                            <div className="bg-emerald-500/10 rounded-xl px-4 py-3 border border-emerald-500/20">
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Approved</p>
                                <p className="text-xl font-black text-emerald-400">{stats.approved}</p>
                            </div>
                            <div className="bg-rose-500/10 rounded-xl px-4 py-3 border border-rose-500/20">
                                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Rejected</p>
                                <p className="text-xl font-black text-rose-400">{stats.rejected}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Refund Cards */}
                <div className="flex flex-col gap-4">
                    {refunds.map((refund) => {
                        const statusConfig = getStatusConfig(refund.status);
                        const StatusIcon = statusConfig.icon;
                        const isExpanded = expandedRefund === refund._id;

                        return (
                            <div
                                key={refund._id}
                                className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all duration-300"
                            >
                                {/* Card Header - Click to expand */}
                                <div
                                    className="p-5 cursor-pointer hover:bg-slate-700/30 transition-colors"
                                    onClick={() => setExpandedRefund(isExpanded ? null : refund._id)}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        {/* Left: Course Info */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 font-bold text-lg border border-indigo-500/20 flex-shrink-0">
                                                {refund.courseId?.title?.substring(0, 2) || "CO"}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-100 text-lg capitalize">
                                                    {refund.courseId?.title || "Course"}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(refund.createdAt).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="text-xs text-slate-600">•</span>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        <DollarSign className="w-3 h-3" />
                                                        ₹{refund.courseId?.price?.toLocaleString('en-IN') || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Status & Expand */}
                                        <div className="flex items-center gap-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
                                                {statusConfig.label}
                                            </span>
                                            <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 pt-2 border-t border-slate-700/50 animate-fadeIn">
                                        {/* Reason */}
                                        <div className="bg-slate-900/50 rounded-xl p-4 mb-5 border border-slate-700/50">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <FileText className="w-4 h-4 text-slate-400" />
                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reason for Refund</p>
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed">"{refund.reason}"</p>
                                        </div>

                                        {/* Timeline */}
                                        <div className="mt-4">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <TrendingUp className="w-3.5 h-3.5" />
                                                Request Progress
                                            </p>
                                            <div className="relative flex items-center justify-between px-2">
                                                {/* Timeline Line */}
                                                <div className="absolute left-[15%] right-[15%] top-1/2 h-0.5 -translate-y-1/2 bg-slate-700">
                                                    <div className={`h-full transition-all duration-700 ${refund.status === 'approved' || refund.status === 'admin_approved' ? 'w-full bg-emerald-500' :
                                                            refund.status === 'rejected' ? 'w-2/3 bg-rose-500' :
                                                                'w-1/3 bg-amber-500'
                                                        }`} />
                                                </div>

                                                {/* Step 1: Request Sent */}
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25">
                                                        ✓
                                                    </div>
                                                    <span className="mt-2 text-[10px] font-medium text-slate-400 text-center">Request<br />Sent</span>
                                                </div>

                                                {/* Step 2: Review */}
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <div className={`flex h-9 w-9 items-center justify-center rounded-full font-bold text-sm shadow-lg ${refund.status === 'pending' ? 'bg-amber-500 text-white shadow-amber-500/25 animate-pulse' :
                                                            refund.status === 'approved' || refund.status === 'admin_approved' ? 'bg-emerald-500 text-white shadow-emerald-500/25' :
                                                                refund.status === 'rejected' ? 'bg-rose-500 text-white shadow-rose-500/25' :
                                                                    'bg-slate-600 text-slate-400'
                                                        }`}>
                                                        {refund.status === 'pending' ? '...' : '✓'}
                                                    </div>
                                                    <span className="mt-2 text-[10px] font-medium text-slate-400 text-center">Under<br />Review</span>
                                                </div>

                                                {/* Step 3: Decision */}
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <div className={`flex h-9 w-9 items-center justify-center rounded-full font-bold text-sm shadow-lg ${refund.status === 'approved' || refund.status === 'admin_approved' ? 'bg-emerald-500 text-white shadow-emerald-500/25' :
                                                            refund.status === 'rejected' ? 'bg-rose-500 text-white shadow-rose-500/25' :
                                                                'bg-slate-600 text-slate-400'
                                                        }`}>
                                                        {refund.status === 'approved' || refund.status === 'admin_approved' ? '✓' :
                                                            refund.status === 'rejected' ? '✕' : '?'}
                                                    </div>
                                                    <span className="mt-2 text-[10px] font-medium text-slate-400 text-center">
                                                        {refund.status === 'approved' || refund.status === 'admin_approved' ? 'Approved' :
                                                            refund.status === 'rejected' ? 'Rejected' : 'Pending'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Status Message */}
                                            <div className={`mt-5 text-center text-xs font-medium px-4 py-2 rounded-lg ${refund.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                    refund.status === 'approved' || refund.status === 'admin_approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                }`}>
                                                {refund.status === 'pending' ? '⏳ Your request is being reviewed by the admin team' :
                                                    refund.status === 'approved' || refund.status === 'admin_approved' ? '✅ Your refund has been approved successfully!' :
                                                        '❌ Your refund request has been rejected'}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-center text-xs text-slate-500">
                    Showing {refunds.length} refund request{refunds.length > 1 ? 's' : ''}
                </div>
            </div>
        </div>
    );
}
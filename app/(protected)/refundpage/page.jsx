'use client'

import React, { useState, useEffect } from 'react';

import { useUserStore } from '../../../src/lib/store/authStore';
import {
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Clock,
    User,
    BookOpen,
    DollarSign,
    AlertCircle,
    RefreshCw,
    ChevronDown,
    Layers
} from 'lucide-react';
import api from '../../../src/lib/api';

export default function Page() {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [expandedRow, setExpandedRow] = useState(null);
    const { user } = useUserStore();

    console.log('user data', user);

    useEffect(() => {
        if (!user?._id) {
            setLoading(false);
            return;
        }

        const fetchRefunds = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/refund/admin/${user._id}`);
                console.log("Fetched Data:", response.data);

                if (response.data.success) {
                    setRefunds(response.data.data || []);
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

    const handleStatusChange = async (refundId, newStatus) => {
        try {
            let response;

            if (newStatus === 'approved') {
                response = await api.put(`/refund/approve/${refundId}`, {
                    adminId: user?._id,
                    comment: "Approved by admin"
                });
            } else {
                response = await api.put(`/refund/${refundId}`, {
                    status: newStatus
                });
            }

            if (response.data) {
                setRefunds(prev =>
                    prev.map(item => item._id === refundId ? { ...item, status: newStatus } : item)
                );
            }
        } catch (err) {
            console.error("Action error:", err);
            alert("Status update karne me error aayi: " + (err.response?.data?.message || err.message));
        }
    };

    // Filter and Search Logic
    const filteredRefunds = refunds.filter(refund => {
        const matchesSearch = refund.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            refund.studentId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            refund.courseId?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || refund.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Stats
    const stats = {
        total: refunds.length,
        pending: refunds.filter(r => r.status === 'pending').length,
        approved: refunds.filter(r => r.status === 'approved').length,
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
                    <p className="mt-4 text-slate-400 font-medium">Loading refund requests...</p>
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
                    <h3 className="text-xl font-bold text-slate-100 text-center mb-2">Something went wrong</h3>
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

    return (
        <div className="min-h-screen bg-slate-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/10 text-indigo-400 text-xs font-semibold mb-3 tracking-wider uppercase border border-indigo-500/20">
                                <Layers className="w-3.5 h-3.5" />
                                Admin Panel
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
                                Refund <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Requests</span>
                            </h1>
                            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
                                Manage and process student course refund claims efficiently.
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

                    {/* Search and Filter */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by student name, email, or course..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm text-slate-100 placeholder-slate-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                    {filteredRefunds.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="w-10 h-10 text-slate-500" />
                            </div>
                            <p className="text-slate-400 font-medium">No refund requests found</p>
                            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filter</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead className="bg-slate-900/50">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Student</th>
                                        <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 hidden md:table-cell">Course</th>
                                        <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 hidden lg:table-cell">Reason</th>
                                        <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 hidden sm:table-cell">Date</th>
                                        <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                                        <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {filteredRefunds.map((refund) => (
                                        <React.Fragment key={refund._id}>
                                            <tr className="hover:bg-slate-700/50 transition-colors">
                                                {/* Student */}
                                                <td className="px-4 sm:px-6 py-4">
                                                    <div className="flex items-center gap-3">

                                                        {/* <h1>img  {JSON.stringify(refund.studentId?.avatar)} </h1> */}
                                                        <img
                                                            src={refund.studentId?.avatar}
                                                            alt={refund.studentId?.name}
                                                            className="h-9 w-9 rounded-full bg-slate-700 object-cover border border-slate-600"
                                                            onError={(e) => { e.currentTarget.src = 'https://avatar.iran.liara.run/public' }}
                                                        />
                                                        <div>
                                                            <div className="font-semibold text-slate-100 text-sm">
                                                                {refund.studentId?.name || 'Unknown Student'}
                                                            </div>
                                                            <div className="text-xs text-slate-400 truncate max-w-[120px] sm:max-w-none">
                                                                {refund.studentId?.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Course */}
                                                <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                                                    <div>
                                                        <div className="font-medium text-slate-200 text-sm capitalize truncate max-w-[150px]">
                                                            {refund.courseId?.title || 'N/A'}
                                                        </div>
                                                        <div className="text-xs font-semibold text-indigo-400">
                                                            ₹{refund.courseId?.price || 0}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Reason */}
                                                <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                                                    <p className="text-slate-400 text-sm truncate max-w-[200px]" title={refund.reason}>
                                                        {refund.reason}
                                                    </p>
                                                </td>

                                                {/* Date */}
                                                <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                                                    <span className="text-slate-400 text-sm whitespace-nowrap">
                                                        {refund.createdAt ? new Date(refund.createdAt).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        }) : 'N/A'}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td className="px-4 sm:px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize 
                                                        ${refund.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                            refund.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                        }`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full 
                                                            ${refund.status === 'pending' ? 'bg-amber-400 animate-pulse' :
                                                                refund.status === 'approved' ? 'bg-emerald-400' :
                                                                    'bg-rose-400'
                                                            }`} />
                                                        {refund.status}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 sm:px-6 py-4 text-right">
                                                    {refund.status === 'pending' ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleStatusChange(refund._id, 'rejected')}
                                                                className="p-2 rounded-lg bg-slate-700 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all border border-slate-600 hover:border-rose-500/30"
                                                                title="Reject"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusChange(refund._id, 'approved')}
                                                                className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-500/25"
                                                                title="Approve"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-500 italic">Processed</span>
                                                    )}
                                                </td>
                                            </tr>
                                            {/* Mobile Expandable Row */}
                                            {expandedRow === refund._id && (
                                                <tr className="sm:hidden bg-slate-800/50">
                                                    <td colSpan={6} className="px-4 py-4">
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-slate-400">Course:</span>
                                                                <span className="text-slate-200 font-medium">{refund.courseId?.title || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-slate-400">Price:</span>
                                                                <span className="text-indigo-400 font-semibold">₹{refund.courseId?.price || 0}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-slate-400">Reason:</span>
                                                                <span className="text-slate-200 text-right max-w-[200px]">{refund.reason}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-slate-400">Date:</span>
                                                                <span className="text-slate-200">
                                                                    {refund.createdAt ? new Date(refund.createdAt).toLocaleDateString() : 'N/A'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="mt-4 text-center text-xs text-slate-500">
                    Showing {filteredRefunds.length} of {refunds.length} total refund requests
                </div>
            </div>
        </div>
    );
}
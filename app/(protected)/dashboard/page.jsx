'use client';

import React, { useState, useEffect } from 'react';
import api from "../../../src/lib/api";
import { useUserStore } from '../../../src/lib/store/authStore';
import { Loader2, User, Wallet, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';

export default function Page() {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useUserStore();

    useEffect(() => {
        if (!user?._id) return;

        const fetchAccountBalance = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/auth/getaccount/${user._id}`);
                setBalance(data.accountBalance);
            } catch (err) {
                setError('Failed to load balance');
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountBalance();
    }, [user?._id]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans antialiased">

            {/* Header - Fully Responsive */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 border-b border-slate-800 pb-4">
                <div className="w-full sm:w-auto">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                        Live Account Overview
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                        <Calendar size={14} />
                        <span>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xs sm:text-sm text-white shadow-lg shadow-blue-500/20">
                        {user?.name?.[0] || 'U'}
                    </div>
                </div>
            </header>

            {/* Main Grid - Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">

                {/* Balance Card - Full Width on Mobile */}
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl border border-indigo-500/20 relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <p className="text-xs sm:text-sm font-semibold text-indigo-200 uppercase tracking-wider flex items-center gap-2">
                                <Wallet size={14} className="sm:size-16" />
                                Available Balance
                            </p>
                            <span className={`text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-bold ${loading ? 'bg-indigo-800/50 text-indigo-200' : 'bg-emerald-500/20 text-emerald-300'
                                }`}>
                                {loading ? 'Syncing...' : '● Live'}
                            </span>
                        </div>

                        {/* Loading, Error, and Data States */}
                        {loading ? (
                            <div className="mt-3 sm:mt-4 animate-pulse flex items-center gap-3">
                                <Loader2 size={20} className="animate-spin text-indigo-300" />
                                <div className="h-8 sm:h-10 bg-indigo-400/30 rounded w-32 sm:w-40"></div>
                            </div>
                        ) : error ? (
                            <div className="mt-3 sm:mt-4 bg-rose-900/40 p-3 rounded-xl border border-rose-500/30 flex items-center gap-2">
                                <span className="text-rose-300 text-sm">⚠️</span>
                                <p className="text-sm font-medium text-rose-300">{error}</p>
                            </div>
                        ) : (
                            <div className="mt-3 sm:mt-4">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                                    ₹{balance?.toLocaleString('en-IN') || '0'}
                                    <span className="text-lg sm:text-xl lg:text-2xl font-medium text-indigo-200 ml-1">.00</span>
                                </h2>
                            </div>
                        )}

                        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs sm:text-sm text-indigo-100/70">
                            <span className="flex items-center gap-2">
                                <span className="bg-indigo-800/30 px-2 py-1 rounded text-[10px] sm:text-xs font-mono">
                                    •••• •••• •••• 4521
                                </span>
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                    <ArrowUpRight size={12} />
                                    +2.5%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats - Responsive Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
                    {/* Monthly Cap Card */}
                    <div className="bg-slate-800/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-slate-700 shadow-lg hover:border-slate-600 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] sm:text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                                Monthly Cap
                            </p>
                            <TrendingUp size={16} className="text-emerald-400" />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold mt-1 text-white">Safe to Spend</h3>
                        <div className="w-full bg-slate-700 h-1.5 sm:h-2 rounded-full overflow-hidden mt-3">
                            <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full w-[65%] rounded-full transition-all duration-1000"></div>
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-400 mt-2 flex justify-between">
                            <span>₹8,450 used</span>
                            <span className="font-medium text-emerald-400">65%</span>
                        </p>
                    </div>

                    {/* Quick Stats Card */}
                    <div className="bg-slate-800/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-slate-700 shadow-lg hover:border-slate-600 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] sm:text-xs font-semibold text-blue-400 uppercase tracking-wider">
                                This Week
                            </p>
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <span className="text-[10px] sm:text-xs font-bold text-blue-400">↑</span>
                            </div>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold mt-1 text-white">12 Transactions</h3>
                        <p className="text-[10px] sm:text-xs text-slate-400 mt-2">
                            <span className="text-emerald-400">+3</span> from last week
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Fully Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-slate-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-slate-700">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent Activity</p>
                    <div className="mt-3 space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-all">
                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm font-medium text-slate-200 truncate">Transaction #{i}</p>
                                    <p className="text-[10px] text-slate-400">2 hours ago</p>
                                </div>
                                <span className="text-xs font-semibold text-emerald-400">+₹{i * 100}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-slate-700 sm:col-span-2">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Actions</p>
                        <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                            View All →
                        </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-3">
                        {['Transfer', 'Pay Bills', 'Add Money', 'History', 'Settings', 'Support'].map((action) => (
                            <button
                                key={action}
                                className="bg-slate-700/50 hover:bg-slate-700 p-2 sm:p-3 rounded-xl text-xs sm:text-sm font-medium text-slate-200 transition-all hover:scale-[1.02] border border-slate-600/30"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6 sm:mt-8 text-center text-[10px] sm:text-xs text-slate-500 border-t border-slate-800 pt-4">
                <p>© {new Date().getFullYear()} Dashboard • All rights reserved</p>
            </div>
        </div>
    );
}
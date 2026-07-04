'use client';

import React, { useState, useEffect } from 'react';
import api from "../../../src/lib/api"
import { useUserStore } from '../../../src/lib/store/authStore';

export default function Page() {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useUserStore();

    console.log('users data here', user)



















    useEffect(() => {
        if (!user?._id) return;

        const fetchAccountBalance = async () => {
            try {
                setLoading(true);

                const { data } = await api.get(
                    `/auth/getaccount/${user._id}`
                )

                console.log(data);
                setBalance(data.accountBalance)
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountBalance();
    }, [user?._id]);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans antialiased">

            {/* Header */}
            <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Main Dashboard</h1>
                    <p className="text-xs text-slate-400">Live Account Overview</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white">
                    U
                </div>
            </header>

            {/* Main Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* Dynamic Account Balance Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl shadow-xl border border-indigo-500/20 col-span-1 md:col-span-2 relative overflow-hidden">
                    <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Available Account Balance</p>

                    {/* Loading, Error, and Data States */}
                    {loading ? (
                        <div className="mt-4 animate-pulse flex space-x-2 items-center">
                            <div className="h-8 bg-indigo-400/30 rounded w-32"></div>
                        </div>
                    ) : error ? (
                        <h2 className="text-sm font-medium text-rose-300 mt-3 bg-rose-900/40 p-2 rounded border border-rose-500/30">
                            ⚠️ {error}
                        </h2>
                    ) : (
                        <h2 className="text-4xl font-extrabold mt-2 text-white tracking-tight">
                            ₹{balance?.toLocaleString('en-IN')}.00
                        </h2>
                    )}

                    <div className="mt-6 flex justify-between items-center text-xs text-indigo-100/70">
                        <span>A/C: XXXX-XXXX-4521</span>
                        <span className="bg-indigo-800/50 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold text-indigo-200">
                            {loading ? "Syncing..." : "Live"}
                        </span>
                    </div>
                </div>

                {/* Quick Analytics Card */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col justify-between">
                    <div>
                        <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Monthly Cap</p>
                        <h3 className="text-xl font-bold mt-1">Safe to Spend</h3>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mt-4">
                        <div className="bg-emerald-500 h-full w-[65%] rounded-full"></div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">65% of your weekly budget remains untouched.</p>
                </div>

            </div>

        </div>
    );
}
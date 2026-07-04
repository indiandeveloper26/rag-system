"use client";

import React, { useState } from "react";
import {
    HelpCircle,
    ArrowRight,
    MessageSquare,
    Send,
    ShieldAlert,
    RefreshCw,
    CheckCircle2,
    Clock
} from "lucide-react";
import api from "../../../../src/lib/api";
import { useUserStore } from "../../../../src/lib/store/authStore";
import { useParams } from "next/navigation";

export default function page() {
    const [prompt, setPrompt] = useState("");
    const [chatHistory, setChatHistory] = useState([
        { role: "assistant", content: "Hii! Main aapka Nexus AI Assistant hoon. Aapko kis course ka refund chahiye ya kya samasya aa rahi hai? Mujhe batayein." }
    ]);

    const params = useParams()


    let { id } = params

    console.log('iddd', id)


    const { user } = useUserStore();
    const [loading, setLoading] = useState(false);

    // AI Agent integration function
    const handleAskAgent = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        const userMessage = prompt;
        setPrompt("");
        setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);
        setLoading(true);

        try {
            // Aapka Backend Route URL yahan aayega
            const response = await (await api.post("/refund/ai", {
                prompt,


                userId: user?._id,
                courseId: id
            })).data

            console.log('resdata froma i agent', response)


            if (response.success) {
                setChatHistory((prev) => [...prev, { role: "assistant", content: response.reply }]);
            } else {
                setChatHistory((prev) => [...prev, { role: "assistant", content: response.message || "Kuch dikkat aa gayi, please try again." }]);
            }
        } catch (error) {
            console.error("Refund Agent Error:", error);
            setChatHistory((prev) => [...prev, { role: "assistant", content: "Server se connect karne mein issue ho raha hai." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="mb-10 border-b border-slate-900 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
                            Refund Support & Claims
                        </h1>
                        <p className="mt-2 text-base text-slate-400">
                            Apne eligible purchased courses ka refund claim kariye hamare intelligent AI support agent se.
                        </p>
                    </div>
                    <div className="bg-rose-500/10 px-4 py-2.5 rounded-2xl border border-rose-500/20 flex items-center gap-2 self-start md:self-auto">
                        <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                        <span className="text-sm font-semibold text-rose-400">7-Day Window Policy</span>
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Guidelines & Policy Status */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Policy Information Card */}
                        <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                <ShieldAlert size={20} className="text-indigo-400" />
                                Refund Guidelines
                            </h3>
                            <ul className="space-y-3.5 text-sm text-slate-400">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span>Course kharidne ke **7 dino ke andar** hi refund initate kiya ja sakta hai.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span>Agar aapne course content **20% se zyada** dekh liya hai, toh refund nahi milega.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span>AI Agent automatically criteria check karke aapka instant workflow trigger kar dega.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Quick Process Timeline Steps */}
                        <div className="bg-slate-900/50 border border-slate-800/40 rounded-2xl p-6">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Refund Process Flow</h4>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                    <div>
                                        <h5 className="text-sm font-semibold text-white">AI Assistant se chat karein</h5>
                                        <p className="text-xs text-slate-500">Apne order ya refund lene ka karan batayein.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                                    <div>
                                        <h5 className="text-sm font-semibold text-white">Automated Verification</h5>
                                        <p className="text-xs text-slate-500">System check karega eligibility criteria.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                                    <div>
                                        <h5 className="text-sm font-semibold text-white">Instant Credit Back</h5>
                                        <p className="text-xs text-slate-500">Sahi paye jaane par 2-3 working days me bank account me transfer.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: AI Agent Interactive Chat Area */}
                    <div className="lg:col-span-7 bg-slate-900 border border-slate-800/60 rounded-3xl shadow-2xl flex flex-col h-[520px] overflow-hidden">

                        {/* Chat Terminal Header */}
                        <div className="px-6 py-4 bg-slate-950/40 border-b border-slate-800/60 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl text-white shadow-md">
                                    <MessageSquare size={18} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Nexus Automated Agent</h3>
                                    <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                                        Online | Secure Channels
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setChatHistory([{ role: "assistant", content: "Hii! Main aapka Nexus AI Assistant hoon. Aapko kis course ka refund chahiye? Mujhe batayein." }])}
                                className="p-1.5 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded-lg transition-colors"
                                title="Reset Chat"
                            >
                                <RefreshCw size={15} />
                            </button>
                        </div>

                        {/* Messages Container Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/20">
                            {chatHistory.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === "user"
                                        ? "bg-indigo-600 text-white rounded-br-none"
                                        : "bg-slate-800/70 text-slate-200 border border-slate-700/30 rounded-bl-none"
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {/* Loading Placeholder */}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800/70 text-slate-400 border border-slate-700/30 rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center gap-2">
                                        <Clock size={14} className="animate-spin text-indigo-400" />
                                        <span>Nexus Agent thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Interactive Chat Input Form */}
                        <form onSubmit={handleAskAgent} className="p-4 bg-slate-950/50 border-t border-slate-800/60 flex items-center gap-3">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="E.g., Mujhe 'Generative AI' course ka refund chahiye..."
                                className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !prompt.trim()}
                                className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-600 rounded-xl transition-all shadow-lg shadow-indigo-600/10 active:scale-95 shrink-0"
                            >
                                <Send size={16} />
                            </button>
                        </form>

                    </div>

                </div>

            </div>
        </div>
    );
}
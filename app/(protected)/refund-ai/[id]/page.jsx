"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    HelpCircle,
    ArrowRight,
    MessageSquare,
    Send,
    ShieldAlert,
    RefreshCw,
    CheckCircle2,
    Clock,
    User,
    Bot,
    Sparkles,
    FileText,
    Calendar,
    AlertCircle,
    Loader2,
    ChevronRight,
    Home
} from "lucide-react";
import api from "../../../../src/lib/api";
import { useUserStore } from "../../../../src/lib/store/authStore";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
    const [prompt, setPrompt] = useState("");
    const [chatHistory, setChatHistory] = useState([
        { role: "assistant", content: "👋 Hi! I'm your Nexus AI Refund Assistant. I'll help you with course refunds. Tell me which course you need a refund for and why!" }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const params = useParams();
    const router = useRouter();
    let { id } = params;
    const { user } = useUserStore();
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    const handleAskAgent = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        const userMessage = prompt;
        setPrompt("");
        setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);
        setLoading(true);
        setIsTyping(true);

        try {
            const response = await (await api.post("/refund/ai", {
                prompt: userMessage,
                userId: user?._id,
                courseId: id
            })).data;

            console.log('resdata from ai agent', response);

            if (response.success) {
                // Simulate typing effect
                setTimeout(() => {
                    setChatHistory((prev) => [...prev, { role: "assistant", content: response.reply }]);
                    setIsTyping(false);
                }, 500);
            } else {
                setChatHistory((prev) => [...prev, { role: "assistant", content: response.message || "Something went wrong. Please try again." }]);
                setIsTyping(false);
            }
        } catch (error) {
            console.error("Refund Agent Error:", error);
            setChatHistory((prev) => [...prev, { role: "assistant", content: "❌ Server connection error. Please try again later." }]);
            setIsTyping(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-300">

            {/* Top Navigation Bar */}
            <div className="border-b border-slate-800/60 bg-slate-900/30 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={() => router.push('/mycourse')}
                                className="p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                            >
                                <Home size={18} className="sm:size-20" />
                            </button>
                            <div className="h-5 w-px bg-slate-700 hidden sm:block"></div>
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 sm:p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                                    <ShieldAlert size={16} className="sm:size-18" />
                                </div>
                                <div>
                                    <h1 className="text-sm sm:text-base font-bold text-white">Refund Support</h1>
                                    <p className="text-[10px] sm:text-xs text-slate-400">AI-Powered Assistance</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-[10px] sm:text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 sm:px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                7-Day Policy
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">

                    {/* Left Column: Guidelines & Policy - Hidden on Mobile */}
                    <div className="hidden lg:block lg:col-span-4 space-y-4">

                        {/* Policy Information Card */}
                        <div className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-5 shadow-xl backdrop-blur-sm hover:border-slate-700/60 transition-all">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                                    <ShieldAlert size={18} className="text-indigo-400" />
                                </div>
                                <h3 className="text-base font-bold text-white">Refund Guidelines</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li className="flex items-start gap-2.5 p-2 bg-slate-800/30 rounded-lg border border-slate-800/40">
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span>Request refund within <span className="text-white font-semibold">7 days</span> of purchase</span>
                                </li>
                                <li className="flex items-start gap-2.5 p-2 bg-slate-800/30 rounded-lg border border-slate-800/40">
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span>Course progress must be <span className="text-white font-semibold">under 20%</span></span>
                                </li>
                                <li className="flex items-start gap-2.5 p-2 bg-slate-800/30 rounded-lg border border-slate-800/40">
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span>AI checks eligibility automatically</span>
                                </li>
                            </ul>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-emerald-400">24/7</p>
                                <p className="text-[10px] text-slate-500">AI Support</p>
                            </div>
                            <div className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-indigo-400">⚡</p>
                                <p className="text-[10px] text-slate-500">Instant Response</p>
                            </div>
                        </div>

                        {/* Process Steps */}
                        <div className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Process</h4>
                            <div className="space-y-2">
                                {[
                                    { step: "Chat with AI", desc: "Explain your issue" },
                                    { step: "Auto Verify", desc: "Check eligibility" },
                                    { step: "Refund Initiated", desc: "2-3 working days" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-2 bg-slate-800/30 rounded-lg">
                                        <div className="w-5 h-5 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-[9px] font-bold shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-white">{item.step}</p>
                                            <p className="text-[10px] text-slate-500">{item.desc}</p>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-600" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Guidelines - Only on Mobile */}
                    <div className="lg:hidden bg-slate-900/80 border border-slate-800/60 rounded-xl p-3 mb-2">
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldAlert size={16} className="text-indigo-400" />
                            <h3 className="text-sm font-bold text-white">Refund Guidelines</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-400">
                            <div className="flex items-center gap-2 bg-slate-800/30 p-2 rounded-lg">
                                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                                <span>7 days refund window</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-800/30 p-2 rounded-lg">
                                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                                <span>Under 20% course progress</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: AI Agent Chat Area */}
                    <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800/60 rounded-2xl shadow-2xl flex flex-col h-[500px] sm:h-[540px] lg:h-[580px] overflow-hidden backdrop-blur-sm">

                        {/* Chat Header */}
                        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-950/40 border-b border-slate-800/60 flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="p-1.5 sm:p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-lg text-white shadow-md">
                                    <Bot size={16} className="sm:size-18" />
                                </div>
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                                        Nexus AI Agent
                                        <span className="text-[8px] sm:text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-500/20">
                                            Active
                                        </span>
                                    </h3>
                                    <p className="text-[9px] sm:text-xs text-slate-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                                        Online • Secure
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setChatHistory([{ role: "assistant", content: "👋 Hi! I'm your Nexus AI Refund Assistant. I'll help you with course refunds. Tell me which course you need a refund for and why!" }])}
                                className="p-1.5 sm:p-2 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded-lg transition-colors"
                                title="Reset Chat"
                            >
                                <RefreshCw size={14} className="sm:size-16" />
                            </button>
                        </div>

                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 bg-slate-950/20">
                            {chatHistory.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                                >
                                    <div className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${msg.role === "user"
                                        ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-none"
                                        : "bg-slate-800/70 text-slate-200 border border-slate-700/30 rounded-bl-none"
                                        }`}>
                                        {msg.role === "assistant" && (
                                            <div className="flex items-center gap-1.5 mb-1 text-[8px] sm:text-[10px] text-indigo-400 font-medium">
                                                <Bot size={12} className="sm:size-14" />
                                                <span>Nexus AI</span>
                                            </div>
                                        )}
                                        <div className="whitespace-pre-wrap break-words">
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-slate-800/70 text-slate-400 border border-slate-700/30 rounded-2xl rounded-bl-none px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm flex items-center gap-2">
                                        <Loader2 size={14} className="animate-spin text-indigo-400" />
                                        <span>Nexus AI is thinking...</span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input Form */}
                        <form onSubmit={handleAskAgent} className="p-3 sm:p-4 bg-slate-950/50 border-t border-slate-800/60 flex items-end gap-2 sm:gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe your refund issue..."
                                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white placeholder-slate-500 outline-none transition-all resize-none"
                                    disabled={loading}
                                />
                                {prompt && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-slate-500">
                                        {prompt.length} chars
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !prompt.trim()}
                                className="p-2.5 sm:p-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:from-slate-800 disabled:to-slate-800 text-white disabled:text-slate-600 rounded-xl transition-all shadow-lg shadow-indigo-600/10 active:scale-95 shrink-0"
                            >
                                <Send size={16} className="sm:size-18" />
                            </button>
                        </form>

                    </div>

                </div>

            </div>

            {/* Footer */}
            <div className="border-t border-slate-800/60 mt-4 sm:mt-6 py-3 sm:py-4 text-center">
                <p className="text-[10px] sm:text-xs text-slate-500">
                    🔒 Secure & Encrypted • AI-Powered Refund Assistance • 24/7 Support
                </p>
            </div>
        </div>
    );
}
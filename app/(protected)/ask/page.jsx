"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Send,
    Bot,
    User,
    Loader2,
    RefreshCw,
    AlertCircle,
    Shield,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    Sparkles,
    MessageSquare,
    Settings,
    Database,
    Zap
} from "lucide-react";
import api from "../../../src/lib/api";

export default function Page() {
    const [messages, setMessages] = useState([
        {
            id: "welcome",
            role: "assistant",
            content: "👋 Welcome Admin! I'm your Refund Policy AI Agent. You can ask me anything about:\n\n• Refund eligibility criteria\n• Policy terms & conditions\n• User refund requests\n• Approval/rejection guidelines\n• Timeframe & processing\n\nHow can I assist you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, isTyping]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userQuestion = input.trim();
        setInput("");
        setError("");

        const userMessageId = Date.now().toString();
        setMessages((prev) => [
            ...prev,
            { id: userMessageId, role: "user", content: userQuestion },
        ]);

        setIsLoading(true);
        setIsTyping(true);

        try {
            const { data } = await api.post(
                "/rag/ask",
                { question: userQuestion },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );

            console.log('Received data:', data);

            if (!data || !data.success) {
                throw new Error(data?.message || "Something went wrong.");
            }

            // Simulate typing delay
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { id: Date.now().toString(), role: "assistant", content: data.answer },
                ]);
                setIsTyping(false);
            }, 500);

        } catch (err) {
            console.error("Chat Error:", err);
            const errMsg = err.response?.data?.message || err.message || "Something went wrong.";
            setError(errMsg);

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: "assistant",
                    content: `⚠️ Error: ${errMsg}`,
                    isError: true
                },
            ]);
            setIsTyping(false);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        if (window.confirm("Are you sure you want to clear the chat history?")) {
            setMessages([
                {
                    id: "welcome",
                    role: "assistant",
                    content: "👋 Welcome Admin! I'm your Refund Policy AI Agent. You can ask me anything about:\n\n• Refund eligibility criteria\n• Policy terms & conditions\n• User refund requests\n• Approval/rejection guidelines\n• Timeframe & processing\n\nHow can I assist you today?",
                },
            ]);
            setError("");
        }
    };

    // Quick suggestion chips
    const quickSuggestions = [
        "What are refund eligibility criteria?",
        "Show recent refund requests",
        "How to approve a refund?",
        "Refund processing time",
        "Policy terms & conditions"
    ];

    return (
        <div className="flex flex-col h-screen max-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans">

            {/* Header section - Premium Admin Style */}
            <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-slate-900/80 border-b border-slate-700/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                        <Shield size={18} className="sm:size-22" />
                    </div>
                    <div>
                        <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                            Refund Policy AI Agent
                            <span className="text-[8px] sm:text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-500/20">
                                Admin
                            </span>
                        </h1>
                        <p className="text-[9px] sm:text-xs text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>Active</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">Llama-3.3 & Chroma</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">Policy RAG</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Status Indicator */}
                    <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 rounded-lg border border-slate-700/30">
                        <Database size={12} className="text-indigo-400" />
                        <span className="text-[10px] text-slate-400">Connected</span>
                    </div>

                    <button
                        onClick={clearChat}
                        className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 rounded-lg transition border border-slate-700/30"
                    >
                        <RefreshCw size={14} className="sm:size-16" />
                        <span className="hidden sm:inline">Reset</span>
                    </button>
                </div>
            </header>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-slate-900/40 border-b border-slate-700/30">
                <div className="flex items-center gap-2 bg-slate-800/30 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-700/20">
                    <FileText size={14} className="text-indigo-400" />
                    <div>
                        <p className="text-[8px] sm:text-[10px] text-slate-500">Policy Docs</p>
                        <p className="text-[10px] sm:text-xs font-bold text-white">12</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/30 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-700/20">
                    <Clock size={14} className="text-yellow-400" />
                    <div>
                        <p className="text-[8px] sm:text-[10px] text-slate-500">Pending</p>
                        <p className="text-[10px] sm:text-xs font-bold text-yellow-400">8</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/30 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-700/20">
                    <CheckCircle size={14} className="text-emerald-400" />
                    <div>
                        <p className="text-[8px] sm:text-[10px] text-slate-500">Approved</p>
                        <p className="text-[10px] sm:text-xs font-bold text-emerald-400">156</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/30 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-700/20">
                    <XCircle size={14} className="text-rose-400" />
                    <div>
                        <p className="text-[8px] sm:text-[10px] text-slate-500">Rejected</p>
                        <p className="text-[10px] sm:text-xs font-bold text-rose-400">23</p>
                    </div>
                </div>
            </div>

            {/* Error banner */}
            {error && (
                <div className="bg-rose-500/10 border-b border-rose-500/20 px-4 sm:px-6 py-2 sm:py-2.5 flex items-center gap-2 text-rose-300 text-[10px] sm:text-xs">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Message Thread Container */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-8 lg:px-16 xl:px-32 py-4 sm:py-6 space-y-4 sm:space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {messages.map((msg) => {
                    const isAi = msg.role === "assistant";
                    return (
                        <div
                            key={msg.id}
                            className={`flex gap-3 sm:gap-4 ${!isAi ? "flex-row-reverse" : "flex-row"} animate-in slide-in-from-bottom-2 duration-300`}
                        >
                            {/* Avatar */}
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${isAi
                                    ? msg.isError
                                        ? "bg-rose-950 text-rose-400 border border-rose-500/30"
                                        : "bg-gradient-to-tr from-indigo-600 to-violet-500 text-white border border-indigo-500/30"
                                    : "bg-slate-700 text-white border border-slate-600"
                                }`}>
                                {isAi ? <Bot size={14} className="sm:size-16" /> : <User size={14} className="sm:size-16" />}
                            </div>

                            {/* Text Bubble */}
                            <div className={`flex flex-col max-w-[85%] sm:max-w-[80%] ${!isAi ? "items-end" : "items-start"}`}>
                                <div className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl leading-relaxed text-xs sm:text-sm shadow-md whitespace-pre-wrap ${isAi
                                        ? msg.isError
                                            ? "bg-rose-950/40 text-rose-200 border border-rose-900/50 rounded-tl-none"
                                            : "bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-none backdrop-blur-sm"
                                        : "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-tr-none"
                                    }`}>
                                    {msg.content}
                                </div>
                                <span className="text-[8px] sm:text-[10px] text-slate-500 mt-1 px-1 flex items-center gap-1">
                                    {isAi ? (
                                        <>
                                            <Sparkles size={10} className="text-indigo-400" />
                                            Refund AI Agent
                                        </>
                                    ) : (
                                        <>
                                            <User size={10} />
                                            Admin
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex gap-3 sm:gap-4 flex-row animate-in slide-in-from-bottom-2 duration-300">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white border border-indigo-500/30 flex items-center justify-center shrink-0">
                            <Bot size={14} className="sm:size-16" />
                        </div>
                        <div className="flex flex-col items-start max-w-[85%] sm:max-w-[80%]">
                            <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-800/80 text-slate-400 border border-slate-700/60 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs sm:text-sm shadow-md">
                                <Loader2 size={14} className="animate-spin text-indigo-400" />
                                <span>Searching policy documents...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions - Only show when chat is empty or has few messages */}
            {messages.length < 3 && (
                <div className="px-3 sm:px-4 md:px-8 lg:px-16 xl:px-32 pb-2">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        <p className="text-[8px] sm:text-[10px] text-slate-500 w-full mb-1">Quick questions:</p>
                        {quickSuggestions.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setInput(suggestion);
                                    // Auto submit after a small delay
                                    setTimeout(() => {
                                        const event = new Event('submit', { cancelable: true });
                                        handleSendMessage(event);
                                    }, 300);
                                }}
                                className="text-[8px] sm:text-[10px] bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-slate-700/30 transition-all hover:border-indigo-500/30"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Bar Section */}
            <div className="p-3 sm:p-4 bg-slate-900/80 border-t border-slate-700/40 backdrop-blur-md">
                <form onSubmit={handleSendMessage} className="relative flex items-center max-w-7xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about refund policy, eligibility, approvals..."
                        disabled={isLoading}
                        className="w-full bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800 text-slate-100 text-sm pl-3 sm:pl-4 pr-12 py-2.5 sm:py-3.5 rounded-xl border border-slate-700/80 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition disabled:opacity-60"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-1.5 sm:right-2 p-1.5 sm:p-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-lg transition disabled:opacity-40 disabled:hover:from-indigo-600 disabled:hover:to-indigo-500 active:scale-95"
                    >
                        <Send size={15} className="sm:size-18" />
                    </button>
                </form>
                <div className="flex items-center justify-between max-w-7xl mx-auto mt-1.5 sm:mt-2">
                    <p className="text-[8px] sm:text-[10px] text-slate-500 flex items-center gap-1">
                        <Shield size={10} className="text-indigo-400" />
                        Strict RAG: Answers from policy documents only
                    </p>
                    <p className="text-[8px] sm:text-[10px] text-slate-500">
                        {input.length > 0 && `${input.length} characters`}
                    </p>
                </div>
            </div>
        </div>
    );
}
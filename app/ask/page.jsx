"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import api from "../../src/lib/api";


export default function Page() {
    const [messages, setMessages] = useState([
        {
            id: "welcome",
            role: "assistant",
            content: "Hello! Main aapka PDF RAG assistant hoon. Aap mujhse document ke baare me koi bhi sawaal pooch sakte hain.",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const messagesEndRef = useRef(null);

    // Auto-scroll to the latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userQuestion = input.trim();
        setInput("");
        setError("");

        // 1. Append user message to state
        const userMessageId = Date.now().toString();
        setMessages((prev) => [
            ...prev,
            { id: userMessageId, role: "user", content: userQuestion },
        ]);

        setIsLoading(true);

        try {
            // 2. Hit your backend endpoint
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

            // FIX: response.ok hata diya kyunki axios direct errors catch me bhejta hai
            if (!data || !data.success) {
                throw new Error(data?.message || "Kuch error aayi hai backend se.");
            }

            // 3. Append assistant response to state
            setMessages((prev) => [
                ...prev,
                { id: Date.now().toString(), role: "assistant", content: data.answer },
            ]);
        } catch (err) {
            console.error("Chat Error:", err);

            // Centralized error message verification
            const errMsg = err.response?.data?.message || err.message || "Something went wrong.";
            setError(errMsg);

            // Append error block inside chat flow
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: "assistant",
                    content: `⚠️ Error: ${errMsg}`,
                    isError: true
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        if (window.confirm("Kya aap chat history clear karna chahte hain?")) {
            setMessages([
                {
                    id: "welcome",
                    role: "assistant",
                    content: "Hello! Main aapka PDF RAG assistant hoon. Aap mujhse document ke baare me koi bhi sawaal pooch sakte hain.",
                },
            ]);
            setError("");
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-screen bg-slate-900 text-slate-100 font-sans">
            {/* Header section */}
            <header className="flex items-center justify-between px-6 py-4 bg-slate-800/60 border-b border-slate-700/50 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                        <Bot size={22} />
                    </div>
                    <div>
                        <h1 className="text-md font-semibold tracking-wide text-white">Smart RAG Engine</h1>
                        <p className="text-xs text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Llama-3.3 & Chroma Connected
                        </p>
                    </div>
                </div>

                <button
                    onClick={clearChat}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 rounded-md transition border border-slate-700/30"
                >
                    <RefreshCw size={14} />
                    Reset Chat
                </button>
            </header>

            {/* Error banner indicator */}
            {error && (
                <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-2.5 flex items-center gap-2 text-rose-300 text-xs">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Message Thread Container */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 sm:px-6 md:px-24 xl:px-48 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {messages.map((msg) => {
                    const isAi = msg.role === "assistant";
                    return (
                        <div
                            key={msg.id}
                            className={`flex gap-4 ${!isAi ? "flex-row-reverse" : "flex-row"}`}
                        >
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${isAi
                                ? msg.isError ? "bg-rose-950 text-rose-400 border border-rose-500/30" : "bg-slate-800 text-indigo-400 border border-slate-700"
                                : "bg-indigo-600 text-white"
                                }`}>
                                {isAi ? <Bot size={16} /> : <User size={16} />}
                            </div>

                            {/* Text Box Bubble */}
                            <div className={`flex flex-col max-w-[80%] ${!isAi ? "items-end" : "items-start"}`}>
                                <div className={`px-4 py-3 rounded-2xl leading-relaxed text-sm shadow-md whitespace-pre-wrap ${isAi
                                    ? msg.isError
                                        ? "bg-rose-950/40 text-rose-200 border border-rose-900/50 rounded-tl-none"
                                        : "bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-none"
                                    : "bg-indigo-600 text-white rounded-tr-none"
                                    }`}>
                                    {msg.content}
                                </div>
                                <span className="text-[10px] text-slate-500 mt-1 px-1">
                                    {isAi ? "RAG Bot" : "You"}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {/* Processing/Streaming Loader State */}
                {isLoading && (
                    <div className="flex gap-4 flex-row">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 text-indigo-400 border border-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                            <Bot size={16} />
                        </div>
                        <div className="flex flex-col items-start max-w-[80%]">
                            <div className="px-4 py-3.5 bg-slate-800/50 text-slate-400 border border-slate-700/40 rounded-2xl rounded-tl-none flex items-center gap-2 text-sm shadow-sm">
                                <Loader2 size={16} className="animate-spin text-indigo-500" />
                                <span>Chroma standard search & Llama answering...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar Section */}
            <div className="p-4 bg-slate-800/30 border-t border-slate-700/40 backdrop-blur-md sm:px-6 md:px-24 xl:px-48">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Context me se kuch bhi pucho... (e.g., Explain Section 4)"
                        disabled={isLoading}
                        className="w-full bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800 text-slate-100 text-sm pl-4 pr-12 py-3.5 rounded-xl border border-slate-700/80 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition disabled:opacity-60"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-lg transition disabled:opacity-40 disabled:hover:bg-indigo-600 disabled:scale-100"
                    >
                        <Send size={16} />
                    </button>
                </form>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                    Strict RAG Engine: Answers are generated purely based on injected vector document data.
                </p>
            </div>
        </div>
    );
}
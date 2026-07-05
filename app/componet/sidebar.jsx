"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    LogOut,
    LogIn,
    HelpCircle,
    BookOpen,
    FileText,
    MessageSquare,
    GraduationCap,
    BookMarked,
    ShieldAlert,
    UserCheck,
    Layers,
    User,
    Menu,
    X
} from "lucide-react";

import { signOut } from "firebase/auth";
import { auth } from "../../src/lib/firebas";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../src/lib/store/authStore";
import api from "../../src/lib/api";
import { VERSION } from "../../src/lib/version";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logoutUser, user, isLogin } = useUserStore();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Get Course", href: "/getcourse", icon: BookOpen },
        { name: "Admin Policy", href: "/upload", icon: FileText },
        { name: "RAG Chat", href: "/ask", icon: MessageSquare },
        { name: "My Course", href: "/mycourse", icon: GraduationCap },
        { name: "Publish Book", href: "/publihsbook", icon: BookMarked },
        { name: "Admin Refund Page", href: "/refundpage", icon: ShieldAlert },
        { name: "Student Refund Page", href: "/studentrefundpage", icon: UserCheck },
    ];

    const footerItems = [
        { name: "Help & Support", href: "/ask", icon: HelpCircle },
    ];

    const logout = async () => {
        try {
            await signOut(auth);
            logoutUser();
            const res = await api.post("/auth/logout", {}, { withCredentials: true });
            await res.json();
            router.push("/login");
        } catch (error) {
            console.log("Logout Error:", error);
        }
    };

    return (
        <>
            {/* 📱 MOBILE TOP FLOATING BAR (Sticky style to prevent text overlapping) */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-40">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                        <Layers size={16} />
                    </div>
                    <span className="text-sm font-bold text-white tracking-wider uppercase">Nexus AItt</span>
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-slate-800 text-slate-200 rounded-xl border border-slate-700 hover:bg-slate-700 transition-all"
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* 🌫️ MOBILE BACKDROP LAYER */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* 🏛️ MAIN RESPONSIBLE SIDEBAR */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col justify-between text-slate-300 select-none transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                    md:relative md:translate-x-0 shrink-0`}
            >
                {/* Brand / Logo Header */}
                <div>
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/60">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl text-white shadow-md shadow-indigo-500/10">
                                <Layers size={20} />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold tracking-wider text-white uppercase">Nexus AI</h2>
                                <p className="text-[10px] text-indigo-400 font-medium">Enterprise RAG Portal</p>
                            </div>
                        </div>
                        {/* Mobile Side Close Trigger */}
                        <button onClick={() => setIsOpen(false)} className="md:hidden p-1 text-slate-400 hover:text-white">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Main Menu Links */}
                    <nav className="px-4 py-6 space-y-1.5 overflow-y-auto max-h-[calc(100vh-240px)] custom-scrollbar">
                        <p className="px-2 text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Main Menu</p>
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative ${isActive
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                                        : "hover:bg-slate-800/60 hover:text-slate-100 text-slate-400"
                                        }`}
                                >
                                    <Icon size={18} className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"}`} />
                                    <span>{item.name}</span>
                                    {isActive && <span className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Controls & User Context */}
                <div>
                    <div className="px-4 py-2 border-t border-slate-800/40 space-y-1">
                        {footerItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3.5 px-4 py-2.5 text-xs font-medium rounded-xl transition-all ${isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800/40 text-slate-500 hover:text-slate-300"
                                        }`}
                                >
                                    <Icon size={16} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}

                        {isLogin ? (
                            <button
                                onClick={() => { setIsOpen(false); logout(); }}
                                className="w-full flex items-center gap-3.5 px-4 py-2.5 text-xs font-medium rounded-xl text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/5 transition-all text-left group"
                            >
                                <LogOut size={16} className="text-rose-500/50 group-hover:text-rose-400 transition-colors" />
                                <span>Logout System</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => { setIsOpen(false); router.push("/login"); }}
                                className="w-full flex items-center gap-3.5 px-4 py-2.5 text-xs font-medium rounded-xl text-indigo-400 hover:text-white bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 hover:border-indigo-500 transition-all text-left group"
                            >
                                <LogIn size={16} className="text-indigo-400 group-hover:text-white transition-colors" />
                                <span>Login Account</span>
                            </button>
                        )}
                    </div>

                    <div className="p-4 bg-slate-950/40 border-t border-slate-800 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700/50 shadow-inner">
                            <User size={18} />
                        </div>
                        <div className="truncate flex-1">
                            <h4 className="text-xs font-semibold text-slate-200 truncate">{user?.name}</h4>
                            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                            <p className="text-[10px] text-slate-500 truncate">{VERSION}</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
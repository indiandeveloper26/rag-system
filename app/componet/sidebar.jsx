"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileUp,
    MessageSquare,
    LogOut,
    LogIn,
    Settings,
    HelpCircle,
    Layers,
    User,
    Import
} from "lucide-react";

import { signOut } from "firebase/auth";
import { auth } from "../../src/lib/firebas";
import { useRouter } from "next/navigation";

import { useUserStore } from "../../src/lib/store/authStore";

import api from "../../src/lib/api"
import { VERSION } from "../../src/lib/version"




export default function Sidebar() {
    const pathname = usePathname();

    const router = useRouter();

    const { logoutUser, user, isLogin } = useUserStore()


    console.log("userdstat", user)

    // Navigation Links Array (Dynamic structure)
    const menuItems = [
        { name: "Dashboard", href: "/getcourse", icon: LayoutDashboard },
        { name: "Upload PDF", href: "/upload", icon: FileUp },
        { name: "RAG Chat", href: "/ask", icon: MessageSquare },
        { name: "mycourse", href: "/mycourse", icon: Settings },
        { name: "publihsbook", href: "/publihsbook", icon: Settings },
    ];

    const footerItems = [
        { name: "Help & Support", href: "/support", icon: HelpCircle },
    ];


    console.log('usedast', isLogin, user)


    const logout = async () => {

        try {


            // 1. Firebase Google logout
            await signOut(auth);
            logoutUser()



            // 2. Backend cookie clear
            const res = await api.post(
                "/auth/logout",
                {},
                {
                    withCredentials: true
                }
            );


            const data = await res.json();

            console.log(data);



            // 3. Redirect
            router.push("/login");


        }
        catch (error) {

            console.log(
                "Logout Error:",
                error
            );

        }

    }


    return (
        <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col justify-between text-slate-300 shrink-0 select-none">

            {/* Top Logo / Brand Section */}
            <div>
                <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/60">
                    <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl text-white shadow-md shadow-indigo-500/10">
                        <Layers size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold tracking-wider text-white uppercase">Nexus AI</h2>
                        <p className="text-[10px] text-indigo-400 font-medium">Enterprise RAG Portal</p>
                    </div>
                </div>

                {/* Main Navigation Menu */}
                <nav className="px-4 py-6 space-y-1.5">
                    <p className="px-2 text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Main Menu</p>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative ${isActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                                    : "hover:bg-slate-800/60 hover:text-slate-100 text-slate-400"
                                    }`}
                            >
                                <Icon size={18} className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"}`} />
                                <span>{item.name}</span>

                                {/* Active subtle indicator line */}
                                {isActive && (
                                    <span className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Footer & User Profile Section */}
            <div>
                {/* Secondary Menu (Support etc.) */}
                <div className="px-4 py-2 border-t border-slate-800/40 space-y-1">
                    {footerItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3.5 px-4 py-2.5 text-xs font-medium rounded-xl transition-all ${isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800/40 text-slate-500 hover:text-slate-300"
                                    }`}
                            >
                                <Icon size={16} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}

                    {/* Logout Button */}
                    {isLogin ? (
                        // 🔓 Logout Button (Jab User Logged In Ho)
                        <button
                            onClick={() => logout()}
                            className="w-full flex items-center gap-3.5 px-4 py-2.5 text-xs font-medium rounded-xl text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/5 transition-all text-left group"
                        >
                            <LogOut size={16} className="text-rose-500/50 group-hover:text-rose-400 transition-colors" />
                            <span>Logout System</span>
                        </button>
                    ) : (
                        // 🔒 Login Button (Jab User Logged Out Ho - Matching Premium Layout)
                        <button
                            onClick={() => /* Aapka login navigation ya function yahan aayega */ { }}
                            className="w-full flex items-center gap-3.5 px-4 py-2.5 text-xs font-medium rounded-xl text-indigo-400 hover:text-white bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 hover:border-indigo-500 transition-all text-left group"
                        >
                            <LogIn size={16} className="text-indigo-400 group-hover:text-white transition-colors" />
                            <span>Login Account</span>
                        </button>
                    )}
                </div>

                {/* Profile Card Summary */}
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
    );
}
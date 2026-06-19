"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../src/lib/firebas";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../src/lib/store/authStore";
import { Loader2, ShieldAlert, Sparkles, KeyRound } from "lucide-react";

export default function Login() {
    const router = useRouter();
    const { loginUser } = useUserStore();

    // UI states handling
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState("");

    const googleLogin = async () => {
        setIsLoading(true);
        setAuthError("");

        try {
            // 1. Firebase auth trigger
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userData = {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                photo: user.photoURL
            };

            // Global State management update
            loginUser(userData);
            console.log('Firebase User logged:', user);

            // 2. Syncing with backend server
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            console.log('Backend sync status:', data);

            if (data?.success) {
                router.push("/");
            } else {
                throw new Error(data?.message || "Backend database sync failed.");
            }

        } catch (error) {
            console.error("Login Engine Error:", error);
            // Handle cancel auth or direct network errors safely
            if (error.code === "auth/popup-closed-by-user") {
                setAuthError("Sign-in process beech me close kar diya gaya tha.");
            } else {
                setAuthError(error.message || "Something went wrong during standard authentication.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden select-none">
            {/* Background Glow Mesh Lights */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-md w-full bg-slate-900 border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative z-10">

                {/* Visual Identity Logo Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
                        <KeyRound size={22} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                        Welcome to Nexus <Sparkles size={16} className="text-indigo-400 animate-pulse" />
                    </h1>
                    <p className="text-slate-500 text-xs mt-1.5">
                        Apne corporate account se connect karke RAG system access karein
                    </p>
                </div>

                {/* Error Banner Alert Area */}
                {authError && (
                    <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-rose-300 text-xs leading-relaxed animate-fade-in">
                        <ShieldAlert size={16} className="shrink-0 mt-0.5 text-rose-400" />
                        <span>{authError}</span>
                    </div>
                )}

                {/* Interactive Action Control Container */}
                <div className="space-y-4">
                    <button
                        onClick={googleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-900 font-semibold text-sm py-3.5 px-5 rounded-xl border border-slate-200 transition disabled:opacity-60 disabled:pointer-events-none shadow-md shadow-white/5"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin text-slate-700" />
                                <span>Verifying Account...</span>
                            </>
                        ) : (
                            <>
                                {/* Standard Vector Flat Google Identity Icon SVG */}
                                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                    <path
                                        fill="#EA4335"
                                        d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.23 1.414 15.46 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.96 0 11.57-4.894 11.57-11.79 0-.795-.085-1.4-.195-2.015H12.24z"
                                    />
                                </svg>
                                <span>Continue with Google</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Footer Disclaimer Policy Notice */}
                <div className="mt-8 pt-5 border-t border-slate-800/60 text-center">
                    <p className="text-[11px] text-slate-500">
                        Secure workspace framework connected to Firebase Node Auth Protocol.
                    </p>
                </div>

            </div>
        </div>
    );
}
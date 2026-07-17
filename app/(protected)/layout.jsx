"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../src/lib/store/authStore";

export default function ProtectedLayout({ children }) {
    const router = useRouter();

    const { isLogin } = useUserStore();

    // Zustand persist hydration
    const hasHydrated = useUserStore.persist.hasHydrated();

    useEffect(() => {
        if (!hasHydrated) return;

        if (!isLogin) {
            router.replace("/login");
        }
    }, [hasHydrated, isLogin, router]);

    // Jab tak Zustand hydrate na ho tab tak kuch mat dikhao
    if (!hasHydrated) {
        return (
            <div className="h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    // Hydration ke baad login nahi hai
    if (!isLogin) {
        return null;
    }

    return children;
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../src/lib/store/authStore";

export default function ProtectedLayout({ children }) {
    const router = useRouter();

    const { isLogin } = useUserStore();

    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;

        if (!isLogin) {
            router.replace("/login");
        }
    }, [hydrated, isLogin, router]);

    if (!hydrated) {
        return (
            <div className="h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!isLogin) {
        return null;
    }

    return children;
}
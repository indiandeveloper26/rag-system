"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../src/lib/store/authStore";

export default function ProtectedLayout({ children }) {
    const router = useRouter();
    const { user, isLogin } = useUserStore();

    const [loading, setLoading] = useState(true);

    console.log('islogin', isLogin)

    useEffect(() => {
        // optional debug
        const stored = localStorage.getItem("user-storage");
        // console.log("localStorage user:", stored);

        if (user === undefined) return;

        if (!isLogin) {


            router.replace("/login");
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return children;
}
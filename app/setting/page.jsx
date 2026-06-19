"use client";

import { signOut } from "firebase/auth";
import { auth } from "../../src/lib/firebas";
import { useRouter } from "next/navigation";


export default function page() {

    const router = useRouter();


    const logout = async () => {

        try {


            // 1. Firebase Google logout
            await signOut(auth);



            // 2. Backend cookie clear
            const res = await fetch("/api/logout", {

                method: "POST",

                credentials: "include"

            });



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

    };



    return (

        <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
        >
            Logout
        </button>

    );

}
import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useUserStore = create(

    persist(

        (set) => ({

            user: null,

            isLogin: false,


            loginUser: (user) => set({

                user: user,
                isLogin: true

            }),



            logoutUser: () => set({

                user: null,
                isLogin: false

            })


        }),


        {
            name: "user-storage"
        }

    )

);
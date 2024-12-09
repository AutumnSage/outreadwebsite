"use client"

import { NextUIProvider, useUser } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import { ReactNode, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { getUserIsLoading, getUserState, useUserStore } from "@/lib/zustand/zustand";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { getUserBySuperbaseID } from "./data-access/user";
interface ProvidersProps {
    children: ReactNode;
}

const queryClient = new QueryClient();

export default function Providers({ children }: ProvidersProps) {
    const setUser = useUserStore((state) => state.setUser);
    const clearUser = useUserStore((state) => state.clearUser);

    useEffect(() => {
        async function fetchSession() {
            console.log("Updated UserState")
            const supabase = createClient();
            const { data } = await supabase.auth.getSession();

            console.log(data)
            console.log(data.session?.user.id)
            if (data.session?.user.id) {
                setUser({ isLoading: true });

                const userData = await getUserBySuperbaseID(data.session?.user.id.toUpperCase() as string)
                console.log(userData)
                if (userData) {
                    setUser({ ...userData, isLoading: false });
                    console.log(useUserStore.getState())
                } else {
                    clearUser();
                }
            }

        }
        fetchSession();
    }, [setUser, clearUser]);

    return (
        <QueryClientProvider client={queryClient}>
            <NextUIProvider>
                {children}
                <Toaster position="bottom-right" />
            </NextUIProvider>
        </QueryClientProvider>
    );
}

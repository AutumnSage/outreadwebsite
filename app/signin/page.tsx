'use client'

import { Button, Input } from "@nextui-org/react";
import PasswordInput from "../component/General/PasswordInput/HiddenInput";
import { signIn } from "./action";
import { useFormState, useFormStatus } from 'react-dom'
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Loading from "../component/General/Loading";
import toast from "react-hot-toast";
import { useUserStore } from "@/lib/zustand/zustand";

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full" type="submit" variant="solid" disabled={pending}>
            {pending ? 'Signing in...' : 'Sign in'}
        </Button>
    )
}

export default function Page() {
    const [state, formAction] = useFormState(signIn, null)
    const formRef = useRef<HTMLFormElement>(null)
    const router = useRouter()
    const userState = useUserStore()

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
            formRef.current?.reset();
        }
        if (state?.success) {
            toast.success(state.success);
            window.location.href = '/user'
            formRef.current?.reset();
        }
    }, [state, router, userState]);


    return (
        <div className="flex flex-col w-full h-[600px] items-center justify-center bg-white">
            <div className=" w-[90%] max-w-[800px] h-[400px] items-center justify-center p-4">
                <h1 className="text-4xl font-semibold text-center text-black">Sign in</h1>
                <div className="flex flex-col justify-center items-center w-full h-[300px] p-4">
                    <form ref={formRef} action={formAction} className="w-full">
                        <Input className="mb-4 text-black" type="email" name="email" id="email" variant="bordered" label="Email" placeholder="Enter your email" />
                        <PasswordInput placeholder="Enter your password" label="Password" name="password" />
                        <div className="mb-4"></div>
                        <SubmitButton />
                        <div className="w-full flex justify-end flex-col">
                            {/* <a className="mb-1 text-sm text-right text-blue-500" href="/signup">No Account? Sign up here </a> */}
                            <a className="mb-1 text-sm text-right text-blue-500" href="/send-reset-email">Forgot Password? Reset here </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
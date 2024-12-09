// app/signup/page.tsx
'use client'

import { Button, Input } from "@nextui-org/react";
import { signUp } from "./action";
import PasswordInput from "../component/General/PasswordInput/HiddenInput";
import { useFormState, useFormStatus } from 'react-dom'
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full" type="submit" variant="solid" disabled={pending}>
            {pending ? 'Signing up...' : 'Sign up'}
        </Button>
    )
}

export default function Page() {
    const [state, formAction] = useFormState(signUp, null)
    const formRef = useRef<HTMLFormElement>(null)
    const router = useRouter()

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
            formRef.current?.reset();
        }
        if (state?.success) {
            toast.success(state.success);
            setTimeout(() => {
                router.push('/user')
            }, 2000);
            formRef.current?.reset();
        }
    }, [state, router]);

    return (
        <div className="flex flex-col w-full h-[600px] items-center justify-center bg-white">
            <div className="w-1/2 h-[400px] items-center justify-center p-4">
                <h1 className="text-4xl font-semibold text-center text-black">Create An Account</h1>
                <div className="flex flex-col justify-center items-center w-full h-[300px] p-4">
                    <form ref={formRef} action={formAction} className="w-full">
                        <Input
                            className="mb-4 text-black"
                            type="email"
                            name="email"
                            id="email"
                            variant="bordered"
                            label="Email"
                            placeholder="Enter your email"
                            required
                        />
                        <PasswordInput
                            placeholder="Enter your password"
                            label="Password"
                            name="password"
                        />
                        <div className="mb-4"></div>
                        <div className="w-full flex justify-end">
                            <a className="mb-1 text-sm text-right text-blue-500" href="/signin">Already have an account? Sign in here</a>
                        </div>
                        <SubmitButton />
                    </form>
                </div>
            </div>
        </div>
    );
}
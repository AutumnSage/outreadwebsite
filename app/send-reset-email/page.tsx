'use client'

import { sendResetEmail } from "./action";
import { useRouter } from "next/navigation";
import { Button, Input } from "@nextui-org/react";
import { useFormState, useFormStatus } from 'react-dom'
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full" type="submit" variant="solid" disabled={pending}>
            {pending ? 'Processing...' : 'Request Reset Email'}
        </Button>
    )
}

export default function Page() {
    const [state, formAction] = useFormState(sendResetEmail, null)
    const formRef = useRef<HTMLFormElement>(null)
    const router = useRouter()

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
            formRef.current?.reset();
        }
        if (state?.success) {
            toast.success(state.success);
            formRef.current?.reset();
        }
    }, [state, router]);



    return (
        <div className="flex flex-col w-full h-[600px] items-center justify-center bg-white">
            <div className=" w-[90%] max-w-[800px] h-[400px] items-center justify-center p-4">
                <h1 className="text-4xl font-semibold text-center text-black">
                    Request Password Reset
                </h1>
                <div className="flex flex-col justify-center items-center w-full h-[300px] p-4">
                    <form ref={formRef} action={formAction} className="w-full">
                        <Input label="Email" placeholder="Enter your email" name="email" type="email" required />
                        <div className="mb-4"></div>
                        <SubmitButton />
                    </form>
                </div>
            </div>
        </div>
    );
}
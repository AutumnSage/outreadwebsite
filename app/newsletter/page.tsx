"use client"

import React, { useEffect, useRef, useState } from "react";
import { useClientMediaQuery } from "@/hooks/useClientMediaQuery";
import { Image, Button, Input } from "@nextui-org/react";
import { newsletterSignup } from "./action";
import { useFormState, useFormStatus } from 'react-dom'
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation'

const endpoint = process.env.DEV_MODE === "true" ? process.env.LOCALHOST : ""
interface NewsletterResult {
    error?: string;
    success?: string;
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="text-black w-full" type="submit" disabled={pending}>
            {pending ? "Signing up..." : "Sign up"}
        </Button>
    )
}

function NewsletterForm({ labelColor = "text-white", input = '' }) {
    const [state, formAction] = useFormState<NewsletterResult | null, FormData>(newsletterSignup, null)
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();
    const [email, setEmail] = useState('')

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Send welcome email
        try {
            const response = await fetch(endpoint + `/api/sendEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'newsletter',
                    email: email,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to send email");
            }

            // If email sent successfully, trigger the server action
            const formData = new FormData();
            formData.append('email', email);
            formAction(formData);
        } catch (error) {
            toast.error("Failed to send email");
        }
    }

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
            formRef.current?.reset();
        }
        if (state?.success) {
            toast.success(state.success);
            setTimeout(() => {
                router.push('/')
            }, 2000);
            formRef.current?.reset();
        }
    }, [state, router]);

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="w-full px-4">
            <Input
                className={`mb-4 ${input}`}
                classNames={{
                    label: `${labelColor}`
                }}
                type="email"
                name="email"
                id="email"
                variant="bordered"
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <SubmitButton />
        </form>
    );
}

function DesktopComponent() {
    return (
        <div className="flex flex-col w-screen h-full bg-[#27394F] text-black bg-top">
            <div className="flex text-white w-full h-[700px] justify-center items-center">
                <div className="flex flex-col items-center justify-center w-1/2 h-full px-8 ">
                    <div className="text-center text-4xl font-semibold pt-6 mb-2">
                        Get free weekly summaries sent to your email!
                    </div>
                    <div className="flex flex-col w-full p-2 h-auto mb-8 ">
                        <NewsletterForm labelColor="!text-white" />
                    </div>
                </div>
                <div className="h-full w-1/2 flex justify-end items-start overflow-y-hidden">
                    <Image className="z-10 max-w-[] object-cover -top-[100px] h-full" alt="newsletter" src="/newsletter.png"></Image>
                </div>
            </div>
        </div>
    )
}

function MobileComponent() {
    return (
        <div className="flex flex-col w-screen h-full bg-white text-white bg-[url('/carousel.png')] bg-top -z-10">
            <div className="flex flex-col text-white w-full h-[1000px] justify-center items-center">
                <div className="w-[90%] h-full flex flex-col justify-center items-center" >
                    <div className="-top-[100px] relative">
                        <Image className="max-h-[800px]" alt="newsletter" src="/newsletter.png"></Image>
                    </div>
                    <div className="text-center text-xl font-semibold px-8 mb-8 text-black">
                        Get free weekly summaries sent to your email!
                    </div>
                    <NewsletterForm labelColor="!text-black" input='text-black' />
                </div>
            </div>
        </div>
    )
}

export default function App() {
    const isMobile = useClientMediaQuery("(max-width: 768px)");
    return (
        <>
            {isMobile ? <MobileComponent /> : <DesktopComponent />}
        </>
    );
}
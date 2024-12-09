'use client'

import React, { useEffect, useRef, useState } from "react";
import { Button, Image } from "@nextui-org/react";
import { useClientMediaQuery } from '../../../hooks/useClientMediaQuery'
import DownloadFromTheAppStore from "../General/DownloadAppStoreButton";
import { useFormState } from 'react-dom'
import { signOut } from "./action";
import { isAuthenticated, useUserStore, } from '@/lib/zustand/zustand';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ModalButton from "../ModalButton/modalButton";

function AuthButton({ size, variant = "bordered" }: { size: "md" | "lg" | "sm" | undefined, variant: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost" | undefined }) {
    const [state, formAction] = useFormState(signOut, null)
    const formRef = useRef<HTMLFormElement>(null)
    const { clearUser, supabaseUserId } = useUserStore()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true);

    setTimeout(() => {
        setIsLoading(false);
    }, 300);

    const handleSignOut = () => {
        formAction();
        toast.success("Successfully signed out");
        router.push('/');
        clearUser();
    }

    if (isLoading) return <div></div>

    if (supabaseUserId) {
        return (
            <div className="flex">
                <form action={handleSignOut}>
                    <a href="/">
                        <Button type="submit" color="primary" size={size} className="text-black border-black rounded-md mx-1" variant={variant}>
                            SIGN OUT
                        </Button>
                    </a>
                </form>
            </div>
        )
    } else {
        return (
            <div className="flex">
                <a href="/signin">
                    <Button color="primary" size={size} className="text-black border-black rounded-md mx-1 " variant={variant}>
                        SIGN IN
                    </Button>
                </a>
                <a href="/newsletter">
                    <Button color="primary" size={size} className="text-black border-black rounded-md mx-1" variant={variant}>
                        NEWSLETTER
                    </Button>
                </a>
            </div>
        )
    }
}

export default function App() {
    const isMobile = useClientMediaQuery("(max-width: 768px)");
    const size = isMobile ? "md" : "lg";
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };


    const NavButtons = ({ variant = "bordered" }: {
        variant: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost" | undefined
    }) => (
        <>
            <a href="/contact-us">
                <Button color="primary" size={size} className="text-black border-black rounded-md mx-1" variant={variant}>
                    CONTACT US
                </Button>
            </a>
            <AuthButton size={size} variant={variant} />
        </>
    );

    return (
        <>
            <div className="flex justify-between items-center w-full shadow-md h-[75px] bg-white relative p-4 z-20">
                <a className="" href="/">
                    {isMobile ? <Image src='/favi.png' className="mr-2 flex items-center justify-center" height={40} alt="outread logo" /> : <Image src='/logo.png' className="top-[2px]" height={53} alt="outread logo" />}
                </a>

                {isMobile ? (
                    <div className="flex items-center">
                        <Button onClick={toggleMobileMenu} className="p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </Button>
                        {isMobileMenuOpen && (
                            <div className="absolute top-[75px] right-0 bg-white shadow-md p-4 flex flex-col items-center">
                                <NavButtons variant="light" />
                                <ModalButton boardered={true} text="Get App" bgColour="white" textColour="black" width="150px" height="48px" />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full flex items-end justify-end">
                        <NavButtons variant="bordered" />
                        <div className="mx-1"></div>
                        <ModalButton boardered={true} text="GET APP" bgColour="white" textColour="black" width="180px" height="48px" />
                    </div>
                )}
            </div>
        </>
    )
}
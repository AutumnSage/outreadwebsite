'use client'

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Button, Image } from "@nextui-org/react";
import { useClientMediaQuery } from '../../../hooks/useClientMediaQuery'
import DownloadFromTheAppStore from "../General/DownloadAppStoreButton";
import { useFormState } from 'react-dom'
import { signOut } from "./action";
import { isAuthenticated, useUserStore, } from '@/lib/zustand/zustand';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ModalButton from "../ModalButton/modalButton";

function AuthButton({ size, variant = "bordered" , isMobile = false }: { size: "md" | "lg" | "sm" | undefined, variant: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost" | undefined , isMobile : boolean | null}) {
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
            <div className={`flex ${isMobile && 'flex-col items-center'}`}>
                <a href="/discover">
                    <Button type="submit" color="primary" size={size} className="auth-btn mx-1 text-[#132435] hover:text-[#88D84D] text-lg font-medium  border-0 hover:border-b-2 border-b-[#88D84D]  rounded-none transition-all" variant={variant}>
                        Search
                    </Button>
                </a>
                <a href="/user">
                    <Button type="submit" color="primary" size={size} className="auth-btn mx-1 text-[#132435] hover:text-[#88D84D] text-lg font-medium  border-0 hover:border-b-2 border-b-[#88D84D]  rounded-none transition-all" variant={variant}>
                        My Account
                    </Button>
                </a>
                <form action={handleSignOut}>
                    <a href="/">
                        <Button type="submit" color="primary" size={size} className="auth-btn mx-1 text-[#132435] hover:text-[#88D84D] text-lg font-medium  border-0 hover:border-b-2 border-b-[#88D84D]  rounded-none transition-all" variant={variant}>
                            Sign Out
                        </Button>
                    </a>
                </form>
            </div>
        )
    } else {
        return (
            <div className="flex">
                <a href="/signin">
                    <Button color="primary" size={size} className="auth-btn mx-1 text-[#132435] hover:text-[#88D84D] text-lg font-medium  border-0 hover:border-b-2 border-b-[#88D84D]  rounded-none transition-all" variant={variant}>
                        SIGN IN
                    </Button>
                </a>
                <a href="/newsletter">
                    <Button color="primary" size={size} className="auth-btn mx-1 text-[#132435] hover:text-[#88D84D] text-lg font-medium  border-0 hover:border-b-2 border-b-[#88D84D]  rounded-none transition-all" variant={variant}>
                        NEWSLETTER
                    </Button>
                </a>
                <a href="/contact-us">
                    <Button color="primary" size={size} className="contact-us-btn  mx-1 text-[#132435] hover:text-[#88D84D] text-lg font-medium  border-0 hover:border-b-2 border-b-[#88D84D]  rounded-none transition-all" variant={variant}>
                        CONTACT US
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
    const userData = useUserStore();
    const subscriptionPlan: any = {
        "USER": "Free",
        "PAID_USER": "Premium"
    }
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };


    const NavButtons = ({ variant = "bordered" }: {
        variant: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost" | undefined
    }) => (
        <>
            <Suspense>
                <AuthButton isMobile={isMobile} size={size} variant={variant} />
            </Suspense>
        </>
    );

    return (
        <>
            <div className="flex justify-between items-center w-full shadow-md h-[75px] bg-white relative px-4 py-0 z-20">
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
                                {/* <ModalButton boardered={false} text="Get App" bgColour="white" textColour="black" width="150px" height="48px" /> */}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full flex items-end justify-end">
                        <div className="flex items-center gap-3">
                        <NavButtons variant="bordered" />
                        {/* <div className="mx-1"></div> */}
                        {/* <ModalButton boardered={false} text="GET APP" bgColour="white" textColour="black" width="120px" height="48px" /> */}
                        {/* <ModalButton boardered={false} text="GET APP" bgColour="white" textColour="black" width="150px" height="48px" /> */}
                        {
                            subscriptionPlan[userData.role!] === "Free" && 
                            (
                                <Button variant="solid" className="px-5 py-3 rounded-full shadow-md  bg-[#88D84D] text-white" onClick={(e) =>{}}>Get Premium</Button>
                            )
                        }
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
"use client"
import { redirect, useRouter } from "next/navigation"
import { Button, Input } from "@nextui-org/react";
import { updateUsername } from "./action";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../component/NavbarComponents/action";
import CommingSoon from "@/app/component/comming-soon/page";
import { getUserState, useUserStore } from "@/lib/zustand/zustand";
import { Divider } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useFormState } from "react-dom";

const STRIPE_PUBLIC_KEY = "pk_live_51K55kmDOnxS19iBlIjxFwa8OVBnqkPr0N78QHtwk7QM3F9Vx6THdZZZh8zlHVxN0QUYpPL7ihPufwsxNYIaGtHin00gq1f3UhI";

const endpoint = process.env.DEV_MODE === "true" ? process.env.LOCALHOST : ""


export default function Page() {

    const userData = useUserStore()

    const id = userData.id as string

    const [state, formAction] = useFormState(signOut, null)
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const userState = useUserStore()
    const { clearUser, supabaseUserId } = useUserStore()
    const paidUser = userState.role === "PAID_USER"


    const handleUnsubscribe = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(endpoint + '/api/cancelSubscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: getUserState().email }),
            });

            if (!response.ok) {
                throw new Error('Failed to cancel subscription');
            }

            toast.success('Subscription successfully canceled');
            router.push('/');
        } catch (error) {
            console.error('Error canceling subscription:', error);
            toast.error('Failed to cancel subscription. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const subscriptionPlan: any = {
        "USER": "Free",
        "PAID_USER": "Premium"
    }

    const [isEdit, setEdit] = useState(false)

    const handleSignOut = () => {
        formAction();
        toast.success("Successfully signed out");
        router.push('/');
        clearUser();
    }


    return (
        <div className="w-full h-full bg-[#F4F7FB] p-12">
            <div className="xl:w-11/12 flex flex-col m-auto">
                <div className=" w-full">
                    <h1 className="flex flex-row w-full text-[#132435] text-[40px] font-medium mb-4"> My Account </h1>
                    {isEdit ?
                        <form action={updateUsername.bind(null, id)} className="mt-2">
                            <h2 className="text-2xl font-semibold">Update username</h2>
                            <Input className="mb-4" type="username" name="username" id="username" variant="bordered" label="username" placeholder="Enter your username" />
                            <Button variant="solid" className="bg-[#4B7E68] text-white" type="submit">Update</Button>
                        </form>
                        :
                        <div>
                            <div className="text-3xl font-normal text-[#132435] mb-4">Hi, {userData.username as string} </div>
                            <p  className="cursor-pointer text-[#88D84D]" onClick={() => setEdit(true)}>Change Username</p>
                        </div>
                    }
                </div>
                <Divider className="text-black my-9" />
                <div >
                    <div className="flex flex-row w-full text-[#132435] text-[22px] font-semibold  mb-4"> Your Subscription Plan</div>
                    <div className="text-2xl mb-4"> {subscriptionPlan[userData.role!]} </div>
                    <div className="flex gap-4">
                    {
                        subscriptionPlan[userData.role!] === "Premium" &&
                        <Button variant="solid" className="px-5 py-3 rounded-full shadow-md  bg-[#88D84D] text-white" onClick={handleUnsubscribe}>Unsubscribe</Button>
                    }
                    {
                        subscriptionPlan[userData.role!] === "Free" &&
                        <Button variant="solid" className="px-5 py-3 rounded-full shadow-md  bg-[#88D84D] text-white" onClick={handleUnsubscribe}>Get Premium</Button>
                    }
                    </div>
                </div>
                <Divider className="text-black my-9" />
                <div className="flex flex-col">
                    <div className="flex flex-row w-full text-[#132435] text-[22px] font-semibold mb-4">Login Information</div>
                    <div>Email : {userData.email}</div>
                    {/* <a className="text-[#4B7E68]" href="">Change Email</a> */}
                    <a className="text-[#88D84D]" href="/send-reset-email">Change Password</a>
                </div>
                <Divider className="text-black my-9" />
                <div>
                    <div className="flex flex-row w-full text-[#132435] text-[22px] font-semibold  mb-4">Account</div>
                    <p  className="cursor-pointer text-[#88D84D] mb-4" onClick={() => handleSignOut()}>Sign Out</p>
                    <div>To delete your account, <a className="cursor-pointer text-[#88D84D]" href="/contact-us"> contact us</a></div>
                </div>
            </div >
        </div>
    );
}



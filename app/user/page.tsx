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

const STRIPE_PUBLIC_KEY = "pk_live_51K55kmDOnxS19iBlIjxFwa8OVBnqkPr0N78QHtwk7QM3F9Vx6THdZZZh8zlHVxN0QUYpPL7ihPufwsxNYIaGtHin00gq1f3UhI";

const endpoint = process.env.DEV_MODE === "true" ? process.env.LOCALHOST : ""


export default function Page() {

    const userData = useUserStore()

    const id = userData.id as string


    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const userState = useUserStore()
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

    return (
        <div className="flex flex-col w-full  text-black  bg-white p-12 mb-8">
            <div >
                <div className="flex flex-row w-full text-black  bg-white text-4xl"> My Account </div>
                {isEdit ?
                    <form action={updateUsername.bind(null, id)} className="mt-2">
                        <h2 className="text-2xl font-semibold">Update username</h2>
                        <Input className="mb-4" type="username" name="username" id="username" variant="bordered" label="username" placeholder="Enter your username" />
                        <Button variant="solid" className="bg-[#4B7E68] text-white" type="submit">Update</Button>
                    </form>
                    :
                    <div>
                        <div className="text-2xl mb-4">Hi, {userData.username as string} </div>
                        <Button variant="solid" className="bg-[#4B7E68] text-white" onClick={() => setEdit(true)}>Edit Username</Button>
                    </div>

                }
            </div>
            <Divider className="text-black my-8" />
            <div >
                <div className="flex flex-row w-full text-black  bg-white text-lg mb-4"> Your Subscription Plan</div>
                <div className="text-2xl"> {subscriptionPlan[userData.role!]} </div>
                {
                    subscriptionPlan[userData.role!] === "Premium" &&
                    <Button variant="solid" className="bg-[#4B7E68] text-white" onClick={handleUnsubscribe}>Unsubscribe</Button>
                }
            </div>
            <Divider className="text-black my-8" />
            <div className="flex flex-col">
                <div className="flex flex-row w-full text-black  bg-white text-lg mb-4">Login Information</div>
                <div>Email : {userData.email}</div>
                {/* <a className="text-[#4B7E68]" href="">Change Email</a> */}
                <a className="text-[#4B7E68]" href="/send-reset-email">Change Password</a>
            </div>

            <Divider className="text-black my-8" />

            <div>
                <div className="flex flex-row w-full text-black  bg-white text-lg mb-4">Delete Your Account</div>
                <div>To delete your account, <a className="text-[#4B7E68]" href="/contact-us"> contact us</a></div>
            </div>
        </div >
    );
}



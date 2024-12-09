'use client'

import { useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { getUserState, isAuthenticated, useUserStore } from '@/lib/zustand/zustand';
import toast from 'react-hot-toast';

const STRIPE_PUBLIC_KEY = "pk_live_51K55kmDOnxS19iBlIjxFwa8OVBnqkPr0N78QHtwk7QM3F9Vx6THdZZZh8zlHVxN0QUYpPL7ihPufwsxNYIaGtHin00gq1f3UhI";

const endpoint = process.env.DEV_MODE === "true" ? process.env.LOCALHOST : ""

interface SelectOptionProps {
    title: string;
    amount: number;
    description: string;
    checkoutDescription: string;
    priceId: string;
    isUpgrade?: boolean;
    isUnsubscribe?: boolean;
    onUnsubscribe?: () => void;
}

function SelectOption({
    title,
    amount,
    description,
    checkoutDescription,
    priceId,
    isUpgrade,
    isUnsubscribe,
    onUnsubscribe
}: SelectOptionProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (isUnsubscribe && onUnsubscribe) {
            onUnsubscribe();
        } else {
            setIsLoading(true);
            try {
                const response = await fetch(endpoint + '/api/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ priceId }),
                });

                if (!response.ok) {
                    throw new Error('Failed to create checkout session');
                }

                const { sessionId } = await response.json();
                const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
                if (stripe) {
                    await stripe.redirectToCheckout({ sessionId });
                }
            } catch (error) {
                console.error('Error creating checkout session:', error);
                alert('Failed to create checkout session. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className='w-[500px] h-full rounded-lg shadow-2xl mx-2 text flex flex-col p-4' >
            <h2 className='text-lg font-semibold'>{title}</h2>
            {!isUnsubscribe && (
                <>
                    <div className="text-4xl font-semibold flex flex-row mb-auto ">
                        ${amount}
                    </div >
                    <div className='text-lg font-normal'>{description}</div>
                    <div className='text-lg font-normal mt-auto text-blue-400'>{checkoutDescription}</div>
                </>
            )}
            <button
                className={`w-full rounded-lg p-2 my-2 ${isUnsubscribe ? 'bg-red-500' : 'bg-black'} text-white`}
                onClick={handleClick}
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : isUpgrade ? 'Upgrade' : isUnsubscribe ? 'Unsubscribe' : 'Select'}
            </button>
        </div>
    )
}

const selectOptions: SelectOptionProps[] = [
    // {
    //     title: "Monthly",
    //     amount: 20,
    //     description: "Billed monthly",
    //     checkoutDescription: "7 day free-trial then $20 USD / month",
    //     priceId: "price_1Q7f3nDOnxS19iBlilrummi5"
    // },
    // {
    //     title: "Annual",
    //     amount: 200,
    //     description: "Billed annually",
    //     checkoutDescription: "Save $40 compared to monthly plan",
    //     priceId: "price_1NxxxxxxxxxxxxxxxxxxxxxYY", // Replace with actual Stripe Price ID for annual plan
    //     isUpgrade: true
    // },
    {
        title: "Unsubscribe",
        amount: 0,
        description: "",
        checkoutDescription: "",
        priceId: "",
        isUnsubscribe: true
    }
]

export default function Page() {
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

    return (
        <main className='bg-white w-full min-h-screen flex flex-col text-black items-center justify-center p-4'>
            <div className='mb-8 text-6xl font-semibold'>Current Subscription : {paidUser ? "Premium" : "Free"} </div>
            <div className='text-4xl font-semibold mb-12'> Manage Your Subscription </div>
            <div className='w-full justify-center items-center flex flex-wrap gap-8'>
                {selectOptions.map((option, key) => (
                    <SelectOption
                        key={key}
                        {...option}
                        onUnsubscribe={option.isUnsubscribe ? handleUnsubscribe : undefined}
                    />
                ))}
            </div>
            {isLoading && <div className="mt-4">Processing...</div>}
        </main>
    );
}
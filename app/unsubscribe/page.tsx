'use client'

import React, { useEffect, useRef, useState } from 'react'
import { unsubscribe } from './action'
import { useFormState } from 'react-dom'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function UnsubscribePage() {
    const [state, formAction] = useFormState(unsubscribe, null)
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
                router.push('/')
            }, 2000);
            formRef.current?.reset();
        }
    }, [state, router]);


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Unsubscribe
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form action={formAction} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1 text-black">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Unsubscribe
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
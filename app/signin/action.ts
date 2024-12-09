
"use server";
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { useUserStore } from '@/lib/zustand/zustand';

export async function signIn(prevState: any, formData: FormData) {
    const supabase = createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        return { error: 'Invalid email or password. Please try again.' }
    }
    revalidatePath('/')
    return { success: 'Signed in successfully' }
}
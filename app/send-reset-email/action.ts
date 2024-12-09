'use server'

import { createClient } from "@/lib/supabase/server";

export async function sendResetEmail(prevState: any, formData: FormData) {
    const supabase = createClient();
    const email = formData.get('email') as string;

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
            console.error("Error initiating password reset:", error.message);
            return { error: error.message };
        }

        return { success: "Password reset email sent. Please check your inbox." };
    } catch (error: any) {
        console.error("Error initiating password reset:", error.message);
        return { error: error.message };
    }
}
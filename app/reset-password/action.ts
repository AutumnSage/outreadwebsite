"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function resetPassword(prevState: any, formData: FormData) {
    const supabase = createClient();
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
        return { error: "New password does not match confirmation" };
    }

    try {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            console.error("Error updating password:", error.message);
            return { error: error.message };
        }

        revalidatePath('/');
        return { success: "Password reset successfully. Please sign in with your new password." };
    } catch (error: any) {
        console.error("Error updating password:", error.message);
        return { error: error.message };
    }
}
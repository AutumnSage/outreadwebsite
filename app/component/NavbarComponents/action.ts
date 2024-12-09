"use server";

import { redirect } from "next/navigation";
import { ActionResult } from "next/dist/server/app-render/types";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function signOut(): Promise<ActionResult> {
    const supabase = createClient()
    try {
        await supabase.auth.signOut()
    } catch (e) {
        return { error: "Signout error" }
    }
    revalidatePath('/')
    return { success: "Successfully signed out" }
}
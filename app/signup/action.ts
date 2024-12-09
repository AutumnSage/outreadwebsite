// app/signup/action.ts
"use server"

import { createClient } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";

export async function signUp(prevState: any, formData: FormData) {
    const supabase = createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email and password are required" };
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });



    if (error) {
        console.error("Signup error:", error);
        return { error: error.message };
    }

    if (!data) {
        return { error: "An error occurred while creating your account. Please try again." };
    }

    const prisma = new PrismaClient();
    try {
        await prisma.user.create({
            data: {
                email: email,
                supabaseUserId: data.user!.id.toUpperCase(),
            },
        });

        await prisma.newsletterSubscriber.create({
            data: {
                email: email,
            },
        });

    } catch (error) {
        console.error("Error creating user in database:", error);
        return { error: "An error occurred while creating your account. Please try again." };
    } finally {
        await prisma.$disconnect();
    }


    return { success: "Account created successfully" };
}
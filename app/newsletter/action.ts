"use server";

import { PrismaClient } from "@prisma/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default async function Page() { }

interface NewsletterResult {
    error?: string;
    success?: string;
}


export async function newsletterSignup(prevState: any, formData: FormData): Promise<NewsletterResult> {
    const prisma = new PrismaClient();
    const email = formData.get("email") as string;

    if (!email) {
        return { error: "Email is required" };
    }

    try {
        const existingSubscriber = await prisma.newsletterSubscriber.findUnique({ where: { email: email } });
        if (existingSubscriber) {
            return { error: "You're already signed up for the newsletter!" };
        }

        await prisma.newsletterSubscriber.create({
            data: {
                email: email,
            },
        });

        return { success: "Successfully signed up for the newsletter! Check your email for a welcome message." };
    } catch (error) {
        console.error('Error during newsletter signup:', error);
        return { error: "An error occurred while signing up. Please try again." };
    } finally {
        await prisma.$disconnect();
    }
}
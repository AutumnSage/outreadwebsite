import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, User } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",// Use the latest API version
});

export async function GET(req: NextRequest) {
    const updatedUsers: string[] = [];
    try {
        // Get all users with PAID_USER role from the database
        const paidUsers = await prisma.user.findMany({
            where: {
                role: 'PAID_USER',
            },
        });

        const data = await fetch("https://out-read.com/wp-json/custom/v1/all-users", {
            method: 'GET',
        });

        const users = await data.json();
        const s2Members = users.filter((user: any) => user.roles[0] === "s2member_level1");

        for (const user of paidUsers) {
            if (s2Members.find((u: User) => u.email !== user.email)) continue

            console.log("Found Stripe User : " + user.email)

            // Check the user's subscription status in Stripe using their email
            const subscriptions = await stripe.subscriptions.search({
                query: `email:'${user.email}' AND status:'active'`,
            });

            // If the user doesn't have an active Stripe subscription, update their role
            if (subscriptions.data.length === 0) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { role: 'USER' },
                });
                updatedUsers.push(user.email);
            }
        }
    } catch (error) {
        console.error('Error checking subscriptions:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }

    return NextResponse.json({ message: 'Subscription check completed successfully', updatedUsers: updatedUsers }, { status: 200 });
}

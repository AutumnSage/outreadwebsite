import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20', // Updated to the latest API version
});

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // Find the user in the database
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, role: true }
        });



        if (!user || user.role !== 'PAID_USER') {
            return NextResponse.json({ error: 'User not found or no active subscription' }, { status: 404 });
        }

        // Since we don't have stripeCustomerId in the schema, we'll need to fetch it from Stripe
        const stripeCustomers = await stripe.customers.list({ email: email });
        if (stripeCustomers.data.length === 0) {
            return NextResponse.json({ error: 'No Stripe customer found for this user' }, { status: 404 });
        }
        const stripeCustomerId = stripeCustomers.data[0].id;

        // Get the customer's subscriptions
        const subscriptions = await stripe.subscriptions.list({
            customer: stripeCustomerId,
            status: 'active',
        });

        if (subscriptions.data.length === 0) {
            return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
        }

        // Cancel the subscription
        await stripe.subscriptions.cancel(subscriptions.data[0].id);

        // Update user's role in the database
        await prisma.user.update({
            where: { email },
            data: { role: 'USER' }
        });

        return NextResponse.json({ message: 'Subscription successfully canceled' });
    } catch (error) {
        console.error('Error canceling subscription:', error);
        return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
    }
}
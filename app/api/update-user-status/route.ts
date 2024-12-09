import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-06-20',
});

const prisma = new PrismaClient();

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { session_id } = await req.json();

            // Retrieve the session from Stripe
            const session = await stripe.checkout.sessions.retrieve(session_id);


            if (session.payment_status === 'paid') {
                // Get the customer email from the session
                const customerEmail = session.customer_details?.email;
                console.log({ customerEmail })


                if (customerEmail) {
                    // Update the user status in the database
                    await prisma.user.update({
                        where: { email: customerEmail },
                        data: { role: 'PAID_USER' },
                    });

                    return NextResponse.json({ message: 'User status updated successfully' });
                } else {
                    throw new Error('Customer email not found in session');
                }
            } else {
                throw new Error('Payment not completed');
            }
        } catch (err: any) {
            console.error('Error updating user status:', err);
            return NextResponse.json({ error: { message: err.message } }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: { message: 'Method Not Allowed' } }, { status: 405 });
    }
}
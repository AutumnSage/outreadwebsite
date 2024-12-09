import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-06-20', // Updated to the latest API version
});



export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { priceId } = await req.json();

            // Create Checkout Sessions from body params.
            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `http://localhost:3000//subscription`,
            });

            return NextResponse.json({ sessionId: session.id });
        } catch (err: any) {
            console.error('Error creating checkout session:', err);
            return NextResponse.json({ error: { message: err.message } }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: { message: 'Method Not Allowed' } }, { status: 405 });
    }
}
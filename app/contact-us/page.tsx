'use client'

import { Button, Input, Textarea } from "@nextui-org/react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
// import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

const endpoint = process.env.DEV_MODE === "true" ? process.env.LOCALHOST : ""

function ContactForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const { executeRecaptcha } = useGoogleReCaptcha();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        // if (!executeRecaptcha) {
        //     console.log("Execute recaptcha not yet available");
        //     return;
        // }

        try {
            // const token = await executeRecaptcha('contact_form');

            const formData = new FormData(event.currentTarget);
            const name = formData.get('name') as string;
            const email = formData.get('email') as string;
            const message = formData.get('message') as string;

            const response = await fetch(endpoint + '/api/sendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'contact',
                    name,
                    email,
                    message,
                    // recaptchaToken: token
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Message sent successfully!');
                formRef.current?.reset();
            } else {
                toast.error(data.error || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="w-full">
            <Input
                className="mb-4 text-black"
                type="text"
                name="name"
                label="Name"
                placeholder="Enter your name"
                variant="bordered"
                required
            />
            <Input
                className="mb-4 text-black"
                type="email"
                name="email"
                label="Email"
                placeholder="Enter your email"
                variant="bordered"
                required
            />
            <Textarea
                className="mb-4 text-black"
                name="message"
                label="Message"
                placeholder="Enter your message"
                variant="bordered"
                required
            />
            {/* <GoogleReCaptchaProvider reCaptchaKey="6Lce-VsqAAAAAPisNY3absGuWg5fI5Xx0QqQYq-Z"> */}
            <Button className="w-full" type="submit" variant="solid" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
            {/* </GoogleReCaptchaProvider> */}

        </form>
    );
}

export default function ContactUs() {
    return (
        <div className="flex flex-col w-full min-h-[600px] items-center justify-center bg-white">
            <div className="w-[90%] max-w-[800px] items-center justify-center p-4">
                <h1 className="text-4xl font-semibold text-center text-black mb-8">Contact Us</h1>
                <ContactForm />
            </div>
        </div>
    );
}
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, input } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import DownloadFromAppStoreBlack from "../General/DownloadAppStoreButton";

import { useFormState, useFormStatus } from 'react-dom'
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from "react";

const endpoint = process.env.DEV_MODE === "true" ? process.env.LOCALHOST : ""

interface NewsletterResult {
    error?: string;
    success?: string;
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="text-black w-full bg-[#4B7E68] text-white" type="submit" disabled={pending}>
            {pending ? "Signing up..." : "SIGN UP"}
        </Button>
    )
}

async function newsletterSignup(prevState: NewsletterResult | null, formData: FormData): Promise<NewsletterResult> {
    const email = formData.get('email')
    if (!email) {
        return { error: "Email is required" }
    }
    try {
        const response = await fetch(`${endpoint}/api/sendEmail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'newsletter',
                email: email,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to send email");
        }

        return { success: "Successfully signed up for the newsletter!" }
    } catch (error) {
        return { error: "Failed to sign up for the newsletter. Please try again." }
    }
}




export default function ModalButton({ boardered, text, bgColour, textColour, width, height }: { boardered: boolean, text: string, bgColour: string, textColour: string, width: string, height: string }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [state, formAction] = useFormState<NewsletterResult | null, FormData>(newsletterSignup, null)
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();
    console.log("================ router " , router);
    
    const [email, setEmail] = useState('')

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        formAction(formData);
    }

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
            formRef.current?.reset();
        }
        if (state?.success) {
            toast.success(state.success);
            onClose(); // Close the modal on success
            formRef.current?.reset();
            setEmail('');
        }
    }, [state, router, onClose]);


    return (
        <>
            <Button
                className={`text-${textColour} ${boardered ? 'border-solid border-2 border-black rounded-md' : 'hover:border-b-2 border-[#88D84D] rounded-none hover:text-[#88D84D] '} text-md text-center font-medium`}
                style={{ backgroundColor: bgColour, width: width, height: height }}
                onClick={onOpen}
            >
                {text}
            </Button >
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent className="text-black">
                    <ModalHeader className="flex flex-col" >
                        <div className=" w-full flex justify-center gap-1 text-2xl">
                            Get the Outread App
                        </div>
                        <div className="w-full flex justify-center font-normal text-medium ">Start exploring research like never before  </div>
                    </ModalHeader>
                    <ModalBody className="flex flex-col justify-center items-center">
                        <Image src="qrNoBackground.png" alt="qr" className="w-full h-full mb-2">

                        </Image>
                        <DownloadFromAppStoreBlack width="120px" height="50px" />
                        <div className="text-sm flex flex-col justify-center items-center">
                            <div>
                                Don’t have an iOS device?
                            </div>
                            <div className="text-center mb-4">
                                Sign up for our <span className="text-[#F26546]">newsletter</span> for <span className="text-[#9678AC]">free summaries and updates!</span>
                            </div>
                            <form ref={formRef} onSubmit={handleSubmit} className="w-[80%] mb-2">
                                <Input
                                    className="mb-2 w-full text-center"
                                    classNames={{ input: "text-center" }}
                                    type="email"
                                    name="email"
                                    id="email"
                                    variant="bordered"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <SubmitButton />
                            </form>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

"use client"

import React, { useEffect, useState } from "react";
import { useClientMediaQuery } from "@/hooks/useClientMediaQuery";
import { Image } from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";



const defaultContent =
    [
        "Outread is an AI-powered research and insight discovery platform. Outread makes it easier to discover and digest cutting-edge research papers in different industries. Outread highlights the significance of each piece of research and its impact on the world, making it easier for users to stay informed and make informed decisions.",
        "With a subscription to Outread, you gain full access to a wealth of content, including detailed summaries and insights from the latest research papers across various fields. During our 7-day free trial, you can explore all features, search for topics of interest, and upload new research papers for simplification. Our subscription plans are $20 per month or $120 per year, with the flexibility to cancel anytime.",
        "Get in touch with the team anytime using this email - admin@out-read.com",
        "Outread covers a wide range of academic papers across various industries, focusing on the most influential and impactful research. Using multiple metrics such as Altmetric scores, Bibliometrics, i-10 author index scores, and H-index, we curate and present breakthrough papers to ensure you have access to the most significant and cutting-edge research available. Our goal is to filter through the noise and deliver the most relevant and high-quality papers to our audience.",
    ]

function DesktopComponent() {
    return (
        <div className="w-full h-auto p-4">
            <div className="text-2xl font-semibold text-center w-full mb-4">
                Frequently Asked Questions
            </div>
            <Accordion selectionMode="multiple">
                <AccordionItem key="1" aria-label="Accordion 1" title="What is Outread?">
                    {defaultContent[0]}
                </AccordionItem>
                <AccordionItem key="2" aria-label="Accordion 2" title="What does my subscription give me access to?">
                    {defaultContent[1]}
                </AccordionItem>
                <AccordionItem key="3" aria-label="Accordion 2" title="How to get in touch with the team?">
                    {defaultContent[2]}
                </AccordionItem>
                <AccordionItem key="4" aria-label="Accordion 3" title="What types of academic papers does Outread cover?">
                    {defaultContent[3]}
                </AccordionItem>
                <AccordionItem key="5" aria-label="Accordion 3" title="Is there a community or forum for Outread users?">
                    <div>You can join our Discord <a className="text-blue-400 underline" href="https://discord.gg/XcUXxNcA">here</a></div>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

function MobileComponent() {

    return (
        <div className="w-full h-auto  p-2 my-8 " >
            <div className="text-2xl font-semibold text-center w-full mb-4">
                Frequently Asked Questions
            </div>
            <Accordion selectionMode="multiple">
                <AccordionItem key="1" aria-label="Accordion 1" title="What is Outread?">
                    {defaultContent[0]}
                </AccordionItem>
                <AccordionItem key="2" aria-label="Accordion 2" title="What does my subscription give me access to?">
                    {defaultContent[1]}
                </AccordionItem>
                <AccordionItem key="2" aria-label="Accordion 2" title="How to get in touch with the team?">
                    {defaultContent[2]}
                </AccordionItem>
                <AccordionItem key="3" aria-label="Accordion 3" title="What types of academic papers does Outread cover?">
                    {defaultContent[3]}
                </AccordionItem>
                <AccordionItem key="3" aria-label="Accordion 3" title="Is there a community or forum for Outread users?">
                    <div>You can join our Discord <a href="https://discord.gg/XcUXxNcA">here</a></div>
                </AccordionItem>
            </Accordion>
        </div>
    );
}


export default function App() {
    const isMobile = useClientMediaQuery("(max-width: 768px)");
    return (
        <>
            {
                isMobile ?
                    <MobileComponent /> : <DesktopComponent />
            }
        </>
    );

}
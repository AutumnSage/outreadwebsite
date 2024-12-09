"use client"

import React, { useEffect, useState } from "react";
import { useClientMediaQuery } from "@/hooks/useClientMediaQuery";
import { Button } from "@nextui-org/react";
import Image from 'next/image'

const keywords = ["Agriculture", "Vet Sciences", "Data and Statistics", "Health Science", "Space", "Metaverse"];
const keywords2 = ['History', 'Economics', 'Biology', 'Computer Science', 'Language and Culture', "Mathematics"];
const keywords3 = ["Philosophy", "Green Energy", "Human Society", "Psychology", "Startups", "Creative Sciences"];


function DesktopComponent() {
    const allKeywords = [keywords, keywords2, keywords3];

    return (
        <div className="flex flex-col text-black w-full h-[300px]  justify-center items-center p-4">
            <div className=" flex justify-center items-center text-center w-full h-16 font-semibold text-4xl p-4 mb-4">What are you interested in?</div>
            <div className="overflow-x-scroll  no-scrollbar h-full w-full flex flex-col items-center">
                {allKeywords.map((keywordSet, setIndex) => (
                    <div key={setIndex} className="flex flex-row my-1">
                        {keywordSet.map((content, idx) => (
                            <KeywordButton key={idx} content={content} buttonSize="md" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}


function KeywordButton({ content, buttonSize }: { key: number, content: string, buttonSize: "lg" | "md" | "sm" | undefined }) {
    {
        return (
            <div className="w-auto mx-2 ">
                <Button startContent={<img src={`/icons/${content.toLowerCase()}.png`} alt="icon" />} className=" w-full" color="primary" size={buttonSize} variant="bordered">
                    {content}
                </Button>

            </div >
        )

    }
}


function MobileComponent() {
    const allKeywords = [keywords, keywords2, keywords3];

    return (
        <div className="flex flex-col text-black w-full h-[300px]  justify-center items-center py-4 mt-8">
            <div className=" flex justify-center items-center text-center w-full h-16 font-semibold text-4xl p-4 mb-4">What are you interested in?</div>
            <div className=" overflow-x-scroll  no-scrollbar h-full w-full flex flex-col ">
                {allKeywords.map((keywordSet, setIndex) => (
                    <div key={setIndex} className="flex flex-row my-1">
                        {keywordSet.map((content, idx) => (
                            <KeywordButton key={idx} content={content} buttonSize="md" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
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
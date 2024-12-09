"use client"

import React, { useEffect, useState } from "react";
import { useClientMediaQuery } from "@/hooks/useClientMediaQuery";
import Image from 'next/image'
import DownloadAppStoreButton from "../General/DownloadAppStoreButton";
import hero from "@/public/hero.png";
import ModalButton from "../ModalButton/modalButton";

function DesktopComponent() {
    return (
        <>
            <div className="w-full flex flex-row items-center justify-center h-[700px] text-black bg" >
                <div className="flex flex-col w-2/5 h-full ml-8 justify-center items-center">
                    <div className="flex flex-col justify-start h-full mt-8 mr-4 ">
                        <div className="text-6xl font-semibold mt-12 mr-2
                        ">
                            <div>
                                Making knowledge
                            </div>
                            <div >
                                accessible for all.
                            </div>
                        </div>
                        <div className="text-2xl my-2 ">
                            <div>
                                15-min simplified summaries
                            </div>
                            <div className="mb-2">
                                of cutting-edge research papers.
                            </div>
                        </div>
                        <ModalButton boardered={false} text="Start Reading" bgColour="#4B7E68" textColour="white" width="300px" height="50px" />
                    </div>
                </div>
                <div className="flex w-auto h-full items-start justify-start">
                    <Image className="max-h-[700px] w-auto" alt="Hero Image" src={hero}></Image>
                </div>
            </div >
        </>
    )
}


function MobileComponent() {
    const isSmall = useClientMediaQuery("(max-width: 400px)");
    const size = isSmall ? "md" : "lg";
    return (
        <div className="flex flex-col w-full h-[800px] m">
            <div className="text-center text-4xl font-semibold px-8 pt-6 pb-">
                Making knowledge accessible for all
            </div>
            <div
                className="text-center text-xl px-8 py-4">
                15-min simplified summaries of cutting-edge research papers
            </div>
            <div className=" flex items-center justify-center w-full p-2">
                <ModalButton boardered={false} text="Start Reading" bgColour="#4B7E68" textColour="white" width="300px" height="50px" />
            </div>
            <div className="w-full flex grow justify-center items-center">
                <Image className="max-h-[550px] w-auto" alt="Hero Image" src={hero}></Image>
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
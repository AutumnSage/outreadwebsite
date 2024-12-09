"use client"

import React, { use, useEffect, useState } from "react";
import DownloadAppStoreButton from "../General/DownloadAppStoreButton";
import { Image } from "@nextui-org/react";
import { useClientMediaQuery } from "@/hooks/useClientMediaQuery";
import classNames from "classnames";


function DesktopComponet() {



    return (
        <div className="flex flex-col items-center justify-center w-full h-[450px] bg-contain my-4">
            <div className="w-2/3 text-4xl text-center h-auto mb-2 font-semibold">
                Stay on the cutting-edge in 15 mins
            </div>
            <div className="flex flex-row w-full h-full items-center justify-center">
                <div className="flex flex-col h-[350px] w-full items-center justify-center">
                    <div className="flex justify-center items-center h-[200px] mx-2">
                        <Image className="h-[200px]" alt="Piggy Bank" src="/money_d.png">

                        </Image>
                    </div>
                    <div className="flex h-full w-[80%] items-center justify-center p-4">
                        <div className="text-center text-xl font-normal">
                            <span className="font-semibold">
                                Research journals are expensive,
                            </span>
                            {" "} costing upwards of $100k USD.
                        </div>
                    </div>
                </div >

                <div className="flex flex-col h-[350px] w-full items-center justify-center my-4">
                    <div className="flex justify-center items-center h-[200px] mx-2">
                        <Image className="h-[170px] mt-[30px]" alt="Idea" src="/summary_d.png">

                        </Image>
                    </div>
                    <div className="flex h-full w-[80%] items-center justify-center p-4">
                        <div className="text-center text-xl font-normal">
                            We provide {" "}
                            <span className="font-semibold">
                                short summaries
                            </span>
                            {" "} of research articles from {" "}
                            <span className="font-semibold">
                                top journals.
                            </span>
                        </div>
                    </div>
                </div >

                <div className="flex flex-col h-[350px] w-full items-center justify-center my-4">
                    <div className="flex justify-center items-center h-[200px] mx-2">
                        <Image className="h-[200px]" alt="access" src="/access_d.png">

                        </Image>
                    </div>
                    <div className="flex h-full w-[80%] items-center justify-center p-4">
                        <div className="text-center text-xl font-normal">
                            Learn {" "}
                            <span className="font-semibold">
                                new ideas
                            </span>
                            {" "} and concepts before anyone else via {""}
                            <span className="font-semibold">
                                audio or text.
                            </span>
                        </div>
                    </div>
                </div >
            </div>
        </div >
    )
}


function MobileComponent() {
    const isSmall = useClientMediaQuery('(max-width: 350px)');
    const size = isSmall ? "font-normal text-sm" : "font-normal text-md";

    return (
        <div className="flex flex-col items-center justify-center w-full h-[700px] py-4 bg-contain">
            <div className="w-2/3 text-2xl font-semibold text-center h-[100px] font-semibold">
                Stay on the cutting-edge in 15 mins
            </div>
            <div className="flex flex-row min-h-[150px] w-full items-center justify-center my-4">
                <div className="flex justify-center items-center h-full w-[40%] mx-2">
                    <Image alt="Piggy Bank" src="/money.png">

                    </Image>
                </div>
                <div className="flex h-full w-[50%] items-center justify-center p-4">
                    <div className={size}>
                        <span className="font-semibold">
                            Research journals are expensive,
                        </span>
                        {" "} costing upwards of $100k USD.
                    </div>
                </div>
            </div >

            <div className="flex flex-row min-h-[150px] w-full items-center justify-center my-4">
                <div className="flex justify-center items-center h-full w-[40%] mx-2">
                    <Image alt="Idea" src="/summary.png">

                    </Image>
                </div>
                <div className="flex h-full w-[50%] items-center justify-center p-4">
                    <div className={size}>
                        We provide {" "}
                        <span className="font-semibold">
                            short summaries
                        </span>
                        {" "} of research articles from {" "}
                        <span className="font-semibold">
                            top journals.
                        </span>
                    </div>
                </div>
            </div >

            <div className="flex flex-row min-h-[150px] w-full items-center justify-center my-4">
                <div className="flex justify-center items-center h-full w-[40%] mx-2">
                    <Image alt="access" src="/access.png">

                    </Image>
                </div>
                <div className="flex h-full w-[50%] items-center justify-center p-4">
                    <div className={size}>
                        Learn {" "}
                        <span className="font-semibold">
                            new ideas
                        </span>
                        {" "} and concepts before anyone else via {""}
                        <span className="font-semibold">
                            audio or text.
                        </span>
                    </div>
                </div>
            </div >

        </div >
    )
}

export default function App() {
    const isMobile = useClientMediaQuery('(max-width: 768px)');


    return (
        <>
            {isMobile ? <MobileComponent /> : <DesktopComponet />}
        </>
    )
}

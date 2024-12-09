"use client"

import React, { useEffect, useState } from "react";
import { useClientMediaQuery } from "@/hooks/useClientMediaQuery";
import { Image } from "@nextui-org/react";
import DownloadAppStoreButton from "../General/DownloadAppStoreButton";
import { Button } from "@nextui-org/react";

function DesktopComponent() {
    return (
        <div className="w-full h-[370px] my-[15px] flex  items-center justify-center">
            <div className="h-full w-1/2 flex flex-col text-4xl items-end">
                <div className="mb-2 ">
                    Download the
                    <div className="font-semibold">mobile app </div>
                    now
                </div>
                <Image src="/arrow.png" alt="arrow" />
            </div>
            <div className="flex w-1/2 h-full justify-start ml-12 items-center">
                <Image src="/qr_code.png" alt="qrcode" className="max-h-[320px] h-[80%]"></Image>
            </div>
        </div>
    )
}


function KeywordButton({ key, content }: { key: number, content: string }) {
    {
        return (
            <div className="w-auto mx-2 ">
                <Button color="primary" size="lg" variant="bordered">
                    {content}
                </Button>
            </div>
        )
    }
}


function MobileComponent() {
    return (
        <div className="flex size-full items-center justify-center mb-2">
            <Image src="/qr_code.png">

            </Image>
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
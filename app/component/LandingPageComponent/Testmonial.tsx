"use client"

import React, { useEffect, useState } from "react";
import { useClientMediaQuery } from "@/hooks/useClientMediaQuery";
import { Image } from "@nextui-org/react";
import DownloadAppStoreButton from "../General/DownloadAppStoreButton";
import { Button } from "@nextui-org/react";



const DisplayIcons = () => {
    return (
        <div className="flex flex-row items-center justify-center w-full h-[150px]">
            <Image src="/google.png" alt="ibm" className="h-14 mx-3"></Image>
            <Image src="/aws.png" alt="amazon" className="h-14 mx-3"></Image>
            <Image src="/techstars.png" alt="apple" className="h-14 mx-3"></Image>
            <Image src="/zoho.png" alt="google" className="h-14 mx-3"></Image>
            <Image src="/linkedin.png" alt="linkedin" className="h-14 mx-3"></Image>
            <Image src="/microsoft.png" alt="microsoft" className="h-14 mx-3"></Image>
            <Image src="/dell.png" alt="ibm" className="h-14 mx-3"></Image>
            <Image src="/fortescue.webp" alt="fortune" className="h-14 mx-3"></Image>
        </div>
    )
}

export default function Testmonial() {
    const isMobile = useClientMediaQuery("(max-width: 768x)");
    return (
        <>
            <div className="bg-[#111E2B] h-[250px] rounded-[38px] w-[90%] flex flex-col items-center justify-evenly">
                <div className="text-white text-4xl font-semibold"> Trusted by Professionals at </div>
                <DisplayIcons></DisplayIcons>
            </div>
        </>
    );

}
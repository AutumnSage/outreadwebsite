"use client"

import React from "react";
import { useClientMediaQuery } from "@/hooks/useClientMediaQuery";
import { Divider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import DownloadFromAppStoreBlack from "../General/DownloadAppStoreButton";

function DesktopComponent() {
    return (
        <div className="w-full text-[#132435] h-[300px] flex flex-col items-center justify-center">
            <DownloadFromAppStoreBlack width="280px" height="80px" />
            <div className="mt-9 mb-9 flex flex-row items-center justify-center w-full h-auto text-sm font-medium gap-3">
                <a href="/contact-us">Contact Us</a>
                <a href="/newsletter">Newletter</a>
                <a href="/privacy">Privacy Policy</a>
                <a href="/tos">Terms of Service</a>
            </div>
            <div className="flex flex-row  mb-2">
                <div className=" mx-2">
                    <a href="https://www.instagram.com/outread.official/">
                        <FontAwesomeIcon icon={faInstagram} size="lg"></FontAwesomeIcon>
                    </a>
                </div>
                <div >
                    <a href="https://www.linkedin.com/company/outread/">
                        <FontAwesomeIcon icon={faLinkedin} size="lg"></FontAwesomeIcon>
                    </a>
                </div>
            </div>
            <p className="font-medium">©Outread 2024</p>
        </div>
    )
}



function MobileComponent() {
    return (
        <div className="w-full h-72  p-4 bg-black text-gray-200 z-20">
            <DownloadFromAppStoreBlack width="150px" height="50px" />
            <Divider className="my-4 bg-gray-200" />
            <div className=" flex flex-col text-sm font-medium">
                <a href="/contact-us">Contact Us</a>
                <a href="/newsletter">Newletter</a>
                <a href="/privacy">Privacy Policy</a>
                <a href="/tos">Terms of Service</a>
            </div>
            <Divider className="my-4 bg-gray-200" />
            <div className="flex flex-row">
                <div className="mx-2" >
                    <a href="https://www.instagram.com/outread.official/">
                        <FontAwesomeIcon icon={faInstagram} size="lg"></FontAwesomeIcon>
                    </a>
                </div>
                <div >
                    <a href="https://www.linkedin.com/company/outread/">
                        <FontAwesomeIcon icon={faLinkedin} size="lg"></FontAwesomeIcon>
                    </a>
                </div>
            </div>
            <div>
                ©Outread 2024
            </div>
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
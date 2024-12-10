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
        <div className="w-full text-[#132435] py-14 flex flex-col items-center justify-center bg-white">
            <DownloadFromAppStoreBlack width="280px" height="80px" />
            <div className="mt-9 mb-9 flex flex-row items-center justify-center w-full h-auto text-medium font-medium gap-3">
                <a href="/contact-us">Contact Us</a>
                <a href="/newsletter">Newletter</a>
                <a href="/privacy">Privacy Policy</a>
                <a href="/tos">Terms of Service</a>
            </div>
            <div className="flex flex-row  mt-4 mb-2">
                <div className=" mx-2">
                    <a href="https://www.instagram.com/outread.official/">
                        <FontAwesomeIcon icon={faInstagram} size="2x"></FontAwesomeIcon>
                    </a>
                </div>
                <div >
                    <a href="https://www.linkedin.com/company/outread/">
                        <FontAwesomeIcon icon={faLinkedin} size="2x"></FontAwesomeIcon>
                    </a>
                </div>
            </div>
            <p className="font-medium text-medium">©Outread 2024</p>
        </div>
    )
}



function MobileComponent() {
    return (
        <div className="w-full   p-4 py-12 bg-white text-black z-20 flex flex-col justify-center items-center">
            <DownloadFromAppStoreBlack width="150px" height="50px" />
            <Divider className="my-4 bg-gray-200 mt-9" />
            <div className=" flex gap-4 text-sm font-medium flex-wrap justify-center items-center">
                <a href="/contact-us">Contact Us</a>
                <a href="/newsletter">Newletter</a>
                <a href="/privacy">Privacy Policy</a>
                <a href="/tos">Terms of Service</a>
            </div>
            <Divider className="my-4 bg-gray-200  mb-9"  />
            <div className="flex flex-row mt-4 mb-4">
                <div className="mx-2" >
                    <a href="https://www.instagram.com/outread.official/">
                        <FontAwesomeIcon icon={faInstagram} size="2x"></FontAwesomeIcon>
                    </a>
                </div>
                <div >
                    <a href="https://www.linkedin.com/company/outread/">
                        <FontAwesomeIcon icon={faLinkedin} size="2x"></FontAwesomeIcon>
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
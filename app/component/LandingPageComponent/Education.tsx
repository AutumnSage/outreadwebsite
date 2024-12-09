"use client"

import { Image } from "@nextui-org/react";
import ModalButton from "../ModalButton/modalButton";
import { useClientMediaQuery } from "@/hooks/useClientMediaQuery";
export default function Education() {
    const isMobile = useClientMediaQuery("(max-width: 768px)");

    if (isMobile) {
        return (
            <div className="flex flex-col w-full items-center justify-start">
                <div className="flex flex-col items-center justify-center text-4xl my-8 font-semibold">See How It works
                    <video autoPlay loop muted className="w-[80%] my-4 rounded-[13px]">
                        <source src="/Product Hunt video.mp4" type="video/mp4" />
                    </video>
                    <ModalButton boardered={false} text="Start Reading" bgColour="#4B7E68" textColour="white" width="300px" height="50px" />
                </div>
                <div className="w-full flex flex-col items-center justify-center my-8">
                    <div className="flex justify-center w-full text-4xl my-8 text-center font-semibold">Explore research like never before</div>
                    <div className="flex flex-col items-center justify-center my-8">
                        <div className={`"w-full flex items-center justify-center flex-col text-lg`}>
                            <div className=" flex flex-col items-center justify-center mb-6 ">
                                <Image src="/EP1 1.png" alt="EPub" className="w-[750px]"></Image>
                            </div>
                            <div className="w-full text-center items-center justify-center">
                                Read <span className="font-bold"> 15-miunte</span> summaries of <span className="font-bold"> cutting-edge research</span> papers.
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center my-8">
                        <div className={`"w-full flex items-center justify-center flex-col text-lg }`}>
                            <div className="flex flex-col items-center justify-center mb-6 ">
                                <Image src="/EP2 1.png" alt="EPub"></Image>
                            </div>
                            <div className="w-full text-center items-center justify-center">
                                Browse through different <span className="font-bold"> categories</span> and get personalized <span className="font-bold"> recommendations.</span>
                            </div>


                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center my-8">
                        <div className={"w-full flex items-center justify-center flex-col text-lg "}>
                            <div className="flex flex-col items-center justify-center mb-6 ">
                                <Image src="/EP3 1.png" alt="EPub"></Image>
                            </div>
                            <div className="w-full text-center items-center justify-center">
                                Toggle between <span className="font-bold"> simple</span> and <span className="font-bold"> technical</span>  summaries to customize your reading experience.
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center my-8">
                        <div className=" w-full flex items-center justify-center flex-col text-lg">
                            <div className=" flex flex-col items-center justify-center mb-6 ">
                                <Image src="/EP4 1.png" alt="EPub"></Image>
                            </div>
                            <div className="w-full text-center items-center justify-center">
                                Access insights quickly
                                with <span className="font-bold"> vertical swipe cards</span> of <span className="font-bold">  bite-sized</span> knowledge.
                            </div>

                        </div>
                    </div>

                    <ModalButton boardered={false} text="Start Reading" bgColour="#F26546" textColour="white" width="300px" height="50px" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full items-center justify-start">
            <div className="flex flex-col items-center justify-center text-4xl my-8 font-semibold">See How It works
                <video autoPlay loop muted className="w-[80%] my-4 rounded-[13px]">
                    <source src="/Product Hunt video.mp4" type="video/mp4" />
                </video>
                <ModalButton boardered={false} text="Start Reading" bgColour="#4B7E68" textColour="white" width="320px" height="60px" />
            </div>
            <div className="w-full flex flex-col items-center justify-center my-8">
                <div className="flex justify-center w-full text-4xl my-8 font-semibold">Explore research like never before</div>
                <div className="flex flex-col items-center justify-center my-8">
                    <div className={`"w-full flex items-center justify-evenly  ${isMobile ? "flex-col text-lg" : "flex-row text-3xl"}`}>
                        <div className=" flex flex-col items-center justify-center">
                            <Image src="/EP1 1.png" alt="EPub" className="w-[750px]"></Image>
                        </div>
                        <div className="w-[30%] items-center justify-center">
                            Read <span className="font-bold"> 15-miunte</span> summaries of <span className="font-bold"> cutting-edge research</span> <br /> papers.
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center my-8">
                    <div className={`"w-full flex items-center justify-evenly  ${isMobile ? "flex-col text-lg" : "flex-row text-2xl"}`}>
                        <div className="w-[30%] items-center justify-center">
                            Browse through different <br /> <span className="font-bold"> categories</span> and get personalized <span className="font-bold"> recommendations.</span> <br />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <Image src="/EP2 1.png" alt="EPub" className="w-[750px]"></Image>
                        </div>

                    </div>
                </div>
                <div className="flex flex-col items-center justify-center my-8">
                    <div className={`"w-full flex items-center justify-evenly  ${isMobile ? "flex-col text-lg" : "flex-row text-2xl"}`}>
                        <div className="flex flex-col items-center justify-center">
                            <Image src="/EP3 1.png" alt="EPub" className="w-[750px]"></Image>
                        </div>
                        <div className="w-[30%] items-center justify-center">
                            Toggle between <span className="font-bold"> simple</span> and <span className="font-bold"> technical</span>  summaries to<br />  customize your reading experience.
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center my-8">
                    <div className="w-full flex flex-row items-center justify-evenly text-2xl">
                        <div className="w-[30%] items-center justify-center">
                            Access insights quickly
                            with <span className="font-bold"> vertical swipe cards</span> <br /> of <span className="font-bold">  bite-sized</span> knowledge.
                        </div>
                        <div className=" flex flex-col items-center justify-center">
                            <Image src="/EP4 1.png" alt="EPub" className="w-[750px]"></Image>
                        </div>
                    </div>
                </div>

                <ModalButton boardered={false} text="Start Reading" bgColour="#F26546" textColour="white" width="300px" height="50px" />
            </div>
        </div>
    )
}

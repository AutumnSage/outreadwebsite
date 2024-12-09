"use client"

import React, { useEffect, useState } from "react";
import { useClientMediaQuery } from "@/hooks/useClientMediaQuery";


const carousellContent = [{
    id: 1,
    content: "Discover the powers of Qubits and Quantum Gates",
},
{
    id: 2,
    content: "Understand the importance of founders in Startups",
},
{
    id: 3,
    content: "How computing power is being used to revolutionise Ecology",
},

{
    id: 4,
    content: "How computing power is being used to revolutionise Ecology",
},
{
    id: 5,
    content: "Exploring the possibilities in the world of Generative Chemestry",
},
{
    id: 6,
    content: "Exploring the possibilities in the world of Generative Chemestry",
},
{
    id: 7,
    content: "Exploring the possibilities in the world of Generative Chemestry",
},
{
    id: 8,
    content: "Exploring the possibilities in the world of Generative Chemestry",
},
{
    id: 9,
    content: "Exploring the possibilities in the world of Generative Chemestry",
},
{
    id: 10,
    content: "Exploring the possibilities in the world of Generative Chemestry",
},
]

function CarousellItem({ id }: { id: number }) {

    const isMobile = useClientMediaQuery("(max-width: 768px)");

    return (
        <div className=" mx-2 w-full h-full">
            {isMobile ?
                <div className='h-full w-[180px]'>
                    <img className="object-cover rounded-xl" src={`/articles/${id}.png`} alt="picture_summary">
                    </img>
                </div> :
                <div className='w-[260px] '>
                    <img className="object-cover rounded-xl" src={`/articles/${id}.png`} alt="picture_summary">
                    </img>
                </div>}

        </div>
    )

}


function DesktopComponenet() {
    return (
        <div className="w-full h-[520px] flex items-center justify-center mb-4">
            <div className="flex flex-col  text-white w-[90%] h-[520px] bg-[#27394F] *:bg-cover justify-center items-center rounded-lg">
                <div className=" flex justify-center items-center text-center w-2/3 h-16 font-semibold text-4xl p-4">Discover Research Summaries</div>
                <div className="no-scrollbar overflow-x-scroll flex flex-coll h-auto w-full">
                    <div className="p-4 h-full flex justify-start items-center">
                        {carousellContent.map((content, index) => (
                            <CarousellItem key={index} {...content} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function MobileComponent() {

    return <div className="flex flex-col text-white w-full h-[400px] bg-[#27394F]  rounded-[32px] bg-cover justify-center items-center">
        <div className=" flex justify-center items-center text-center w-full h-16 font-semibold text-2xl p-4 ">Discover Research Summaries</div>
        <div className="no-scrollbar overflow-x-scroll flex flex-coll h-2/3 w-full mt-2">
            <div className="p-4 h-full flex justify-start items-center">
                {carousellContent.map((content, index) => (
                    <CarousellItem key={index} {...content} />
                ))}
            </div>
        </div>
    </div>

}

export default function App() {
    const isMobile = useClientMediaQuery("(max-width: 768px)");
    return (
        <>
            {isMobile ? <MobileComponent /> : <DesktopComponenet />}
        </>
    )

}
"use client"

import React, { useState, useRef, useCallback, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { useClientMediaQuery } from "@/hooks/useClientMediaQuery";
import { Textarea, Card, CardBody, CardHeader, Button, Progress, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Divider, Skeleton } from "@nextui-org/react";
import { SearchIcon } from "@nextui-org/shared-icons";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useUserStore, getUserCredit, isAuthenticated, getUserId, getUserIsLoading, updateZustand } from '@/lib/zustand/zustand';
import { get } from "http";
import DataLoadingSkeleton from "../component/History/DataLoadingSkeleton";


interface Insight {
    type: "outread" | "semantic_scholar";
    paper_id: string;
    insight: string;
    keyword: string;
    insight_explanation: string;
    doi: string;
    title?: string;
    authors?: string[];
    year?: number;
    citationCount?: number;
    url?: string;
}

interface RelevantPaper {
    title: string;
    author: string;
    slug?: string;
    doi: string;
    relevance_score: number;
    altMetricScore: number;
    one_card_summary: {
        content: string;
        heading: string;
    };
    type: "outread" | "semantic_scholar";
    abstract?: string;
    citationCount?: number;
}

interface ArticleData {
    summary: {
        insight: Insight[];
        summarised_response: string;
    };
    relevant_papers: RelevantPaper[];
}

interface PreviousQuestion {
    id: string;
    query: string;
    complexity: string;
    createdAt: string;
    response: ArticleData;
}

interface TrendAnalysisResponse {
    id: string;
    query: string;
    complexity: string;
    createdAt: string;
}


function HistoryList({className , isMobile , questionList , isLoading} : {isMobile: boolean, className: string , questionList : {title : string , questions : string[]}[] , isLoading : boolean}) {
    const router = useRouter();
    
    const handleClick = (e : React.MouseEvent<HTMLButtonElement , MouseEvent>, searchParam : string) => {
        console.log(e);
        console.log(searchParam);
        
        e.preventDefault()
        router.push(`/discover?search=${searchParam}`)
      }


    return (
        <div className={`${className} flex flex-col items-center py-2 bg-[#F4F7FB]`}>
        <div className="flex flex-col gap-5 w-full justify-center  text-center">
                {
                    (questionList.length > 0 && !isLoading) && (
                        <>
                            {
                                questionList.map((questionBlock, index) => (
                                    <>
                                        <div className="mt-[60px] mb-[60px]">
                                            <p className="font-medium text-2xl text-left text-[#686868] mb-10 ">{questionBlock.title}</p>
                                            <div className="flex flex-col gap-4">
                                                { questionBlock.questions.map((question, index) => (
                                                <div key={index} className="flex justify-between w-full bg-white items-center drop-shadow-lg rounded-xl  mb-4  py-2 px-4 cursor-default">
                                                    <p className="text-[#132435] text-lg font-normal text-left">{question}</p>
                                                    <Button
                                                onClick={(e) => handleClick(e , question)}
                                                disabled={isLoading}
                                                className="w-fit bg-white text-[#D9D9D9] hover:bg-[#D9D9D9] hover:text-white  min-w-fit px-[10px] py-[25px] rounded-full transition-all"
                                            >
                                                <svg className="text-2xl text-default-400 pointer-events-none flex-shrink-0 " xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"/></svg>
                                            </Button>
                                                </div>
                                                ))}
                                            </div>
                                        </div>
                                        {
                                            index !== (questionList.length - 1) && (
                                                <Divider className="bg-[#D9D9D9] h-[1.7px]" />
                                            )
                                        }
                                    </>
                                ))
                            }
                        </>
                    )
                }
            </div>
        </div>
    )
} 

function LoadingAnimation() {
    const messages = [
        "Feach Data",
        "Searching internal and external resources",
        "Linking Resources",
        "Checking Relevance",
        "Validating Results",
        "Listing History"
    ];
    const [currentMessage, setCurrentMessage] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrentMessage((prev) => (prev + 1) % messages.length);
        }, 5000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);


    return (
        <div  className={`xl:w-10/12 w-full lg:max-w-4xl`}>
            <p className="text-center text-xl font-medium text-[black]">{messages[currentMessage]}...</p> 
            <DataLoadingSkeleton />
        </div>
    );
}

function HistoryPage() {
    const isMobile = useClientMediaQuery("(max-width: 768px)");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const content = (
        <>
            <div className="flex flex-col items-center justify-start w-full h-full bg-[#F4F7FB] ">
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <HistoryList 
                className={`xl:w-10/12 w-full lg:max-w-4xl  ${isMobile ? 'w-full' : 'w-1/2'}   mb-${isMobile ? '4' : '8'} `}
                isLoading={isLoading}
                isMobile={isMobile!}
                questionList={[{
                        title : 'Today',
                        questions : [
                            "Is personalised pricing good for us?",
                            "This is a Question I asked today?",
                            "What are the consequences of having more than 8 coffees a day?.0",
                        ]
                    },
                    {
                        title : 'Last 7 Days',
                        questions : [
                            "Is personalised pricing good for us?",
                            "This is a Question I asked today?",
                            "What are the consequences of having more than 8 coffees a day?",
                        ]
                    }
                  ]}
                />
                {isLoading && <LoadingAnimation />}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <ModalContent className="text-black">
                        <ModalHeader className="flex flex-col gap-1">Credit Limit Reached</ModalHeader>
                        <ModalBody>
                            <p>You have reached your credit limit. Please wait until tomorrow for your quota to reset.</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={() => setIsModalOpen(false)}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </>
    );

    return (
        <div className="flex w-full min-h-screen bg-[#F5F5F5]">
            {/* {!isMobile && <Sidebar questions={previousQuestions} onQuestionClick={handleQuestionClick} />} */}
            <div className={`bg-[#F4F7FB] flex-1 flex flex-col items-center justify-start p-${isMobile ? '4' : '8'}`}>
                {content}
            </div>
        </div>
    );
}

export default HistoryPage;

"use client"

import React, { useState, useRef, useCallback, useEffect, ChangeEvent } from "react";
import { useClientMediaQuery } from "@/hooks/useClientMediaQuery";
import { Textarea, Card, CardBody, CardHeader, Button, Progress, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { SearchIcon } from "@nextui-org/shared-icons";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useUserStore, getUserCredit, isAuthenticated, getUserId, getUserIsLoading, updateZustand } from '@/lib/zustand/zustand';
import { get } from "http";


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

function sanitizeInput(input: string): string {
    return input.replace(/[^a-zA-Z -123457890]/g, '').slice(0, 150);
}

function SearchArea({ className, onSubmit, isLoading, isMobile }: { isMobile: boolean, className: string; onSubmit: (query: string, complexity: string) => void; isLoading: boolean }) {
    const [value, setValue] = useState("");
    const [complexity, setComplexity] = useState("informative");

    const handleChange = (newValue: string) => {
        setValue(sanitizeInput(newValue));
    };

    const handleSubmit = () => {
        onSubmit(value, complexity);
    };

    return (
        <div className={`${className} flex flex-col items-center p-2 bg-[#F4F7FB]`}>
            <div className="flex flex-col gap-5 w-full justify-center  text-center">
                <div className="mt-24">
                    <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'}  text-black font-medium  mb-2`}>Discover Articles</h1>
                    <p className="font-medium text-[24px] text-center text-[#686868]	" >Ask any question </p>
                </div>
                <div className="bg-white w-full flex flex-col items-center drop-shadow-lg rounded-xl  mb-4  py-5 px-4 cursor-default">
                    <div className="flex flex-col w-full">
                    <Textarea
                        className="bg-white articles-search rounded-md "
                        placeholder="Ask a question..."
                        onKeyDown={(e : KeyboardEvent) => {
                            if (e.key === "Enter") {
                                handleSubmit();
                            }
                        }}
                        value={value}
                        onValueChange={handleChange}
                        maxLength={250}
                     />
                     <div className="flex justify-between items-center">
                        <div className="w-1/3">
                            <Select
                            labelPlacement={"inside"}
                            label="Complexity"
                            selectedKeys={[complexity]}
                            classNames={{ mainWrapper: "rounded", base: "bg-white", trigger: "bg-white" }}
                            onChange={(e : ChangeEvent<HTMLSelectElement>) => setComplexity(e.target.value)}
                        >
                            <SelectItem className="text-black w-full" key="simple" value="simple">Simple</SelectItem>
                            <SelectItem className="text-black w-full" key="informative" value="informative">Informative</SelectItem>
                        </Select>
                        </div>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-1/3 bg-[#88d84d] text-white "
                        >
                            {isLoading ? 
                            "Processing..." : 
                                <SearchIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                            }
                        </Button>
                     </div>
                     </div>
                    {/* <Textarea
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit();
                            }
                        }}
                        value={value}
                        className="bg-white"
                        onValueChange={handleChange}
                        placeholder="Ask A Question"
                        classNames={{ innerWrapper: 'bg-whitSearche hover:bg-white', base: 'bg-white hover:bg-white ', inputWrapper: 'shadow-none bg-white data-[hover=true]:bg-white group-data-[focus=true]:bg-white ', }}
                        maxLength={250}
                        endContent={
                            <SearchIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                    /> */}
                </div>
            </div>
            <div className="w-full mb-4 bg-white">
                {/* <Select
                    label="Complexity"
                    placeholder="Select complexity"
                    selectedKeys={[complexity]}
                    classNames={{ mainWrapper: "rounded", base: "bg-[#F4F7FB]", trigger: "bg-white" }}
                    onChange={(e) => setComplexity(e.target.value)}
                >
                    <SelectItem className="text-black w-full" key="simple" value="simple">Simple</SelectItem>
                    <SelectItem className="text-black w-full" key="informative" value="informative">Informative</SelectItem>
                </Select> */}
            </div>
            <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-1/3 bg-[#88d84d] text-white "
            >
                {isLoading ? "Processing..." : "Submit"}
            </Button>
        </div >
    );
}

function ReferencedText({ text, onReferenceClick }: { text: string, onReferenceClick: (index: number) => void }) {
    const parts = text.split(/(<reference>\d+<\/reference>)/);
    return (
        <p >
            {parts.map((part, i) => {
                const match = part.match(/<reference>(\d+)<\/reference>/);
                if (match) {
                    const indexes = match[1].split(',').map(index => parseInt(index));
                    return (
                        <sup key={i} className="text-blue-500 cursor-pointer" onClick={() => onReferenceClick(indexes[0])}>
                            [{match[1]}]
                        </sup>
                    );
                }
                return part;
            })}
        </p>
    );
}

function InsightCard({ isMobile, insight, relevantPaper, isSelected }: { isMobile: boolean, insight: Insight, relevantPaper: RelevantPaper, isSelected: boolean }) {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        if (relevantPaper.type === "semantic_scholar") {
            window.open(`https://doi.org/${insight.doi}`, '_blank');
        } else {
            setExpanded(!expanded);
        }
    };
    console.log("Rendering Insight card")
    console.log({insight})
    console.log({relevantPaper})
    
    return (
        <Card className={` px-3 py-4 mb-4 ${isSelected ? 'bg-gray-300' : ''}`}>
            <CardHeader className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{insight.insight}</h3>
            </CardHeader>
            <CardBody>
                <p>{insight.insight_explanation}</p>
                <div className="mt-4">
                    {/* <p className="text-gray-400 font-semibold">Author: {insight.author}</p> */}
                    {/* {relevantPaper.type === "semantic_scholar" ? ( */}
                    <p className="text-gray-400 font-semibold">Citation Count: {insight.citationCount}</p>
                    {/* ) : */}
                        {/* <p className="text-gray-400 font-semibold">Altmetric Score: {relevantPaper.altMetricScore}</p> */}
                    {/* } */}
                    <p className="text-gray-400 font-semibold">DOI: {insight.doi}</p>
                </div>
                <div className={`flex items-center w-full h-full ${isMobile ? "flex-col" : ""}`}>
                    <div className="mt-4 w-full">
                        <p className="text-gray-400 font-semibold">Relevance Score:</p>
                        <Progress
                            value={relevantPaper.relevance_score * 100}
                            className="max-w-md"
                            color="success"
                            showValueLabel={true}
                            label={`${(relevantPaper.relevance_score * 100).toFixed(0)}%`}
                        />
                    </div>
                    <Button className="bg-[#88d84d] text-white mt-4 min-w-36" onClick={handleExpandClick}>
                        {relevantPaper.type === "semantic_scholar" ? "View Paper" : (expanded ? "Collapse" : "Expand")}
                    </Button>
                </div>
                {expanded && relevantPaper.type === "outread" && (
                    <div className="mt-4">
                        <h4 className="font-bold text-xl">{relevantPaper.title}</h4>
                        <h5 className="font-semibold mt-2 text-lg">{relevantPaper.one_card_summary.heading}</h5>
                        {relevantPaper.one_card_summary.content.split('\n').map((line, index) => (
                            <div key={index}>{line}</div>
                        ))}

                        <div className={`${isMobile ? "flex flex-col" : "flex"} items-center`}>
                            <Link href={`/article/${relevantPaper.slug}`} passHref>
                                <Button className="mt-4 bg-[#88d84d] text-white">Read Full Summary</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}

function DiscoverContent({ isMobile, articleData }: { isMobile: boolean, articleData: ArticleData | null }) {
    const [selectedInsightIndex, setSelectedInsightIndex] = useState<number | null>(null);
    const insightRefs = useRef<(HTMLDivElement | null)[]>([]);

    const scrollToInsight = useCallback((index: number) => {
        setSelectedInsightIndex(index);
        if (insightRefs.current[index]) {
            const elementToScroll = insightRefs.current[index];
            elementToScroll?.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    if (!articleData) {
        return null;
    }

    return (
        <div className="w-full max-w-4xl mx-auto text-black">
            <div className="bg-white text-black px-6 py-4 rounded-md ">
                <h2 className="text-2xl font-semibold mb-4 ">Summary</h2>
                <ReferencedText
                    text={articleData.summary.summarised_response}
                    onReferenceClick={scrollToInsight}
                />
            </div>
            <h2 className="text-2xl font-semibold1 my-4">Insights</h2>
            {articleData.summary.insight.map((insight, index) => (
                <div key={index} ref={(el) => {
                    if (el) insightRefs.current[index] = el;
                }}>
                    <InsightCard
                        isMobile={isMobile}
                        insight={insight}
                        relevantPaper={articleData.relevant_papers[index]}
                        isSelected={index === selectedInsightIndex}
                    />
                </div>
            ))}
        </div>
    );
}

function LoadingAnimation() {
    const messages = [
        "Processing Query",
        "Searching internal and external resources",
        "Formulating insight",
        "Linking Resources",
        "Checking Relevance",
        "Validating Results",
        "Generating summary and response"
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
        <div className="text-center text-2xl font-semibold text-[black]">
            <div role="status" className="flex flex-col justify-center items-center mb-2">
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
            </div>
            {messages[currentMessage]}...
        </div>
    );
}
// function Sidebar({ questions, onQuestionClick }: { questions: PreviousQuestion[], onQuestionClick: (question: PreviousQuestion) => void }) {
//     return (
//         <div className="w-64 bg-gray-300 rounded-md h-full overflow-y-auto p-4 border-r border-gray-200 text-black ">
//             <h2 className="text-xl font-semibold mb-4">Previous Questions</h2>
//             {questions.map((question) => (
//                 <div
//                     key={question.id}
//                     className="cursor-pointer hover:bg-gray-100 p-2 rounded mb-2"
//                     onClick={() => onQuestionClick(question)}
//                 >
//                     <p className="text-sm font-medium">{question.query}</p>
//                     <p className="text-xs text-gray-500">{new Date(question.createdAt).toLocaleString()}</p>
//                 </div>
//             ))}
//         </div>
//     );
// }

function DiscoverPage() {
    const router = useRouter();
    const isMobile = useClientMediaQuery("(max-width: 768px)");
    const [articleData, setArticleData] = useState<ArticleData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previousQuestions, setPreviousQuestions] = useState<PreviousQuestion[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchPreviousQuestions();
    }, []);

    const fetchPreviousQuestions = async () => {
        try {
            setTimeout(async () => {
                console.log("Fetching Previous Questions")
                const response = await fetch('/api/getPreviousQuestions?id=' + getUserId());
                if (!response.ok) {
                    throw new Error('Failed to fetch previous questions');
                }
                const data = await response.json();
                console.log({ previousQuestions: data })
                setPreviousQuestions(data);
            }, 2000)
        } catch (error) {
            console.error('Error fetching previous questions:', error);
        }
    };

    const fetchData = async (query: string, complexity: string) => {

        const userCredit = getUserCredit();
        // if (userCredit === 0) {
        //     setIsModalOpen(true);
        //     return;
        // }

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/trendAnalysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, complexity }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            
            console.log(data)

            const articleData = data.result;
            const sortedArticleData = articleData.relevant_papers.sort((a: RelevantPaper, b: RelevantPaper) => {
                if (a.type === "outread" && b.type === "semantic_scholar") return -1;
                if (a.type === "semantic_scholar" && b.type === "outread") return 1;
                return b.relevance_score - a.relevance_score;
            });
            data.result.relevant_papers = sortedArticleData;
            console.log("This is printing out the ufkcing")
            console.log({data})
            // data.result.relevant_papers = data.result

            await updateZustand()

            setArticleData(data.result);
            fetchPreviousQuestions(); // Refresh the list of previous questions
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load article data. Please try again later.' + error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuestionClick = (question: PreviousQuestion) => {
        setArticleData(question.response)
    };

    console.log(getUserIsLoading(), isAuthenticated())

    // if (getUserIsLoading()) {
    //     return <div role="status" className="flex flex-col justify-center items-center mb-2 w-full h-[400px] bg-white text-2xl">
    //         <div className="text-2xl font-semibold text-black ">If this has been loading for more than 3 seconds please refresh the page.</div>
    //         <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    //             <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
    //             <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
    //         </svg>
    //     </div>
    // }

    // if (!isAuthenticated() && !getUserIsLoading()) {

    //     return (
    //         <div className="flex flex-col items-center justify-center h-screen bg-[#F5F5F5] text-black">
    //             <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
    //             <p className="text-lg mb-4">You need to be logged in to access this feature.</p>
    //             <Button onClick={() => router.push('/signin')} className="bg-[#88d84d] text-white">
    //                 Sign In
    //             </Button>
    //         </div>
    //     );
    // }

    const content = (
        <>
            <div className="flex flex-col items-center justify-start w-full h-full bg-[#F4F7FB] ">
                {/* <div className="w-full flex flex-col items-end justify-end text-xl bg-[#f5f5f5] text-black">
                    Credit : {getUserCredit()}
                </div> */}
                <SearchArea
                    className={`${isMobile ? 'w-full' : 'w-1/2'}   mb-${isMobile ? '4' : '8'} `}
                    onSubmit={fetchData}
                    isLoading={isLoading}
                    isMobile={isMobile!}
                />

                {error && <div className="text-red-500 mb-4">{error}</div>}
                {isLoading && <LoadingAnimation />}
                {!isLoading && <DiscoverContent isMobile={isMobile!} articleData={articleData} />}
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

export default DiscoverPage;

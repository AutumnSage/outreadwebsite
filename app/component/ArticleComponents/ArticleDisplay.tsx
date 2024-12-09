'use client'

import React, { useState } from 'react'
import { Image } from '@nextui-org/react'
import SummaryToggle from './SummaryToggle'
// import SummaryCards from './SummaryCards'
import { Button } from '@nextui-org/react'
import { Divider } from "@nextui-org/divider";
import { useClientMediaQuery } from '@/hooks/useClientMediaQuery'
interface Article {
    id: string
    slug: string
    title: string
    subtitle: string
    coverImage: string
    originalPaperTitle: string
    authorName: string
    audioId?: string | null
    doi: string
    altMetricScore: number
    simpleSummary: [{
        heading: string,
        content: string,
    }]
    defaultSummary: [{
        heading: string,
        content: string,
    }]
    estimatedReadingTime: number
    categories: { name: string }[]
}

export default function ArticleDisplay({ article }: { article: Article }) {
    const [summaryType, setSummaryType] = useState<'simple' | 'default'>('default')
    const [preview, setPreview] = useState<Boolean>(true)
    const isMobile = useClientMediaQuery("(max-width: 768px)");

    return (
        <div className="max-w-full w-full  mx-auto px-4 py-8 flex flex-col justify-center items-center bg-[#27394F] ">
            {preview ? (
                <>
                    <div className={`flex  w-full  items-start justify-center`}>
                        <div className={`flex  flex-col ml-8 min-h-[800px] justify-start`}>
                            <div className='flexmflex-col  max-w-[700px] mb-2'>
                                <h1 className="text-3xl font-semibold mb-2">{article.title}</h1>
                                <h2 className="text-lg font-thin  mb-2">{article.subtitle}</h2>
                                <Divider className='bg-gray-400'></Divider>
                                <div className='flex justify-between'>
                                    <p>Reading Time : {article.estimatedReadingTime} minutes</p>
                                    <p>Author: {article.authorName}</p>
                                </div>
                                <Divider className='bg-gray-400'></Divider>
                            </div>
                            <div>
                                {
                                    article.categories.map((category) => (
                                        <div key={category.name} className="flex items-center">
                                            <Button
                                                className=" bg-blue-950 text-white mr-2 " >
                                                {category.name}
                                            </Button>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className='w-[700px] mt-2 flex justify-center flex-col'>
                                {article.simpleSummary[0].content.split('\n').map((line, index) => (
                                    <div key={index}>{line}</div>
                                ))}
                            </div>
                        </div>
                        <div className='w-1/3 flex justify-start flex-col items-center'>
                            <Image
                                src={article.coverImage}
                                alt={article.title}
                                width={"300px"}
                                className='mb-4'
                            />
                            <Button className='w-[300px] h-[50px] rounded-none bg-[#4B7E68] text-white' onClick={() => { setPreview(false) }}> Read Now</Button>
                        </div>

                    </div>

                    {/* {isAdminUser &&
                        <div className='w-full flex justify-center'>
                            <Button className='w-[200px] h-[70px]' onClick={() => { regenerateArticle(article.id) }}> Regenerate Article</Button>
                        </div>
                    } */}

                </>
            ) : (
                <div className="w-[70%]">
                    <SummaryToggle summaryType={summaryType} onToggle={setSummaryType} />
                    {/* SummaryCards component commented out as requested */}
                    {/* <SummaryCards
                        simpleSummary={article.simpleSummary}
                        defaultSummary={article.defaultSummary}
                        currentType={summaryType}
                        doi={article.doi}
                        altmetricScore={article.altMetricScore}
                    /> */}
                    <h1 className="text-4xl font-semibold mb-4">{article.title}</h1>
                    <div className="mt-4 bg-white p-4 text-black">
                        {summaryType === 'simple' ? (
                            article.simpleSummary.map((summary, index) => (
                                <div key={index} className="mb-4">
                                    <h2 className="text-2xl font-semibold mb-2">{summary.heading}</h2>
                                    <p>{summary.content}</p>
                                </div>
                            ))
                        ) : (
                            article.defaultSummary.map((summary, index) => (
                                <div key={index} className="mb-4">
                                    <h2 className="text-2xl font-semibold mb-2">{summary.heading}</h2>
                                    <p>{summary.content}</p>
                                </div>
                            ))
                        )}
                        <div className="mt-4">
                            <p>DOI: {article.doi}</p>
                            <p>Altmetric Score: {article.altMetricScore}</p>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    )
}

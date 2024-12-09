import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface Article {
    id: string
    slug: string
    title: string
    subtitle: string
    coverImage: string
    originalPaperTitle: string
    authorName: string
    doi: string
    altMetricScore: number
    oneCardSummary: {
        heading: string,
        content: string,
    }
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

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    console.log(slug)
    if (!slug) {
        return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    try {
        const article = await prisma.article.findUnique({
            where: { slug },
            include: {
                articleImage: true,
                categories: true,
            },
        })

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 })
        }

        let oneCardSummaryNew = article.oneCardSummary as any
        // format onecard summary that whenever there is a bullet point, it will be a new line

        const defaultSummary = article.defaultSummary as [any]
        defaultSummary.unshift(oneCardSummaryNew)
        const simpleSummary = article.simpleSummary as [any]
        simpleSummary.unshift(oneCardSummaryNew)



        // Format the article data
        const formattedArticle = {
            ...article,
            coverImage: article.articleImage?.src || '',
            defaultSummary: defaultSummary,
            simpleSummary: simpleSummary
        }

        console.log(formattedArticle)

        return NextResponse.json(formattedArticle)
    } catch (error) {
        console.error('Error fetching article:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
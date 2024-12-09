// File: app/api/createArticle/route.js

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
// File: app/api/upload/route.js
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const prisma = new PrismaClient();


interface Payload {
    metaData: string,
    defaultSummary: string,
    simpleSummary: string,
    oneCardSummary: string,
    imageData: any,
}


export async function POST(request: NextRequest) {
    try {
        // Parse the JSON body from the request
        const body: Payload = await request.json();
        const { metaData, defaultSummary, simpleSummary, imageData } = body;
        console.log("Passing imgData")

        const { imgName, imgData } = imageData
        console.log("Passing MetaData")

        const { title, subtitle, authorName, categories, doi, altmetric, generatedWith, originalPaperTitle } = JSON.parse(metaData);

        const unique = await prisma.article.findUnique({ where: { doi: doi } });
        if (unique) {
            console.log("Article found")
            return NextResponse.json({ error: 'Article already exists', id: unique.id }, { status: 400 });
        }

        const connectCategory = await prisma.catergory.upsert({ where: { name: categories }, create: { name: categories }, update: { name: categories } })

        const imgBuffer = Buffer.from(imgData, 'base64');
        const { data, error } = await supabase.storage.from('Images')
            .upload("article_covers/" + imgName, imgBuffer);
        let imageMesaage = "Image uploaded successfully";

        if (error) {
            console.error('Supabase storage error:', error);
            imageMesaage = 'Supabase storage error:' + error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('Images')
            .getPublicUrl("article_covers/" + imgName);

        const image = await prisma.image.create({
            data: {
                src: publicUrl,
                name: imgName,
                alt: imgName
            }
        })

        console.log(image)

        const defaultSummaryParsed = JSON.parse(defaultSummary);
        const simpleSummaryParsed = JSON.parse(simpleSummary);

        console.log(defaultSummaryParsed)
        console.log(simpleSummaryParsed)
        let slug: string = title.toLowerCase().replace(/ /g, '-');
        slug = slug.replace(/[^a-zA-Z0-9-]/g, '');

        let article = null;
        // Create the article in the database
        try {

            article = await prisma.article.create({
                data: {
                    title: title,
                    subtitle: subtitle,
                    authorName: authorName,
                    originalPaperTitle: originalPaperTitle,
                    // filter slug to only contain lowercase letters, numbers, and hyphens
                    slug: slug,
                    altMetricScore: altmetric,
                    doi: doi,
                    estimatedReadingTime: Math.random() * (8 - 14) + 8,
                    generatedWith: generatedWith,
                    simpleSummary: simpleSummaryParsed,
                    oneCardSummary: {
                        heading: title,
                        content: body.oneCardSummary
                    },
                    defaultSummary: defaultSummaryParsed,
                    articleImage: {
                        connect: {
                            id: image.id
                        }
                    },
                    categories: {
                        connect: {
                            id: connectCategory.id
                        }
                    }
                },
            });
        } catch (error) {
            console.error('Error creating article:', error);
        }

        // Return the created article
        return NextResponse.json({ id: article?.id }, { status: 201 });
    } catch (error) {
        console.error('Error creating article:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
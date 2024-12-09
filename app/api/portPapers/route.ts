import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export async function POST(request: NextRequest) {
    const prisma = new PrismaClient();
    const body = await request.json();

    // Input validation
    const requiredFields = ['title', 'doi', 'publishDate', 'authorName', 'journal', 'ISSN', 'altmetricsScore', 'citations'];
    for (const field of requiredFields) {

        if (body[field] === undefined) {
            console.log("Could not find field " + field)
            console.log({body})
            return NextResponse.json({ message: `Missing required field: ${field}` }, { status: 400 });
        }
    }

    const { data, error } = await supabase.storage.from('Images')
            .upload("researchPaper", body.pdfData);

    if(error){
        console.log("Error uploading pdf")
        console.log(error)
        return NextResponse.json({ message: 'Error uploading pdf', error: error.message }, { status: 400 });
    }

    try {
        const paper = await prisma.paper.create({
            data: {
                title: body.title,
                doi: body.doi,
                publishDate: body.publishDate,
                authorName: body.authorName,
                journal: body.journal,
                ISSN: body.ISSN,
                altmetricsScore: body.altmetricsScore,
                citations: body.citations,
                pdfUrl: body.pdfUrl || null,
                abstractTree: body.abstractTree || null,
                metrics: body.metrics || null,
                Article: body.summaryId ? {
                    connect: {
                        id: body.summaryId
                    }
                } : undefined
            },
            include: {
                Article: true
            }
        });

        return NextResponse.json({
            message: 'Paper created successfully',
            paper: {
                ...paper,
                connectedToArticle: !!paper.Article
            }
        }, { status: 201 });
    } catch (error) {
        console.log('Error creating paper:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.log("Error")
            return NextResponse.json({ message: 'Error creating paper', error: error.message }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

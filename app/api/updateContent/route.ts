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
    simpleSummary: string,
    doi: string,
    oneCardSummary: string,
}


export async function POST(request: NextRequest) {
    try {
        // Parse the JSON body from the request
        const body: Payload = await request.json();
        const {doi ,simpleSummary, oneCardSummary} = body;

        console.log({doi, simpleSummary,oneCardSummary})

        const simpleSummaryParsed = JSON.parse(simpleSummary);

        console.log(simpleSummaryParsed)

        try {
            const updateArticle = await prisma.article.update({
                where: {
                    doi : doi
                },
                data: {
                    simpleSummary: simpleSummaryParsed,
                    oneCardSummary: oneCardSummary
                },
            });
            return NextResponse.json({ id: updateArticle?.id }, { status: 200 });

        }catch (error) {
            console.log(error)
            return NextResponse.json({ error: error}, { status: 400 });
        }

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
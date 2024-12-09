// File: app/api/createArticle/route.js

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
// File: app/api/upload/route.js

export async function POST(request: NextRequest) {
    const prisma = new PrismaClient();
    const body = await request.json();
    const title = body.title;
    console.log(title)
    try {
        const article = await prisma.article.findFirst({
            where: {
                originalPaperTitle: title,
            }
        });

        if (article) {
            return NextResponse.json(article, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
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
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req : Request) {
  // get id from search params
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  try {
    const previousQuestions = await prisma.trendAnalysisResponse.findMany({
      where: {
        userId: id as string,
      },
      select: {
        id: true,
        query: true,
        complexity: true,
        createdAt: true,
        response: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Limit to the 10 most recent questions
    });

 
    return NextResponse.json(previousQuestions);
  } catch (error) {
    console.error('Error fetching previous questions:', error);
    return NextResponse.json({ error: 'Failed to fetch previous questions' }, { status: 500 });
  }
}

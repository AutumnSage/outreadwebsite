// prisma/scripts/updateArticles.ts

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import csv from 'csv-parser'
import path from 'path'

const prisma = new PrismaClient()

async function importCSV(filePath: string) {
    const results: any[] = []

    return new Promise<any[]>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error))
    })
}

async function processPRISMAUpdate(filePath: string) {
    const data: any[] = await importCSV(filePath)

    for (const record of data) {
        const doi = record['DOI or Identifier'] as string
        const authorName = record['Author Name'] as string
        const title = record['Summary Title'].trim() as string
        const altMetricScore = record['Altmetric'] as string
        const originalPaperTitle = record['Original Article Title'] as string
        const slug = title.trim().toLowerCase().replace(/ /g, '-')

        const article = await prisma.article.findFirst({
            where: { originalPaperTitle: title + '.pdf' },
        })

        if (article) {
            await prisma.article.update({
                where: { id: article.id },
                data: {
                    doi: doi,
                    authorName: authorName,
                    title: title,
                    altMetricScore: parseInt(altMetricScore) | 0,
                    slug: slug,
                    originalPaperTitle: originalPaperTitle,
                },
            })
            console.log(`Updating article: ${article.title} Success`)
        }
    }
}

interface UserRow {
    email: string
}

(async function () {


    async function readUsersFromCSV(): Promise<UserRow[]> {
        return new Promise((resolve, reject) => {
            const results: UserRow[] = []

            fs.createReadStream(path.join(__dirname, '1.csv'))
                .pipe(csv())
                .on('data', (data: UserRow) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error))
        })
    }

    await prisma.newsletterSubscriber.deleteMany({})

    const results = await readUsersFromCSV()

    await prisma.newsletterSubscriber.createMany({ data: results })

})()
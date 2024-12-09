import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { parse } from 'csv-parse';

const prisma = new PrismaClient();

async function storeArticles() {
    const csvFilePath = 'prisma/scripts/r.csv';

    const parser = fs
        .createReadStream(csvFilePath)
        .pipe(parse({
            columns: true,
            skip_empty_lines: true
        }));

    for await (const row of parser) {
        const { title, category } = row;

        const article = await prisma.article.findFirst({ where: { title: title } });
        const remove = await prisma.article.delete({ where: { doi: article!.doi } });
    }


    console.log("Done")
    await prisma.$disconnect();
}

storeArticles().catch((error) => {
    console.error('Error in storeArticles:', error);
    process.exit(1);
});

import { PrismaClient } from "@prisma/client";

(async () => {
    const prisma = new PrismaClient();

    const targetCategories: string[] = [
        "Business", "Chemical Science", "Technology", "Health",
        "Humanities", "Earth Science", "Physics", "Social Science"
    ];

    const categoryMapping: { [key: string]: string } = {
        "Business": "Business",
        "Chemical Science": "Chemical Science",
        "Technology": "Technology",
        "Health": "Health",
        "Humanities": "Humanities",
        "Earth Science": "Earth Science",
        "Physics": "Physics",
        "Social Science": "Social Science",
        "Planetary Science": "Earth Science",
        "Environmental Science": "Earth Science",
        "Physiology": "Health",
        "Evolutionary Biology": "Social Science",
        "Artificial Intelligence": "Technology",
        "Developmental Biology": "Health",
        "Biology": "Health",
        "Neuroscience": "Health",
        "Astronomy": "Earth Science",
        "Plant Science": "Chemical Science",
        "Genetics": "Health",
        "Energy": "Physics",
    };

    try {
        const articles = await prisma.article.findMany({ include: { categories: true } });
        let idx = 0
        const catergories = await prisma.catergory.findMany({});
        // for ever article, add catergory mapping to the article
        for (const article of articles) {
            console.log(idx++)
            const catergory = catergories.find(catergory => catergory.name === categoryMapping[article.categories[0].name])!;
            if (!catergory) continue;
            console.log("Updating " + catergory.name)

            await prisma.article.update({
                where: { id: article.id },
                data: { categories: { connect: { id: catergory.id } } }
            });
        }
        console.log(`Updated categories for ${articles.length} articles`);
    } catch (error) {
        console.error("Error updating categories:", error);
    } finally {
        await prisma.$disconnect();
    }
})();
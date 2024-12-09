// prisma/scripts/updateArticles.ts

import { PrismaClient } from '@prisma/client'


(async function () {
    const prisma = new PrismaClient()

    const users = await prisma.user.findMany({})

    const userEmails = new Set(users.map(user => user.email))

    await prisma.newsletterSubscriber.createMany({
        data: Array.from(userEmails).map(email => ({
            email: email,
        })),
        skipDuplicates: true,
    })
    console.log('Users added to newsletter')
})()
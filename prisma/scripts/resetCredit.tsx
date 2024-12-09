import { PrismaClient } from '@prisma/client';

(async function () {

    const prisma = new PrismaClient();
    console.log("Hey")
    await prisma.user.updateMany({
        where: {},
        data: {
            credit: 15,
        }
    })

    await prisma.$disconnect();
})();
'use server'
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function getUserBySuperbaseID(id: string) {
    return prisma.user.findUnique({
        where: {
            supabaseUserId: id
        }
    })
}


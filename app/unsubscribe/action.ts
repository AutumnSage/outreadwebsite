'use server'

import { createClient } from '@/lib/supabase/server'
import { PrismaClient } from '@prisma/client'

export async function unsubscribe(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const prisma = new PrismaClient()

    try {
        // Remove user from the database
        await prisma.newsletterSubscriber.delete({ where: { email: email } })
        return { success: 'Successfully unsubscribed' }
    } catch (error) {
        console.error('Error unsubscribing:', error)
        return { error: 'Failed to unsubscribe. Please try again.' }
    }
}
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    // Check if the current path matches the desired routes
    const path = request.nextUrl.pathname
    if (path === '/user' || path.startsWith('/user/') ||
        path === '/subscription' || path.startsWith('/subscription')) {
        return await updateSession(request)
    }
    // For all other routes, do nothing
    return
}

export const config = {
    matcher: [
        // Match all routes
        '/(.*)',
    ],
}
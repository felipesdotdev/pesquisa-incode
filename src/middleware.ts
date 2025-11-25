import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './lib/auth';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define paths that are protected
    const isProtectedRoute = path.startsWith('/admin') && !path.startsWith('/admin/login');
    const isPublicRoute = path === '/admin/login';

    // Decrypt the session from the cookie
    const cookie = request.cookies.get('session')?.value;
    const session = cookie ? await decrypt(cookie) : null;

    // Redirect to /admin/login if the user is not authenticated
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/admin/login', request.nextUrl));
    }

    // Redirect to /admin if the user is already authenticated
    if (isPublicRoute && session) {
        return NextResponse.redirect(new URL('/admin', request.nextUrl));
    }

    return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

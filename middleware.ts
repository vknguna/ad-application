import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { searchParams, pathname } = request.nextUrl;
    const key = searchParams.get('key');
    const sitePassword = process.env.SITE_PASSWORD;

    // 1. Magic Link / Kiosk Mode: Bypass with ?key=...
    if (key && sitePassword && key === sitePassword) {
        // Redirect to the same URL but without the 'key' parameter to keep it clean
        const url = new URL(request.url);
        url.searchParams.delete('key');

        const response = NextResponse.redirect(url);

        // Set the site_auth cookie
        response.cookies.set('site_auth', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            sameSite: 'lax'
        });

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};

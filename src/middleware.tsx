import { NextResponse, NextFetchEvent, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest, event: NextFetchEvent) {
    const token = await getToken({ req });
    const isAuthenticated = !!token;

    if (req.nextUrl.pathname === '/dashboard' && !isAuthenticated) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if ((req.nextUrl.pathname === '/dashboard' || req.nextUrl.pathname === '/')  && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard/schools', req.url));
    }
    return NextResponse.next();
    
}

export const config = { matcher: ["/", "/dashboard"] };
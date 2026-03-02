import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PRIVATE_PREFIXES = [
  '/dashboard',
  '/discover',
  '/companies',
  '/engagement',
  '/prospector',
  '/content',
  '/knowledge',
  '/career',
  '/analytics',
  '/media',
  '/social',
  '/ai',
  '/settings',
  '/notifications',
  '/people',
  '/topics',
  '/research',
  '/occasions',
];

function isPrivatePath(pathname: string) {
  return PRIVATE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('sf_session')?.value;
  const loggedIn = Boolean(session);

  if ((pathname === '/login' || pathname === '/signup') && loggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isPrivatePath(pathname) && !loggedIn) {
    const login = new URL('/login', request.url);
    login.searchParams.set('next', pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|images/|robots.txt|sitemap.xml|api/).*)',
  ],
};

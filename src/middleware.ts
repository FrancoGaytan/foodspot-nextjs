import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_LOCALE = 'en-US';

// Protected Routes
const PROTECTED_PATHS = ['userProfile', 'createEvent', 'event'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root path `/` to the default locale's event home.
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}/eventHome`;
    return NextResponse.redirect(url);
  }

  const segments = pathname.split('/').filter(Boolean);
  const lang = segments[0];
  const nextPath = segments[1];

  const token = request.cookies.get('jwt')?.value;

  if (PROTECTED_PATHS.includes(nextPath) && !token) {
    const loginUrl = new URL(`/${lang}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/**
 * This config makes sure that:
 * '/' must redirect to '/lang/eventHome'
 * '/lang/userProfile-createEvent-event' will be protected
 * It won't stop the user in public routes such as '/lang/faq'
 */
export const config = {
  matcher: ['/', '/:lang', '/:lang/userProfile/:path*', '/:lang/createEvent/:path*', '/:lang/event/:path*'],
};

// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')!
  const pathname = request.nextUrl.pathname
  
  // Exclude static files and API routes
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next()
  }

  // Check if it's a custom domain
  const businessId = hostname.replace('.yourdomain.com', '')
  if (hostname !== 'yourdomain.com') {
    // Rewrite to /book/[businessId]
    const url = request.nextUrl.clone()
    url.pathname = `/book/${businessId}${pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next|static|favicon.ico).*)',
  ],
}
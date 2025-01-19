// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  const hostname = request.headers.get('host');
  
  // If we're on localhost, we need to handle subdomains differently
  const isLocalhost = hostname?.includes('localhost') || hostname?.includes('127.0.0.1');
  
  // Get the subdomain by splitting the hostname
  let subdomain: string | null = null;
  
  if (isLocalhost) {
    // For localhost, we'll use a query parameter to simulate subdomains
    const url = new URL(request.url);
    subdomain = url.searchParams.get('business');
  } else {
    // For production, extract the subdomain from the hostname
    const hostParts = hostname?.split('.');
    if (hostParts && hostParts.length > 2) {
      subdomain = hostParts[0];
    }
  }

  // If there's no subdomain, continue to the main app
  if (!subdomain) {
    return NextResponse.next();
  }

  // Create URL for rewrite
  const url = new URL(request.url);
  
  // Handle different paths
  if (url.pathname.startsWith('/dashboard')) {
    url.pathname = `/business/${subdomain}/dashboard${url.pathname.replace('/dashboard', '')}`;
  } else if (url.pathname.startsWith('/book')) {
    url.pathname = `/business/${subdomain}/book${url.pathname.replace('/book', '')}`;
  } else {
    url.pathname = `/business/${subdomain}${url.pathname}`;
  }

  // Rewrite the request to the appropriate path
  return NextResponse.rewrite(url);
}
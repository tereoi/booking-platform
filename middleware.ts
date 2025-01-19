import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { collection, query, where } from 'firebase/firestore';

// Firebase admin initialisatie (alleen in server-side context)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const adminDb = getFirestore();

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const path = request.nextUrl.pathname;
  
  // Check ontwikkelomgeving
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

  // Business ID ophalen
  let businessId: string | null = null;

  if (isDevelopment && isLocalhost) {
    // Voor lokale ontwikkeling gebruiken we een query parameter
    const url = new URL(request.url);
    businessId = url.searchParams.get('business');
  } else {
    // In productie halen we het uit de subdomain
    const hostParts = hostname.split('.');
    if (hostParts.length > 2 && hostParts[0] !== 'www') {
      businessId = hostParts[0];
    }
  }

  // Als er geen business ID is, ga door naar de main app
  if (!businessId) {
    return NextResponse.next();
  }

  // Valideer of de business bestaat
  try {
    const businessesRef = adminDb.collection('businesses');
    const snapshot = await businessesRef
      .where('customUrl', '==', businessId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      // Business niet gevonden, stuur naar 404
      return NextResponse.redirect(new URL('/404', request.url));
    }
  } catch (error) {
    console.error('Middleware business check error:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }

  const url = new URL(request.url);

  // Root pad afhandelen
  if (path === '/') {
    return NextResponse.rewrite(new URL(`/${businessId}`, request.url));
  }

  // Dashboard routes
  if (path.startsWith('/dashboard')) {
    // Later kunnen we hier auth checks toevoegen
    return NextResponse.rewrite(
      new URL(`/${businessId}/dashboard${path.replace('/dashboard', '')}`, request.url)
    );
  }

  // Alle andere routes
  return NextResponse.rewrite(new URL(`/${businessId}${path}`, request.url));
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
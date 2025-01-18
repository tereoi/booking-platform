// src/pages/book/[businessId]/index.tsx
import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import type { Business } from '@/types/business';
import Head from 'next/head';
import BookingFlow from '@/components/appointments/BookingFlow';

interface BusinessSitePageProps {
  business: Business;
}

export default function BusinessSitePage({ business }: BusinessSitePageProps) {
  const { site } = business;
  const [showBooking, setShowBooking] = useState(false);

  return (
    <>
      <Head>
        <title>{site.seo?.title || business.name}</title>
        <meta name="description" content={site.seo?.description} />
        {site.seo?.keywords && <meta name="keywords" content={site.seo.keywords.join(', ')} />}
        {site.seo?.ogImage && <meta property="og:image" content={site.seo.ogImage} />}
        <style>{`
          :root {
            --primary-color: ${site.styling?.primaryColor || '#000000'};
            --secondary-color: ${site.styling?.secondaryColor || '#ffffff'};
          }
          body {
            font-family: ${site.styling?.fontFamily || 'system-ui'}, sans-serif;
          }
          ${site.styling?.customCss || ''}
        `}</style>
      </Head>

      <div className="min-h-screen">
        {/* Hero Section */}
        <header 
          className="relative h-[70vh] flex items-center justify-center"
          style={{
            backgroundImage: site.hero?.backgroundImage ? `url(${site.hero.backgroundImage})` : undefined,
            backgroundColor: (site.styling?.primaryColor || '#000000') + '10',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative text-center text-white space-y-4 p-4">
            {site.styling?.logo && (
              <img 
                src={site.styling.logo} 
                alt={business.name} 
                className="h-20 mx-auto mb-6"
              />
            )}
            <h1 className="text-4xl md:text-6xl font-bold">
              {site.hero?.title || 'Welkom'}
            </h1>
            <p className="text-xl md:text-2xl">
              {site.hero?.subtitle || 'Plan direct een afspraak'}
            </p>
            <button
              onClick={() => setShowBooking(true)}
              className="mt-8 px-8 py-3 bg-white text-black rounded-full 
                        text-lg font-medium hover:bg-opacity-90 transition-all"
            >
              Maak een afspraak
            </button>
          </div>
        </header>

        {/* About Section */}
        {site.about && (
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8">{site.about.title || 'Over ons'}</h2>
              <div className="prose max-w-none">
                {site.about.content.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              {site.about.image && (
                <img 
                  src={site.about.image} 
                  alt="About us" 
                  className="mt-8 rounded-lg w-full max-h-96 object-cover"
                />
              )}
            </div>
          </section>
        )}

        {/* Contact Section */}
        {site.contact && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8">Contact</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {site.contact.address && (
                    <div>
                      <h3 className="font-medium mb-2">Adres</h3>
                      <p>{site.contact.address}</p>
                    </div>
                  )}
                  {site.contact.phone && (
                    <div>
                      <h3 className="font-medium mb-2">Telefoon</h3>
                      <a 
                        href={`tel:${site.contact.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {site.contact.phone}
                      </a>
                    </div>
                  )}
                  {site.contact.email && (
                    <div>
                      <h3 className="font-medium mb-2">Email</h3>
                      <a 
                        href={`mailto:${site.contact.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {site.contact.email}
                      </a>
                    </div>
                  )}
                </div>
                {site.contact.googleMapsUrl && (
                  <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
                    <iframe
                      src={site.contact.googleMapsUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Booking Modal */}
        {showBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 m-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {site.booking?.title || 'Maak een afspraak'}
                </h2>
                <button
                  onClick={() => setShowBooking(false)}
                  className="text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 mb-8">
                {site.booking?.description || 'Kies een service en tijd die jou uitkomt'}
              </p>
              <BookingFlow
                business={business}
                onComplete={() => setShowBooking(false)}
              />
            </motion.div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} {business.name}. Alle rechten voorbehouden.</p>
        </div>
      </footer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { businessId } = context.params || {};

  if (!businessId || typeof businessId !== 'string') {
    return {
      notFound: true,
    };
  }

  try {
    // Query for business by customUrl
    const businessesRef = collection(db, 'businesses');
    const q = query(businessesRef, where('customUrl', '==', businessId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        notFound: true,
      };
    }

    const businessDoc = querySnapshot.docs[0];
    const business = {
      id: businessDoc.id,
      ...businessDoc.data(),
    };

    return {
      props: {
        business,
      },
    };
  } catch (error) {
    console.error('Error fetching business:', error);
    return {
      notFound: true,
    };
  }
};
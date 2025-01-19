import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Head from 'next/head';
import { Business } from '@/types/business';
import BookingFlow from '@/components/appointments/BookingFlow';
import { motion } from 'framer-motion';

interface BusinessPageProps {
  business: Business;
}

export default function BusinessPage({ business }: BusinessPageProps) {
  const [showBooking, setShowBooking] = useState(true);

  // Business styling toepassen
  const pageStyles = {
    '--primary-color': business.site.styling?.primaryColor || '#000000',
    '--secondary-color': business.site.styling?.secondaryColor || '#ffffff',
    '--font-family': `${business.site.styling?.fontFamily || 'system-ui'}, sans-serif`
  } as React.CSSProperties;

  return (
    <>
      <Head>
        <title>{business.name} - Online Afspraak Maken</title>
        <meta name="description" content={`Maak eenvoudig online een afspraak bij ${business.name}`} />
        <style>{`
          :root {
            --primary-color: ${business.site.styling?.primaryColor || '#000000'};
            --secondary-color: ${business.site.styling?.secondaryColor || '#ffffff'};
          }
          body {
            font-family: var(--font-family);
            background-color: var(--background-color, #ffffff);
          }
          ${business.site.styling?.customCss || ''}
        `}</style>
      </Head>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col"
        style={pageStyles}
      >
        {/* Header met bedrijfslogo/naam */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {business.site.styling?.logo ? (
                <motion.img 
                  src={business.site.styling.logo} 
                  alt={business.name}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="h-10 w-auto"
                />
              ) : (
                <h1 className="text-xl font-bold">{business.name}</h1>
              )}
            </div>
          </div>
        </header>

        {/* Main booking area */}
        <main className="max-w-4xl mx-auto px-4 py-8 flex-grow">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <BookingFlow 
              business={business}
              onComplete={() => {
                // Handle booking complete
                alert('Afspraak gemaakt!');
              }}
            />
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} {business.name}
            </p>
          </div>
        </footer>
      </motion.div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { businessId } = context.params || {};

  if (!businessId || typeof businessId !== 'string') {
    return { notFound: true };
  }

  try {
    // Zoek business op basis van customUrl
    const businessesRef = collection(db, 'businesses');
    const q = query(businessesRef, where('customUrl', '==', businessId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { notFound: true };
    }

    const businessDoc = snapshot.docs[0];
    const business = {
      id: businessDoc.id,
      ...businessDoc.data(),
    } as Business;

    return {
      props: { business }
    };
  } catch (error) {
    console.error('Error fetching business:', error);
    return { notFound: true };
  }
};
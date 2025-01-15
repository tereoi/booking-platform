// src/pages/verify-email.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/lib/firebase';
import { sendEmailVerification } from 'firebase/auth';
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function VerifyEmail() {
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          setIsVerified(true);
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleResendEmail = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await sendEmailVerification(user, {
          url: 'https://yourdomain.com/verify-email',
        });
        alert('Verification email resent!');
      } catch (error) {
        console.error('Error sending verification email:', error);
        alert('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-8 text-center"
          >
            {isVerified ? (
              <>
                <h2 className="heading-2 mb-4">Email Geverifieerd!</h2>
                <p className="text-gray-600 mb-4">
                  Je wordt doorgestuurd naar het dashboard...
                </p>
              </>
            ) : (
              <>
                <h2 className="heading-2 mb-4">Verifieer je Email</h2>
                <p className="text-gray-600 mb-6">
                  We hebben een verificatie link gestuurd naar je email adres.
                  Klik op de link in de email om je account te activeren.
                </p>
                <button
                  onClick={handleResendEmail}
                  className="button-secondary mb-4 w-full"
                >
                  Verstuur email opnieuw
                </button>
                <p className="text-sm text-gray-500">
                  Ga terug naar de{' '}
                  <Link href="/login" className="text-black hover:underline">
                    login pagina
                  </Link>
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
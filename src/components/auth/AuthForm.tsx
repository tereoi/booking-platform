// src/components/auth/AuthForm.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { auth, db } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification,
  AuthError 
} from 'firebase/auth';
import { doc, collection, query, where, getDocs } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { setupNewBusiness } from '@/utils/businessSetup';

interface AuthFormProps {
  mode: 'login' | 'register';
}

interface FormData {
  email: string;
  password: string;
  businessName?: string;
  customUrl?: string;
  confirmPassword?: string;
}

// Nieuwe interface voor business setup
interface BusinessSetupData {
  name: string;
  email: string;
  customUrl?: string;
}

const getErrorMessage = (error: AuthError) => {
  switch (error.code) {
    case 'auth/invalid-credential':
      return 'Email of wachtwoord is onjuist.';
    case 'auth/user-not-found':
      return 'Geen gebruiker gevonden met dit email adres.';
    case 'auth/wrong-password':
      return 'Incorrect wachtwoord.';
    case 'auth/email-already-in-use':
      return 'Dit email adres is al in gebruik.';
    case 'auth/weak-password':
      return 'Wachtwoord moet minimaal 6 karakters zijn.';
    case 'auth/invalid-email':
      return 'Ongeldig email adres.';
    default:
      return 'Er is iets misgegaan. Probeer het opnieuw.';
  }
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    businessName: '',
    customUrl: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError('');
    
    if (name === 'businessName') {
      // Automatisch genereren van een custom URL
      const customUrl = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-') // Vervang speciale karakters met streepjes
        .replace(/-+/g, '-')        // Voorkom meerdere streepjes
        .replace(/^-|-$/g, '');     // Verwijder streepjes aan begin/eind
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        customUrl
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const checkCustomUrlAvailability = async (url: string): Promise<boolean> => {
    const businessesRef = collection(db, 'businesses');
    const q = query(businessesRef, where('customUrl', '==', url));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        // Validaties
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Wachtwoorden komen niet overeen');
        }
        if (!formData.businessName) {
          throw new Error('Bedrijfsnaam is verplicht');
        }
        if (formData.password.length < 6) {
          throw new Error('Wachtwoord moet minimaal 6 karakters zijn');
        }
        if (!formData.customUrl) {
          throw new Error('Custom URL is verplicht');
        }

        // Check of custom URL beschikbaar is
        const isUrlAvailable = await checkCustomUrlAvailability(formData.customUrl);
        if (!isUrlAvailable) {
          throw new Error('Deze URL is al in gebruik. Kies een andere.');
        }

        // Maak gebruiker aan
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Stuur verificatie email
        await sendEmailVerification(userCredential.user);

        // Setup het nieuwe bedrijf met alle default waardes
        const businessData: BusinessSetupData = {
          name: formData.businessName,
          email: formData.email,
          customUrl: formData.customUrl
        };

        await setupNewBusiness(userCredential.user.uid, businessData);

        toast.success('Account succesvol aangemaakt! Check je email.');
        router.push('/verify-email');
      } else {
        // Login
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        
        toast.success('Succesvol ingelogd!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || getErrorMessage(error));
      toast.error(error.message || getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20 pb-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      </motion.div>
      
      <div className="max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="relative bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-200/50"
        >
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-center mb-2">
              {mode === 'login' ? 'Welkom terug' : 'Start je booking pagina'}
            </h2>
            <p className="text-center text-gray-500 mb-8">
              {mode === 'login' 
                ? 'Log in om je afspraken te beheren'
                : 'Creëer je eigen professionele booking pagina'}
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrijfsnaam
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                    placeholder="Jouw bedrijfsnaam"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom URL
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white/50 backdrop-blur-sm">
                    <span className="inline-flex items-center px-4 border-r border-gray-200 text-gray-500 text-sm bg-gray-50">
                      https://
                    </span>
                    <input
                      type="text"
                      name="customUrl"
                      required
                      value={formData.customUrl}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="jouw-bedrijf"
                    />
                    <span className="inline-flex items-center px-4 border-l border-gray-200 text-gray-500 text-sm bg-gray-50">
                      .yourdomain.com
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Dit wordt jouw unieke booking pagina URL
                  </p>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                  placeholder="naam@bedrijf.nl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wachtwoord
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bevestig wachtwoord
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <button
                type="submit"
                disabled={loading}
                className="relative w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl py-3 px-4 font-medium shadow-lg hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              >
                <span className="relative z-10">
                  {loading ? 'Even geduld...' : mode === 'login' ? 'Inloggen' : 'Registreren'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 group-hover:opacity-0 transition-opacity" />
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
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
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

interface AuthFormProps {
  mode: 'login' | 'register';
}

interface FormData {
  email: string;
  password: string;
  businessName?: string;
  confirmPassword?: string;
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
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(''); // Reset error on input change
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        // Validaties
        if (formData.password !== formData.confirmPassword) {
          setError('Wachtwoorden komen niet overeen');
          return;
        }
        if (!formData.businessName) {
          setError('Bedrijfsnaam is verplicht');
          return;
        }
        if (formData.password.length < 6) {
          setError('Wachtwoord moet minimaal 6 karakters zijn');
          return;
        }

        // Maak gebruiker aan
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Stuur verificatie email
        await sendEmailVerification(userCredential.user);

        // Maak bedrijfsprofiel aan
        await setDoc(doc(db, 'businesses', userCredential.user.uid), {
          businessName: formData.businessName,
          email: formData.email,
          createdAt: new Date().toISOString(),
          settings: {
            theme: {
              primaryColor: '#000000',
              secondaryColor: '#ffffff'
            },
            notifications: {
              email: true,
              push: false,
              sms: false
            }
          }
        });

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
      setError(getErrorMessage(error));
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-8"
        >
          <h2 className="heading-2 text-center mb-8">
            {mode === 'login' ? 'Welkom terug' : 'Registreren'}
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rest of the form remains the same */}
            {mode === 'register' && (
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                  Bedrijfsnaam
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="Jouw bedrijfsnaam"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="naam@bedrijf.nl"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Wachtwoord
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Bevestig wachtwoord
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="button-primary w-full"
            >
              {loading ? 'Even geduld...' : mode === 'login' ? 'Inloggen' : 'Registreren'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
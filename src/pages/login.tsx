// src/pages/login.tsx
import MainLayout from '@/components/layout/MainLayout';
import AuthForm from '@/components/auth/AuthForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <MainLayout>
      <AuthForm mode="login" />
      <p className="text-center mt-4 text-gray-600">
        Nog geen account?{' '}
        <Link href="/register" className="text-black hover:underline">
          Registreer hier
        </Link>
      </p>
    </MainLayout>
  );
}
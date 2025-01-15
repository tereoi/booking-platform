// src/pages/register.tsx
import MainLayout from '@/components/layout/MainLayout';
import AuthForm from '@/components/auth/AuthForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <MainLayout>
      <AuthForm mode="register" />
      <p className="text-center mt-4 text-gray-600">
        Al een account?{' '}
        <Link href="/login" className="text-black hover:underline">
          Log hier in
        </Link>
      </p>
    </MainLayout>
  );
}
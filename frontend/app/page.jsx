'use client';
import AuthPage from '../components/AuthPage.jsx';

export default function Page() {
  return <AuthPage />;
}

/*
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export default function Page() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  return null;
}*/
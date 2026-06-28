'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { DemoBanner } from '@/components/demo-banner';
import { LoadingPage } from '@/components/loading-spinner';
import { isFirebaseConfigured } from '@/firebase/config';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && isFirebaseConfigured) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingPage message="Loading dashboard..." />;
  }

  if (!user && isFirebaseConfigured) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <DemoBanner />
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

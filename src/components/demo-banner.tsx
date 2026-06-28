'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { isFirebaseConfigured } from '@/firebase/config';

export function DemoBanner() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isFirebaseConfigured) {
    return null;
  }

  return (
    <div className="bg-amber-500 text-white px-4 py-2 text-sm font-medium flex items-center justify-center">
      <AlertTriangle className="h-4 w-4 mr-2" />
      Firebase not configured. Running in Demo Mode.
    </div>
  );
}

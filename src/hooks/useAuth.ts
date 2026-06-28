import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/firebase/config';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // Demo mode: create a mock user
      setUser({
        uid: 'demo-user',
        email: 'demo@multimax.ai',
        displayName: 'Demo User',
        emailVerified: true,
      } as User);
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}

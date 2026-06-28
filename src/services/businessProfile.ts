import { db, isFirebaseConfigured } from '@/firebase/config';
import { collection, addDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { BusinessProfile } from '@/types';
import { mockBusinessProfile } from '@/lib/mock-data';
import { withTimeout, getLocalProfile, saveLocalProfile } from '@/lib/db-fallback';

export async function createBusinessProfile(profile: Omit<BusinessProfile, 'id'>) {
  const localId = 'local-profile-' + Date.now();
  saveLocalProfile(profile.userId, { ...profile, id: localId });

  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase not configured, saved profile locally');
    return localId;
  }

  withTimeout(addDoc(collection(db, 'businessProfiles'), profile), 5000)
    .then((docRef) => {
      saveLocalProfile(profile.userId, { ...profile, id: docRef.id });
    })
    .catch((error) => {
      console.warn('Firebase profile sync skipped:', getErrorMessage(error));
    });

  return localId;
}

export async function getBusinessProfile(userId: string) {
  const local = getLocalProfile(userId);

  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase not configured, returning local/mock profile');
    return local || mockBusinessProfile;
  }

  try {
    const q = query(collection(db, 'businessProfiles'), where('userId', '==', userId));
    const querySnapshot = await withTimeout(getDocs(q));
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = { id: doc.id, ...doc.data() } as BusinessProfile;
      saveLocalProfile(userId, data);
      return data;
    }
    return local;
  } catch (error) {
    console.warn('Using local business profile:', getErrorMessage(error));
    if (userId === 'demo-user') {
      return local || mockBusinessProfile;
    }
    return local;
  }
}

export async function updateBusinessProfile(id: string, profile: Partial<BusinessProfile>) {
  const userId = profile.userId || 'demo-user';
  saveLocalProfile(userId, { ...profile, id });

  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase not configured, updated profile locally');
    return;
  }

  const firestore = db;
  const syncToFirebase = async () => {
    if (id.startsWith('local-profile-')) {
      const current = getLocalProfile(userId);
      const { id: _, ...rest } = { ...current, ...profile } as BusinessProfile;
      const docRef = await withTimeout(addDoc(collection(firestore, 'businessProfiles'), rest));
      saveLocalProfile(userId, { ...rest, id: docRef.id });
    } else {
      const docRef = doc(firestore, 'businessProfiles', id);
      await withTimeout(updateDoc(docRef, profile));
    }
  };

  syncToFirebase().catch((error) => {
    console.warn('Firebase profile sync skipped:', getErrorMessage(error));
  });
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error || 'Unknown error');
}

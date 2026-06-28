import { db, isFirebaseConfigured } from '@/firebase/config';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { Campaign } from '@/types';
import { mockCampaigns } from '@/lib/mock-data';
import { withTimeout, getLocalCampaigns, saveLocalCampaign } from '@/lib/db-fallback';

const toDate = (val: any) => {
  if (!val) return new Date();
  if (typeof val.toDate === 'function') return val.toDate();
  return new Date(val);
};

export async function createCampaign(campaign: Omit<Campaign, 'id'>) {
  const localId = 'local-campaign-' + Date.now();
  const fullCampaign: Campaign = { 
    ...campaign, 
    id: localId, 
    startDate: toDate(campaign.startDate),
    endDate: toDate(campaign.endDate),
    createdAt: new Date() 
  };
  saveLocalCampaign(campaign.userId, fullCampaign);

  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase not configured, saved campaign locally');
    return localId;
  }

  try {
    const docRef = await withTimeout(addDoc(collection(db, 'campaigns'), campaign));
    saveLocalCampaign(campaign.userId, { ...fullCampaign, id: docRef.id });
    return docRef.id;
  } catch (error) {
    console.error('Error creating campaign in Firebase:', error);
    return localId;
  }
}

export async function getCampaigns(userId: string) {
  const local = getLocalCampaigns(userId);

  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase not configured, returning local/mock campaigns');
    return local.length > 0 ? local : mockCampaigns;
  }

  try {
    const q = query(
      collection(db, 'campaigns'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const querySnapshot = await withTimeout(getDocs(q));
    const firebaseCampaigns = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: toDate(data.startDate),
        endDate: toDate(data.endDate),
        createdAt: toDate(data.createdAt),
      } as Campaign;
    });

    firebaseCampaigns.forEach(c => saveLocalCampaign(userId, c));
    return firebaseCampaigns;
  } catch (error) {
    console.error('Error getting campaigns from Firebase:', error);
    return local.length > 0 ? local : mockCampaigns;
  }
}


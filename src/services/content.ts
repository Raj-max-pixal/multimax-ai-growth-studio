import { db, isFirebaseConfigured } from '@/firebase/config';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { GeneratedContent } from '@/types';
import { mockContent } from '@/lib/mock-data';
import { withTimeout, getLocalContent, saveLocalContentItem } from '@/lib/db-fallback';

const toDate = (val: any) => {
  if (!val) return new Date();
  if (typeof val.toDate === 'function') return val.toDate();
  return new Date(val);
};

export async function saveContent(content: Omit<GeneratedContent, 'id'>) {
  const localId = 'local-content-' + Date.now();
  const fullContent: GeneratedContent = {
    ...content,
    id: localId,
    createdAt: new Date()
  };
  saveLocalContentItem(content.userId, fullContent);

  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase not configured, saved content locally');
    return localId;
  }

  try {
    const docRef = await withTimeout(addDoc(collection(db, 'generatedContent'), content));
    saveLocalContentItem(content.userId, { ...fullContent, id: docRef.id });
    return docRef.id;
  } catch (error) {
    console.error('Error saving content in Firebase:', error);
    return localId;
  }
}

export async function getGeneratedContent(userId: string) {
  const local = getLocalContent(userId);

  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase not configured, returning local/mock content');
    return local.length > 0 ? local : mockContent;
  }

  try {
    const q = query(
      collection(db, 'generatedContent'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const querySnapshot = await withTimeout(getDocs(q));
    const firebaseContent = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: toDate(data.createdAt),
      } as GeneratedContent;
    });

    firebaseContent.forEach(item => saveLocalContentItem(userId, item));
    return firebaseContent;
  } catch (error) {
    console.error('Error getting generated content from Firebase:', error);
    return local.length > 0 ? local : mockContent;
  }
}


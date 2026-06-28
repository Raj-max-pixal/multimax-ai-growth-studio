import { BusinessProfile, Campaign, GeneratedContent } from '@/types';

const TIMEOUT_MS = 8000;

export function withTimeout<T>(promise: Promise<T>, timeoutMs: number = TIMEOUT_MS): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Firebase operation timed out'));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}


export function getLocalProfile(userId: string): BusinessProfile | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(`multimax_profile_${userId}`);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (parsed.createdAt) parsed.createdAt = new Date(parsed.createdAt);
      if (parsed.updatedAt) parsed.updatedAt = new Date(parsed.updatedAt);
      return parsed as BusinessProfile;
    } catch (e) {
      console.error('Error parsing local profile:', e);
    }
  }
  return null;
}

export function saveLocalProfile(userId: string, profile: Partial<BusinessProfile>) {
  if (typeof window === 'undefined') return;
  const current = getLocalProfile(userId) || {};
  const updated = { ...current, ...profile, userId };
  localStorage.setItem(`multimax_profile_${userId}`, JSON.stringify(updated));
}

export function getLocalCampaigns(userId: string): Campaign[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(`multimax_campaigns_${userId}`);
  if (data) {
    try {
      const parsed = JSON.parse(data) as any[];
      return parsed.map(item => ({
        ...item,
        startDate: item.startDate ? new Date(item.startDate) : new Date(),
        endDate: item.endDate ? new Date(item.endDate) : new Date(),
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      })) as Campaign[];
    } catch (e) {
      console.error('Error parsing local campaigns:', e);
    }
  }
  return [];
}

export function saveLocalCampaign(userId: string, campaign: Campaign) {
  if (typeof window === 'undefined') return;
  const campaigns = getLocalCampaigns(userId);
  const index = campaigns.findIndex(c => c.id === campaign.id);
  if (index >= 0) {
    campaigns[index] = campaign;
  } else {
    campaigns.unshift(campaign);
  }
  localStorage.setItem(`multimax_campaigns_${userId}`, JSON.stringify(campaigns));
}

export function getLocalContent(userId: string): GeneratedContent[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(`multimax_content_${userId}`);
  if (data) {
    try {
      const parsed = JSON.parse(data) as any[];
      return parsed.map(item => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      })) as GeneratedContent[];
    } catch (e) {
      console.error('Error parsing local content:', e);
    }
  }
  return [];
}

export function saveLocalContentItem(userId: string, content: GeneratedContent) {
  if (typeof window === 'undefined') return;
  const items = getLocalContent(userId);
  const index = items.findIndex(i => i.id === content.id);
  if (index >= 0) {
    items[index] = content;
  } else {
    items.unshift(content);
  }
  localStorage.setItem(`multimax_content_${userId}`, JSON.stringify(items));
}

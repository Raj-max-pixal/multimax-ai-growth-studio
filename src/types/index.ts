export interface BusinessProfile {
  id?: string;
  businessName: string;
  industry: string;
  products: string;
  targetAudience: string;
  monthlyBudget: number;
  marketingGoals: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Campaign {
  id?: string;
  name: string;
  type: string;
  status: 'planned' | 'active' | 'completed';
  startDate: Date;
  endDate: Date;
  budget: number;
  estimatedReach: number;
  estimatedROI: number;
  userId: string;
  createdAt?: Date;
}

export interface GeneratedContent {
  id?: string;
  type: string;
  platform: string;
  content: string;
  userId: string;
  createdAt?: Date;
}

export interface AIActivity {
  id?: string;
  type: string;
  description: string;
  timestamp: Date;
  userId: string;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  userId: string;
}

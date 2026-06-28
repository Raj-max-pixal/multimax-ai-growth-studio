import { BusinessProfile } from '@/types';

export const demoBusinessProfile: BusinessProfile = {
  id: 'demo-profile',
  userId: 'demo-user',
  businessName: 'TechStart Inc.',
  industry: 'Technology',
  products: 'SaaS platform for small business automation, AI-powered tools for marketing and operations, cloud-based solutions for remote teams',
  targetAudience: 'Small to medium-sized businesses (SMBs) looking to automate their operations, startup founders aged 25-45, marketing managers in growing companies, remote team leaders',
  monthlyBudget: 10000,
  marketingGoals: 'Increase brand awareness by 50% in 6 months, generate 500 qualified leads per month, achieve 300% ROI on marketing spend, establish thought leadership in SMB automation space',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
};

export const demoCampaigns = [
  {
    id: 'demo-campaign-1',
    userId: 'demo-user',
    name: 'Q1 Product Launch',
    type: 'Product Launch',
    status: 'Active',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-15'),
    budget: 15000,
    platforms: ['LinkedIn', 'Google Ads', 'Email'],
    description: 'Comprehensive launch campaign for new automation features',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'demo-campaign-2',
    userId: 'demo-user',
    name: 'Spring Growth Push',
    type: '30-day',
    status: 'Planned',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-04-30'),
    budget: 20000,
    platforms: ['Instagram', 'Facebook', 'LinkedIn', 'Email'],
    description: 'Aggressive growth campaign for Q2',
    createdAt: new Date('2024-01-15'),
  },
];

export const demoContent = [
  {
    id: 'demo-content-1',
    userId: 'demo-user',
    type: 'Instagram',
    platform: 'Instagram',
    topic: 'Product Feature Highlight',
    content: '🚀 New Feature Alert! Our AI-powered automation just got smarter. Now you can:\n\n✅ Automate repetitive tasks\n✅ Save 10+ hours weekly\n✅ Scale without hiring\n\nReady to transform your workflow? Link in bio! #Automation #SaaS #Productivity #SmallBusiness #TechStart',
    status: 'Published',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'demo-content-2',
    userId: 'demo-user',
    type: 'LinkedIn',
    platform: 'LinkedIn',
    topic: 'Industry Insight',
    content: 'The future of work is automated. Here\'s why SMBs are embracing AI-powered automation:\n\n1️⃣ Cost efficiency - Do more with less\n2️⃣ Scalability - Grow without growing pains\n3️⃣ Accuracy - Reduce human error\n4️⃣ Speed - Respond faster to customers\n\nAre you ready to automate your success? Let\'s discuss how TechStart can help.',
    status: 'Published',
    createdAt: new Date('2024-01-22'),
  },
  {
    id: 'demo-content-3',
    userId: 'demo-user',
    type: 'Email',
    platform: 'Email',
    topic: 'Newsletter',
    content: 'Subject: 5 Ways to Automate Your Business Today\n\nHi [Name],\n\nRunning a small business is hard work. But what if you could reclaim 10+ hours every week?\n\nIn this week\'s newsletter, we\'re sharing 5 automation strategies that are transforming SMBs:\n\n1. Customer service chatbots\n2. Social media scheduling\n3. Email marketing automation\n4. Invoice processing\n5. Lead qualification\n\nRead the full guide on our blog.\n\nBest,\nThe TechStart Team',
    status: 'Draft',
    createdAt: new Date('2024-01-25'),
  },
];

export const demoAnalytics = {
  totalCampaigns: 12,
  activeCampaigns: 3,
  totalContent: 45,
  publishedContent: 38,
  totalReach: 285000,
  avgEngagementRate: 4.8,
  avgROI: 171,
  monthlyBudget: 10000,
  monthlySpend: 8500,
  conversions: 245,
  leads: 520,
  growth: {
    followers: 14000,
    engagement: 13200,
    trend: [
      { month: 'Jan', followers: 5000, engagement: 4500 },
      { month: 'Feb', followers: 6200, engagement: 5800 },
      { month: 'Mar', followers: 7800, engagement: 7200 },
      { month: 'Apr', followers: 9500, engagement: 8900 },
      { month: 'May', followers: 11500, engagement: 10800 },
      { month: 'Jun', followers: 14000, engagement: 13200 },
    ],
  },
  platformPerformance: [
    { platform: 'Instagram', reach: 85000, engagement: 4200, conversions: 85 },
    { platform: 'LinkedIn', reach: 65000, engagement: 3800, conversions: 95 },
    { platform: 'Facebook', reach: 75000, engagement: 3100, conversions: 45 },
    { platform: 'Twitter', reach: 35000, engagement: 1200, conversions: 12 },
    { platform: 'Email', reach: 25000, engagement: 950, conversions: 8 },
  ],
};

export const loadDemoData = () => {
  // Load demo business profile
  localStorage.setItem('multimax_profile_demo-user', JSON.stringify(demoBusinessProfile));
  
  // Load demo campaigns
  localStorage.setItem('multimax_campaigns_demo-user', JSON.stringify(demoCampaigns));
  
  // Load demo content
  localStorage.setItem('multimax_content_demo-user', JSON.stringify(demoContent));
  
  console.log('Demo data loaded successfully');
};

export const clearDemoData = () => {
  localStorage.removeItem('multimax_profile_demo-user');
  localStorage.removeItem('multimax_campaigns_demo-user');
  localStorage.removeItem('multimax_content_demo-user');
  console.log('Demo data cleared');
};

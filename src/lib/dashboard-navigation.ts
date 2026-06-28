export const dashboardNavigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    keywords: ['home', 'overview', 'metrics', 'summary'],
  },
  {
    name: 'Business Profile',
    href: '/dashboard/business-profile',
    icon: 'Building2',
    keywords: ['company', 'industry', 'audience', 'budget', 'goals', 'profile'],
  },
  {
    name: 'AI Marketing Audit',
    href: '/dashboard/marketing-audit',
    icon: 'Award',
    keywords: ['audit', 'score', 'swot', 'roadmap', 'budget', 'roi'],
  },
  {
    name: 'AI Growth Roadmap',
    href: '/dashboard/growth-roadmap',
    icon: 'Map',
    keywords: ['growth', 'roadmap', '90 day', 'month', 'strategy', 'advisor'],
  },
  {
    name: 'Competitor Analyzer',
    href: '/dashboard/competitor-analyzer',
    icon: 'Search',
    keywords: ['competitor', 'seo', 'pricing', 'ads', 'market'],
  },
  {
    name: 'Customer Personas',
    href: '/dashboard/customer-personas',
    icon: 'Users',
    keywords: ['persona', 'buyer', 'customer', 'audience', 'segments'],
  },
  {
    name: 'AI Campaign Calendar',
    href: '/dashboard/campaign-calendar',
    icon: 'CalendarDays',
    keywords: ['calendar', '30 day', 'posts', 'email', 'ads', 'csv'],
  },
  {
    name: 'Automation Center',
    href: '/dashboard/automation-center',
    icon: 'Workflow',
    keywords: ['workflow', 'automation', 'generate strategy', 'process'],
  },
  {
    name: 'Marketing Health Score',
    href: '/dashboard/health-score',
    icon: 'HeartPulse',
    keywords: ['health', 'score', 'seo', 'content', 'website', 'email'],
  },
  {
    name: 'Trend Discovery',
    href: '/dashboard/trend-discovery',
    icon: 'Compass',
    keywords: ['trends', 'hashtags', 'keywords', 'festivals', 'viral'],
  },
  {
    name: 'Export Center',
    href: '/dashboard/export-center',
    icon: 'FileDown',
    keywords: ['export', 'pdf', 'docx', 'csv', 'report'],
  },
  {
    name: 'AI Business Analyzer',
    href: '/dashboard/analyzer',
    icon: 'Brain',
    keywords: ['business', 'analysis', 'strategy', 'swot', 'summary'],
  },
  {
    name: 'Content Generator',
    href: '/dashboard/content-generator',
    icon: 'PenTool',
    keywords: ['content', 'instagram', 'facebook', 'linkedin', 'email', 'blog', 'ads'],
  },
  {
    name: 'Campaign Planner',
    href: '/dashboard/campaign-planner',
    icon: 'Calendar',
    keywords: ['campaign', 'plan', 'launch', 'festival', 'checklist'],
  },
  {
    name: 'ROI Predictor',
    href: '/dashboard/roi-predictor',
    icon: 'TrendingUp',
    keywords: ['roi', 'prediction', 'sales', 'conversions', 'cpc', 'ctr'],
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: 'BarChart3',
    keywords: ['analytics', 'charts', 'revenue', 'ctr', 'cpa', 'performance'],
  },
  {
    name: 'AI Assistant',
    href: '/dashboard/assistant',
    icon: 'MessageSquare',
    keywords: ['assistant', 'chat', 'cmo', 'executive', 'advice'],
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: 'Settings',
    keywords: ['settings', 'account', 'preferences'],
  },
];

export type DashboardNavItem = (typeof dashboardNavigation)[number];

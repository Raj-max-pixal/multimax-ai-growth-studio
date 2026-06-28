'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const campaignSummary = [
  { name: 'Jan', campaigns: 4, budget: 5000, roi: 120 },
  { name: 'Feb', campaigns: 5, budget: 6000, roi: 145 },
  { name: 'Mar', campaigns: 6, budget: 7000, roi: 180 },
  { name: 'Apr', campaigns: 5, budget: 6500, roi: 165 },
  { name: 'May', campaigns: 7, budget: 8000, roi: 195 },
  { name: 'Jun', campaigns: 8, budget: 9000, roi: 220 },
];

const contentGenerated = [
  { name: 'Instagram', value: 45 },
  { name: 'Facebook', value: 38 },
  { name: 'LinkedIn', value: 28 },
  { name: 'Twitter', value: 22 },
  { name: 'Blog', value: 15 },
  { name: 'Email', value: 12 },
];

const performanceData = [
  { name: 'Week 1', engagement: 4000, reach: 12000, conversions: 85 },
  { name: 'Week 2', engagement: 5200, reach: 15000, conversions: 110 },
  { name: 'Week 3', engagement: 4800, reach: 14000, conversions: 95 },
  { name: 'Week 4', engagement: 6100, reach: 18000, conversions: 130 },
];

const growthTrend = [
  { name: 'Jan', followers: 5000, engagement: 4500 },
  { name: 'Feb', followers: 6200, engagement: 5800 },
  { name: 'Mar', followers: 7800, engagement: 7200 },
  { name: 'Apr', followers: 9500, engagement: 8900 },
  { name: 'May', followers: 11500, engagement: 10800 },
  { name: 'Jun', followers: 14000, engagement: 13200 },
];

const recommendations = [
  { id: 1, type: 'Optimization', title: 'Increase Instagram posting frequency', description: 'Your Instagram engagement is 25% higher than other platforms. Consider posting daily to maximize reach.' },
  { id: 2, type: 'Budget', title: 'Allocate more budget to LinkedIn', description: 'LinkedIn campaigns show 30% higher ROI. Consider shifting 15% of budget from Facebook to LinkedIn.' },
  { id: 3, type: 'Content', title: 'Focus on video content', description: 'Video posts receive 2x more engagement. Create more short-form video content for better results.' },
  { id: 4, type: 'Timing', title: 'Optimize posting schedule', description: 'Your audience is most active between 6-9 PM. Schedule important posts during these hours.' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track your marketing performance and growth
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">160</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
              +18% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">285K</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
              +24% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">171%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowDownRight className="h-3 w-3 mr-1 text-red-600" />
              -3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Summary Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Summary</CardTitle>
          <CardDescription>
            Monthly campaign performance overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={campaignSummary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="roi" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Content Generated Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
            <CardDescription>
              Content generated by platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contentGenerated}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
            <CardDescription>
            Engagement, reach, and conversions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="engagement" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="reach" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="conversions" stroke="#ffc658" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Growth Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Trend</CardTitle>
          <CardDescription>
            Followers and engagement growth over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={growthTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="followers" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              <Area type="monotone" dataKey="engagement" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle>AI Recommendations</CardTitle>
          </div>
          <CardDescription>
            Personalized suggestions to improve your marketing performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {rec.type}
                    </span>
                    <h4 className="font-semibold">{rec.title}</h4>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

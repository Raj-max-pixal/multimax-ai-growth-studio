'use client';

import { useEffect, useState } from 'react';
import { Compass, Hash, CalendarDays, Lightbulb, Search, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getBusinessProfile } from '@/services/businessProfile';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/toast';
import { extractJsonObject, generateContent } from '@/lib/gemini';
import { LoadingSpinner } from '@/components/loading-spinner';

interface TrendReport {
  trendingHashtags: string[];
  trendingKeywords: string[];
  trendingTopics: string[];
  upcomingFestivals: string[];
  seasonalCampaigns: string[];
  viralContentIdeas: string[];
  marketingOpportunities: string[];
  nextBestAction: string;
}

export default function TrendDiscoveryPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [report, setReport] = useState<TrendReport | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const data = await getBusinessProfile(user.uid);
      setProfile(data);
    };

    loadProfile();
  }, [user]);

  const discoverTrends = async () => {
    setLoading(true);
    try {
      const context = profile ? `
Business Name: ${profile.businessName}
Industry: ${profile.industry}
Products/Services: ${profile.products}
Target Audience: ${profile.targetAudience}
Marketing Goals: ${profile.marketingGoals}
Monthly Budget: ${profile.monthlyBudget}
` : 'Use a practical startup marketing context.';

      const prompt = `You are an AI trend strategist. Find high-potential marketing trends for this business:

${context}

Return only valid JSON in this exact shape:
{
  "trendingHashtags": ["10 hashtags"],
  "trendingKeywords": ["10 search keywords"],
  "trendingTopics": ["8 content topics"],
  "upcomingFestivals": ["5 relevant festivals, holidays, or seasonal moments"],
  "seasonalCampaigns": ["5 campaign ideas"],
  "viralContentIdeas": ["8 short-form content ideas"],
  "marketingOpportunities": ["7 growth opportunities"],
  "nextBestAction": "one immediate action"
}`;

      const response = await generateContent(prompt);
      setReport(extractJsonObject<TrendReport>(response));
      showToast('success', 'Trend report generated');
    } catch (error) {
      console.error('Error discovering trends:', error);
      showToast('error', 'Failed to generate trend report');
    } finally {
      setLoading(false);
    }
  };

  const sections = report ? [
    { title: 'Trending Hashtags', icon: Hash, items: report.trendingHashtags },
    { title: 'Trending Keywords', icon: Search, items: report.trendingKeywords },
    { title: 'Trending Topics', icon: TrendingUp, items: report.trendingTopics },
    { title: 'Upcoming Moments', icon: CalendarDays, items: report.upcomingFestivals },
    { title: 'Seasonal Campaigns', icon: Compass, items: report.seasonalCampaigns },
    { title: 'Viral Content Ideas', icon: Zap, items: report.viralContentIdeas },
    { title: 'Marketing Opportunities', icon: Lightbulb, items: report.marketingOpportunities },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Compass className="h-8 w-8 text-primary" />
            AI Trend Discovery
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover timely hashtags, keywords, topics, and campaign opportunities.
          </p>
        </div>
        <Button onClick={discoverTrends} disabled={loading}>
          {loading ? <LoadingSpinner /> : <SparkButtonIcon />}
          Discover Trends
        </Button>
      </div>

      {!report ? (
        <Card>
          <CardHeader>
            <CardTitle>Trend Intelligence</CardTitle>
            <CardDescription>
              Generate a current opportunity map tailored to your business profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={discoverTrends} disabled={loading} className="w-full" size="lg">
              {loading ? <LoadingSpinner /> : <Compass className="mr-2 h-5 w-5" />}
              Generate Trend Report
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>Next Best Action</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{report.nextBestAction}</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <section.icon className="h-5 w-5 text-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {section.items.map((item) => (
                      <span key={item} className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                        {item}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SparkButtonIcon() {
  return <Compass className="mr-2 h-4 w-4" />;
}

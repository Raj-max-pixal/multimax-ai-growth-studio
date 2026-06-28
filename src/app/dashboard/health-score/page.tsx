'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getBusinessProfile } from '@/services/businessProfile';
import { extractJsonObject, generateContent } from '@/lib/gemini';
import { LoadingSpinner } from '@/components/loading-spinner';
import { 
  HeartPulse,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Globe,
  FileText,
  Share2,
  Mail,
  Users,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

interface HealthScore {
  overall: number;
  categories: {
    branding: { score: number; issues: string[]; recommendations: string[] };
    seo: { score: number; issues: string[]; recommendations: string[] };
    content: { score: number; issues: string[]; recommendations: string[] };
    ads: { score: number; issues: string[]; recommendations: string[] };
    socialMedia: { score: number; issues: string[]; recommendations: string[] };
    website: { score: number; issues: string[]; recommendations: string[] };
    emailMarketing: { score: number; issues: string[]; recommendations: string[] };
    customerEngagement: { score: number; issues: string[]; recommendations: string[] };
  };
  topPriorities: Array<{
    category: string;
    issue: string;
    recommendation: string;
    impact: 'High' | 'Medium' | 'Low';
  }>;
}

export default function HealthScorePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const data = await getBusinessProfile(user.uid);
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, [user]);

  const calculateHealthScore = async () => {
    setLoading(true);
    try {
      const businessContext = profile ? `
Business Name: ${profile.businessName}
Industry: ${profile.industry}
Products/Services: ${profile.products}
Target Audience: ${profile.targetAudience}
Marketing Goals: ${profile.marketingGoals}
Monthly Budget: ${profile.monthlyBudget}
      ` : 'No business profile available. Generate generic health score.';

      const prompt = `As a marketing consultant and auditor, conduct a comprehensive marketing health assessment for this business:

${businessContext}

Evaluate the business across 8 marketing categories and provide a health score (0-100) for each:

1. Branding - Visual identity, brand consistency, brand awareness
2. SEO - Search engine optimization, keywords, technical SEO
3. Content - Content quality, consistency, engagement
4. Ads - Advertising performance, ROI, targeting
5. Social Media - Presence, engagement, growth
6. Website - UX, performance, conversion
7. Email Marketing - List health, open rates, engagement
8. Customer Engagement - Customer satisfaction, retention, loyalty

Provide the analysis in the following JSON format:
{
  "overall": number (0-100),
  "categories": {
    "branding": {
      "score": number (0-100),
      "issues": ["3 specific issues"],
      "recommendations": ["3 actionable recommendations"]
    },
    "seo": {
      "score": number (0-100),
      "issues": ["3 specific issues"],
      "recommendations": ["3 actionable recommendations"]
    },
    "content": {
      "score": number (0-100),
      "issues": ["3 specific issues"],
      "recommendations": ["3 actionable recommendations"]
    },
    "ads": {
      "score": number (0-100),
      "issues": ["3 specific issues"],
      "recommendations": ["3 actionable recommendations"]
    },
    "socialMedia": {
      "score": number (0-100),
      "issues": ["3 specific issues"],
      "recommendations": ["3 actionable recommendations"]
    },
    "website": {
      "score": number (0-100),
      "issues": ["3 specific issues"],
      "recommendations": ["3 actionable recommendations"]
    },
    "emailMarketing": {
      "score": number (0-100),
      "issues": ["3 specific issues"],
      "recommendations": ["3 actionable recommendations"]
    },
    "customerEngagement": {
      "score": number (0-100),
      "issues": ["3 specific issues"],
      "recommendations": ["3 actionable recommendations"]
    }
  },
  "topPriorities": [
    {
      "category": "category name",
      "issue": "specific issue",
      "recommendation": "actionable recommendation",
      "impact": "High/Medium/Low"
    }
  ] (5 top priorities)
}

Be realistic in your assessment. If no specific data is available, assume common issues for businesses in this industry. Focus on actionable insights that can drive real improvement.`;

      const response = await generateContent(prompt);
      const result = extractJsonObject<HealthScore>(response);
      setHealthScore(result);
      showToast('success', 'Marketing health score calculated!');
    } catch (error) {
      console.error('Error calculating health score:', error);
      showToast('error', 'Failed to calculate health score');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  const categoryIcons = {
    branding: <Target className="h-5 w-5" />,
    seo: <Globe className="h-5 w-5" />,
    content: <FileText className="h-5 w-5" />,
    ads: <TrendingUp className="h-5 w-5" />,
    socialMedia: <Share2 className="h-5 w-5" />,
    website: <Globe className="h-5 w-5" />,
    emailMarketing: <Mail className="h-5 w-5" />,
    customerEngagement: <Users className="h-5 w-5" />,
  };

  const categoryNames = {
    branding: 'Branding',
    seo: 'SEO',
    content: 'Content',
    ads: 'Advertising',
    socialMedia: 'Social Media',
    website: 'Website',
    emailMarketing: 'Email Marketing',
    customerEngagement: 'Customer Engagement',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <HeartPulse className="h-8 w-8 text-primary" />
          Marketing Health Score
        </h1>
        <p className="text-muted-foreground mt-2">
          Get a comprehensive health assessment of your marketing across all channels
        </p>
      </div>

      {!healthScore ? (
        <Card>
          <CardHeader>
            <CardTitle>Calculate Marketing Health Score</CardTitle>
            <CardDescription>
              AI will analyze your marketing across 8 categories and provide actionable recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={calculateHealthScore} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Analyzing...
                </>
              ) : (
                <>
                  <HeartPulse className="mr-2 h-5 w-5" />
                  Calculate Health Score
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Overall Marketing Health Score</span>
                <div className="flex items-center gap-3">
                  {getScoreIcon(healthScore.overall)}
                  <div className={`text-5xl font-bold ${getScoreColor(healthScore.overall)}`}>
                    {healthScore.overall}/100
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getScoreBg(healthScore.overall)} transition-all duration-1000`}
                  style={{ width: `${healthScore.overall}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Category Scores */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(healthScore.categories).map(([key, category]) => (
              <Card key={key} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {categoryIcons[key as keyof typeof categoryIcons]}
                      <CardTitle className="text-sm">{categoryNames[key as keyof typeof categoryNames]}</CardTitle>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                      {category.score}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getScoreBg(category.score)} transition-all duration-1000`}
                      style={{ width: `${category.score}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Top Priorities */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Top 5 Priority Actions
              </CardTitle>
              <CardDescription>
                Focus on these high-impact improvements first
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthScore.topPriorities.map((priority, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{priority.category}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          priority.impact === 'High' ? 'bg-red-100 text-red-700' :
                          priority.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {priority.impact} Impact
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">{priority.issue}</div>
                      <div className="text-sm font-medium">{priority.recommendation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Category Analysis */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Detailed Analysis</h2>
            {Object.entries(healthScore.categories).map(([key, category]) => (
              <Card key={key}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {categoryIcons[key as keyof typeof categoryIcons]}
                      <CardTitle>{categoryNames[key as keyof typeof categoryNames]}</CardTitle>
                    </div>
                    <div className={`text-3xl font-bold ${getScoreColor(category.score)}`}>
                      {category.score}/100
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="font-semibold mb-2 flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        Issues
                      </div>
                      <ul className="space-y-1 text-sm">
                        {category.issues.map((issue, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-red-500">•</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold mb-2 flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Recommendations
                      </div>
                      <ul className="space-y-1 text-sm">
                        {category.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <ArrowRight className="h-3 w-3 mt-1 flex-shrink-0 text-green-500" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button onClick={() => setHealthScore(null)} variant="outline" className="w-full">
            Recalculate Health Score
          </Button>
        </div>
      )}
    </div>
  );
}

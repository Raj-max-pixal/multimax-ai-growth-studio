'use client';

import { useState } from 'react';
import { useToast } from '@/components/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { extractJsonObject, generateContent } from '@/lib/gemini';
import { LoadingSpinner } from '@/components/loading-spinner';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Globe,
  Share2,
  DollarSign,
  Users,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface CompetitorAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  marketingChannels: Array<{
    channel: string;
    presence: string;
    effectiveness: string;
  }>;
  seoAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
  };
  socialMediaStrategy: {
    platforms: string[];
    contentStrategy: string;
    engagementRate: string;
  };
  advertisingStrategy: {
    platforms: string[];
    estimatedSpend: string;
    keyMessages: string[];
  };
  pricingStrategy: {
    positioning: string;
    priceRange: string;
    valueProposition: string;
  };
  recommendations: string[];
  opportunities: string[];
}

export default function CompetitorAnalyzerPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [competitorInput, setCompetitorInput] = useState('');
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null);

  const analyzeCompetitor = async () => {
    if (!competitorInput.trim()) {
      showToast('error', 'Please enter a company name or website URL');
      return;
    }

    setLoading(true);
    try {
      const prompt = `As a competitive intelligence expert and marketing analyst, conduct a comprehensive competitor analysis for: ${competitorInput}

Provide a detailed analysis in the following JSON format:
{
  "summary": "2-3 sentence overview of the competitor",
  "strengths": ["5 key strengths"],
  "weaknesses": ["5 key weaknesses"],
  "marketingChannels": [
    {
      "channel": "channel name",
      "presence": "strong/medium/weak",
      "effectiveness": "description of effectiveness"
    }
  ],
  "seoAnalysis": {
    "strengths": ["3 SEO strengths"],
    "weaknesses": ["3 SEO weaknesses"],
    "opportunities": ["3 SEO opportunities"]
  },
  "socialMediaStrategy": {
    "platforms": ["platform1", "platform2", "platform3"],
    "contentStrategy": "description of their content approach",
    "engagementRate": "estimated engagement rate"
  },
  "advertisingStrategy": {
    "platforms": ["ad platform1", "ad platform2"],
    "estimatedSpend": "estimated monthly ad spend range",
    "keyMessages": ["3 key advertising messages"]
  },
  "pricingStrategy": {
    "positioning": "premium/mid-market/budget",
    "priceRange": "price range description",
    "valueProposition": "their main value proposition"
  },
  "recommendations": ["5 actionable recommendations to compete with them"],
  "opportunities": ["5 market opportunities they're missing"]
}

Be specific, professional, and provide actionable insights. Focus on areas where we can differentiate and win.`;

      const response = await generateContent(prompt);
      const result = extractJsonObject<CompetitorAnalysis>(response);
      setAnalysis(result);
      showToast('success', 'Competitor analysis completed!');
    } catch (error) {
      console.error('Error analyzing competitor:', error);
      showToast('error', 'Failed to analyze competitor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Search className="h-8 w-8 text-primary" />
          Competitor Analyzer
        </h1>
        <p className="text-muted-foreground mt-2">
          Analyze your competitors and discover opportunities to outperform them
        </p>
      </div>

      {!analysis ? (
        <Card>
          <CardHeader>
            <CardTitle>Enter Competitor Information</CardTitle>
            <CardDescription>
              Enter a company name or website URL to analyze their marketing strategy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="competitor">Company Name or Website URL *</Label>
              <Input
                id="competitor"
                value={competitorInput}
                onChange={(e) => setCompetitorInput(e.target.value)}
                placeholder="e.g., competitor.com or Competitor Inc."
              />
            </div>
            <Button 
              onClick={analyzeCompetitor} 
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
                  <Search className="mr-2 h-5 w-5" />
                  Analyze Competitor
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{analysis.summary}</p>
            </CardContent>
          </Card>

          {/* Strengths & Weaknesses */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <TrendingDown className="h-5 w-5" />
                  Weaknesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Marketing Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Marketing Channels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.marketingChannels.map((channel, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-semibold">{channel.channel}</div>
                      <div className="text-sm text-muted-foreground">{channel.effectiveness}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      channel.presence === 'strong' ? 'bg-green-100 text-green-700' :
                      channel.presence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {channel.presence}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SEO Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                SEO Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="font-semibold text-green-600">Strengths</h3>
                  <ul className="space-y-1 text-sm">
                    {analysis.seoAnalysis.strengths.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-red-600">Weaknesses</h3>
                  <ul className="space-y-1 text-sm">
                    {analysis.seoAnalysis.weaknesses.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-blue-600">Opportunities</h3>
                  <ul className="space-y-1 text-sm">
                    {analysis.seoAnalysis.opportunities.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Social Media Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold mb-2">Platforms</div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.socialMediaStrategy.platforms.map((platform, i) => (
                      <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-2">Content Strategy</div>
                  <p className="text-sm text-muted-foreground">{analysis.socialMediaStrategy.contentStrategy}</p>
                </div>
                <div>
                  <div className="font-semibold mb-2">Engagement Rate</div>
                  <p className="text-sm text-muted-foreground">{analysis.socialMediaStrategy.engagementRate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advertising Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Advertising Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold mb-2">Ad Platforms</div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.advertisingStrategy.platforms.map((platform, i) => (
                      <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-2">Estimated Monthly Spend</div>
                  <p className="text-sm text-muted-foreground">{analysis.advertisingStrategy.estimatedSpend}</p>
                </div>
                <div>
                  <div className="font-semibold mb-2">Key Messages</div>
                  <ul className="space-y-1 text-sm">
                    {analysis.advertisingStrategy.keyMessages.map((message, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ArrowRight className="h-3 w-3 mt-1 flex-shrink-0" />
                        {message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Pricing Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Positioning</div>
                  <div className="font-semibold">{analysis.pricingStrategy.positioning}</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Price Range</div>
                  <div className="font-semibold">{analysis.pricingStrategy.priceRange}</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Value Proposition</div>
                  <div className="font-semibold">{analysis.pricingStrategy.valueProposition}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Opportunities */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Market Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.opportunities.map((opp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    {opp}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Button onClick={() => setAnalysis(null)} variant="outline" className="w-full">
            Analyze Another Competitor
          </Button>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getBusinessProfile } from '@/services/businessProfile';
import { generateMarketingContent } from '@/lib/gemini';
import { Brain, Loader2, Copy, Download } from 'lucide-react';

export default function AnalyzerPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [analysis, setAnalysis] = useState({
    swot: '',
    persona: '',
    strategy: '',
    opportunities: '',
    competitors: '',
    summary: '',
  });

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;
      try {
        const profile = await getBusinessProfile(user.uid);
        setHasProfile(!!profile);
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    };

    checkProfile();
  }, [user]);

  const generateAnalysis = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const profile = await getBusinessProfile(user.uid);
      if (!profile) {
        showToast('error', 'Please complete your business profile first');
        return;
      }

      const context = `
        Business Name: ${profile.businessName}
        Industry: ${profile.industry}
        Products: ${profile.products}
        Target Audience: ${profile.targetAudience}
        Monthly Budget: ${profile.monthlyBudget}
        Marketing Goals: ${profile.marketingGoals}
      `;

      const [swot, persona, strategy, opportunities, competitors, summary] = await Promise.all([
        generateMarketingContent('SWOT Analysis', context),
        generateMarketingContent('Customer Persona', context),
        generateMarketingContent('Marketing Strategy', context),
        generateMarketingContent('Growth Opportunities', context),
        generateMarketingContent('Competitor Suggestions', context),
        generateMarketingContent('Business Summary', context),
      ]);

      setAnalysis({ swot, persona, strategy, opportunities, competitors, summary });
    } catch (error) {
      console.error('Error generating analysis:', error);
      showToast('error', 'Failed to generate analysis. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!hasProfile) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Business Analyzer</h1>
          <p className="text-muted-foreground mt-2">
            Complete your business profile to unlock AI-powered analysis
          </p>
        </div>
        <Card className="p-8">
          <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Profile Required</h3>
          <p className="text-muted-foreground mb-6">
            To generate personalized business analysis, we need information about your business.
          </p>
          <Button onClick={() => window.location.href = '/dashboard/business-profile'}>
            Complete Business Profile
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Business Analyzer</h1>
          <p className="text-muted-foreground">
            Get comprehensive insights about your business with AI-powered analysis
          </p>
        </div>
        <Button onClick={generateAnalysis} disabled={generating} size="lg">
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Generate Analysis
            </>
          )}
        </Button>
      </div>

      {Object.values(analysis).some(value => value) && (
        <Tabs defaultValue="swot" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="swot">SWOT</TabsTrigger>
            <TabsTrigger value="persona">Persona</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="swot" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>SWOT Analysis</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(analysis.swot)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Strengths, Weaknesses, Opportunities, and Threats analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {analysis.swot || 'Click "Generate Analysis" to create SWOT analysis'}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="persona" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Customer Persona</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(analysis.persona)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Detailed profile of your ideal customer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {analysis.persona || 'Click "Generate Analysis" to create customer persona'}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategy" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Marketing Strategy</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(analysis.strategy)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Comprehensive marketing strategy recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {analysis.strategy || 'Click "Generate Analysis" to create marketing strategy'}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Growth Opportunities</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(analysis.opportunities)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Potential areas for business growth and expansion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {analysis.opportunities || 'Click "Generate Analysis" to identify growth opportunities'}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitors" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Competitor Suggestions</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(analysis.competitors)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Analysis of competitors and competitive positioning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {analysis.competitors || 'Click "Generate Analysis" to analyze competitors'}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Business Summary</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(analysis.summary)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Executive summary of your business analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {analysis.summary || 'Click "Generate Analysis" to create business summary'}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {!Object.values(analysis).some(value => value) && !generating && (
        <Card className="p-12 text-center">
          <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
          <p className="text-muted-foreground mb-6">
            Click &quot;Generate Analysis&quot; to get comprehensive insights about your business
          </p>
        </Card>
      )}
    </div>
  );
}

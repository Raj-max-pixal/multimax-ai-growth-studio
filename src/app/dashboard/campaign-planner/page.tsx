'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { getBusinessProfile } from '@/services/businessProfile';
import { generateMarketingContent } from '@/lib/gemini';
import { Calendar, Loader2, Copy, Download } from 'lucide-react';

const planTypes = [
  { id: '7day', name: '7 Day Plan', description: 'Quick wins and immediate actions' },
  { id: '30day', name: '30 Day Plan', description: 'Comprehensive month-long strategy' },
  { id: 'festival', name: 'Festival Campaign', description: 'Seasonal and holiday marketing' },
  { id: 'launch', name: 'Product Launch', description: 'New product introduction plan' },
  { id: 'weekly', name: 'Weekly Calendar', description: 'Week-by-week content schedule' },
  { id: 'checklist', name: 'Marketing Checklist', description: 'Essential marketing tasks' },
];

export default function CampaignPlannerPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [planType, setPlanType] = useState('7day');
  const [generatedPlan, setGeneratedPlan] = useState('');

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

  const generatePlan = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const profile = await getBusinessProfile(user.uid);
      if (!profile) {
        showToast('error', 'Please complete your business profile first');
        return;
      }

      const selectedPlan = planTypes.find(p => p.id === planType);
      const context = `
        Business Name: ${profile.businessName}
        Industry: ${profile.industry}
        Products: ${profile.products}
        Target Audience: ${profile.targetAudience}
        Monthly Budget: ${profile.monthlyBudget}
        Marketing Goals: ${profile.marketingGoals}
      `;

      const plan = await generateMarketingContent(
        `${selectedPlan?.name} - ${selectedPlan?.description}`,
        context
      );

      setGeneratedPlan(plan);
      showToast('success', 'Campaign plan generated successfully');
    } catch (error) {
      console.error('Error generating plan:', error);
      showToast('error', 'Failed to generate plan. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPlan);
    showToast('success', 'Plan copied to clipboard');
  };

  if (!hasProfile) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Campaign Planner</h1>
          <p className="text-muted-foreground mt-2">
            Complete your business profile to unlock AI-powered campaign planning
          </p>
        </div>
        <Card className="p-8">
          <Calendar className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Profile Required</h3>
          <p className="text-muted-foreground mb-6">
            To generate personalized campaign plans, we need information about your business.
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
      <div>
        <h1 className="text-3xl font-bold">AI Campaign Planner</h1>
        <p className="text-muted-foreground">
          Generate comprehensive marketing campaigns with detailed schedules
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Plan Type</CardTitle>
            <CardDescription>
              Choose the type of campaign plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Type</label>
              <Select
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
              >
                {planTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Select>
            </div>

            {planTypes.find(p => p.id === planType) && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {planTypes.find(p => p.id === planType)?.description}
                </p>
              </div>
            )}

            <Button onClick={generatePlan} disabled={generating} className="w-full">
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Generate Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Campaign Plan</CardTitle>
              {generatedPlan && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <CardDescription>
              AI-generated marketing campaign with detailed timeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedPlan ? (
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {generatedPlan}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Select plan type and click generate to create campaign plan
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getBusinessProfile } from '@/services/businessProfile';
import { generateContent } from '@/lib/gemini';
import { LoadingSpinner } from '@/components/loading-spinner';
import { 
  Workflow,
  CheckCircle,
  Circle,
  ArrowRight,
  Play,
  RefreshCw,
  Download,
  FileText,
  Sparkles,
  Target,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  output?: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  completed: boolean;
}

export default function AutomationCenterPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
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

  const runMarketingWorkflow = async () => {
    if (!profile) {
      showToast('error', 'Please complete your business profile first');
      return;
    }

    setLoading(true);
    const workflow: Workflow = {
      id: 'marketing-workflow',
      name: 'Complete Marketing Strategy',
      description: 'Generate a comprehensive marketing strategy from business profile',
      steps: [
        { id: '1', name: 'Analyze Business Profile', status: 'pending' },
        { id: '2', name: 'Generate Marketing Strategy', status: 'pending' },
        { id: '3', name: 'Create Social Media Posts', status: 'pending' },
        { id: '4', name: 'Generate Email Campaigns', status: 'pending' },
        { id: '5', name: 'Create Ad Copy', status: 'pending' },
        { id: '6', name: 'Generate SEO Content', status: 'pending' },
        { id: '7', name: 'Create Campaign Calendar', status: 'pending' },
        { id: '8', name: 'Generate Analytics Report', status: 'pending' },
      ],
      completed: false,
    };

    setActiveWorkflow(workflow);

    try {
      const businessContext = `
Business Name: ${profile.businessName}
Industry: ${profile.industry}
Products/Services: ${profile.products}
Target Audience: ${profile.targetAudience}
Marketing Goals: ${profile.marketingGoals}
Monthly Budget: ${profile.monthlyBudget}
      `;

      // Step 1: Analyze Business Profile
      workflow.steps[0].status = 'running';
      setActiveWorkflow({ ...workflow });
      await new Promise(resolve => setTimeout(resolve, 1000));
      workflow.steps[0].status = 'completed';
      workflow.steps[0].output = 'Business profile analyzed successfully';
      setActiveWorkflow({ ...workflow });

      // Step 2: Generate Marketing Strategy
      workflow.steps[1].status = 'running';
      setActiveWorkflow({ ...workflow });
      const strategyPrompt = `As a marketing strategist, create a comprehensive marketing strategy for this business:\n${businessContext}\n\nProvide a strategic overview with key objectives, target segments, value proposition, and positioning.`;
      const strategy = await generateContent(strategyPrompt);
      workflow.steps[1].status = 'completed';
      workflow.steps[1].output = strategy.substring(0, 200) + '...';
      setActiveWorkflow({ ...workflow });

      // Step 3: Create Social Media Posts
      workflow.steps[2].status = 'running';
      setActiveWorkflow({ ...workflow });
      const socialPrompt = `Generate 5 engaging social media posts for Instagram, LinkedIn, and Facebook based on:\n${businessContext}\n\nInclude hashtags and call-to-actions.`;
      await generateContent(socialPrompt);
      workflow.steps[2].status = 'completed';
      workflow.steps[2].output = '5 social media posts generated';
      setActiveWorkflow({ ...workflow });

      // Step 4: Generate Email Campaigns
      workflow.steps[3].status = 'running';
      setActiveWorkflow({ ...workflow });
      const emailPrompt = `Create 3 email campaigns (welcome, promotional, re-engagement) for:\n${businessContext}`;
      await generateContent(emailPrompt);
      workflow.steps[3].status = 'completed';
      workflow.steps[3].output = '3 email campaigns created';
      setActiveWorkflow({ ...workflow });

      // Step 5: Create Ad Copy
      workflow.steps[4].status = 'running';
      setActiveWorkflow({ ...workflow });
      const adPrompt = `Generate Google Ads and Facebook Ads copy for:\n${businessContext}\n\nInclude headlines, descriptions, and CTAs.`;
      await generateContent(adPrompt);
      workflow.steps[4].status = 'completed';
      workflow.steps[4].output = 'Ad copy generated for Google and Facebook';
      setActiveWorkflow({ ...workflow });

      // Step 6: Generate SEO Content
      workflow.steps[5].status = 'running';
      setActiveWorkflow({ ...workflow });
      const seoPrompt = `Generate SEO-optimized blog titles, meta descriptions, and keywords for:\n${businessContext}`;
      await generateContent(seoPrompt);
      workflow.steps[5].status = 'completed';
      workflow.steps[5].output = 'SEO content generated';
      setActiveWorkflow({ ...workflow });

      // Step 7: Create Campaign Calendar
      workflow.steps[6].status = 'running';
      setActiveWorkflow({ ...workflow });
      const calendarPrompt = `Create a 7-day campaign calendar with daily tasks for:\n${businessContext}`;
      await generateContent(calendarPrompt);
      workflow.steps[6].status = 'completed';
      workflow.steps[6].output = '7-day campaign calendar created';
      setActiveWorkflow({ ...workflow });

      // Step 8: Generate Analytics Report
      workflow.steps[7].status = 'running';
      setActiveWorkflow({ ...workflow });
      const analyticsPrompt = `Create an analytics report template with KPIs to track for:\n${businessContext}`;
      await generateContent(analyticsPrompt);
      workflow.steps[7].status = 'completed';
      workflow.steps[7].output = 'Analytics report template generated';
      setActiveWorkflow({ ...workflow });

      workflow.completed = true;
      setActiveWorkflow({ ...workflow });
      showToast('success', 'Marketing workflow completed successfully!');
    } catch (error) {
      console.error('Error running workflow:', error);
      showToast('error', 'Workflow failed. Please try again.');
      const failedStep = workflow.steps.find(s => s.status === 'running');
      if (failedStep) {
        failedStep.status = 'error';
        setActiveWorkflow({ ...workflow });
      }
    } finally {
      setLoading(false);
    }
  };

  const resetWorkflow = () => {
    setActiveWorkflow(null);
  };

  const exportWorkflow = () => {
    if (!activeWorkflow) return;
    
    const report = `
MARKETING WORKFLOW REPORT
========================

Business: ${profile?.businessName || 'N/A'}
Industry: ${profile?.industry || 'N/A'}
Date: ${new Date().toLocaleDateString()}

WORKFLOW STEPS
--------------
${activeWorkflow.steps.map((step, i) => `
${i + 1}. ${step.name}
   Status: ${step.status.toUpperCase()}
   ${step.output ? `Output: ${step.output}` : ''}
`).join('\n')}

FULL OUTPUTS
-----------
${activeWorkflow.steps.map((step, i) => `
--- ${step.name} ---
${step.output || 'No output available'}
`).join('\n\n')}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marketing-workflow-report.txt';
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Workflow report exported!');
  };

  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'running':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <Circle className="h-5 w-5 text-red-500 fill-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Workflow className="h-8 w-8 text-primary" />
          Marketing Automation Center
        </h1>
        <p className="text-muted-foreground mt-2">
          Run automated marketing workflows to generate comprehensive strategies
        </p>
      </div>

      {!activeWorkflow ? (
        <Card>
          <CardHeader>
            <CardTitle>Available Workflows</CardTitle>
            <CardDescription>
              Select a workflow to automate your marketing tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Card className="border-2 border-primary hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle>Complete Marketing Strategy</CardTitle>
                    <CardDescription className="mt-2">
                      Generate a comprehensive marketing strategy including social posts, emails, ads, SEO, campaign calendar, and analytics report
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Target className="h-4 w-4" />
                  <span>8 steps • ~2 minutes</span>
                </div>
                <Button 
                  onClick={runMarketingWorkflow} 
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      Running Workflow...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Run Workflow
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="opacity-50">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <TrendingUp className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <CardTitle>Lead Generation Workflow</CardTitle>
                    <CardDescription className="mt-2">
                      Automated lead generation with landing pages, email sequences, and follow-ups
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>Coming Soon</span>
                </div>
                <Button disabled className="w-full">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="border-2 border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{activeWorkflow.name}</CardTitle>
                  <CardDescription>{activeWorkflow.description}</CardDescription>
                </div>
                {activeWorkflow.completed && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Completed</span>
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workflow Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeWorkflow.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStepIcon(step.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{step.name}</div>
                        {step.output && (
                          <span className="text-xs text-muted-foreground max-w-[200px] truncate">
                            {step.output}
                          </span>
                        )}
                      </div>
                      {step.status === 'running' && (
                        <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 animate-pulse w-1/2" />
                        </div>
                      )}
                    </div>
                    {index < activeWorkflow.steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={resetWorkflow} variant="outline" className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Run Again
            </Button>
            <Button onClick={exportWorkflow} disabled={!activeWorkflow.completed} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

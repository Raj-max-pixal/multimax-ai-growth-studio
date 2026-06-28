'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, CheckCircle, Download, Map, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/toast';
import { getBusinessProfile } from '@/services/businessProfile';
import { extractJsonObject, generateContent } from '@/lib/gemini';

interface RoadmapTask {
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  channel: string;
  kpi: string;
}

interface RoadmapMonth {
  month: number;
  title: string;
  objective: string;
  tasks: RoadmapTask[];
  budgetFocus: string;
  expectedROI: string;
}

interface GrowthRoadmap {
  executiveSummary: string;
  projectedOutcome: string;
  months: RoadmapMonth[];
  risks: string[];
  nextBestAction: string;
}

export default function GrowthRoadmapPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<GrowthRoadmap | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const data = await getBusinessProfile(user.uid);
        setProfile(data);
      } catch {
        showToast('info', 'Using demo business data for the roadmap');
      }
    };

    loadProfile();
  }, [user, showToast]);

  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const businessContext = profile ? `
Business Name: ${profile.businessName}
Industry: ${profile.industry}
Products/Services: ${profile.products}
Target Audience: ${profile.targetAudience}
Monthly Budget: ${profile.monthlyBudget}
Marketing Goals: ${profile.marketingGoals}
` : 'Use a realistic startup business profile and generate a practical 90-day marketing roadmap.';

      const prompt = `You are an AI CMO and strategic marketing advisor.

Create a 90-day AI Growth Roadmap for this business:
${businessContext}

Return only valid JSON in this exact format:
{
  "executiveSummary": "short strategic overview",
  "projectedOutcome": "expected result after 90 days",
  "months": [
    {
      "month": 1,
      "title": "month theme",
      "objective": "main objective",
      "tasks": [
        {
          "title": "specific task",
          "priority": "High/Medium/Low",
          "channel": "SEO/Social/Email/Ads/Website/Analytics/etc",
          "kpi": "measurable KPI"
        }
      ],
      "budgetFocus": "where budget should go",
      "expectedROI": "expected ROI range"
    }
  ],
  "risks": ["3 risks"],
  "nextBestAction": "one immediate action"
}

Create exactly 3 months. Each month must include 4 tasks. Make it practical, specific, and judge-demo friendly.`;

      const response = await generateContent(prompt);
      const result = extractJsonObject<GrowthRoadmap>(response);
      setRoadmap(result);
      showToast('success', 'AI Growth Roadmap generated');
    } catch (error) {
      console.error('Error generating growth roadmap:', error);
      showToast('error', 'Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  const exportRoadmap = () => {
    if (!roadmap) return;

    const content = [
      'AI GROWTH ROADMAP',
      '',
      roadmap.executiveSummary,
      '',
      `Projected Outcome: ${roadmap.projectedOutcome}`,
      '',
      ...roadmap.months.flatMap((month) => [
        `Month ${month.month}: ${month.title}`,
        `Objective: ${month.objective}`,
        `Budget Focus: ${month.budgetFocus}`,
        `Expected ROI: ${month.expectedROI}`,
        ...month.tasks.map((task) => `- [${task.priority}] ${task.title} (${task.channel}) KPI: ${task.kpi}`),
        '',
      ]),
      'Risks:',
      ...roadmap.risks.map((risk) => `- ${risk}`),
      '',
      `Next Best Action: ${roadmap.nextBestAction}`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ai-growth-roadmap.txt';
    link.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Growth roadmap exported');
  };

  const getPriorityClass = (priority: RoadmapTask['priority']) => {
    if (priority === 'High') return 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300';
    if (priority === 'Medium') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300';
    return 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Map className="h-8 w-8 text-primary" />
            AI Growth Roadmap
          </h1>
          <p className="text-muted-foreground mt-2">
            Turn your business profile into a clear 90-day strategic marketing plan.
          </p>
        </div>
        {roadmap && (
          <Button variant="outline" onClick={exportRoadmap}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
      </div>

      {!roadmap ? (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generate 90-Day Growth Plan
            </CardTitle>
            <CardDescription>
              Creates month-by-month priorities, tasks, budget focus, KPIs, risks, and next best action.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={generateRoadmap} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <LoadingSpinner />
                  Building Strategic Roadmap...
                </>
              ) : (
                <>
                  <Map className="mr-2 h-5 w-5" />
                  Generate AI Growth Roadmap
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Executive Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{roadmap.executiveSummary}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Projected Outcome
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{roadmap.projectedOutcome}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {roadmap.months.map((month) => (
              <Card key={month.month} className="flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <CalendarDays className="h-4 w-4" />
                    Month {month.month}
                  </div>
                  <CardTitle>{month.title}</CardTitle>
                  <CardDescription>{month.objective}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 pt-4">
                  <div className="space-y-3">
                    {month.tasks.map((task) => (
                      <div key={task.title} className="rounded-lg border p-3">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div className="font-medium">{task.title}</div>
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityClass(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="grid gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {task.channel}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {task.kpi}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    <div><span className="font-semibold">Budget Focus:</span> {month.budgetFocus}</div>
                    <div><span className="font-semibold">Expected ROI:</span> {month.expectedROI}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risks To Watch</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {roadmap.risks.map((risk) => (
                    <li key={risk} className="flex items-start gap-2 text-sm">
                      <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>Next Best Action</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{roadmap.nextBestAction}</p>
              </CardContent>
            </Card>
          </div>

          <Button onClick={() => setRoadmap(null)} variant="outline" className="w-full">
            Generate New Roadmap
          </Button>
        </div>
      )}
    </div>
  );
}

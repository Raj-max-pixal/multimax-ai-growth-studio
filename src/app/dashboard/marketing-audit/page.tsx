'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getBusinessProfile } from '@/services/businessProfile';
import { extractJsonObject, generateContent } from '@/lib/gemini';
import { LoadingSpinner } from '@/components/loading-spinner';
import { 
  TrendingUp, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb,
  Calendar,
  DollarSign,
  BarChart3,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AuditResult {
  overallScore: number;
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  actionItems: Array<{
    task: string;
    priority: 'High' | 'Medium' | 'Low';
    impact: string;
  }>;
  roadmap: Array<{
    week: number;
    focus: string;
    tasks: string[];
  }>;
  budgetAllocation: {
    category: string;
    percentage: number;
    amount: number;
  }[];
  expectedROI: {
    timeframe: string;
    expectedGrowth: string;
    keyMetrics: string[];
  };
}

export default function MarketingAuditPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [customBusiness, setCustomBusiness] = useState({
    businessName: '',
    industry: '',
    products: '',
    targetAudience: '',
    monthlyBudget: '',
    marketingGoals: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const data = await getBusinessProfile(user.uid);
        if (data) {
          setProfile(data);
          setCustomBusiness({
            businessName: data.businessName || '',
            industry: data.industry || '',
            products: data.products || '',
            targetAudience: data.targetAudience || '',
            monthlyBudget: data.monthlyBudget?.toString() || '',
            marketingGoals: data.marketingGoals || '',
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, [user]);

  const runAudit = async () => {
    if (!customBusiness.businessName || !customBusiness.industry) {
      showToast('error', 'Please fill in business name and industry');
      return;
    }

    setLoading(true);
    try {
      const businessContext = `
Business Name: ${customBusiness.businessName}
Industry: ${customBusiness.industry}
Products/Services: ${customBusiness.products}
Target Audience: ${customBusiness.targetAudience}
Monthly Budget: ${customBusiness.monthlyBudget}
Marketing Goals: ${customBusiness.marketingGoals}
      `;

      const prompt = `As a senior marketing consultant and CMO, conduct a comprehensive marketing audit for this business:

${businessContext}

Provide a detailed analysis in the following JSON format:
{
  "overallScore": number (0-100),
  "swotAnalysis": {
    "strengths": [5 specific strengths],
    "weaknesses": [5 specific weaknesses],
    "opportunities": [5 specific opportunities],
    "threats": [5 specific threats]
  },
  "actionItems": [
    {
      "task": "specific actionable task",
      "priority": "High/Medium/Low",
      "impact": "expected impact"
    }
  ] (10 items),
  "roadmap": [
    {
      "week": number,
      "focus": "weekly focus area",
      "tasks": ["task1", "task2", "task3"]
    }
  ] (4 weeks),
  "budgetAllocation": [
    {
      "category": "category name",
      "percentage": number,
      "amount": number (based on monthly budget)
    }
  ],
  "expectedROI": {
    "timeframe": "timeframe",
    "expectedGrowth": "percentage",
    "keyMetrics": ["metric1", "metric2", "metric3"]
  }
}

Be specific, actionable, and professional. Focus on realistic recommendations that can drive real business growth.`;

      const response = await generateContent(prompt);
      const result = extractJsonObject<AuditResult>(response);
      setAuditResult(result);
      showToast('success', 'Marketing audit completed successfully!');
    } catch (error) {
      console.error('Error running audit:', error);
      showToast('error', 'Failed to run marketing audit');
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Marketing Audit
          </h1>
          <p className="text-muted-foreground mt-2">
            Get a comprehensive marketing analysis with actionable insights
          </p>
        </div>
      </div>

      {!auditResult ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Enter your business details to generate a comprehensive marketing audit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={customBusiness.businessName}
                    onChange={(e) => setCustomBusiness({ ...customBusiness, businessName: e.target.value })}
                    placeholder="Your company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Input
                    id="industry"
                    value={customBusiness.industry}
                    onChange={(e) => setCustomBusiness({ ...customBusiness, industry: e.target.value })}
                    placeholder="e.g., Technology, E-commerce, Healthcare"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="products">Products/Services</Label>
                <Textarea
                  id="products"
                  value={customBusiness.products}
                  onChange={(e) => setCustomBusiness({ ...customBusiness, products: e.target.value })}
                  placeholder="Describe your main products or services"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Textarea
                  id="targetAudience"
                  value={customBusiness.targetAudience}
                  onChange={(e) => setCustomBusiness({ ...customBusiness, targetAudience: e.target.value })}
                  placeholder="Describe your ideal customers"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyBudget">Monthly Marketing Budget (USD)</Label>
                <Input
                  id="monthlyBudget"
                  type="number"
                  value={customBusiness.monthlyBudget}
                  onChange={(e) => setCustomBusiness({ ...customBusiness, monthlyBudget: e.target.value })}
                  placeholder="5000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketingGoals">Marketing Goals</Label>
                <Textarea
                  id="marketingGoals"
                  value={customBusiness.marketingGoals}
                  onChange={(e) => setCustomBusiness({ ...customBusiness, marketingGoals: e.target.value })}
                  placeholder="What are your main marketing objectives?"
                  rows={3}
                />
              </div>
              <Button 
                onClick={runAudit} 
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
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Run Marketing Audit
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                What You&apos;ll Get
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="font-semibold">Overall Marketing Score</div>
                    <div className="text-sm text-muted-foreground">0-100 score with detailed breakdown</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="font-semibold">SWOT Analysis</div>
                    <div className="text-sm text-muted-foreground">Strengths, Weaknesses, Opportunities, Threats</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="font-semibold">Top 10 Action Items</div>
                    <div className="text-sm text-muted-foreground">Prioritized tasks with impact analysis</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="font-semibold">30-Day Growth Roadmap</div>
                    <div className="text-sm text-muted-foreground">Week-by-week implementation plan</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="font-semibold">Budget Allocation</div>
                    <div className="text-sm text-muted-foreground">Optimal budget distribution</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="font-semibold">Expected ROI</div>
                    <div className="text-sm text-muted-foreground">Growth projections and key metrics</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Overall Marketing Score</span>
                <div className={`text-5xl font-bold ${getScoreColor(auditResult.overallScore)}`}>
                  {auditResult.overallScore}/100
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getScoreBg(auditResult.overallScore)} transition-all duration-1000`}
                  style={{ width: `${auditResult.overallScore}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* SWOT Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>SWOT Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-semibold text-green-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Strengths
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {auditResult.swotAnalysis.strengths.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Weaknesses
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {auditResult.swotAnalysis.weaknesses.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-blue-600 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Opportunities
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {auditResult.swotAnalysis.opportunities.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-orange-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Threats
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {auditResult.swotAnalysis.threats.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-orange-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Action Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditResult.actionItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{item.task}</div>
                      <div className="text-sm text-muted-foreground mt-1">{item.impact}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 30-Day Roadmap */}
          <Card>
            <CardHeader>
              <CardTitle>30-Day Growth Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditResult.roadmap.map((week, i) => (
                  <div key={i} className="border-l-4 border-primary pl-4">
                    <div className="font-semibold">Week {week.week}: {week.focus}</div>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {week.tasks.map((task, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <ArrowRight className="h-3 w-3 mt-1 flex-shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Budget Allocation */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditResult.budgetAllocation.map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.category}</span>
                      <span>{item.percentage}% (${item.amount.toLocaleString()})</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expected ROI */}
          <Card>
            <CardHeader>
              <CardTitle>Expected ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{auditResult.expectedROI.expectedGrowth}</div>
                  <div className="text-sm text-muted-foreground">Expected Growth</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{auditResult.expectedROI.timeframe}</div>
                  <div className="text-sm text-muted-foreground">Timeframe</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{auditResult.expectedROI.keyMetrics.length}</div>
                  <div className="text-sm text-muted-foreground">Key Metrics</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="font-semibold mb-2">Key Metrics to Track:</div>
                <ul className="space-y-1 text-sm">
                  {auditResult.expectedROI.keyMetrics.map((metric, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Button onClick={() => setAuditResult(null)} variant="outline" className="w-full">
            Run New Audit
          </Button>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { TrendingUp, DollarSign, Users, MousePointer, ArrowUpRight, Clock, ShieldCheck, Brain, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ROIPredictorPage() {
  const [budget, setBudget] = useState(5000);
  const [platform, setPlatform] = useState('facebook');
  const [duration, setDuration] = useState(30);
  const [audience, setAudience] = useState(10000);
  const [results, setResults] = useState<any>(null);

  const platforms = [
    { id: 'facebook', name: 'Facebook', cpc: 0.97, ctr: 0.9, conversion: 2.1 },
    { id: 'instagram', name: 'Instagram', cpc: 1.20, ctr: 0.8, conversion: 1.8 },
    { id: 'linkedin', name: 'LinkedIn', cpc: 5.26, ctr: 0.5, conversion: 2.5 },
    { id: 'twitter', name: 'Twitter/X', cpc: 0.50, ctr: 1.0, conversion: 1.5 },
    { id: 'google', name: 'Google Ads', cpc: 2.32, ctr: 3.2, conversion: 3.8 },
  ];

  const calculateROI = () => {
    const selectedPlatform = platforms.find(p => p.id === platform);
    if (!selectedPlatform) return;

    const estimatedClicks = Math.floor((budget / selectedPlatform.cpc));
    const estimatedConversions = Math.floor(estimatedClicks * (selectedPlatform.conversion / 100));
    const estimatedReach = Math.floor(audience * (duration / 30));
    const avgOrderValue = 50;
    const estimatedRevenue = estimatedConversions * avgOrderValue;
    const estimatedROI = ((estimatedRevenue - budget) / budget) * 100;

    setResults({
      budget,
      platform: selectedPlatform.name,
      duration,
      audience,
      estimatedReach,
      estimatedClicks,
      estimatedConversions,
      estimatedRevenue,
      estimatedROI: estimatedROI.toFixed(1),
      cpc: selectedPlatform.cpc,
      ctr: selectedPlatform.ctr,
      conversionRate: selectedPlatform.conversion,
      confidence: Math.min(94, Math.max(62, Math.round(70 + selectedPlatform.ctr * 4 + selectedPlatform.conversion * 3))),
      successProbability: Math.min(95, Math.max(45, Math.round(55 + selectedPlatform.conversion * 8 + (budget > 3000 ? 8 : 0)))),
      bestPostingTime: platform === 'linkedin' ? 'Tue-Thu, 9:00-11:00 AM' : platform === 'google' ? 'Weekdays, 10:00 AM-2:00 PM' : 'Mon-Thu, 6:00-9:00 PM',
      highPerformingSegment: platform === 'linkedin' ? 'Decision-makers in growing teams' : platform === 'google' ? 'High-intent searchers comparing solutions' : 'Lookalike audiences based on engaged customers',
      churnRisk: estimatedROI > 50 ? 'Low' : estimatedROI > 0 ? 'Medium' : 'High',
      futureSales: Math.round(estimatedRevenue * 1.18),
    });
  };

  const chartData = results ? [
    { name: 'Budget', value: results.budget },
    { name: 'Revenue', value: results.estimatedRevenue },
  ] : [];

  const breakdownData = results ? [
    { name: 'Clicks', value: results.estimatedClicks },
    { name: 'Conversions', value: results.estimatedConversions },
  ] : [];

  const COLORS = ['#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ROI Predictor</h1>
        <p className="text-muted-foreground">
          Estimate campaign performance before you spend
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Parameters</CardTitle>
            <CardDescription>
              Enter your campaign details to get ROI estimates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Marketing Budget (USD)</Label>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                min="0"
                step="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                {platforms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Campaign Duration (Days)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                min="1"
                max="365"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience Size</Label>
              <Input
                id="audience"
                type="number"
                value={audience}
                onChange={(e) => setAudience(parseInt(e.target.value) || 0)}
                min="100"
                step="1000"
              />
            </div>

            <Button onClick={calculateROI} className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              Calculate ROI
            </Button>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle>ROI Results</CardTitle>
              <CardDescription>
                Estimated performance for {results.platform}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Estimated Revenue</span>
                  </div>
                  <div className="text-2xl font-bold">${results.estimatedRevenue.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Estimated ROI</span>
                  </div>
                  <div className={`text-2xl font-bold ${parseFloat(results.estimatedROI) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {results.estimatedROI}%
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Estimated Reach</span>
                  </div>
                  <div className="text-2xl font-bold">{results.estimatedReach.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MousePointer className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Estimated Clicks</span>
                  </div>
                  <div className="text-2xl font-bold">{results.estimatedClicks.toLocaleString()}</div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Estimated Conversions</span>
                </div>
                <div className="text-2xl font-bold">{results.estimatedConversions.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {results && (
        <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Predictive Analytics
            </CardTitle>
            <CardDescription>
              AI-style projections with confidence scoring for planning decisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Best Posting Time
                </div>
                <div className="font-semibold">{results.bestPostingTime}</div>
                <p className="text-xs text-muted-foreground mt-1">{results.confidence}% confidence</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Future Sales
                </div>
                <div className="text-2xl font-bold">${results.futureSales.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Projected next-period revenue</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Success Probability
                </div>
                <div className="text-2xl font-bold">{results.successProbability}%</div>
                <p className="text-xs text-muted-foreground mt-1">{results.confidence}% confidence</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  Top Audience Segment
                </div>
                <div className="font-semibold">{results.highPerformingSegment}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <MousePointer className="h-4 w-4 text-primary" />
                  Expected Conversions
                </div>
                <div className="text-2xl font-bold">{results.estimatedConversions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">{results.conversionRate}% estimated conversion rate</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  Churn Risk
                </div>
                <div className={`text-2xl font-bold ${
                  results.churnRisk === 'Low' ? 'text-green-600' : results.churnRisk === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {results.churnRisk}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Based on ROI and conversion quality</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Budget vs Revenue</CardTitle>
              <CardDescription>
                Comparison of investment and expected returns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Breakdown</CardTitle>
              <CardDescription>
                Clicks to conversions ratio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={breakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        </>
      )}
    </div>
  );
}

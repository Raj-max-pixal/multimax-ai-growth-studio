'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getBusinessProfile } from '@/services/businessProfile';
import { extractJsonObject, generateContent } from '@/lib/gemini';
import { LoadingSpinner } from '@/components/loading-spinner';
import { 
  Calendar as CalendarIcon,
  Download,
  Instagram,
  Linkedin,
  Facebook,
  Mail,
  FileText,
  TrendingUp,
  Copy
} from 'lucide-react';

interface DayContent {
  instagramPost?: string;
  instagramReel?: string;
  instagramStory?: string;
  linkedinPost?: string;
  email?: string;
  googleAd?: string;
  facebookAd?: string;
  blogPost?: string;
}

interface CampaignCalendar {
  month: string;
  year: number;
  days: Array<{
    date: string;
    dayOfWeek: string;
    content: DayContent;
    focus: string;
  }>;
}

export default function CampaignCalendarPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [calendar, setCalendar] = useState<CampaignCalendar | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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

  const generateCalendar = async () => {
    setLoading(true);
    try {
      const businessContext = profile ? `
Business Name: ${profile.businessName}
Industry: ${profile.industry}
Products/Services: ${profile.products}
Target Audience: ${profile.targetAudience}
Marketing Goals: ${profile.marketingGoals}
Monthly Budget: ${profile.monthlyBudget}
      ` : 'No business profile available. Generate generic marketing calendar.';

      const prompt = `As a marketing strategist and content planner, create a comprehensive 30-day marketing calendar for ${months[selectedMonth]} ${selectedYear}:

${businessContext}

Generate a detailed calendar in the following JSON format:
{
  "month": "${months[selectedMonth]}",
  "year": ${selectedYear},
  "days": [
    {
      "date": "YYYY-MM-DD",
      "dayOfWeek": "Monday/Tuesday/etc",
      "content": {
        "instagramPost": "engaging Instagram post idea with hashtags",
        "instagramReel": "Instagram Reel concept (optional)",
        "instagramStory": "Instagram Story idea (optional)",
        "linkedinPost": "professional LinkedIn post",
        "email": "email subject line and brief content",
        "googleAd": "Google Ads copy with headline and description",
        "facebookAd": "Facebook Ads copy",
        "blogPost": "blog post topic and brief outline"
      },
      "focus": "weekly focus area or campaign theme"
    }
  ]
}

Create 30 days of content. Mix promotional content (20%) with educational/engaging content (80%). Include relevant hashtags. Make content specific to the business and industry. Ensure variety in content types and platforms.`;

      const response = await generateContent(prompt);
      const result = extractJsonObject<CampaignCalendar>(response);
      setCalendar(result);
      showToast('success', 'Campaign calendar generated successfully!');
    } catch (error) {
      console.error('Error generating calendar:', error);
      showToast('error', 'Failed to generate calendar');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!calendar) return;

    let csv = 'Date,Day,Focus,Instagram Post,Instagram Reel,Instagram Story,LinkedIn Post,Email,Google Ad,Facebook Ad,Blog Post\n';
    
    calendar.days.forEach(day => {
      csv += `"${day.date}","${day.dayOfWeek}","${day.focus}",`;
      csv += `"${day.content.instagramPost || ''}",`;
      csv += `"${day.content.instagramReel || ''}",`;
      csv += `"${day.content.instagramStory || ''}",`;
      csv += `"${day.content.linkedinPost || ''}",`;
      csv += `"${day.content.email || ''}",`;
      csv += `"${day.content.googleAd || ''}",`;
      csv += `"${day.content.facebookAd || ''}",`;
      csv += `"${day.content.blogPost || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketing-calendar-${calendar.month}-${calendar.year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Calendar exported to CSV!');
  };

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    showToast('success', 'Content copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-8 w-8 text-primary" />
            AI Campaign Calendar
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate a 30-day marketing calendar with daily content across all platforms
          </p>
        </div>
        {calendar && (
          <Button onClick={exportToCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        )}
      </div>

      {!calendar ? (
        <Card>
          <CardHeader>
            <CardTitle>Generate Campaign Calendar</CardTitle>
            <CardDescription>
              AI will create a comprehensive 30-day marketing calendar for your business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <select
                  id="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  {months.map((month, i) => (
                    <option key={i} value={i}>{month}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                />
              </div>
            </div>
            <Button 
              onClick={generateCalendar} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Generating Calendar...
                </>
              ) : (
                <>
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Generate 30-Day Calendar
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{calendar.month} {calendar.year} Marketing Calendar</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {calendar.days.length} days of content
                </span>
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {calendar.days.map((day, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{new Date(day.date).getDate()}</div>
                        <div className="text-xs text-muted-foreground">{day.dayOfWeek}</div>
                      </div>
                      <div className="h-12 w-px bg-border" />
                      <div>
                        <div className="font-semibold">{day.focus}</div>
                        <div className="text-sm text-muted-foreground">{day.date}</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {day.content.instagramPost && (
                      <div className="space-y-2 p-3 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Instagram className="h-4 w-4 text-pink-600" />
                          <span className="font-semibold text-sm">Instagram Post</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">{day.content.instagramPost}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full"
                          onClick={() => copyContent(day.content.instagramPost!)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    )}
                    {day.content.linkedinPost && (
                      <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Linkedin className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-sm">LinkedIn Post</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">{day.content.linkedinPost}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full"
                          onClick={() => copyContent(day.content.linkedinPost!)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    )}
                    {day.content.email && (
                      <div className="space-y-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-yellow-600" />
                          <span className="font-semibold text-sm">Email</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">{day.content.email}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full"
                          onClick={() => copyContent(day.content.email!)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    )}
                    {day.content.blogPost && (
                      <div className="space-y-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-sm">Blog Post</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">{day.content.blogPost}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full"
                          onClick={() => copyContent(day.content.blogPost!)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    )}
                    {day.content.googleAd && (
                      <div className="space-y-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-red-600" />
                          <span className="font-semibold text-sm">Google Ad</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">{day.content.googleAd}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full"
                          onClick={() => copyContent(day.content.googleAd!)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    )}
                    {day.content.facebookAd && (
                      <div className="space-y-2 p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Facebook className="h-4 w-4 text-indigo-600" />
                          <span className="font-semibold text-sm">Facebook Ad</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">{day.content.facebookAd}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full"
                          onClick={() => copyContent(day.content.facebookAd!)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    )}
                    {day.content.instagramReel && (
                      <div className="space-y-2 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Instagram className="h-4 w-4 text-purple-600" />
                          <span className="font-semibold text-sm">Instagram Reel</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">{day.content.instagramReel}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full"
                          onClick={() => copyContent(day.content.instagramReel!)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    )}
                    {day.content.instagramStory && (
                      <div className="space-y-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Instagram className="h-4 w-4 text-orange-600" />
                          <span className="font-semibold text-sm">Instagram Story</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">{day.content.instagramStory}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full"
                          onClick={() => copyContent(day.content.instagramStory!)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-4">
            <Button onClick={() => setCalendar(null)} variant="outline" className="flex-1">
              Generate New Calendar
            </Button>
            <Button onClick={exportToCSV} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

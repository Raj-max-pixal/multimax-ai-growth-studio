'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getBusinessProfile } from '@/services/businessProfile';
import { generateMarketingContent } from '@/lib/gemini';
import { saveContent, getGeneratedContent } from '@/services/content';
import { PenTool, Loader2, Copy, RefreshCw, Download } from 'lucide-react';

const contentTypes = [
  { id: 'instagram', name: 'Instagram Caption', platform: 'Instagram' },
  { id: 'linkedin', name: 'LinkedIn Post', platform: 'LinkedIn' },
  { id: 'facebook', name: 'Facebook Post', platform: 'Facebook' },
  { id: 'twitter', name: 'Twitter/X Post', platform: 'Twitter' },
  { id: 'blog', name: 'Blog Outline', platform: 'Blog' },
  { id: 'email', name: 'Email Campaign', platform: 'Email' },
  { id: 'google-ads', name: 'Google Ads Copy', platform: 'Google Ads' },
  { id: 'meta-ads', name: 'Meta Ads Copy', platform: 'Meta Ads' },
  { id: 'seo', name: 'SEO Meta Description', platform: 'SEO' },
  { id: 'hashtags', name: 'Hashtags', platform: 'Social Media' },
  { id: 'cta', name: 'Call To Action', platform: 'General' },
];

export default function ContentGeneratorPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [contentType, setContentType] = useState('instagram');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [savedContents, setSavedContents] = useState<any[]>([]);

  const loadSavedContent = useCallback(async () => {
    if (!user) return;
    try {
      const contents = await getGeneratedContent(user.uid);
      setSavedContents(contents);
    } catch (error) {
      console.error('Error loading saved content:', error);
    }
  }, [user]);

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
    loadSavedContent();
  }, [user, loadSavedContent]);

  const generateContent = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const profile = await getBusinessProfile(user.uid);
      if (!profile) {
        showToast('error', 'Please complete your business profile first');
        return;
      }

      const selectedType = contentTypes.find(t => t.id === contentType);
      const context = `
        Business Name: ${profile.businessName}
        Industry: ${profile.industry}
        Products: ${profile.products}
        Target Audience: ${profile.targetAudience}
        Marketing Goals: ${profile.marketingGoals}
        ${customPrompt ? `Additional Context: ${customPrompt}` : ''}
      `;

      const content = await generateMarketingContent(
        `${selectedType?.name} for ${selectedType?.platform}`,
        context
      );

      setGeneratedContent(content);
      showToast('success', 'Content generated successfully');
    } catch (error) {
      console.error('Error generating content:', error);
      showToast('error', 'Failed to generate content. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const saveGeneratedContent = async () => {
    if (!user || !generatedContent) return;
    try {
      const selectedType = contentTypes.find(t => t.id === contentType);
      await saveContent({
        type: selectedType?.name || contentType,
        platform: selectedType?.platform || 'General',
        content: generatedContent,
        userId: user.uid,
        createdAt: new Date(),
      });
      loadSavedContent();
      showToast('success', 'Content saved successfully');
    } catch (error) {
      console.error('Error saving content:', error);
      showToast('error', 'Failed to save content. Please try again.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    showToast('success', 'Content copied to clipboard');
  };

  const regenerateContent = () => {
    generateContent();
  };

  if (!hasProfile) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Content Generator</h1>
          <p className="text-muted-foreground mt-2">
            Complete your business profile to unlock AI-powered content generation
          </p>
        </div>
        <Card className="p-8">
          <PenTool className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Profile Required</h3>
          <p className="text-muted-foreground mb-6">
            To generate personalized marketing content, we need information about your business.
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
        <h1 className="text-3xl font-bold">AI Content Generator</h1>
        <p className="text-muted-foreground">
          Create engaging marketing content for any platform in seconds
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content Settings</CardTitle>
            <CardDescription>
              Choose the type of content you want to generate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type</Label>
              <Select
                id="contentType"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                {contentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.platform})
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customPrompt">Additional Context (Optional)</Label>
              <Textarea
                id="customPrompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Add any specific details, tone, or requirements for the content..."
                rows={4}
              />
            </div>

            <Button onClick={generateContent} disabled={generating} className="w-full">
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <PenTool className="h-4 w-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Content</CardTitle>
              {generatedContent && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={regenerateContent} disabled={generating}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={saveGeneratedContent}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <CardDescription>
              AI-generated marketing content based on your business profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <Textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                rows={12}
                className="resize-none"
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Select content type and click generate to create content
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {savedContents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Saved Content</CardTitle>
            <CardDescription>
              Your previously generated and saved content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savedContents.slice(0, 5).map((item) => (
                <div key={item.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.type}</span>
                    <span className="text-sm text-muted-foreground">{item.platform}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

async function getSavedContent() {
  // This would fetch from Firebase in a real implementation
  return [];
}

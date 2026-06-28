'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BusinessProfile } from '@/types';
import { createBusinessProfile, getBusinessProfile, updateBusinessProfile } from '@/services/businessProfile';
import { Building2, Save, CheckCircle } from 'lucide-react';

export default function BusinessProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<Partial<BusinessProfile>>({
    businessName: '',
    industry: '',
    products: '',
    targetAudience: '',
    monthlyBudget: 0,
    marketingGoals: '',
  });
  const [existingProfileId, setExistingProfileId] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await getBusinessProfile(user.uid);
        if (data) {
          setProfile(data);
          setExistingProfileId(data.id || null);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        showToast('error', 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('error', 'Please wait for your session to finish loading');
      return;
    }

    // Validation
    if (!profile.businessName || !profile.industry || !profile.products || 
        !profile.targetAudience || !profile.marketingGoals || (profile.monthlyBudget || 0) <= 0) {
      showToast('error', 'Please fill in all required fields');
      return;
    }

    setSaving(true);
    setSaved(false);

    try {
      const profileData = {
        ...profile,
        userId: user.uid,
        createdAt: existingProfileId ? profile.createdAt : new Date(),
        updatedAt: new Date(),
      } as BusinessProfile;

      if (existingProfileId) {
        await updateBusinessProfile(existingProfileId, profileData);
        showToast('success', 'Profile updated successfully');
      } else {
        const id = await createBusinessProfile(profileData);
        setExistingProfileId(id);
        showToast('success', 'Profile created successfully');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('error', 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof BusinessProfile, value: string | number) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Business Profile</h1>
        <p className="text-muted-foreground">
          Tell us about your business to get personalized AI marketing recommendations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <CardTitle>Business Information</CardTitle>
          </div>
          <CardDescription>
            This information helps our AI generate more relevant marketing content and strategies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={profile.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  required
                  placeholder="Your company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <select
                  id="industry"
                  value={profile.industry}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select industry</option>
                  <option value="Technology">Technology</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Travel">Travel</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="products">Products/Services *</Label>
              <Textarea
                id="products"
                value={profile.products}
                onChange={(e) => handleChange('products', e.target.value)}
                required
                placeholder="Describe your main products or services"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience *</Label>
              <Textarea
                id="targetAudience"
                value={profile.targetAudience}
                onChange={(e) => handleChange('targetAudience', e.target.value)}
                required
                placeholder="Describe your ideal customers (age, location, interests, etc.)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyBudget">Monthly Marketing Budget (USD) *</Label>
              <Input
                id="monthlyBudget"
                type="number"
                value={profile.monthlyBudget}
                onChange={(e) => handleChange('monthlyBudget', parseFloat(e.target.value) || 0)}
                required
                min="0"
                step="100"
                placeholder="5000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketingGoals">Marketing Goals *</Label>
              <Textarea
                id="marketingGoals"
                value={profile.marketingGoals}
                onChange={(e) => handleChange('marketingGoals', e.target.value)}
                required
                placeholder="What are your main marketing objectives? (e.g., increase brand awareness, generate leads, boost sales)"
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              {saved && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Profile saved successfully!
                </div>
              )}
              <Button type="submit" disabled={saving || !user} className="ml-auto">
                {saving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Why complete your profile?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Get personalized marketing strategies based on your industry</p>
          <p>• Generate content that resonates with your target audience</p>
          <p>• Receive campaign recommendations within your budget</p>
          <p>• Track progress toward your specific marketing goals</p>
        </CardContent>
      </Card>
    </div>
  );
}

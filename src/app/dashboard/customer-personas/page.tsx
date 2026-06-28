'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getBusinessProfile } from '@/services/businessProfile';
import { extractJsonArray, generateContent } from '@/lib/gemini';
import { LoadingSpinner } from '@/components/loading-spinner';
import { 
  Users, 
  User, 
  Briefcase, 
  DollarSign, 
  Heart,
  Target,
  Smartphone,
  FileText,
  TrendingUp,
  Plus,
  Download
} from 'lucide-react';

interface Persona {
  name: string;
  age: number;
  profession: string;
  income: string;
  interests: string[];
  painPoints: string[];
  goals: string[];
  preferredPlatforms: string[];
  buyingBehavior: string;
  preferredContentTypes: string[];
  quote: string;
}

export default function CustomerPersonasPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [numPersonas, setNumPersonas] = useState(3);

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

  const generatePersonas = async () => {
    setLoading(true);
    try {
      const businessContext = profile ? `
Business Name: ${profile.businessName}
Industry: ${profile.industry}
Products/Services: ${profile.products}
Target Audience: ${profile.targetAudience}
Marketing Goals: ${profile.marketingGoals}
      ` : 'No business profile available. Generate generic customer personas.';

      const prompt = `As a customer research expert and marketing strategist, create ${numPersonas} detailed buyer personas for this business:

${businessContext}

Generate personas in the following JSON format:
[
  {
    "name": "realistic name",
    "age": number,
    "profession": "job title",
    "income": "income range",
    "interests": ["interest1", "interest2", "interest3"],
    "painPoints": ["pain point1", "pain point2", "pain point3"],
    "goals": ["goal1", "goal2", "goal3"],
    "preferredPlatforms": ["platform1", "platform2", "platform3"],
    "buyingBehavior": "description of how they make purchasing decisions",
    "preferredContentTypes": ["content type1", "content type2", "content type3"],
    "quote": "a realistic quote from this persona about their needs"
  }
]

Make each persona distinct, realistic, and based on actual customer segments. Include specific details that would help with marketing targeting.`;

      const response = await generateContent(prompt);
      const result = extractJsonArray<Persona[]>(response);
      setPersonas(result);
      showToast('success', `Generated ${result.length} customer personas!`);
    } catch (error) {
      console.error('Error generating personas:', error);
      showToast('error', 'Failed to generate personas');
    } finally {
      setLoading(false);
    }
  };

  const exportPersonas = () => {
    const data = JSON.stringify(personas, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer-personas.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Personas exported successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Customer Persona Generator
          </h1>
          <p className="text-muted-foreground mt-2">
            Create detailed buyer personas to target your ideal customers
          </p>
        </div>
        {personas.length > 0 && (
          <Button onClick={exportPersonas} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        )}
      </div>

      {!personas.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Generate Customer Personas</CardTitle>
            <CardDescription>
              AI will create detailed buyer personas based on your business profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="numPersonas">Number of Personas</Label>
              <Input
                id="numPersonas"
                type="number"
                min="1"
                max="5"
                value={numPersonas}
                onChange={(e) => setNumPersonas(parseInt(e.target.value) || 3)}
              />
            </div>
            <Button 
              onClick={generatePersonas} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Generating Personas...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Generate Personas
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {personas.map((persona, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                        {persona.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{persona.name}</CardTitle>
                        <CardDescription>{persona.profession}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{persona.age} years old</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{persona.income}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">Interests</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {persona.interests.map((interest, i) => (
                        <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-red-500" />
                      <span className="font-semibold text-sm">Pain Points</span>
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {persona.painPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-semibold text-sm">Goals</span>
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {persona.goals.map((goal, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">Preferred Platforms</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {persona.preferredPlatforms.map((platform, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">Content Preferences</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {persona.preferredContentTypes.map((type, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">Buying Behavior</span>
                </div>
                <p className="text-sm text-muted-foreground">{persona.buyingBehavior}</p>
              </div>

              <div className="pt-2 border-t bg-muted/50 p-3 rounded-lg">
                <p className="text-sm italic text-muted-foreground">&ldquo;{persona.quote}&rdquo;</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <Button onClick={() => setPersonas([])} variant="outline" className="flex-1">
          Generate New Personas
        </Button>
        <Button onClick={exportPersonas} className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Export JSON
        </Button>
      </div>
    </div>
  )}
</div>
);
}

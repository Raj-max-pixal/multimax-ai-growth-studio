import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DemoBanner } from '@/components/demo-banner';
import { 
  Sparkles, 
  Target, 
  Zap, 
  BarChart3, 
  MessageSquare, 
  Calendar,
  Check,
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  Rocket
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      <DemoBanner />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Marketing Platform
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Grow Your Business with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Marketing
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Generate marketing strategies, create AI content, plan campaigns, estimate ROI, and analyze performance - all in one powerful platform.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-12 px-8">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="ghost" className="w-full sm:w-auto text-lg h-12 px-8">
                  Try Demo
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>AI-powered tools</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800 border-y">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50M+</div>
              <div className="text-muted-foreground">Content Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful AI tools to supercharge your marketing efforts
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Target className="mb-4 h-12 w-12 text-primary" />
                <CardTitle>AI Business Analyzer</CardTitle>
                <CardDescription>
                  Get comprehensive SWOT analysis, customer personas, and marketing strategies tailored to your business.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full">
                    Try Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Zap className="mb-4 h-12 w-12 text-primary" />
                <CardTitle>Content Generator</CardTitle>
                <CardDescription>
                  Create engaging content for Instagram, LinkedIn, Facebook, Twitter, blogs, emails, and ads in seconds.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full">
                    Try Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Calendar className="mb-4 h-12 w-12 text-primary" />
                <CardTitle>Campaign Planner</CardTitle>
                <CardDescription>
                  Generate 7-day, 30-day, festival, and product launch campaign plans with detailed marketing calendars.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full">
                    Try Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <BarChart3 className="mb-4 h-12 w-12 text-primary" />
                <CardTitle>ROI Predictor</CardTitle>
                <CardDescription>
                  Estimate reach, clicks, conversions, and ROI for your campaigns before you spend a dollar.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <MessageSquare className="mb-4 h-12 w-12 text-primary" />
                <CardTitle>AI Marketing Assistant</CardTitle>
                <CardDescription>
                  Chat with an AI marketing expert that knows your business and provides personalized advice.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full">
                    Try Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Sparkles className="mb-4 h-12 w-12 text-primary" />
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Track campaign performance, content engagement, and growth trends with beautiful visualizations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full">
                    Try Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Tell us about your business, industry, products, and marketing goals.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">Generate AI Content</h3>
              <p className="text-muted-foreground">
                Use our AI tools to create marketing strategies, content, and campaign plans.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Launch & Analyze</h3>
              <p className="text-muted-foreground">
                Execute your campaigns and track performance with our analytics dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Transform Your Marketing?
          </h2>
          <p className="mb-8 text-lg text-blue-100">
            Join thousands of businesses already using AI to grow faster
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="text-lg h-12 px-8">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">MultiMax AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered marketing platform for startups and small businesses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard/business-profile" className="hover:text-primary">Business Profile</Link></li>
                <li><Link href="/dashboard/content-generator" className="hover:text-primary">Content Generator</Link></li>
                <li><Link href="/dashboard/campaign-planner" className="hover:text-primary">Campaign Planner</Link></li>
                <li><Link href="/dashboard/analytics" className="hover:text-primary">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">About</Link></li>
                <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary">Careers</Link></li>
                <li><Link href="#" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-primary">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 MultiMax AI Growth Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

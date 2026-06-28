import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

let client: GoogleGenerativeAI | null = null;

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'MultiMax Gemini generation API',
    message: 'Use POST with a JSON body containing a prompt to generate marketing content.',
    models: unique([
      process.env.GEMINI_MODEL,
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
    ]),
  });
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key') {
    throw new Error('Gemini API key is not configured. Add GEMINI_API_KEY to your environment.');
  }

  if (!client) {
    client = new GoogleGenerativeAI(apiKey);
  }

  return client;
}

export async function POST(request: Request) {
  try {
    const { prompt } = (await request.json()) as { prompt?: string };

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    const genAI = getGeminiClient();
    const modelCandidates = unique([
      process.env.GEMINI_MODEL,
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
    ]);

    let text = '';
    let lastError: unknown = null;

    for (const modelName of modelCandidates) {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: 0.75,
              topP: 0.9,
              maxOutputTokens: 8192,
            },
          });

          const result = await model.generateContent(prompt);
          text = result.response.text();
          break;
        } catch (error) {
          lastError = error;
          if (!isTransientGeminiError(error)) break;
          await wait(500 + attempt * 900);
        }
      }
      if (text) break;
    }

    if (!text) {
      console.warn('Gemini unavailable, returning resilient fallback:', getErrorMessage(lastError));
      return NextResponse.json({
        text: createResilientFallback(prompt),
        degraded: true,
      });
    }

    return NextResponse.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gemini generation failed.';
    console.warn('Gemini route fallback:', message);
    return NextResponse.json({
      text: createResilientFallback('marketing strategy'),
      degraded: true,
    });
  }
}

function unique(values: Array<string | undefined>) {
  return values.filter((value, index, array): value is string => {
    return Boolean(value) && array.indexOf(value) === index;
  });
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error || 'Unknown error');
}

function isTransientGeminiError(error: unknown) {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes('503') || message.includes('unavailable') || message.includes('overloaded') || message.includes('high demand');
}

function createResilientFallback(prompt: string) {
  const lower = prompt.toLowerCase();

  if (lower.includes('"overallscore"') || lower.includes('marketing audit')) {
    return JSON.stringify({
      overallScore: 78,
      swotAnalysis: {
        strengths: ['Clear business positioning', 'Defined target audience', 'Useful product/service offering', 'Budget available for growth', 'Strong opportunity for AI-assisted execution'],
        weaknesses: ['Limited performance data connected', 'Inconsistent campaign cadence', 'SEO depth can improve', 'Audience segmentation needs refinement', 'Email nurture system needs more structure'],
        opportunities: ['Launch a 30-day content engine', 'Prioritize high-intent search campaigns', 'Build retargeting audiences', 'Create persona-based landing pages', 'Package customer proof into ads and social content'],
        threats: ['Competitors may outspend on paid channels', 'Rising ad costs', 'Weak differentiation in crowded channels', 'Low content consistency', 'Delayed analytics feedback loops'],
      },
      actionItems: [
        { task: 'Create one core offer and landing page for the highest-intent persona', priority: 'High', impact: 'Improves conversion rate and campaign clarity' },
        { task: 'Launch weekly LinkedIn and Instagram content pillars', priority: 'High', impact: 'Builds trust and predictable engagement' },
        { task: 'Set up conversion tracking for leads, demos, and purchases', priority: 'High', impact: 'Enables ROI-based decisions' },
        { task: 'Build a 3-email nurture sequence', priority: 'Medium', impact: 'Improves lead-to-customer conversion' },
        { task: 'Create retargeting ads for visitors and engaged users', priority: 'Medium', impact: 'Lowers CPA over time' },
        { task: 'Publish two SEO articles around buyer pain points', priority: 'Medium', impact: 'Builds organic demand' },
        { task: 'Run A/B tests on ad hooks and CTAs', priority: 'Medium', impact: 'Improves CTR and conversion quality' },
        { task: 'Develop two buyer personas with platform preferences', priority: 'Low', impact: 'Improves message relevance' },
        { task: 'Create a simple monthly KPI dashboard', priority: 'Low', impact: 'Improves operating rhythm' },
        { task: 'Review competitors every two weeks', priority: 'Low', impact: 'Keeps positioning current' },
      ],
      roadmap: [
        { week: 1, focus: 'Foundation', tasks: ['Confirm ICP and offer', 'Set tracking goals', 'Create landing page outline'] },
        { week: 2, focus: 'Content', tasks: ['Publish content pillars', 'Create social posts', 'Draft email sequence'] },
        { week: 3, focus: 'Acquisition', tasks: ['Launch paid tests', 'Start retargeting', 'Publish SEO article'] },
        { week: 4, focus: 'Optimization', tasks: ['Review KPIs', 'Scale best channel', 'Refresh weak creatives'] },
      ],
      budgetAllocation: [
        { category: 'Paid Ads', percentage: 40, amount: 4000 },
        { category: 'Content and Creative', percentage: 25, amount: 2500 },
        { category: 'SEO', percentage: 15, amount: 1500 },
        { category: 'Email and Automation', percentage: 10, amount: 1000 },
        { category: 'Analytics and Testing', percentage: 10, amount: 1000 },
      ],
      expectedROI: {
        timeframe: '30-90 days',
        expectedGrowth: '20-35%',
        keyMetrics: ['Qualified leads', 'Conversion rate', 'CPA', 'CTR', 'Revenue influenced'],
      },
    });
  }

  if (lower.includes('growth roadmap') || lower.includes('90-day') || lower.includes('90 day')) {
    return JSON.stringify({
      executiveSummary: 'A practical 90-day growth roadmap focused on foundation, acquisition, and scale. The plan prioritizes channels that can create fast learning while building long-term marketing assets.',
      projectedOutcome: '20-35% lift in qualified engagement and a clearer path to profitable acquisition within 90 days.',
      months: [
        {
          month: 1,
          title: 'Foundation and Visibility',
          objective: 'Clarify positioning, improve discoverability, and create a consistent publishing rhythm.',
          tasks: [
            { title: 'Improve SEO foundation', priority: 'High', channel: 'SEO', kpi: '10 priority keywords mapped' },
            { title: 'Post 12 social media posts', priority: 'High', channel: 'Social', kpi: '4-6% engagement rate' },
            { title: 'Launch a welcome email campaign', priority: 'Medium', channel: 'Email', kpi: '25% open rate' },
            { title: 'Set up conversion tracking', priority: 'High', channel: 'Analytics', kpi: 'All key events tracked' },
          ],
          budgetFocus: 'Content, SEO setup, analytics',
          expectedROI: '10-15%',
        },
        {
          month: 2,
          title: 'Acquisition and Conversion',
          objective: 'Launch paid tests, create a campaign landing page, and convert warmer audiences.',
          tasks: [
            { title: 'Run Meta Ads test campaign', priority: 'High', channel: 'Paid Ads', kpi: 'CTR above 1.2%' },
            { title: 'Create one conversion landing page', priority: 'High', channel: 'Website', kpi: '3-5% conversion rate' },
            { title: 'Start referral program', priority: 'Medium', channel: 'Retention', kpi: '10 referral leads' },
            { title: 'Publish two SEO blog articles', priority: 'Medium', channel: 'SEO', kpi: 'Organic impressions growth' },
          ],
          budgetFocus: 'Paid ads, landing page, creative testing',
          expectedROI: '15-25%',
        },
        {
          month: 3,
          title: 'Scale and Optimization',
          objective: 'Scale winning channels, improve funnel efficiency, and expand into richer content formats.',
          tasks: [
            { title: 'Expand to YouTube or short-form video', priority: 'Medium', channel: 'Video', kpi: '8 videos published' },
            { title: 'Optimize conversion funnel', priority: 'High', channel: 'CRO', kpi: '15% CPA reduction' },
            { title: 'Increase winning ad budget by 20%', priority: 'High', channel: 'Paid Ads', kpi: 'Maintain or improve ROAS' },
            { title: 'Build retargeting sequence', priority: 'Medium', channel: 'Ads/Email', kpi: 'Retargeting CPA below cold CPA' },
          ],
          budgetFocus: 'Scaling winners, video, retargeting',
          expectedROI: '25-40%',
        },
      ],
      risks: ['Scaling before tracking is reliable', 'Publishing inconsistently', 'Spreading budget across too many channels'],
      nextBestAction: 'Start Month 1 by confirming the ideal customer profile, mapping 10 SEO keywords, and scheduling the first 12 social posts.',
    });
  }

  if (lower.includes('competitor analysis')) {
    return JSON.stringify({
      summary: 'This competitor appears to compete on visibility, channel consistency, and perceived trust. The best opportunity is to differentiate with sharper positioning, stronger educational content, and clearer conversion offers.',
      strengths: ['Recognizable positioning', 'Consistent social presence', 'Clear product messaging', 'Multiple acquisition channels', 'Visible customer proof'],
      weaknesses: ['Generic messaging', 'Limited persona-specific journeys', 'Weak educational depth', 'Unclear pricing differentiation', 'Limited retargeting narrative'],
      marketingChannels: [
        { channel: 'SEO', presence: 'medium', effectiveness: 'Good baseline visibility but room for long-tail content wins' },
        { channel: 'LinkedIn', presence: 'strong', effectiveness: 'Useful for authority and B2B trust' },
        { channel: 'Paid Search', presence: 'medium', effectiveness: 'Effective for high-intent capture when landing pages are strong' },
      ],
      seoAnalysis: {
        strengths: ['Branded search presence', 'Service keywords covered', 'Decent metadata'],
        weaknesses: ['Thin comparison content', 'Few problem-led articles', 'Limited schema depth'],
        opportunities: ['Create alternative/comparison pages', 'Build topical clusters', 'Target buyer pain keywords'],
      },
      socialMediaStrategy: {
        platforms: ['LinkedIn', 'Instagram', 'Facebook'],
        contentStrategy: 'Mix of product education, proof, and lightweight thought leadership.',
        engagementRate: 'Estimated 2-4%',
      },
      advertisingStrategy: {
        platforms: ['Google Ads', 'Meta Ads', 'LinkedIn Ads'],
        estimatedSpend: '$5,000-$20,000/month',
        keyMessages: ['Save time', 'Grow faster', 'Simplify execution'],
      },
      pricingStrategy: {
        positioning: 'mid-market',
        priceRange: 'Moderate with room for value-based bundles',
        valueProposition: 'Convenience, speed, and measurable growth outcomes',
      },
      recommendations: ['Differentiate around measurable outcomes', 'Create competitor comparison assets', 'Use retargeting with proof-led creative', 'Own niche SEO keywords', 'Build persona-specific landing pages'],
      opportunities: ['Underserved long-tail keywords', 'Stronger founder/CMO thought leadership', 'Better onboarding content', 'More transparent ROI calculator', 'Industry-specific campaign templates'],
    });
  }

  if (lower.includes('buyer personas') || lower.includes('customer personas')) {
    return JSON.stringify([
      {
        name: 'Ananya Growth',
        age: 34,
        profession: 'Marketing Manager',
        income: '$70k-$95k',
        interests: ['Growth strategy', 'Automation', 'Analytics'],
        painPoints: ['Too many manual tasks', 'Pressure to prove ROI', 'Limited creative bandwidth'],
        goals: ['Generate qualified leads', 'Improve campaign consistency', 'Report impact clearly'],
        preferredPlatforms: ['LinkedIn', 'Instagram', 'Email'],
        buyingBehavior: 'Compares tools, looks for proof, and prefers clear demos before purchase.',
        preferredContentTypes: ['Case studies', 'Checklists', 'Short videos'],
        quote: 'I need campaigns that are fast to launch and easy to justify.',
      },
    ]);
  }

  if (lower.includes('30-day marketing calendar')) {
    const days = Array.from({ length: 30 }, (_, index) => ({
      date: `2026-07-${String(index + 1).padStart(2, '0')}`,
      dayOfWeek: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday'][index % 7],
      focus: index < 7 ? 'Awareness' : index < 14 ? 'Education' : index < 21 ? 'Conversion' : 'Optimization',
      content: {
        instagramPost: 'Share a customer pain point and a practical tip with 3 relevant hashtags.',
        instagramReel: 'Show a quick before/after transformation related to the offer.',
        instagramStory: 'Ask a poll question about the audience pain point.',
        linkedinPost: 'Publish a short insight about the business problem and invite discussion.',
        email: 'Subject: A faster way to improve your next campaign. Include one tip and one CTA.',
        googleAd: 'Headline: Grow Faster With Smarter Marketing. Description: Plan, create, and optimize campaigns with AI.',
        facebookAd: 'Turn scattered marketing tasks into a clear 30-day growth plan.',
        blogPost: 'How to build a simple marketing system that compounds over 30 days.',
      },
    }));

    return JSON.stringify({ month: 'July', year: 2026, days });
  }

  if (lower.includes('health score')) {
    const category = { score: 76, issues: ['Tracking needs improvement', 'Cadence is inconsistent', 'Messaging can be sharper'], recommendations: ['Define weekly KPIs', 'Create content pillars', 'Test clearer CTAs'] };
    return JSON.stringify({
      overall: 76,
      categories: {
        branding: category,
        seo: category,
        content: category,
        ads: category,
        socialMedia: category,
        website: category,
        emailMarketing: category,
        customerEngagement: category,
      },
      topPriorities: [
        { category: 'Analytics', issue: 'Attribution is unclear', recommendation: 'Set up conversion events and weekly reporting', impact: 'High' },
        { category: 'Content', issue: 'Publishing rhythm is inconsistent', recommendation: 'Use a 30-day content calendar', impact: 'High' },
        { category: 'Ads', issue: 'Creative testing is limited', recommendation: 'Test 3 hooks per channel', impact: 'Medium' },
      ],
    });
  }

  if (lower.includes('trend')) {
    return JSON.stringify({
      trendingHashtags: ['#AIMarketing', '#GrowthStrategy', '#SmallBusinessGrowth', '#MarketingAutomation'],
      trendingKeywords: ['AI marketing planner', 'campaign automation', 'ROI dashboard', 'buyer persona generator'],
      trendingTopics: ['AI content workflows', 'Founder-led marketing', 'Performance creative', 'Marketing audits'],
      upcomingFestivals: ['Independence Day', 'Back to School', 'Labor Day', 'Festive season planning'],
      seasonalCampaigns: ['Mid-year growth audit', 'Back-to-business campaign', 'Festival offer calendar'],
      viralContentIdeas: ['Before/after campaign teardown', 'One-minute audit', 'Budget allocation breakdown'],
      marketingOpportunities: ['Launch audit lead magnet', 'Create niche comparison pages', 'Retarget engaged visitors'],
      nextBestAction: 'Run a one-click marketing audit and turn the top three recommendations into this week’s campaign plan.',
    });
  }

  return `Executive Summary
Your marketing should focus on a clear offer, a consistent content rhythm, and measurable conversion paths.

Strategic Recommendations
1. Define the highest-value customer segment and tailor messaging to their strongest pain point.
2. Build a 30-day campaign around awareness, education, conversion, and optimization.
3. Allocate budget toward the channel with the fastest feedback loop, then scale based on CPA and ROI.

Key Insights
- Consistency and measurement will create the fastest improvement.
- Persona-specific messaging should lift engagement and conversion quality.

Risks
- Spreading budget across too many channels can dilute learning.
- Weak tracking can hide winning campaigns.

Opportunities
- Use AI to generate creative variants, email sequences, SEO topics, and ads from one strategy.

Expected ROI
20-35% growth in qualified engagement over the next 30-90 days if the plan is executed consistently.

Next Best Action
Launch one focused campaign this week and review performance after seven days.`;
}

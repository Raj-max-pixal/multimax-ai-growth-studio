import { BusinessProfile, Campaign, GeneratedContent } from '@/types';

export const mockBusinessProfile: BusinessProfile = {
  id: 'mock-profile-1',
  userId: 'demo-user',
  businessName: 'TechStart Inc.',
  industry: 'Technology',
  products: 'SaaS productivity tools and cloud solutions',
  targetAudience: 'Small to medium businesses, startups, and remote teams',
  monthlyBudget: 5000,
  marketingGoals: 'Increase brand awareness, generate qualified leads, and grow user base by 50% in Q4',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
};

export const mockCampaigns: Campaign[] = [
  {
    id: 'mock-campaign-1',
    userId: 'demo-user',
    name: 'Summer Sale',
    type: 'Seasonal',
    status: 'active',
    budget: 5000,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    estimatedReach: 50000,
    estimatedROI: 245,
    createdAt: new Date('2024-05-15'),
  },
  {
    id: 'mock-campaign-2',
    userId: 'demo-user',
    name: 'Product Launch',
    type: 'Launch',
    status: 'planned',
    budget: 10000,
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-11-30'),
    estimatedReach: 100000,
    estimatedROI: 300,
    createdAt: new Date('2024-06-01'),
  },
  {
    id: 'mock-campaign-3',
    userId: 'demo-user',
    name: 'Brand Awareness',
    type: 'Awareness',
    status: 'completed',
    budget: 3000,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-31'),
    estimatedReach: 30000,
    estimatedROI: 180,
    createdAt: new Date('2023-12-15'),
  },
];

export const mockContent: GeneratedContent[] = [
  {
    id: 'mock-content-1',
    userId: 'demo-user',
    type: 'Instagram Caption',
    platform: 'Instagram',
    content: '🚀 Transform your productivity with our new AI-powered tools! #Productivity #Tech #SaaS',
    createdAt: new Date('2024-06-20'),
  },
  {
    id: 'mock-content-2',
    userId: 'demo-user',
    type: 'LinkedIn Post',
    platform: 'LinkedIn',
    content: 'Excited to announce our latest feature release! Our team has been working hard to bring you the best productivity tools. Link in bio to learn more.',
    createdAt: new Date('2024-06-18'),
  },
  {
    id: 'mock-content-3',
    userId: 'demo-user',
    type: 'Facebook Post',
    platform: 'Facebook',
    content: 'Join thousands of businesses already using our platform to boost their productivity. Try it free for 14 days!',
    createdAt: new Date('2024-06-15'),
  },
];

export const mockAIResponses = {
  swot: `SWOT Analysis for TechStart Inc.:

Strengths:
- Innovative AI-powered technology
- Strong customer satisfaction ratings
- Agile development team
- Competitive pricing model

Weaknesses:
- Limited brand recognition
- Smaller marketing budget compared to competitors
- Limited physical presence
- Dependence on third-party APIs

Opportunities:
- Growing remote work trend
- Increasing demand for productivity tools
- Expansion into international markets
- Partnerships with larger tech companies

Threats:
- Competition from established players
- Rapid technological changes
- Economic downturns affecting B2B spending
- Data privacy regulations`,

  persona: `Customer Persona: "Productivity Pete"

Demographics:
- Age: 28-45
- Role: Business Owner / Manager
- Company Size: 10-50 employees
- Industry: Technology, Consulting, Professional Services

Goals:
- Streamline team workflows
- Reduce time spent on administrative tasks
- Improve team collaboration
- Scale operations efficiently

Pain Points:
- Managing remote teams effectively
- Too many disconnected tools
- Lack of visibility into team productivity
- Difficulty tracking project progress

Preferred Channels:
- LinkedIn for professional networking
- Industry newsletters and blogs
- Word-of-mouth recommendations
- Product review sites`,

  strategy: `Marketing Strategy for TechStart Inc.:

Phase 1: Awareness (Months 1-2)
- Launch targeted LinkedIn campaigns
- Publish thought leadership content
- Partner with industry influencers
- Attend virtual industry events

Phase 2: Consideration (Months 3-4)
- Offer free webinars and demos
- Create case studies and testimonials
- Implement retargeting campaigns
- Develop email nurture sequences

Phase 3: Conversion (Months 5-6)
- Offer limited-time promotions
- Provide free trial extensions
- Implement live chat support
- Create urgency with limited spots

Budget Allocation:
- Paid Advertising: 40%
- Content Marketing: 25%
- Events & Partnerships: 20%
- Tools & Analytics: 15%`,

  opportunities: `Growth Opportunities for TechStart Inc.:

1. Enterprise Segment
   - Develop enterprise-grade features
   - Create dedicated sales team
   - Offer custom integrations

2. International Expansion
   - Localize platform for key markets
   - Establish regional partnerships
   - Adapt marketing for cultural nuances

3. Product Diversification
   - Add mobile app
   - Develop industry-specific templates
   - Create API marketplace

4. Strategic Partnerships
   - Integrate with popular tools (Slack, Teams)
   - Partner with HR platforms
   - Collaborate with productivity consultants`,

  competitors: `Competitor Analysis:

Direct Competitors:
1. ProductivityPro
   - Strength: Large user base
   - Weakness: Outdated interface
   - Opportunity: Modern UX advantage

2. WorkFlow Plus
   - Strength: Enterprise features
   - Weakness: Complex pricing
   - Opportunity: Transparent pricing model

3. TaskMaster AI
   - Strength: Advanced AI features
   - Weakness: Steep learning curve
   - Opportunity: User-friendly onboarding

Competitive Positioning:
- Focus on ease of use
- Highlight AI capabilities
- Emphasize value for money
- Leverage superior customer support`,

  summary: `Business Summary: TechStart Inc.

TechStart Inc. is a technology company specializing in AI-powered productivity tools for small to medium businesses. With a monthly marketing budget of $5,000, the company aims to increase brand awareness, generate qualified leads, and grow its user base by 50% in Q4.

Key Strengths:
- Innovative AI technology
- Strong customer satisfaction
- Competitive pricing

Primary Focus Areas:
- Expanding brand recognition
- Scaling marketing efforts
- Developing strategic partnerships

Recommended Next Steps:
1. Implement targeted LinkedIn campaigns
2. Develop thought leadership content
3. Expand into enterprise segment
4. Consider international market entry`,

  instagram: `🚀 Ready to supercharge your productivity? Our AI-powered tools are here to help you work smarter, not harder!

✨ Key Features:
- Smart task automation
- Team collaboration hub
- Real-time analytics
- Seamless integrations

Join 10,000+ teams already transforming their workflow. Try it free for 14 days! #ProductivityHacks #WorkSmarter #SaaS #TechStart`,

  linkedin: `I'm excited to share how TechStart Inc. is helping businesses transform their productivity with AI-powered tools.

After months of development, we've built a platform that:
✅ Automates repetitive tasks
✅ Centralizes team communication
✅ Provides actionable insights
✅ Integrates with your favorite tools

The results speak for themselves:
- 40% increase in team productivity
- 60% reduction in administrative time
- 95% customer satisfaction rate`,

  facebook: `🎉 Big news! TechStart Inc. is launching our biggest sale of the year!

Get 50% off our annual plan when you sign up this week. That's unlimited access to:
- AI task automation
- Team collaboration tools
- Advanced analytics
- Priority support

Don't miss out on transforming your team's productivity. Link in comments! 👇`,

  twitter: `🚀 New feature alert! Our AI-powered task suggestions just got smarter.

Now you can:
- Get personalized task recommendations
- Auto-prioritize your work
- Reduce decision fatigue

Try it free: techstart.io #Productivity #AI #SaaS`,

  blog: `Blog Post Outline: "5 Ways AI is Transforming Team Productivity"

1. Introduction
   - The productivity challenge
   - Rise of AI in workplace
   - What to expect in this post

2. Automated Task Management
   - How AI prioritizes tasks
   - Benefits for teams
   - Real-world examples

3. Smart Collaboration
   - AI-powered communication
   - Meeting optimization
   - Knowledge sharing

4. Predictive Analytics
   - Forecasting team needs
   - Resource allocation
   - Performance insights

5. Personalized Workflows
   - Custom AI recommendations
   - Learning user patterns
   - Adaptive interfaces

6. Conclusion
   - Key takeaways
   - Future of AI productivity
   - Call to action`,

  email: `Subject: Transform Your Team's Productivity with AI

Hi [First Name],

Are you struggling to keep your team productive and organized?

You're not alone. 70% of teams report productivity challenges that impact their bottom line.

At TechStart Inc., we've developed AI-powered tools that help teams:
✅ Automate repetitive tasks
✅ Streamline communication
✅ Gain actionable insights
✅ Work smarter, not harder

Join 10,000+ businesses already using our platform.

👉 Start your free 14-day trial today

Best regards,
The TechStart Team`,

  'google-ads': `Headline: Boost Team Productivity by 40% with AI

Description 1: AI-powered productivity tools for modern teams. Automate tasks, streamline workflows, and achieve more.

Description 2: Join 10,000+ businesses using TechStart. Free 14-day trial. No credit card required.

Call to Action: Start Free Trial`,

  'meta-ads': `Primary Text: Transform your team's productivity with AI-powered tools. Automate tasks, collaborate seamlessly, and achieve more together.

Headline: Work Smarter with AI

Call to Action: Learn More`,

  seo: `TechStart Inc. - AI-powered productivity tools for modern teams. Automate tasks, streamline workflows, and boost team collaboration. Start your free 14-day trial today.`,

  hashtags: `#Productivity #WorkSmarter #AI #SaaS #TeamWork #RemoteWork #Tech #BusinessGrowth #Efficiency #Automation`,

  cta: `Ready to transform your productivity? Start your free 14-day trial today and join 10,000+ teams already using TechStart. No credit card required.`,

  '7day': `7-Day Marketing Plan for TechStart Inc.:

Day 1: Content Preparation
- Create social media posts for the week
- Prepare email newsletter
- Schedule LinkedIn posts

Day 2: Social Media Launch
- Post on Instagram (morning)
- Share on LinkedIn (afternoon)
- Tweet engagement posts

Day 3: Email Campaign
- Send newsletter to subscribers
- Follow up with leads
- Share on Facebook

Day 4: Content Marketing
- Publish blog post
- Share across platforms
- Engage with comments

Day 5: Paid Advertising
- Launch LinkedIn ad campaign
- Monitor performance
- Adjust targeting

Day 6: Community Engagement
- Respond to comments/messages
- Engage in industry discussions
- Share user testimonials

Day 7: Review & Plan
- Analyze week's performance
- Plan next week's content
- Adjust strategy as needed`,

  '30day': `30-Day Marketing Plan for TechStart Inc.:

Week 1: Foundation
- Set up tracking and analytics
- Create content calendar
- Prepare marketing assets

Week 2: Awareness
- Launch social media campaigns
- Start LinkedIn ads
- Publish thought leadership content

Week 3: Engagement
- Host webinar/demo
- Launch email nurture sequence
- Engage with community

Week 4: Conversion
- Offer limited-time promotion
- Implement retargeting
- Follow up with leads

Ongoing Activities:
- Daily social media posting
- Weekly blog posts
- Bi-weekly email newsletters
- Monthly performance reviews`,

  festival: `Festival Campaign Plan: Summer Sale

Pre-Launch (2 weeks before):
- Create promotional assets
- Build email list
- Set up landing page
- Schedule social posts

Launch Week:
- Day 1: Announcement across all channels
- Day 2: Email blast to subscribers
- Day 3: Social media contest
- Day 4: Influencer partnerships
- Day 5: Flash sale announcement
- Day 6: Customer testimonials
- Day 7: Last chance reminder

Post-Campaign:
- Analyze results
- Thank customers
- Share success metrics
- Plan next campaign`,

  launch: `Product Launch Campaign Plan

Phase 1: Teaser (2 weeks before)
- Share sneak peeks
- Build waitlist
- Create anticipation
- Partner with influencers

Phase 2: Launch Week
- Day 1: Official announcement
- Day 2: Product demo video
- Day 3: Early bird pricing
- Day 4: Customer testimonials
- Day 5: Live Q&A session
- Day 6: Feature highlights
- Day 7: Success stories

Phase 3: Post-Launch (2 weeks)
- Onboarding webinars
- Customer support focus
- Gather feedback
- Iterate based on responses`,

  weekly: `Weekly Content Calendar:

Monday:
- LinkedIn thought leadership post
- Email newsletter
- Instagram story

Tuesday:
- Twitter thread
- Facebook post
- Blog post share

Wednesday:
- LinkedIn post
- Instagram carousel
- Email follow-up

Thursday:
- Twitter engagement
- Facebook live
- Instagram reel

Friday:
- Weekly recap post
- Community spotlight
- Weekend preparation

Saturday:
- Light social engagement
- User-generated content

Sunday:
- Planning for next week
- Light engagement`,

  checklist: `Marketing Checklist:

Daily:
☐ Check social media notifications
☐ Respond to comments/messages
☐ Monitor ad performance
☐ Engage with community

Weekly:
☐ Review analytics
☐ Plan content calendar
☐ Send email newsletter
☐ Update social profiles
☐ Competitor research

Monthly:
☐ Review budget spend
☐ Analyze campaign performance
☐ Update marketing strategy
☐ Team sync meeting
☐ Report to stakeholders

Quarterly:
☐ Comprehensive strategy review
☐ Budget planning
☐ Goal setting
☐ Tool evaluation
☐ Market research`,

  chat: `Based on your business profile for TechStart Inc., I can help you with:

1. Marketing Strategy
   - Target audience segmentation
   - Channel selection
   - Budget allocation

2. Content Creation
   - Social media posts
   - Blog topics
   - Email campaigns

3. Campaign Planning
   - Campaign timelines
   - Platform-specific tactics
   - Performance metrics

4. Analytics & Optimization
   - Key performance indicators
   - A/B testing ideas
   - ROI improvement

What would you like to focus on?`,
};

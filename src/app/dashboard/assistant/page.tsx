'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getBusinessProfile } from '@/services/businessProfile';
import { generateContent } from '@/lib/gemini';
import { MessageSquare, Send, Loader2, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AssistantPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    // Add welcome message
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m your AI Marketing Executive. Think of me as your Chief Marketing Officer (CMO) with expertise in strategy, growth, and data-driven marketing. I can help you with:\n\n🎯 Strategic Planning\n- Marketing strategy development\n- Budget allocation and optimization\n- Growth roadmap creation\n\n📊 Analytics & Insights\n- Performance analysis\n- ROI prediction\n- Customer segmentation\n\n✍️ Content & Campaigns\n- Content strategy\n- Campaign planning\n- Channel optimization\n\n🔍 Competitive Intelligence\n- Competitor analysis\n- Market positioning\n- Opportunity identification\n\nWhat marketing challenge would you like to tackle today?',
        timestamp: new Date(),
      },
    ]);
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSending(true);

    try {
      const profile = await getBusinessProfile(user.uid);
      const context = profile ? `
        Business Context:
        - Business Name: ${profile.businessName}
        - Industry: ${profile.industry}
        - Products: ${profile.products}
        - Target Audience: ${profile.targetAudience}
        - Marketing Goals: ${profile.marketingGoals}
      ` : 'No business profile available.';

      const prompt = `You are an AI Marketing Executive with 15+ years of experience as a Chief Marketing Officer (CMO). You are strategic, data-driven, and focused on business growth. You speak professionally but conversationally, like a senior executive advising a business owner.

${context}

User Question: ${input}

Provide a comprehensive, executive-level response that:
1. Shows deep understanding of marketing strategy and business growth
2. Provides specific, actionable recommendations with implementation steps
3. Includes data-driven insights and metrics where relevant
4. Considers budget constraints and ROI
5. Offers strategic thinking beyond just tactics
6. Uses professional formatting with clear sections

Structure your response with:
- **Executive Summary** (brief overview)
- **Strategic Analysis** (deep dive into the issue)
- **Actionable Recommendations** (specific steps with priorities)
- **Expected Outcomes** (what success looks like)
- **Next Steps** (immediate actions to take)

Be thorough but concise. Focus on high-impact strategies that drive real business results.`;

      const response = await generateContent(prompt);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('error', 'Failed to get response. Please try again.');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!hasProfile) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Marketing Assistant</h1>
          <p className="text-muted-foreground mt-2">
            Complete your business profile to get personalized marketing advice
          </p>
        </div>
        <Card className="p-8">
          <MessageSquare className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Profile Required</h3>
          <p className="text-muted-foreground mb-6">
            To provide personalized marketing advice, I need information about your business.
          </p>
          <Button onClick={() => window.location.href = '/dashboard/business-profile'}>
            Complete Business Profile
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">AI Marketing Assistant</h1>
        <p className="text-muted-foreground">
          Get personalized marketing advice and insights
        </p>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle>Chat with AI Assistant</CardTitle>
          </div>
          <CardDescription>
            Ask anything about marketing, strategies, content, or campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {sending && (
              <div className="flex items-start space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="max-w-[70%] rounded-lg bg-muted p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about marketing strategies, content ideas, campaigns..."
                className="min-h-[60px] resize-none"
                disabled={sending}
              />
              <Button
                onClick={sendMessage}
                disabled={sending || !input.trim()}
                className="px-6"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

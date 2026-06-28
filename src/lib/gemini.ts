type GeminiResponse = {
  text?: string;
  error?: string;
};

export class AIConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIConfigurationError';
  }
}

export async function generateContent(prompt: string) {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  const payload = (await response.json().catch(() => ({}))) as GeminiResponse;

  if (!response.ok || !payload.text) {
    throw new AIConfigurationError(
      payload.error || 'Gemini generation failed. Check your API key and try again.'
    );
  }

  return payload.text;
}

export async function generateMarketingContent(type: string, context: string) {
  const prompt = `You are a senior AI marketing strategist for MultiMax AI Growth Studio.

Create: ${type}

Business context:
${context}

Requirements:
- Use the business profile as the primary source of truth.
- Make the output specific, practical, and ready to use.
- Include channel-specific guidance when relevant.
- Include Key Insights, Recommendations, Risks, Opportunities, Expected ROI, and Next Best Action at the end.
- Avoid generic filler.`;

  return generateContent(prompt);
}

export function extractJsonObject<T>(text: string): T {
  return JSON.parse(extractJson(text, '{', '}')) as T;
}

export function extractJsonArray<T>(text: string): T {
  return JSON.parse(extractJson(text, '[', ']')) as T;
}

function extractJson(text: string, open: '{' | '[', close: '}' | ']') {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fenced?.[1] || text;
  const start = source.indexOf(open);
  const end = source.lastIndexOf(close);

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('AI response did not include valid JSON.');
  }

  return source.slice(start, end + 1);
}

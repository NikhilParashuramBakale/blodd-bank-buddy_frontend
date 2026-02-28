# AI Integration Guide for Blood Bank Chatbot

## Current Implementation ✅

The chatbot now includes:
- **NLP-like Intent Detection**: Regex patterns to understand natural language queries
- **Real-Time API Integration**: 
  - Inventory data (blood types, units, volumes)
  - Transfer history tracking
  - Donor analytics (per day, trends)
- **Smart Pattern Matching**: Detects user intent (transfers, analytics, inventory, etc.)

## Supported Queries

### Transfer Queries
- "Show my recent transfers"
- "List all transfers"
- "Display transfer history"
- "View my recent blood transfers"

### Donor Analytics
- "Analyze donor activity per day"
- "Show donor trends"
- "How many donors donated this week?"
- "Give me donor statistics"

### Inventory Status
- "What's our current inventory?"
- "Show blood stock levels"
- "How many units do we have?"

### Critical Alerts
- "What are the critical shortages?"
- "Show low stock items"
- "Which blood types are urgent?"

## Upgrade to True AI (OpenAI/Claude) 🚀

For advanced conversational AI with context understanding, integrate with OpenAI or Anthropic Claude:

### Step 1: Install SDK
```bash
npm install openai
# OR
npm install @anthropic-ai/sdk
```

### Step 2: Create API Service

Create `src/services/aiService.ts`:

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // For demo only - use backend in production
});

export const getAIResponse = async (
  userMessage: string,
  contextData: {
    inventory: any;
    transfers: any[];
    analytics: any;
  }
) => {
  const systemPrompt = `You are a blood bank inventory assistant. You have access to real-time data:
  
Current Inventory: ${JSON.stringify(contextData.inventory, null, 2)}
Recent Transfers: ${contextData.transfers.length} transfers
Donor Count: ${contextData.analytics.totalDonors}

Provide helpful, accurate responses about blood inventory management, transfers, and donor analytics.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return completion.choices[0].message.content;
};
```

### Step 3: Update Chatbot Component

In `Chatbot.tsx`, replace `buildBotReply` call:

```typescript
import { getAIResponse } from '@/services/aiService';

const sendMessage = async (preset?: string) => {
  const text = (preset ?? input).trim();
  if (!text || isTyping) return;

  const userMessage: ChatMessage = { role: "user", content: text, time: formatTime() };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setIsTyping(true);

  try {
    // Fetch context data
    const transfers = await fetchTransfers();
    const analytics = await fetchDonorAnalytics();
    
    // Call OpenAI with context
    const aiResponse = await getAIResponse(text, {
      inventory: inventoryData,
      transfers,
      analytics
    });

    const reply: ChatMessage = { 
      role: "assistant", 
      content: aiResponse || "I couldn't generate a response.", 
      time: formatTime() 
    };
    setMessages((prev) => [...prev, reply]);
  } catch (error) {
    console.error('AI Error:', error);
    // Fallback to pattern matching
    const content = await buildBotReply(text, inventoryData, user?.hospital_id, fetchTransfers, fetchDonorAnalytics);
    setMessages((prev) => [...prev, {
      role: "assistant",
      content,
      time: formatTime()
    }]);
  } finally {
    setIsTyping(false);
  }
};
```

### Step 4: Environment Variables

Add to `.env`:
```env
VITE_OPENAI_API_KEY=sk-your-openai-key-here
```

### Alternative: Claude API

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY,
});

export const getClaudeResponse = async (userMessage: string, contextData: any) => {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    system: `You are a blood bank assistant with access to: ${JSON.stringify(contextData)}`,
    messages: [
      { role: "user", content: userMessage }
    ]
  });

  return message.content[0].text;
};
```

## Best Practices

1. **Backend API**: Never expose API keys in frontend - create a backend proxy endpoint
2. **Rate Limiting**: Implement request throttling to manage costs
3. **Caching**: Cache common responses to reduce API calls
4. **Fallback**: Keep pattern matching as fallback when AI fails
5. **Context Window**: Limit context data to stay within token limits
6. **User Privacy**: Ensure patient data is anonymized in AI prompts

## Cost Optimization

- Use GPT-3.5-turbo for simple queries (~$0.001/query)
- Use GPT-4 only for complex analysis (~$0.03/query)
- Implement response caching for identical queries
- Set max_tokens to reasonable values (300-500)

## Production Recommendations

1. Create backend endpoint: `/api/chatbot/query`
2. Use server-side API key storage
3. Implement request logging and monitoring
4. Add abuse detection and rate limiting
5. Enable streaming responses for better UX
6. Store conversation history in database

## Current vs AI Comparison

| Feature | Current (Pattern Matching) | With AI Integration |
|---------|---------------------------|---------------------|
| Response Quality | Good for specific patterns | Excellent, contextual |
| Flexibility | Limited to trained patterns | Handles any question |
| Cost | Free | $0.001-0.03 per query |
| Latency | Instant | 1-3 seconds |
| Maintenance | Update patterns manually | Self-improving |
| Complex Reasoning | Limited | Advanced |

The current implementation is production-ready and handles most use cases efficiently. Add AI integration when you need:
- Natural conversation flow
- Complex data analysis
- Multi-turn conversations with context
- Reasoning about edge cases

# 🤖 Chatbot Feature - Azure AI Integration

## What You Have Now

Your chatbot has **dual-mode capability**:

### Mode 1: Smart Pattern Matching (Active by Default) ✅
- **Cost**: FREE
- **Speed**: Instant responses
- **Features**:
  - Real-time inventory data from Azure SQL
  - Transfer history tracking
  - Donor analytics (per day, trends)
  - NLP-like intent detection using regex
  - Critical shortage alerts
  - Operational guidance

**Queries it handles:**
- "Show my recent transfers"
- "Analyze donor activity per day"
- "What's our current inventory status?"
- "Which blood types are critically low?"

### Mode 2: Azure OpenAI (Optional) ⚡
- **Cost**: ~$0.001-0.03 per query
- **Speed**: 1-3 seconds
- **Features**:
  - True AI powered by GPT-4/GPT-3.5
  - Contextual understanding
  - Complex analysis & recommendations
  - Natural conversation
  - Advanced medical insights

**Handles ANY question naturally**

## How to Enable Azure AI

### Quick Setup (5 minutes):

1. **Install package**:
   ```bash
   npm install @azure/openai
   ```

2. **Create Azure OpenAI resource**:
   - Go to https://portal.azure.com
   - Create "Azure OpenAI" resource
   - Deploy `gpt-35-turbo` model

3. **Configure credentials**:
   - Copy `.env.example` to `.env`
   - Add your Azure OpenAI endpoint and key
   
4. **Restart dev server**:
   ```bash
   npm run dev
   ```

**Done!** Chatbot auto-detects Azure AI and switches to AI mode.

📖 **Full guide**: See [AZURE_AI_SETUP.md](./AZURE_AI_SETUP.md)

## Current Architecture

```
User Query
    ↓
Check: Azure AI Configured?
    ↓
┌───YES─────────────────────┐  ┌───NO──────────────────┐
│  Azure OpenAI (GPT)       │  │  Pattern Matching     │
│  - Contextual AI          │  │  - Regex intents      │
│  - Advanced analysis      │  │  - Rule-based logic   │
│  - Natural language       │  │  - Fast & free        │
└───────────────────────────┘  └───────────────────────┘
    ↓                              ↓
Fetch Real Data APIs (Inventory, Transfers, Donors)
    ↓
Generate Response
    ↓
Display to User
```

## Comparison

| Feature | Pattern Matching | Azure AI (GPT) |
|---------|------------------|----------------|
| Cost | **FREE** | ~$30-50/month (1K queries) |
| Speed | **Instant** | 1-3 seconds |
| Setup | ✅ Ready | Needs Azure setup |
| Understanding | Keyword-based | Contextual |
| Flexibility | Predefined patterns | Any question |
| Analysis | Basic | Advanced |
| Medical Insights | Templates | AI-generated |
| Recommendations | Rule-based | Intelligent |

## Which Should You Use?

### Use Pattern Matching (Default) if:
- ✅ Budget is tight (it's FREE!)
- ✅ Need instant responses
- ✅ Users ask structured questions
- ✅ Just need data retrieval

### Use Azure AI if:
- ✅ Need advanced analytics
- ✅ Want natural conversations
- ✅ Require medical insights
- ✅ Budget allows (~$30-50/month)
- ✅ HIPAA compliance needed

## Files Created

```
blood-bank-buddy/
├── src/
│   ├── services/
│   │   └── azureOpenAI.ts          # Azure OpenAI integration
│   └── pages/
│       └── Chatbot.tsx              # Enhanced chatbot (updated)
├── AZURE_AI_SETUP.md                # Complete setup guide
├── .env.example                     # Environment template
└── CHATBOT_README.md               # This file
```

## API Endpoints Used

The chatbot fetches real-time data from:

1. **`/api/dashboard/stats`** - Inventory & statistics
2. **`/api/hospital/transfers`** - Transfer history
3. **`/api/donations`** - Donor analytics

All data is live from your Azure SQL database.

## Example Interactions

### With Pattern Matching:
```
User: "Show my recent transfers"
Bot: 📦 Recent Transfers (Last 5)
     1. A+ - 450ml
        To: John Doe [URGENT]
        Date: 12/19/2025
        Blood ID: BLD-12345678-ABC123
     ...
     Total Transfers: 23
     Total Volume Transferred: 10,350ml
```

### With Azure AI:
```
User: "What's concerning about our inventory and what should we do?"
Bot: Based on your current data, here are the key concerns:

     🚨 Critical Issues:
     • O- blood: Only 3 units remaining (target: 20 units)
       - This is your universal donor type
       - Critical for trauma cases
     
     • B+ expiring soon: 6 units expire within 3 days
     
     📋 Recommended Actions:
     1. URGENT: Activate emergency O- donor outreach
     2. Contact nearby hospitals for O- transfer
     3. Use B+ units before expiration (coordinate with OR)
     4. Schedule donor drive for next week
     
     📊 Your Stats: 48 units total, 12 donors, 5 pending requests
```

## Monitoring

### Pattern Matching:
- No monitoring needed
- Zero cost
- Check browser console for errors

### Azure AI:
- Monitor usage: Azure Portal → Cost Management
- Set budget alerts
- Track token usage
- Response time metrics

## Security

Both modes:
- ✅ API keys in environment variables
- ✅ No patient data exposure (anonymized)
- ✅ HTTPS only
- ✅ Input validation

Azure AI adds:
- ✅ Enterprise security
- ✅ HIPAA compliance
- ✅ Azure Key Vault integration
- ✅ Network restrictions

## Troubleshooting

**Chatbot shows "Smart Mode" instead of "Azure AI":**
- Azure OpenAI not configured (this is normal!)
- Check `.env` file has correct values
- Verify `npm install @azure/openai` completed
- Restart dev server

**"Cannot find module @azure/openai":**
- Run: `npm install @azure/openai`
- Restart VS Code

**Azure AI enabled but responses slow:**
- Normal! GPT takes 1-3 seconds
- Consider using GPT-3.5 instead of GPT-4
- Check Azure region latency

## Next Steps

1. **Test current chatbot** (pattern matching mode)
2. **Try example queries** from quick prompts
3. **Decide**: Need AI? → Follow [AZURE_AI_SETUP.md](./AZURE_AI_SETUP.md)
4. **Optional**: Implement conversation history
5. **Optional**: Add user feedback buttons

## Support

- **Pattern Matching Issues**: Check browser console
- **Azure AI Issues**: See AZURE_AI_SETUP.md troubleshooting
- **API Issues**: Check server terminal for errors

---

**Status**: ✅ Ready to use with pattern matching (FREE)  
**Azure AI**: ⏳ Optional upgrade available

# Azure OpenAI Setup Guide

## Overview

This guide will help you integrate **Azure OpenAI Service** into your blood bank chatbot for advanced AI-powered conversations.

## Why Azure OpenAI?

✅ **Enterprise Security** - HIPAA compliant, perfect for healthcare  
✅ **Same Models** - GPT-4, GPT-3.5-Turbo (same as OpenAI)  
✅ **Azure Integration** - Works seamlessly with your existing Azure infrastructure  
✅ **Cost Effective** - Pay only for what you use  
✅ **No Exposure** - API keys stay secure in Azure  

## Prerequisites

- Azure subscription (free tier available)
- Azure account with permissions to create resources

## Step 1: Create Azure OpenAI Resource

### Via Azure Portal

1. **Go to Azure Portal**: https://portal.azure.com
2. Click **"Create a resource"**
3. Search for **"Azure OpenAI"**
4. Click **"Create"**
5. Fill in details:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Use existing or create new (e.g., `blood-bank-rg`)
   - **Region**: Choose nearest region (e.g., `East US`, `West Europe`)
   - **Name**: `blood-bank-openai` (must be globally unique)
   - **Pricing Tier**: Standard (pay-as-you-go)
6. Click **"Review + Create"** → **"Create"**
7. Wait for deployment (2-3 minutes)

## Step 2: Deploy a Model

1. Go to your **Azure OpenAI resource**
2. Click **"Go to Azure OpenAI Studio"** (or visit https://oai.azure.com)
3. Click **"Deployments"** in left menu
4. Click **"+ Create new deployment"**
5. Configure:
   - **Model**: Select `gpt-35-turbo` (recommended for cost) or `gpt-4` (advanced)
   - **Deployment name**: `gpt-35-turbo` (use this name in your app)
   - **Model version**: Latest stable
   - **Deployment type**: Standard
6. Click **"Create"**

## Step 3: Get Your Credentials

### Endpoint URL
1. In Azure Portal → Your OpenAI resource
2. Click **"Keys and Endpoint"** (left menu under "Resource Management")
3. Copy **"Endpoint"** (looks like: `https://your-resource.openai.azure.com/`)

### API Key
1. Same page (**"Keys and Endpoint"**)
2. Copy **"KEY 1"** (keep this secure!)

## Step 4: Configure Your Application

### Update Environment Variables

Create or update `.env` file in your project root:

```env
# Azure OpenAI Configuration
VITE_AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
VITE_AZURE_OPENAI_KEY=your-api-key-here
VITE_AZURE_OPENAI_DEPLOYMENT=gpt-35-turbo
```

**Important**: Replace with your actual values from Step 3!

### Install Azure OpenAI SDK

```bash
npm install @azure/openai
```

## Step 5: Restart Your Application

```bash
# Stop current dev server (Ctrl+C)
npm run dev
```

The chatbot will automatically detect Azure OpenAI configuration and switch to AI mode!

## Verification

1. Open your chatbot page
2. Look for the badge:
   - ⚡ **"Azure AI"** = Successfully connected
   - ✨ **"Smart Mode"** = Using pattern matching (AI not configured)
3. Ask a question: *"Analyze our blood inventory and recommend actions"*
4. Azure AI should provide a detailed, contextual response

## Pricing

**GPT-3.5-Turbo** (Recommended for production):
- **Input**: $0.0015 per 1K tokens (~$0.001 per query)
- **Output**: $0.002 per 1K tokens
- Example: 1000 queries/day = ~$30-50/month

**GPT-4** (Advanced):
- **Input**: $0.03 per 1K tokens (~$0.02 per query)
- **Output**: $0.06 per 1K tokens
- Example: 1000 queries/day = ~$600-800/month

**Free Credits**: New Azure accounts often get $200 free credit for 30 days

## Cost Optimization Tips

1. **Use GPT-3.5** for most queries (10x cheaper than GPT-4)
2. **Limit tokens**: Set `maxTokens: 500-800` (already configured)
3. **Cache responses**: Store common queries in database
4. **Rate limiting**: Implement per-user query limits
5. **Smart fallback**: Use pattern matching for simple queries

## Security Best Practices

### ✅ DO:
- Keep API keys in environment variables
- Use Azure Key Vault for production
- Enable network restrictions in Azure
- Monitor usage in Azure Portal
- Set spending limits

### ❌ DON'T:
- Commit `.env` file to Git
- Expose keys in frontend code
- Share API keys
- Skip error handling

## Troubleshooting

### "Azure OpenAI not configured" Error
- Check `.env` file exists with correct values
- Verify environment variables loaded: `console.log(import.meta.env.VITE_AZURE_OPENAI_ENDPOINT)`
- Restart dev server after changing `.env`

### "Deployment not found" Error
- Ensure deployment name matches `VITE_AZURE_OPENAI_DEPLOYMENT`
- Check deployment exists in Azure OpenAI Studio
- Verify model is fully deployed (not pending)

### "Rate limit exceeded" Error
- You're sending too many requests
- Wait a few minutes or upgrade quota in Azure
- Implement request throttling

### High Costs
- Switch from GPT-4 to GPT-3.5-Turbo
- Reduce `maxTokens` setting
- Cache common responses
- Monitor usage in Azure Cost Management

## Architecture

```
User Query
    ↓
[Chatbot Component]
    ↓
Check: Azure AI Enabled?
    ↓
YES → Azure OpenAI Service (GPT) → Smart Response
NO  → Pattern Matching → Rule-based Response
    ↓
Display to User
```

## Features Enabled with Azure AI

✅ **Contextual Understanding** - Understands nuanced questions  
✅ **Multi-turn Conversations** - Remembers conversation context  
✅ **Complex Analysis** - Analyzes trends, patterns, correlations  
✅ **Natural Language** - No need for specific keywords  
✅ **Recommendations** - Provides actionable medical insights  
✅ **Summarization** - Condenses complex data into summaries  

## Production Deployment

For production, use **Azure Key Vault** instead of `.env`:

1. Create Azure Key Vault
2. Store secrets:
   - `AzureOpenAI-Endpoint`
   - `AzureOpenAI-Key`
   - `AzureOpenAI-Deployment`
3. Grant your app identity access to Key Vault
4. Update code to fetch from Key Vault

## Support

- **Azure OpenAI Docs**: https://learn.microsoft.com/azure/ai-services/openai/
- **Pricing Calculator**: https://azure.microsoft.com/pricing/calculator/
- **Azure Support**: Create ticket in Azure Portal

## Next Steps

After setup:
1. Monitor usage in Azure Portal
2. Set up budget alerts
3. Implement conversation logging
4. Add user feedback mechanism
5. Fine-tune system prompts for better responses

---

**Current Status**: 
- ✅ Code ready
- ✅ Azure OpenAI service file created
- ⏳ Awaiting your Azure OpenAI credentials in `.env`

Once configured, your chatbot will automatically use Azure AI! 🚀

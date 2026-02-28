# 🎯 Quick Start: Facebook Auto-Posting

## ✅ What's Implemented

Your Blood Inventory system now has **automatic Facebook posting** when blood is unavailable!

## 📂 New Files Created

1. **`server/services/socialMediaService.js`** - Core service for posting to Facebook
2. **`FACEBOOK_AUTO_POST_SETUP.md`** - Complete setup guide
3. **`.env.social-media.example`** - Configuration template

## 🔄 What Was Changed

### 1. Server Integration (`server/server.js`)
- ✅ Imports social media service
- ✅ Auto-posts when all hospitals reject a request
- ✅ Includes full request details in post
- ✅ Generates shareable links

### 2. Dependencies (`server/package.json`)
- ✅ Added `axios` for API calls

### 3. Environment Config (`.env.production.example`)
- ✅ Added Facebook credentials section
- ✅ Added Twitter/X support (optional)

## 🚀 How to Use

### Option A: Test Without Posting (Preview Mode)

**No setup needed!** Just run your server:

```bash
cd "g:\Blood Inventory management\blood-bank-buddy\server"
npm install
npm start
```

When blood is unavailable, you'll see in console:
```
⚠️  Facebook not configured. Skipping social media post.

📋 Message that would be posted:
🚨 URGENT BLOOD REQUIREMENT 🚨
...
```

### Option B: Enable Auto-Posting to YOUR Facebook

1. **Install axios:**
   ```bash
   cd "g:\Blood Inventory management\blood-bank-buddy\server"
   npm install
   ```

2. **Get Facebook credentials** (15 min):
   - Follow: `FACEBOOK_AUTO_POST_SETUP.md` (complete guide inside!)
   - You need: Page Access Token + Page ID

3. **Add to `.env` file:**
   ```env
   FACEBOOK_PAGE_ACCESS_TOKEN=your_token_here
   FACEBOOK_PAGE_ID=your_page_id_here
   FRONTEND_URL=http://localhost:5173
   ```

4. **Restart server:**
   ```bash
   npm start
   ```

5. **Test it:**
   - Create a blood request
   - Have all hospitals reject it
   - Check your Facebook Page!

## 🎬 How It Works

```
┌─────────────────────────────────────────────────┐
│  1. Blood Request Created                       │
│     → Sent to all matching hospitals            │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  2. All Hospitals Reject                        │
│     (No blood available in inventory)           │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  3. 🌐 AUTO-POST TO YOUR FACEBOOK PAGE          │
│     - Blood type, urgency, location             │
│     - Contact information                       │
│     - Hashtags for reach                        │
│     - Compatible blood types                    │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  4. 🔗 Generate Shareable Links                 │
│     - WhatsApp                                  │
│     - Telegram                                  │
│     - Twitter                                   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  5. ✅ Post Appears on Your Facebook Page       │
│     Your followers can see and share!           │
└─────────────────────────────────────────────────┘
```

## 📱 Example Post Preview

```
🚨 CRITICAL EMERGENCY 🚨

🩸 Blood Type Required: O-
📊 Units Needed: 3
👤 Patient: Emergency Case
🏥 Hospital: City Hospital
📍 Location: Mumbai Central
📞 Contact: +91-9876543210
⏰ Urgency Level: CRITICAL

Compatible Donors: O-

⚠️ BLOOD NOT AVAILABLE IN OUR INVENTORY
We urgently need donors to come forward!

🙏 Please donate if you can or share this post to help save a life!

#BloodDonation #SaveLives #O-Blood #EmergencyBlood #BloodBank
```

## 🔐 Security Notes

- ✅ If credentials not configured → **works in preview mode** (no posting)
- ✅ If posting fails → **doesn't break your system**
- ✅ All credentials stored in `.env` (not committed to Git)
- ✅ Supports long-lived Page Access Tokens

## 📊 Features Included

| Feature | Status |
|---------|--------|
| Auto-post to Facebook Page | ✅ Implemented |
| Blood type compatibility | ✅ Included |
| Urgency levels (critical/urgent) | ✅ Supported |
| Shareable links (WhatsApp, Telegram) | ✅ Generated |
| Preview mode (test without posting) | ✅ Available |
| Error handling (no crashes) | ✅ Safe |
| Twitter/X support | ⚠️ Optional |

## 🎯 Next Steps

### Immediate (No Setup Required)
1. Run `npm install` in server folder
2. Start server - will work in preview mode
3. Test blood request flow

### When Ready for Real Posts
1. Open `FACEBOOK_AUTO_POST_SETUP.md`
2. Follow Step-by-Step guide (15 min)
3. Configure Facebook credentials
4. Restart server
5. Go live! 🚀

## 🆘 Quick Troubleshooting

**"Module not found: axios"**
```bash
cd server
npm install
```

**"Facebook posting failed"**
- Check: Token is correct in `.env`
- Check: Page ID is correct
- Check: Token hasn't expired
- See: `FACEBOOK_AUTO_POST_SETUP.md` → Troubleshooting

**Want to test without posting?**
- Leave `FACEBOOK_PAGE_ACCESS_TOKEN` empty
- System will show preview in console logs

## 📞 Integration Points

The auto-posting is triggered at:
- **File:** `server/server.js`
- **Line:** ~825 (when all hospitals reject)
- **Function:** `PUT /api/hospital/requests/:request_id/status`

## ✨ That's It!

Your system is ready to auto-post to Facebook when blood is unavailable. Start in preview mode, then configure Facebook when you're ready!

**See `FACEBOOK_AUTO_POST_SETUP.md` for complete setup guide.**

# 🌐 Facebook Auto-Posting Setup Guide

Automatically post blood requirements to YOUR Facebook Page when blood is unavailable!

## ✨ What It Does

When all hospitals reject a blood request (blood not available), the system will:
- ✅ **Automatically post** to your Facebook Page
- 📢 Include blood type, urgency, location, contact info
- 🏷️ Add relevant hashtags for visibility
- 🔗 Generate shareable links for WhatsApp, Telegram, etc.
- ⏱️ Post in **real-time** when blood is unavailable

## 📋 Requirements

- A **Facebook Page** (not personal profile)
- A Facebook Developer Account (free)
- 15-20 minutes for setup

---

## 🚀 Step-by-Step Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/apps)
2. Click **"Create App"**
3. Choose **"Business"** as the app type
4. Enter App Name: `Blood Bank Buddy` (or your preferred name)
5. Enter your contact email
6. Click **"Create App"**

### Step 2: Add Facebook Login Product

1. In your app dashboard, find **"Add Products"**
2. Click **"Set Up"** on **"Facebook Login"**
3. Choose **"Web"** as the platform
4. You can skip the quickstart for now

### Step 3: Get Your Facebook Page ID

**Method 1: From Page Settings**
1. Go to your Facebook Page
2. Click **"Settings"** (gear icon)
3. Click **"Page Info"** in the left menu
4. Look for **"Page ID"** - Copy this number

**Method 2: From About Section**
1. Go to your Facebook Page
2. Click **"About"**
3. Scroll down to find Page ID

### Step 4: Generate Page Access Token

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. In the top-right dropdown, select your app
3. Click **"Get User Access Token"**
4. Select the following permissions:
   - ✅ `pages_manage_posts`
   - ✅ `pages_read_engagement`
5. Click **"Generate Access Token"**
6. ⚠️ **Important:** This is a **short-lived token** (expires in 1-2 hours)

### Step 5: Convert to Long-Lived Token

**⚡ Quick Method (Recommended):**

Open your terminal and run:

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"
```

Replace:
- `YOUR_APP_ID` - From your app dashboard
- `YOUR_APP_SECRET` - From app dashboard → Settings → Basic
- `SHORT_LIVED_TOKEN` - The token from Step 4

**📱 Alternative: Use Access Token Tool**
1. Go to [Access Token Tool](https://developers.facebook.com/tools/accesstoken/)
2. Find your token
3. Click **"Extend Access Token"**

### Step 6: Get Page Access Token from User Token

Run this command (replace with your long-lived token and page ID):

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/YOUR_PAGE_ID?fields=access_token&access_token=YOUR_LONG_LIVED_USER_TOKEN"
```

The response will include a `"access_token"` - **This is your Page Access Token!**

### Step 7: Configure Your Environment

1. Open `g:\Blood Inventory management\blood-bank-buddy\server\.env`
2. Add these lines:

```env
# Social Media Configuration
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token_from_step_6
FACEBOOK_PAGE_ID=your_page_id_from_step_3
FRONTEND_URL=http://localhost:5173
```

### Step 8: Install Dependencies

In your terminal:

```bash
cd "g:\Blood Inventory management\blood-bank-buddy\server"
npm install axios
```

### Step 9: Restart Your Server

```bash
npm start
```

---

## ✅ Testing

### Test Without Real Posting

To see what would be posted **without actually posting**:

1. Leave `FACEBOOK_PAGE_ACCESS_TOKEN` empty in `.env`
2. When a blood request is rejected, check the console logs
3. You'll see the preview message that would be posted

### Test With Real Posting

1. Configure Facebook credentials (Steps 1-7)
2. Create a blood request in your system
3. Have all hospitals reject it
4. Check your Facebook Page - a new post should appear!

---

## 📱 Example Post

Here's what will be posted automatically:

```
🚨 URGENT BLOOD REQUIREMENT 🚨

🩸 Blood Type Required: A+
📊 Units Needed: 2
👤 Patient: John Doe
🏥 Hospital: City Hospital
📍 Location: Mumbai, Maharashtra
📞 Contact: +91-9876543210
⏰ Urgency Level: URGENT

Compatible Donors: A+, A-, O+, O-

⚠️ BLOOD NOT AVAILABLE IN OUR INVENTORY
We urgently need donors to come forward!

🙏 Please donate if you can or share this post to help save a life!

#BloodDonation #SaveLives #A+Blood #EmergencyBlood #BloodBank
```

---

## 🔧 Troubleshooting

### Issue: "Token is invalid"
- **Solution:** Regenerate the Page Access Token (repeat Steps 4-6)
- Make sure you're using a **Page Access Token**, not a User Access Token

### Issue: "Error posting to Facebook"
- **Solution:** Check that your app has necessary permissions
- Verify the Page ID is correct
- Ensure the token hasn't expired

### Issue: Posts not appearing
- **Solution:** Check console logs for errors
- Verify the Facebook Page is published (not in draft mode)
- Make sure you're an admin of the Facebook Page

### Issue: "CORS errors"
- **Solution:** Add your frontend URL to CORS whitelist in server.js

---

## 🎯 Advanced: Twitter/X Integration (Optional)

To also post to Twitter/X:

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app
3. Generate Bearer Token with write permissions
4. Add to `.env`:
   ```env
   ENABLE_TWITTER_POSTING=true
   TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
   ```

---

## 🔒 Security Best Practices

1. ⚠️ **Never commit `.env` file** to Git
2. ✅ Use separate tokens for development and production
3. ✅ Regularly rotate your access tokens
4. ✅ Set up token expiration alerts
5. ✅ Use environment variables for all credentials

---

## 📊 Monitoring

The system logs all social media activities:

```javascript
✅ Successfully posted to Facebook!
📍 Post ID: 123456789_987654321
📊 Social Media Posting Summary:
  ✅ Successful: 1
  ⚠️  Skipped: 0
  ❌ Failed: 0
```

Check your console for these logs to verify posting is working.

---

## 🚀 What Happens Now?

**When blood is requested but unavailable:**

1. ⚠️ Requester submits blood request → sent to all hospitals
2. ❌ All hospitals reject (no blood available)
3. 🌐 **System automatically posts to YOUR Facebook Page**
4. 📢 Post includes all details with hashtags
5. 👥 Your followers see it and can help!
6. 💾 Shareable links generated for WhatsApp/Telegram

**This happens automatically - no manual action needed!**

---

## 📞 Need Help?

If you encounter issues:
1. Check the console logs for error messages
2. Verify all credentials are correct
3. Ensure Facebook permissions are granted
4. Test with an empty token first (preview mode)

---

## 🎉 Done!

Your Blood Inventory system will now automatically post to Facebook when blood is unavailable, helping save lives through social media reach! 🩸

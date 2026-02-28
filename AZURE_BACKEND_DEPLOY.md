# Azure Backend Deployment - Quick Guide

## 🎯 Deploy Backend to Azure App Service

Your backend will run on Azure, close to your Azure SQL Database for best performance!

---

## 🚀 METHOD 1: Azure Portal (Easiest - No CLI needed)

### Step 1: Create Web App (2 minutes)

1. Go to https://portal.azure.com
2. Click **"+ Create a resource"** (top left)
3. Search **"Web App"** → Click **Create**

### Step 2: Fill in Details

```
Project Details:
├─ Subscription: Your Azure subscription
└─ Resource Group: Same as your SQL database (or create new)

Instance Details:
├─ Name: blood-bank-api (or any unique name)
├─ Publish: Code
├─ Runtime stack: Node 20 LTS
├─ Operating System: Linux
└─ Region: Same as your SQL Server! (Important for speed)

Pricing:
└─ Sku: Free F1 (for testing) or Basic B1 ($13/month for production)
```

4. Click **"Review + create"** → **Create**
5. Wait 1-2 minutes for deployment

### Step 3: Upload Your Code

**Option A: GitHub (Recommended - Auto-deploy)**

1. In your App Service, go to **Deployment Center** (left menu)
2. Source: **GitHub**
3. Sign in to GitHub
4. Select:
   - Organization: Your GitHub username
   - Repository: Your repository name
   - Branch: main (or your branch)
5. **Important:** Scroll down to "Build Configuration"
   - App location: `server`
   - Click **Save**
6. Azure will automatically deploy! ✅

**Option B: Visual Studio Code (Easiest)**

1. Install extension: "Azure App Service" in VS Code
2. Sign in to Azure (click Azure icon in sidebar)
3. Right-click the `server` folder
4. Select **"Deploy to Web App..."**
5. Choose your app (blood-bank-api)
6. Click **Deploy**

**Option C: ZIP Upload**

1. In your App Service → **Deployment Center**
2. Source: **Local Git/FTP**
3. Or use Azure CLI:
```bash
cd server
npm install --production
zip -r ../deploy.zip .
az webapp deploy --resource-group your-rg --name blood-bank-api --src-path deploy.zip
```

### Step 4: Configure Environment Variables

1. Go to your App Service
2. Click **Configuration** (left menu under Settings)
3. Click **"+ New application setting"** for each variable:

**Required Variables:**
```
NODE_ENV = production

# Database (Same region = fast!)
SQL_SERVER = your-server.database.windows.net
SQL_DATABASE = BloodInventoryDB
SQL_USER = sqladmin
SQL_PASSWORD = your-password
SQL_PORT = 1433
SQL_ENCRYPT = true

# Firebase
FIREBASE_PROJECT_ID = your-firebase-project-id
FIREBASE_CLIENT_EMAIL = your-service-account@iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----
paste-your-entire-key-here-including-line-breaks
-----END PRIVATE KEY-----
FIREBASE_DATABASE_URL = https://your-project-default-rtdb.firebaseio.com

# Security
JWT_SECRET = your-random-secret-key-generate-new-one
ALLOWED_ORIGINS = http://localhost:8080,http://localhost:5173

# Email (Optional)
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_USER = your-email@gmail.com
EMAIL_PASSWORD = your-app-password
EMAIL_FROM = Blood Bank <your-email@gmail.com>
```

4. Click **Save** at the top
5. Click **Continue** to restart the app

### Step 5: Test Your Backend

Your backend URL: `https://blood-bank-api.azurewebsites.net`

Test it:
```bash
# Health check
curl https://blood-bank-api.azurewebsites.net/api/health

# Or open in browser:
https://blood-bank-api.azurewebsites.net/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "...",
  "services": {
    "sql": true,
    "cosmos": false,
    "firebase": true
  }
}
```

---

## 🚀 METHOD 2: Azure CLI (Fastest if you like commands)

### Step 1: Install Azure CLI

**Windows:**
```bash
# Download and install from:
# https://aka.ms/installazurecli
```

**Mac:**
```bash
brew install azure-cli
```

**Linux:**
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### Step 2: Deploy with One Command

```bash
# Login
az login

# Navigate to server folder
cd "G:\Blood Inventory management\blood-bank-buddy\server"

# Deploy (creates everything automatically!)
az webapp up \
  --resource-group blood-bank-rg \
  --name blood-bank-api \
  --runtime "NODE:20-lts" \
  --sku B1 \
  --location eastus

# Add environment variables
az webapp config appsettings set \
  --resource-group blood-bank-rg \
  --name blood-bank-api \
  --settings \
    NODE_ENV=production \
    SQL_SERVER=your-server.database.windows.net \
    SQL_DATABASE=BloodInventoryDB \
    SQL_USER=sqladmin \
    SQL_PASSWORD=your-password
```

---

## 🔧 Update Frontend to Use Azure Backend

### In your local development:

1. Create `.env.local` in `blood-bank-buddy` folder:
```env
VITE_API_URL=https://blood-bank-api.azurewebsites.net
```

2. Restart your frontend:
```bash
cd blood-bank-buddy
npm run dev
```

Now your local frontend will use Azure backend! 🎉

### Update CORS on Backend

Go back to Azure Portal:
1. Your App Service → Configuration
2. Find `ALLOWED_ORIGINS`
3. Update to include:
   ```
   http://localhost:8080,http://localhost:5173,http://localhost:5174
   ```
4. Save

---

## 💰 Cost Breakdown

### Free Tier (F1):
- ✅ FREE
- ⚠️ 60 CPU minutes/day
- ⚠️ 1GB RAM
- ⚠️ App sleeps when idle
- ✅ Good for testing

### Basic Tier (B1) - Recommended:
- 💰 ~$13/month
- ✅ Always on (no sleep)
- ✅ 1.75GB RAM
- ✅ Custom domains
- ✅ SSL included
- ✅ Good for production

### With your existing Azure SQL:
- SQL Database: ~$5/month (you already have)
- App Service: $0-13/month
- Data transfer: FREE (same region!)
- **Total: $5-18/month**

---

## 🔥 Enable Always-On (Important for Production!)

By default, free tier apps sleep. For production:

1. App Service → Configuration
2. General settings tab
3. **Always On**: On
4. Save

⚠️ Note: Always On requires Basic tier or higher ($13/month)

---

## 📊 Monitor Your Backend

### View Logs

**Method 1: Portal**
1. App Service → Log stream (left menu)
2. See live logs

**Method 2: CLI**
```bash
az webapp log tail \
  --resource-group blood-bank-rg \
  --name blood-bank-api
```

### Enable Application Insights (Optional but Recommended)

FREE monitoring and diagnostics:

1. App Service → Application Insights (left menu)
2. Click **Turn on Application Insights**
3. Create new resource
4. Click **Apply**

You'll get:
- ✅ Performance metrics
- ✅ Error tracking
- ✅ Request analytics
- ✅ Live metrics

---

## 🔒 Security Best Practices

### 1. Use Managed Identity (Better than passwords!)

```bash
# Enable managed identity
az webapp identity assign \
  --name blood-bank-api \
  --resource-group blood-bank-rg

# Then in Azure SQL, add this identity as user
# No more passwords in environment variables!
```

### 2. Restrict Database Access

In Azure SQL Server:
1. Firewalls and virtual networks
2. Add rule: "Allow Azure services" ✅
3. Or specific App Service outbound IPs

### 3. Use Azure Key Vault for Secrets

Store sensitive data securely:
```bash
# Create Key Vault
az keyvault create \
  --name blood-bank-vault \
  --resource-group blood-bank-rg \
  --location eastus

# Store secrets
az keyvault secret set \
  --vault-name blood-bank-vault \
  --name SQLPassword \
  --value "your-password"
```

---

## 🚀 Auto-Deploy on Git Push (CI/CD)

Already configured if you used GitHub option!

Every time you push to main branch:
1. Azure detects the change
2. Automatically builds
3. Automatically deploys
4. You get notification

**View deployment history:**
- App Service → Deployment Center → Logs

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
1. Check Azure SQL firewall rules
2. Ensure "Allow Azure services" is ON
3. Verify connection string
4. Check App Service outbound IPs are whitelisted

### Issue: App keeps restarting

**Solution:**
1. Check logs (Log stream)
2. Verify all environment variables are set
3. Check Node.js version matches (20 LTS)
4. Ensure PORT=8080 environment variable

### Issue: CORS errors

**Solution:**
1. Update ALLOWED_ORIGINS in Configuration
2. Include your frontend URL
3. Save and restart

### Issue: "Application Error"

**Solution:**
1. Check logs
2. Common causes:
   - Missing environment variables
   - Wrong Node version
   - Build errors
3. Redeploy if needed

---

## 📝 Quick Reference

**Your Backend URL:**
```
https://blood-bank-api.azurewebsites.net
```

**Health Check:**
```
https://blood-bank-api.azurewebsites.net/api/health
```

**Test Endpoints:**
```
GET  /api/health - Health check
GET  /ping - Simple ping
POST /api/login - Hospital login
GET  /api/dashboard/stats?hospital_id=H001 - Dashboard data
```

**Update Code:**
- Push to GitHub (auto-deploys)
- Or right-click in VS Code → Deploy to Web App
- Or use: `az webapp deploy`

**View Logs:**
- Portal: App Service → Log stream
- CLI: `az webapp log tail --name blood-bank-api --resource-group your-rg`

**Restart App:**
- Portal: Overview → Restart
- CLI: `az webapp restart --name blood-bank-api --resource-group your-rg`

---

## ✅ Checklist

Before going live:

- [ ] Backend deployed successfully
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] Health check returns success
- [ ] CORS configured for your frontend
- [ ] Logs are accessible
- [ ] Always On enabled (if production)
- [ ] Application Insights enabled
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic)

---

## 🎉 Success!

Your backend is now running on Azure!

**Frontend stays local** → Fast development  
**Backend on Azure** → Fast database access  
**Best of both worlds!** 🚀

When ready to deploy frontend, you can use:
- Vercel (FREE)
- Netlify (FREE)
- Azure Static Web Apps (FREE)

---

Need help? Check App Service logs or let me know! 👍

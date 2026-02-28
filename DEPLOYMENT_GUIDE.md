# 🚀 Blood Bank Buddy - Deployment Guide

Complete guide for deploying Blood Bank Buddy to various cloud platforms.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Deployment Options](#deployment-options)
   - [Docker (Recommended)](#docker-recommended)
   - [Vercel + Railway](#vercel--railway)
   - [Netlify + Render](#netlify--render)
   - [Azure App Service](#azure-app-service)
   - [AWS](#aws)
4. [Database Setup](#database-setup)
5. [Post-Deployment Steps](#post-deployment-steps)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ Node.js 20+ installed locally
- ✅ Azure SQL Database provisioned
- ✅ Firebase project setup (for caching)
- ✅ Domain name (optional but recommended)
- ✅ SSL certificate (automatically provided by most platforms)

---

## Environment Variables

### Frontend Variables (.env.production)

```bash
VITE_API_URL=https://your-backend-api.com
VITE_AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
VITE_AZURE_OPENAI_KEY=your-key
VITE_AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
```

### Backend Variables (server/.env.production)

```bash
# Database
SQL_SERVER=your-server.database.windows.net
SQL_DATABASE=BloodInventoryDB
SQL_USER=sqladmin
SQL_PASSWORD=your-password

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com

# Security
JWT_SECRET=your-jwt-secret-key
ALLOWED_ORIGINS=https://your-frontend.com

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## Deployment Options

### 🐳 Docker (Recommended)

**Best for:** Full control, any cloud provider

#### 1. Build and Run Locally

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### 2. Deploy to Any Cloud

**Option A: Docker Hub**
```bash
# Tag images
docker tag blood-bank-frontend:latest yourusername/blood-bank-frontend:latest
docker tag blood-bank-backend:latest yourusername/blood-bank-backend:latest

# Push to Docker Hub
docker push yourusername/blood-bank-frontend:latest
docker push yourusername/blood-bank-backend:latest
```

**Option B: Azure Container Registry**
```bash
# Login to ACR
az acr login --name yourregistry

# Tag and push
docker tag blood-bank-frontend yourregistry.azurecr.io/blood-bank-frontend:latest
docker push yourregistry.azurecr.io/blood-bank-frontend:latest
```

#### 3. Deploy to Azure Container Instances

```bash
# Create resource group
az group create --name blood-bank-rg --location eastus

# Deploy frontend
az container create \
  --resource-group blood-bank-rg \
  --name blood-bank-frontend \
  --image yourregistry.azurecr.io/blood-bank-frontend:latest \
  --dns-name-label blood-bank-app \
  --ports 80

# Deploy backend
az container create \
  --resource-group blood-bank-rg \
  --name blood-bank-backend \
  --image yourregistry.azurecr.io/blood-bank-backend:latest \
  --dns-name-label blood-bank-api \
  --ports 5000 \
  --environment-variables \
    NODE_ENV=production \
    SQL_SERVER=$SQL_SERVER \
    SQL_DATABASE=$SQL_DATABASE \
  --secure-environment-variables \
    SQL_PASSWORD=$SQL_PASSWORD \
    JWT_SECRET=$JWT_SECRET
```

---

### ▲ Vercel + Railway

**Best for:** Fast deployment, great DX

#### Frontend (Vercel)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
cd blood-bank-buddy
vercel

# For production
vercel --prod
```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all `VITE_*` variables

4. **Set API URL**
   - Update `VITE_API_URL` to your Railway backend URL

#### Backend (Railway)

1. **Install Railway CLI**
```bash
npm i -g @railway/cli
```

2. **Deploy**
```bash
cd blood-bank-buddy/server
railway login
railway init
railway up

# Link to production
railway link
```

3. **Configure Environment Variables**
   - Railway Dashboard → Your Project → Variables
   - Add all backend environment variables

4. **Custom Domain** (Optional)
   - Railway Dashboard → Settings → Domains
   - Add custom domain

---

### 🎯 Netlify + Render

**Best for:** Simple static hosting + backend

#### Frontend (Netlify)

1. **Deploy via Git**
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Or using CLI**
```bash
npm i -g netlify-cli
cd blood-bank-buddy
netlify deploy --prod
```

3. **Environment Variables**
   - Netlify Dashboard → Site Settings → Environment Variables
   - Add all `VITE_*` variables

#### Backend (Render)

1. **Create Web Service**
   - Connect GitHub repository
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node server.js`

2. **Environment Variables**
   - Render Dashboard → Environment
   - Add all backend variables

---

### ☁️ Azure App Service

**Best for:** Enterprise deployments, Azure ecosystem

#### Frontend

```bash
# Create resource group
az group create --name blood-bank-rg --location eastus

# Create App Service plan
az appservice plan create \
  --name blood-bank-plan \
  --resource-group blood-bank-rg \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --resource-group blood-bank-rg \
  --plan blood-bank-plan \
  --name blood-bank-frontend \
  --runtime "NODE|20-lts"

# Deploy
cd blood-bank-buddy
npm run build
az webapp deploy \
  --resource-group blood-bank-rg \
  --name blood-bank-frontend \
  --src-path dist.zip \
  --type zip
```

#### Backend

```bash
# Create backend app
az webapp create \
  --resource-group blood-bank-rg \
  --plan blood-bank-plan \
  --name blood-bank-api \
  --runtime "NODE|20-lts"

# Configure environment variables
az webapp config appsettings set \
  --resource-group blood-bank-rg \
  --name blood-bank-api \
  --settings \
    NODE_ENV=production \
    SQL_SERVER=$SQL_SERVER \
    SQL_DATABASE=$SQL_DATABASE
```

---

### 🟠 AWS (Amplify + Elastic Beanstalk)

#### Frontend (AWS Amplify)

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
cd blood-bank-buddy
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

#### Backend (Elastic Beanstalk)

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd blood-bank-buddy/server
eb init

# Create environment
eb create blood-bank-api-prod

# Deploy
eb deploy
```

---

## Database Setup

### Azure SQL Database

1. **Create Database**
```bash
az sql server create \
  --name blood-bank-sql \
  --resource-group blood-bank-rg \
  --location eastus \
  --admin-user sqladmin \
  --admin-password YourStrongPassword123!

az sql db create \
  --resource-group blood-bank-rg \
  --server blood-bank-sql \
  --name BloodInventoryDB \
  --service-objective S0
```

2. **Configure Firewall**
```bash
# Allow Azure services
az sql server firewall-rule create \
  --resource-group blood-bank-rg \
  --server blood-bank-sql \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

3. **Run Migrations**
   - Execute SQL scripts from `server/sql/` folder
   - Or run: `node server/deploy-schema.js`

---

## Post-Deployment Steps

### 1. Verify Health Checks

```bash
# Frontend
curl https://your-frontend.com

# Backend
curl https://your-api.com/health
```

### 2. Test Core Functionality

- ✅ Register a hospital account
- ✅ Login and verify authentication
- ✅ Add a donor
- ✅ Record a donation
- ✅ Check inventory updates
- ✅ Test chatbot (if AI is configured)

### 3. Configure DNS

```bash
# Add CNAME record
your-domain.com  →  your-app.vercel.app
api.your-domain.com  →  your-api.railway.app
```

### 4. Enable HTTPS

Most platforms provide automatic SSL:
- ✅ Vercel: Automatic
- ✅ Netlify: Automatic
- ✅ Railway: Automatic
- ✅ Azure: Enable in portal
- ✅ AWS: Use ACM

### 5. Monitor Application

- Set up logging (Azure Application Insights, Datadog, etc.)
- Configure alerts
- Set up uptime monitoring

---

## Troubleshooting

### Common Issues

**1. CORS Errors**
- Update `ALLOWED_ORIGINS` in backend
- Ensure API URL is correct in frontend

**2. Database Connection Failed**
- Check firewall rules
- Verify connection string
- Test connectivity from deployment region

**3. Build Fails**
- Check Node version (should be 20+)
- Clear cache: `npm cache clean --force`
- Verify all dependencies are listed in package.json

**4. Environment Variables Not Working**
- Ensure variables are prefixed with `VITE_` for frontend
- Restart services after adding variables
- Check for typos in variable names

---

## Support

For deployment issues or questions:
- 📧 Check logs in your deployment platform
- 📚 Review platform-specific documentation
- 🐛 Open an issue on GitHub

---

## Next Steps

After successful deployment:
1. ✅ Set up monitoring and alerts
2. ✅ Configure backup strategy
3. ✅ Implement CI/CD pipeline
4. ✅ Set up staging environment
5. ✅ Configure CDN (optional)


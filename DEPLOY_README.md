# 🩸 Blood Bank Buddy - Ready for Deployment!

## 🚀 Quick Deploy (Choose One)

Your application is **ready to deploy**! Choose your preferred platform:

### ⚡ Fastest Option (5 minutes)
```bash
# Windows
deploy.bat

# Mac/Linux
chmod +x deploy.sh
./deploy.sh
```

### 🎯 Platform-Specific Deployment

#### Option 1: Vercel + Railway (Recommended)
**Best for:** Quick deployment, excellent developer experience

**Frontend (Vercel):**
```bash
npm i -g vercel
cd blood-bank-buddy
vercel --prod
```

**Backend (Railway):**
```bash
npm i -g @railway/cli
cd server
railway up
```

📖 **[Detailed Guide](./QUICK_DEPLOY.md#option-1-vercel-frontend--railway-backend)**

---

#### Option 2: Docker (Full Control)
**Best for:** Any cloud provider, full control

```bash
docker-compose build
docker-compose up -d
```

📖 **[Docker Guide](./QUICK_DEPLOY.md#option-2-docker-deployment-full-control)**

---

#### Option 3: Netlify + Render
**Best for:** Simple static hosting + managed backend

```bash
# Frontend
npm i -g netlify-cli
netlify deploy --prod

# Backend: Deploy via Render Dashboard
# https://render.com
```

📖 **[Netlify + Render Guide](./DEPLOYMENT_GUIDE.md#-netlify--render)**

---

## 📋 Pre-Deployment Checklist

- [ ] **Database**: Azure SQL Database created
- [ ] **Firebase**: Project setup completed  
- [ ] **Schema**: Database tables created (run `server/deploy-schema.js`)
- [ ] **Environment Variables**: Configured from `.env.example` templates
- [ ] **Domain** (optional): DNS configured

---

## 🔧 Configuration Files

All deployment configurations are ready:

| Platform | Configuration Files |
|----------|-------------------|
| Docker | `Dockerfile`, `docker-compose.yml`, `nginx.conf` |
| Vercel | `vercel.json` |
| Netlify | `netlify.toml` |
| Railway | `server/railway.json` |
| Render | `server/render.yaml` |
| GitHub Actions | `.github/workflows/deploy.yml` |

---

## 📚 Documentation

- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - 5-minute deployment guide
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment documentation
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Initial setup guide

---

## 🌐 Environment Variables

### Frontend (.env.production)
```bash
VITE_API_URL=https://your-backend-url.com
VITE_AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
VITE_AZURE_OPENAI_KEY=your-key
VITE_AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
```

### Backend (server/.env.production)
```bash
NODE_ENV=production
SQL_SERVER=your-server.database.windows.net
SQL_DATABASE=BloodInventoryDB
SQL_USER=sqladmin
SQL_PASSWORD=your-password
FIREBASE_PROJECT_ID=your-project-id
JWT_SECRET=your-secret-key
```

📖 **[Complete list of environment variables](./DEPLOYMENT_GUIDE.md#environment-variables)**

---

## 🧪 Test Your Deployment

After deployment, verify:

```bash
# Health check
curl https://your-api-url.com/api/health

# Basic ping
curl https://your-api-url.com/ping

# Frontend
curl https://your-frontend-url.com
```

**Manual Testing:**
1. ✅ Register hospital account
2. ✅ Login
3. ✅ Add donor
4. ✅ Record donation
5. ✅ Check inventory updates
6. ✅ Test chatbot

---

## 💰 Estimated Costs

### Free Tier (Testing)
- Vercel: Free
- Railway: Free trial → $5/month
- Azure SQL: ~$5/month (Basic)
- Firebase: Free (Spark plan)
- **Total: ~$10/month**

### Production Tier
- Vercel Pro: $20/month  
- Railway Pro: $20/month
- Azure SQL Standard: $15-50/month
- Firebase: Pay as you go
- **Total: ~$55-90/month**

---

## 🆘 Need Help?

**Common Issues:**
- **CORS errors?** → Update `ALLOWED_ORIGINS` in backend
- **Database connection failed?** → Check firewall rules
- **Build fails?** → Verify Node.js version (20+)
- **Env vars not working?** → Add `VITE_` prefix for frontend

📖 **[Troubleshooting Guide](./DEPLOYMENT_GUIDE.md#troubleshooting)**

---

## 🔄 CI/CD Pipeline

GitHub Actions workflow is configured at `.github/workflows/deploy.yml`

**Setup:**
1. Add secrets to GitHub repository:
   - `VERCEL_TOKEN`
   - `RAILWAY_TOKEN`
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`

2. Push to `main` or `production` branch
3. Automatic deployment begins! 🎉

---

## 📊 Monitoring

After deployment, set up:
- ✅ Health checks (auto-configured at `/api/health`)
- ✅ Uptime monitoring (UptimeRobot, Pingdom)
- ✅ Error tracking (Sentry, LogRocket)
- ✅ Performance monitoring (Azure Application Insights)

---

## 🎉 You're Ready!

Your Blood Bank Buddy is deployment-ready with:
- ✅ Multi-platform support
- ✅ Docker containerization
- ✅ CI/CD pipeline
- ✅ Health checks
- ✅ Production-optimized builds
- ✅ Comprehensive documentation

**Deploy now and start saving lives! 🩸**

---

## 📞 Support

For deployment support:
- 📖 Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- 📖 Check [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)
- 🐛 Open GitHub issue
- 📧 Contact support

---

Made with ❤️ for healthcare professionals

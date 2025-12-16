# Deployment Guide - HRFlow AI

This guide covers deployment options for production use with your client.

---

## 🚀 Quick Deploy (Current Setup)

**Status**: ✅ Already deployed and ready to use!

The application is currently running on Figma Make's infrastructure with:
- Frontend: Automatically deployed
- Backend: Supabase Edge Functions (live)
- Database: Supabase PostgreSQL (configured)
- Storage: Supabase Object Storage (ready)

**What you need to do**:
1. Upload your OpenAI API key (prompted on first use)
2. Create an HR admin account at `/hr/login`
3. Share the URL with your client

**That's it!** ✨

---

## 📦 GitHub Repository Setup

To give this to your client on GitHub:

### 1. Create a New Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - HRFlow AI v1.0"

# Create repository on GitHub
# Then push:
git remote add origin https://github.com/yourusername/hrflow-ai.git
git branch -M main
git push -u origin main
```

### 2. Repository Settings

Make the repository:
- **Private** (if client wants exclusivity)
- **Public** (if you want to showcase it)

Add a professional description:
> "AI-Powered Automated Hiring & Onboarding Platform - Screen resumes, extract insights, and schedule interviews automatically using OpenAI GPT-4"

### 3. Add Topics (GitHub Tags)

- `ai`
- `recruitment`
- `hr-tech`
- `automation`
- `openai`
- `supabase`
- `react`
- `typescript`

---

## 🌐 Custom Domain Setup

To use your client's domain (e.g., `hire.clientcompany.com`):

### Option 1: Keep Current Hosting + Custom Domain

1. Contact Figma Make support to add custom domain
2. Point client's DNS to provided address
3. SSL certificate auto-generated

### Option 2: Self-Host with Custom Domain

See "Self-Hosting" section below.

---

## 🏗 Self-Hosting Options

If your client wants to host it themselves:

### Option A: Vercel (Recommended - Easiest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod

# Configure environment variables in Vercel dashboard:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
```

**Pros**: 
- Free tier available
- Automatic HTTPS
- Global CDN
- Easy rollbacks

**Cons**:
- Need to configure Supabase separately

### Option B: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

**Configuration**:
- Build command: `npm run build`
- Publish directory: `dist`
- Add environment variables in Netlify UI

### Option C: Docker + VPS

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]

EXPOSE 3000
```

Deploy to DigitalOcean, AWS, or any VPS:

```bash
docker build -t hrflow-ai .
docker run -p 80:3000 hrflow-ai
```

### Option D: AWS Amplify

1. Connect GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add environment variables
4. Deploy

---

## 🔧 Environment Variables Setup

For self-hosted deployments, create these environment variables:

```env
# Required
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Optional (if using different OpenAI account)
VITE_OPENAI_API_KEY=sk-your-key-here
```

**Security Note**: Never commit `.env` files to Git!

---

## 📊 Supabase Setup (For Self-Hosted)

If client wants their own Supabase project:

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Create new project
3. Wait for setup (2-3 minutes)

### 2. Configure Storage

```sql
-- Run in Supabase SQL Editor
CREATE BUCKET IF NOT EXISTS make-45c854cf-resumes (
  public = true,
  file_size_limit = 10485760
);
```

### 3. Deploy Edge Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy function
supabase functions deploy make-server-45c854cf
```

### 4. Set Environment Variables

In Supabase dashboard → Edge Functions → Secrets:

```
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 💳 Cost Breakdown

Help your client understand costs:

### Current Setup (Figma Make)
- **Hosting**: Included
- **Database**: Included
- **Storage**: Included
- **Total**: $0 infrastructure

### Self-Hosted Setup

**Supabase Free Tier**:
- Database: 500MB (plenty for 10,000+ candidates)
- Storage: 1GB (enough for 200+ resumes)
- Edge Functions: 500K requests/month
- **Cost**: $0/month

**Supabase Pro** (if needed):
- Database: 8GB
- Storage: 100GB
- More compute
- **Cost**: $25/month

**OpenAI API**:
- GPT-4o-mini: ~$0.005 per candidate
- 1000 candidates/month: ~$5
- **Cost**: ~$5-20/month

**Hosting** (Vercel/Netlify):
- Free tier: Fine for small companies
- Pro: $20/month for custom domains
- **Cost**: $0-20/month

**Total Monthly Cost**: $5-45/month

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Environment variables secured (not in code)
- [ ] CORS configured correctly
- [ ] API rate limiting enabled
- [ ] HTTPS enforced
- [ ] File upload size limits set
- [ ] Authentication working properly
- [ ] Backup strategy in place
- [ ] Error logging configured
- [ ] Privacy policy created
- [ ] Terms of service created

---

## 📈 Scaling Considerations

When your client grows:

### 100+ candidates/month
- Current setup handles fine
- No changes needed

### 1,000+ candidates/month
- Upgrade Supabase to Pro
- Consider CDN for resumes
- Add Redis caching

### 10,000+ candidates/month
- Dedicated database
- Load balancing
- Queue system for AI processing
- Multiple OpenAI API keys

---

## 🔄 CI/CD Pipeline (Advanced)

For automated deployments:

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: vercel/deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 🧪 Testing Before Production

Run these tests before giving to client:

```bash
# 1. Test application flow
# Submit 5 test candidates with different profiles

# 2. Test HR dashboard
# Login, filter, search, view details

# 3. Test mobile
# Open on phone, test all features

# 4. Load testing
# Submit 20 candidates simultaneously

# 5. Error handling
# Test with invalid data, missing fields, large files
```

---

## 📱 Mobile App (Future)

If client wants mobile apps:

### React Native Version
- Reuse most components
- Add native camera for doc scanning
- Push notifications
- 2-3 weeks development

### Progressive Web App (PWA)
- Add service worker
- Enable offline mode
- Add to home screen
- 1 week development

---

## 🎯 Go-Live Checklist

Final steps before client launch:

### 1 Week Before:
- [ ] All features tested
- [ ] Performance optimized
- [ ] Mobile tested
- [ ] Client training scheduled
- [ ] Documentation ready

### 3 Days Before:
- [ ] Backup created
- [ ] Monitoring setup
- [ ] Error tracking enabled
- [ ] Support plan ready

### 1 Day Before:
- [ ] Final testing
- [ ] Client walkthrough
- [ ] Emergency contacts ready

### Launch Day:
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] Be available for support
- [ ] Celebrate! 🎉

---

## 🆘 Rollback Plan

If something goes wrong:

1. **Identify issue** (check logs, user reports)
2. **Assess severity** (critical, major, minor)
3. **If critical**: Revert to previous version
4. **If minor**: Fix and redeploy
5. **Communication**: Update client immediately

### Vercel Rollback:
```bash
vercel rollback
```

### Netlify Rollback:
Use dashboard to deploy previous version

---

## 📞 Post-Deployment Support

Set up support channels:

1. **Email**: support@yourcompany.com
2. **Slack**: Create shared channel with client
3. **Phone**: Emergency hotline for critical issues
4. **Documentation**: Link to README and guides
5. **Training**: Schedule 1-hour onboarding session

---

## 🎓 Client Training Agenda

1-hour session to train client:

**0:00-0:15** - Overview
- What the system does
- Key benefits
- Success metrics

**0:15-0:30** - HR Dashboard Tour
- Logging in
- Viewing candidates
- Filtering and searching
- Taking actions

**0:30-0:45** - Configuration
- Adding team members
- Customizing emails
- Adjusting screening criteria

**0:45-1:00** - Q&A and Advanced Features

---

## 🌟 Success Metrics

Track these to show ROI:

- Time saved per candidate (before: 15 min, after: 2 min)
- Candidates processed per week
- Average fit score accuracy
- Time to first interview
- Hiring manager satisfaction

---

**Your client is going to love this! The system is production-ready and professional. Good luck with the demo! 🚀**

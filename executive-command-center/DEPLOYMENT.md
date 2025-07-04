# 🚀 Vercel Deployment Guide - Executive Command Center

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 16+ installed locally

## Step 1: Prepare for Deployment

### 1.1 Update Build Configuration
The project is already configured with:
- ✅ React 18 with TypeScript
- ✅ Material-UI v5
- ✅ Environment variable support
- ✅ Vercel configuration file

### 1.2 Environment Variables
We've already created environment files:
- `.env.local` - Local development
- `.env.development` - Vercel development deployment
- `.env.staging` - Vercel staging deployment

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to Development**:
   ```bash
   # From the executive-command-center directory
   vercel --env development
   ```

4. **Deploy to Staging**:
   ```bash
   vercel --env staging --prod
   ```

### Option B: Deploy via GitHub Integration

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy Executive Command Center to Vercel"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select "executive-command-center" folder as root directory

3. **Configure Project**:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install --legacy-peer-deps`

4. **Add Environment Variables**:
   In Vercel Dashboard → Settings → Environment Variables:
   
   **Development Environment**:
   ```
   REACT_APP_API_BASE_URL=https://api-dev.exalt.com
   REACT_APP_AUTH_DOMAIN=dev.exalt.com
   REACT_APP_ENVIRONMENT=development
   REACT_APP_VERSION=1.0.0-dev
   REACT_APP_ENABLE_ANALYTICS=false
   REACT_APP_LOG_LEVEL=debug
   ```

   **Staging Environment**:
   ```
   REACT_APP_API_BASE_URL=https://api-staging.exalt.com
   REACT_APP_AUTH_DOMAIN=staging.exalt.com
   REACT_APP_ENVIRONMENT=staging
   REACT_APP_VERSION=1.0.0-staging
   REACT_APP_ENABLE_ANALYTICS=true
   REACT_APP_LOG_LEVEL=info
   ```

## Step 3: Domain Configuration

### Development URL
Your app will be available at:
```
https://exalt-executive-command-center-dev.vercel.app
```

### Staging URL
```
https://exalt-executive-command-center-staging.vercel.app
```

### Custom Domain (Optional)
1. Go to Vercel Dashboard → Domains
2. Add custom domain:
   - Development: `dev-dashboard.exalt.com`
   - Staging: `staging-dashboard.exalt.com`

## Step 4: Deployment Scripts

Add to your package.json:
```json
"scripts": {
  "deploy:dev": "vercel --env development",
  "deploy:staging": "vercel --env staging --prod",
  "deploy:preview": "vercel"
}
```

## Step 5: Continuous Deployment

### Automatic Deployments
- **Main branch** → Staging environment
- **Pull requests** → Preview deployments
- **Tagged releases** → Production (when ready)

### Branch Configuration
In Vercel Dashboard → Settings → Git:
- Production Branch: `staging`
- Preview Branches: All branches

## Step 6: Post-Deployment Testing

### 1. Verify Environment
```javascript
// Check in browser console
console.log(process.env.REACT_APP_ENVIRONMENT);
// Should show: "development" or "staging"
```

### 2. Test Features
- ✅ Login with demo credentials
- ✅ Navigate all pages
- ✅ Check API connectivity
- ✅ Verify responsive design
- ✅ Test performance metrics

### 3. Monitor Deployment
- Vercel Dashboard → Analytics
- Check Web Vitals scores
- Monitor error rates
- Review performance metrics

## Step 7: Team Collaboration

### Invite Team Members
1. Vercel Dashboard → Settings → Team
2. Invite developers with appropriate roles:
   - **Admin**: Full access
   - **Developer**: Deploy and manage
   - **Viewer**: Read-only access

### Environment Access
- Development: All team members
- Staging: Senior developers only
- Production: Admin approval required

## Deployment Checklist

### Pre-Deployment
- [ ] Run `npm run build` locally
- [ ] Fix any build warnings/errors
- [ ] Update environment variables
- [ ] Test login functionality
- [ ] Verify API endpoints

### Post-Deployment
- [ ] Check deployment URL
- [ ] Test all navigation
- [ ] Verify data loading
- [ ] Check responsive design
- [ ] Monitor error logs

## Troubleshooting

### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### Environment Variables Not Working
- Ensure variables start with `REACT_APP_`
- Rebuild after adding new variables
- Check Vercel dashboard for typos

### 404 Errors on Routes
The `vercel.json` is configured to handle client-side routing.
If issues persist, check the rewrites configuration.

## Rollback Strategy

### Quick Rollback
1. Vercel Dashboard → Deployments
2. Find previous stable deployment
3. Click "..." → "Promote to Production"

### Git Rollback
```bash
git revert HEAD
git push origin main
# Vercel auto-deploys the revert
```

## Security Notes

- ✅ API keys are in environment variables
- ✅ HTTPS enforced by default
- ✅ Security headers configured
- ✅ No sensitive data in code
- ✅ Authentication required for access

## Next Steps

1. **Complete Vercel signup**
2. **Run first deployment**:
   ```bash
   npm run deploy:dev
   ```
3. **Share preview URL with team**
4. **Set up custom domains** (optional)
5. **Configure team access**

---

**Your Executive Command Center is ready for Vercel deployment! 🎉**

For support: https://vercel.com/support
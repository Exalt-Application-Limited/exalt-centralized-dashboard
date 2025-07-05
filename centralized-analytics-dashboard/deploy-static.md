# Centralized Analytics Dashboard - Deployment Guide

## Current Status
- React application structure ✅ Complete
- Dependencies: 785 packages partially installed
- Build status: Pending due to incomplete npm installation

## Deployment Options

### Option 1: GitHub Actions (Recommended)
The `.github/workflows/build-deploy.yml` workflow will:
1. Install dependencies fresh in CI environment
2. Build the React application
3. Deploy to AWS S3 + CloudFront

**To deploy:**
1. Push code to the GitHub repository
2. GitHub Actions will automatically build and deploy

### Option 2: Pre-built Static Files
Since npm installation is timing out locally, use GitHub Actions to build and download artifacts:
1. Push to GitHub
2. Download build artifacts from Actions
3. Deploy the static files to any web server

### Option 3: Alternative Build Environment
Use a cloud development environment or CI/CD service:
- GitHub Codespaces
- GitPod
- AWS CodeBuild
- Vercel/Netlify (automatic builds)

### Option 4: Manual Build Steps
If you get npm working:
```bash
cd centralized-dashboard/centralized-analytics-dashboard
npm install --legacy-peer-deps
npm run build
# Output will be in ./build directory
```

## Static Hosting Options

### 1. AWS S3 + CloudFront
```bash
aws s3 sync build/ s3://your-bucket-name/
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### 2. Nginx Configuration
```nginx
server {
    listen 80;
    server_name dashboard.example.com;
    root /var/www/dashboard;
    index index.html;
    
    location / {
        try_files $uri /index.html;
    }
}
```

### 3. Vercel Deployment
```bash
npx vercel --prod
```

### 4. Netlify Deployment
```bash
npx netlify deploy --prod --dir=build
```

## Environment Variables
Create `.env` file for runtime configuration:
```
REACT_APP_API_URL=https://api.gogidix-ecosystem.com
REACT_APP_WEBSOCKET_URL=wss://ws.gogidix-ecosystem.com
```

## Next Steps
1. Use GitHub Actions to build the application
2. Download the build artifacts
3. Deploy to your preferred hosting platform
4. Configure environment variables
5. Set up SSL/TLS certificates
6. Configure CDN for performance
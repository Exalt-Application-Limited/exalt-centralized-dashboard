# 🚀 Local Setup Guide - Executive Command Center

## Quick Setup Instructions

Since we're having network/installation issues, here are simple steps to run locally:

### Option 1: Using the Batch File (Windows)
1. Open File Explorer
2. Navigate to: `Desktop\Gogidix-Application-Limited\CLEAN-SOCIAL-ECOMMERCE-ECOSYSTEM\centralized-dashboard\executive-command-center`
3. Double-click: **`setup-and-run.bat`**
4. Wait for installation (5-10 minutes first time)
5. Browser will open automatically at http://localhost:3000

### Option 2: Manual Terminal Setup
Open a new terminal/command prompt and run:

```bash
# Navigate to the directory
cd "C:\Users\frich\Desktop\Gogidix-Application-Limited\CLEAN-SOCIAL-ECOMMERCE-ECOSYSTEM\centralized-dashboard\executive-command-center"

# Install dependencies (only needed once)
npm install --legacy-peer-deps

# Start the development server
npm start
```

### Option 3: If npm install fails
Try these alternatives:

```bash
# Clear npm cache
npm cache clean --force

# Use different registry
npm install --legacy-peer-deps --registry https://registry.npmjs.org/

# Or use yarn
yarn install
yarn start
```

## 🔑 Access the Application

Once running, access at: **http://localhost:3000**

**Demo Credentials:**
- Username: `executive@gogidix.com`
- Password: `demo123`

## 🎯 What You'll See

1. **Login Page** - Professional executive login
2. **Dashboard** - Real-time metrics and overview
3. **Three Domains**:
   - Social Commerce
   - Shared Infrastructure
   - Centralized Dashboard
4. **Executive Features**:
   - Stakeholder Management
   - Alert System
   - Board Reports
   - Settings

## 🛠️ Troubleshooting

### If dependencies fail to install:
1. Check internet connection
2. Try using a VPN if behind corporate firewall
3. Use mobile hotspot as alternative

### If port 3000 is busy:
```bash
# Use different port
PORT=3001 npm start
```

### If you see permission errors:
Run terminal as Administrator (Windows) or use sudo (Linux/Mac)

## 📱 Features Available Locally

All features work in local development:
- ✅ Full UI with Material-UI design
- ✅ Authentication flow
- ✅ All pages and navigation
- ✅ Mock data for testing
- ✅ Responsive design
- ✅ Real-time updates simulation

## 🚨 Important Notes

1. **Mock Data**: Currently using demo data (no backend required)
2. **Hot Reload**: Changes to code auto-refresh the browser
3. **Developer Tools**: Press F12 to see console/network activity
4. **Performance**: First load may be slow, subsequent loads are faster

---

**Ready to proceed with local development!**
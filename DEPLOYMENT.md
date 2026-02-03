# Webflow Cloud Deployment Guide

Since you've already created a Webflow Cloud project and connected it to your GitHub repo, here's how to deploy:

## Automatic Deployment (Recommended)

If your Webflow Cloud project is connected to GitHub, it will automatically deploy when you push to the `main` branch.

### Steps:

1. **Make sure your code is committed and pushed:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Webflow Cloud will automatically:**
   - Detect the push to GitHub
   - Build your Next.js app
   - Deploy it to your Webflow site

3. **Check deployment status:**
   - Go to your Webflow Cloud dashboard
   - View the deployment logs and status

## Manual Deployment (Alternative)

If you prefer to deploy manually using the CLI:

1. **Authenticate with Webflow:**
   ```bash
   webflow auth login
   ```

2. **Build your app:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   webflow cloud deploy
   ```

## Environment Variables

**IMPORTANT:** Make sure to set your environment variables in Webflow Cloud:

### Option 1: Via Webflow Cloud Dashboard

1. **Go to your Webflow Cloud project:**
   - Log into [Webflow Cloud Dashboard](https://webflow.com/dashboard)
   - Navigate to your project

2. **Find Environment Settings:**
   - Look for "Settings" or "Project Settings" in the sidebar
   - Click on "Environments" or "Environment Variables"
   - If you don't see it, try:
     - "Configuration" section
     - "Build Settings"
     - "Deployment Settings"

3. **Add the variable:**
   - Click "Add Environment Variable" or "+" button
   - Key: `OPENAI_API_KEY`
   - Value: `your_openai_api_key_here` (use your actual API key)
   - Save

### Option 2: Via CLI (if available)

Some Webflow Cloud projects allow setting env vars via CLI. Try:
```bash
webflow cloud env set OPENAI_API_KEY=your_key_here
```

### Option 3: Check Build/Deploy Settings

If you still can't find it:
1. Go to your project's "Deployments" or "Builds" section
2. Look for "Environment Configuration" or "Build Environment"
3. Some projects have it under "Advanced Settings"

### Still Can't Find It?

The location varies by Webflow Cloud project type. Try:
- Contact Webflow support for your specific project
- Check the project's documentation/help section
- Look for "Secrets" or "Config Vars" instead of "Environment Variables"

**Note:** Environment variables are required for the AI-generated messages to work in production.

## Mount Path

Your app is configured to mount at `/app` (as specified in `webflow.json`). This means your app will be accessible at:
- `https://your-site.webflow.io/app` (or your custom domain)

## Troubleshooting

- **Build fails:** Check the build logs in Webflow Cloud dashboard
- **API not working:** Verify `OPENAI_API_KEY` is set in environment variables
- **404 errors:** Make sure the mount path matches your Webflow Cloud project settings


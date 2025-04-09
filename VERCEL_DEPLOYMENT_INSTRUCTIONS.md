# Alertify - Vercel Deployment Instructions

Follow these steps to deploy the Alertify application to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. Git repository with your Alertify codebase

## Deployment Steps

### Option 1: Deploy using Vercel CLI

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to your Vercel account:
   ```
   vercel login
   ```

3. Navigate to your project directory and run:
   ```
   vercel
   ```

4. Follow the prompts to configure your project:
   - Set the project name (e.g., "alertify")
   - Confirm the root directory (should be the project root)
   - The build command and output directory are already configured in vercel.json

5. Once deployed, Vercel will provide you with a URL to access your application.

### Option 2: Deploy via Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)

3. Click "New Project"

4. Import your repository from Git

5. Configure your project:
   - Project Name: alertify (or your preferred name)
   - Framework Preset: Vite
   - Root Directory: ./
   - Build and Output Settings: (Vercel will automatically detect these from vercel.json)

6. Click "Deploy"

## API Configuration

The Alertify application is configured with Vercel's serverless API functions. The API structure is organized as follows:

- `/api/index.js` - Main API information
- `/api/sites/index.js` - Sites management endpoints
- `/api/sites/[id].js` - Individual site operations
- `/api/alerts/index.js` - Alerts management
- `/api/stats/index.js` - Dashboard statistics
- `/api/ai-insights/index.js` - AI insights and recommendations
- `/api/ws/index.js` - WebSocket information (Note: For real-time functionality, consider using Vercel's Edge Functions or a third-party service)

## Post-Deployment Verification

After deployment, verify that:

1. The frontend is accessible at your Vercel URL
2. API endpoints are working correctly (e.g., try accessing `/api` to see the API information)
3. The application loads and functions properly in different browsers

## Custom Domain Setup (Optional)

1. From your Vercel project dashboard, go to "Settings" > "Domains"
2. Add your custom domain and follow the instructions to configure DNS settings

## Troubleshooting

If you encounter issues during deployment:

1. Check the Vercel deployment logs for errors
2. Ensure your API endpoints are properly formatted for Vercel serverless functions
3. Verify that all environment variables are correctly set in the Vercel project settings

## Notes

- Vercel automatically handles HTTPS certificates
- The application is configured for optimal performance with Vercel's edge network
- For production environments, consider adding environment variables for any sensitive information

---

Developed by Aman - © 2025 All Rights Reserved
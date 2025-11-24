# Render Deployment Guide

This guide explains how to deploy the UNDERTALE Portfolio backend to Render.

## Prerequisites

- GitHub account
- Render account (free tier available)
- Notion API credentials:
  - Notion API Key
  - Notion Database ID (for guestbook)
  - Notion Projects Database ID

## Deployment Steps

### 1. Push Code to GitHub

Ensure your code is pushed to a GitHub repository:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository: `Portfolio-Website-UnderTail`

### 3. Configure Build Settings

Render should auto-detect the `render.yaml` file. If not, configure manually:

- **Name**: `undertale-portfolio-api` (or your preferred name)
- **Environment**: `Go`
- **Region**: Oregon (or your preferred region)
- **Branch**: `main`
- **Build Command**: `cd backend && go build -o main .`
- **Start Command**: `cd backend && ./main`

### 4. Set Environment Variables

In the Render dashboard, add the following environment variables:

| Key | Value | Description |
|-----|-------|-------------|
| `NOTION_API_KEY` | `secret_xxx...` | Your Notion integration secret |
| `NOTION_DATABASE_ID` | `xxx-xxx-xxx...` | Guestbook database ID |
| `NOTION_PROJECTS_DATABASE_ID` | `xxx-xxx-xxx...` | Projects database ID |
| `PORT` | `8080` | Port (auto-set by Render) |

**To get Notion credentials:**
1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Create a new integration or use existing one
3. Copy the "Internal Integration Token" as `NOTION_API_KEY`
4. Share your databases with the integration
5. Get database IDs from the database URLs

### 5. Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy your backend
3. Wait for the deployment to complete (usually 2-5 minutes)
4. Your API will be available at: `https://your-service-name.onrender.com`

### 6. Update Frontend CORS

After deployment, update the CORS configuration in `backend/main.go`:

```go
AllowedOrigins: []string{
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-frontend-domain.com",  // Add your deployed frontend URL
},
```

Then commit and push the changes. Render will automatically redeploy.

### 7. Update Frontend API URL

In your frontend code, update the API base URL to point to your Render backend:

```typescript
// In your API client or constants file
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-service-name.onrender.com'
  : 'http://localhost:8080';
```

## Health Check

Render will automatically ping the `/health` endpoint to ensure your service is running.

Test it manually:
```bash
curl https://your-service-name.onrender.com/health
# Should return: OK
```

## Testing the API

Test your deployed endpoints:

```bash
# Get guestbook entries
curl https://your-service-name.onrender.com/api/guestbook

# Get projects
curl https://your-service-name.onrender.com/api/projects
```

## Troubleshooting

### Build Fails

- Check the build logs in Render dashboard
- Ensure `go.mod` and `go.sum` are committed
- Verify the build command is correct

### Service Won't Start

- Check the service logs in Render dashboard
- Verify environment variables are set correctly
- Ensure Notion API credentials are valid

### CORS Errors

- Add your frontend domain to `AllowedOrigins` in `main.go`
- Redeploy after making changes

### Database Connection Issues

- Verify Notion API key is correct
- Ensure databases are shared with the integration
- Check database IDs are correct

## Free Tier Limitations

Render's free tier includes:
- 750 hours/month of runtime
- Service spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds

To keep the service active, you can:
- Upgrade to a paid plan
- Use a service like UptimeRobot to ping your API periodically

## Monitoring

Monitor your service in the Render dashboard:
- View logs in real-time
- Check resource usage
- Monitor deployment history

## Updating Your Service

To deploy updates:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render will automatically detect the push and redeploy your service.

---

For more information, visit [Render Documentation](https://render.com/docs).

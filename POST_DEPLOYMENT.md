# Post-Deployment Checklist

## ✅ Backend Deployment Successful

Your backend is now live at: **https://undertale-api.onrender.com**

### Verify Backend is Working

Test the following endpoints:

```bash
# Health check
curl https://undertale-api.onrender.com/health
# Expected: OK

# Get guestbook entries
curl https://undertale-api.onrender.com/api/guestbook
# Expected: JSON array of entries

# Get projects
curl https://undertale-api.onrender.com/api/projects
# Expected: JSON array of projects
```

## 📝 Next Steps

### 1. Update Frontend Configuration

The API configuration has been created at `config/api.ts`:
- ✅ Production URL: `https://undertale-api.onrender.com`
- ✅ Development URL: `http://localhost:8080`
- ✅ Auto-switches based on environment

### 2. Update CORS Settings (If Needed)

The backend now allows requests from:
- ✅ localhost (all ports)
- ✅ Vercel (`*.vercel.app`)
- ✅ Netlify (`*.netlify.app`)
- ✅ Render (`*.onrender.com`)
- ✅ GitHub Pages (`*.github.io`)

If deploying to a custom domain, add it to `backend/main.go`:

```go
AllowedOrigins: []string{
    // ... existing origins
    "https://your-custom-domain.com",
},
```

Then commit and push to trigger redeployment.

### 3. Deploy Frontend

Choose your preferred platform:

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Option B: Netlify
```bash
# Build
npm run build

# Deploy via Netlify CLI or drag-and-drop dist folder
```

#### Option C: Render
Create a new Static Site on Render:
- Build Command: `npm run build`
- Publish Directory: `dist`

#### Option D: GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

### 4. Test Integration

After deploying frontend:

1. Visit your deployed frontend URL
2. Navigate to CONTACT page
3. Try adding a guestbook entry
4. Navigate to PROJECTS page
5. Verify projects load from Notion

### 5. Monitor Performance

**Render Free Tier Notes:**
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Consider using UptimeRobot to keep service active

**Set up monitoring:**
1. Go to [UptimeRobot](https://uptimerobot.com/)
2. Add new monitor
3. URL: `https://undertale-api.onrender.com/health`
4. Interval: 5 minutes

## 🔧 Troubleshooting

### Frontend Can't Connect to API

**Check CORS:**
```bash
# Test CORS from browser console
fetch('https://undertale-api.onrender.com/health')
  .then(r => r.text())
  .then(console.log)
```

If you see CORS error, add your frontend domain to backend CORS settings.

### Notion API Errors

**Verify environment variables in Render:**
1. Go to Render Dashboard
2. Select your service
3. Go to Environment tab
4. Verify:
   - `NOTION_API_KEY` is set
   - `NOTION_DATABASE_ID` is set
   - `NOTION_PROJECTS_DATABASE_ID` is set

**Test Notion connection:**
```bash
curl https://undertale-api.onrender.com/api/projects
```

If you get an error, check:
- Notion integration has access to databases
- Database IDs are correct
- API key is valid

### Slow First Load

This is normal for Render free tier. The service spins down after inactivity.

**Solutions:**
- Upgrade to paid plan ($7/month)
- Use UptimeRobot to ping every 5 minutes
- Add loading state in frontend

## 📊 Monitoring Dashboard

Create a simple monitoring dashboard:

```typescript
// In your frontend
const checkBackendHealth = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.HEALTH);
    return response.ok;
  } catch {
    return false;
  }
};
```

## 🎉 Success Criteria

- [ ] Backend health check returns "OK"
- [ ] Guestbook API returns data
- [ ] Projects API returns data from Notion
- [ ] Frontend can fetch data from backend
- [ ] CORS allows frontend domain
- [ ] Environment variables are set correctly
- [ ] No console errors in browser

---

**Your backend is live! 🚀**

Next: Deploy your frontend and update this checklist.

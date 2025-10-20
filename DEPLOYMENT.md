# Netlify Deployment Guide

## Quick Deploy

### Option 1: Deploy via Netlify CLI (Recommended)

1. **Install Netlify CLI** (if you haven't already):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize and deploy**:
   ```bash
   # First time - creates a new site
   netlify init
   
   # Or deploy directly
   netlify deploy --prod
   ```

### Option 2: Deploy via Git (GitHub/GitLab)

1. **Push your code to GitHub**:
   ```bash
   git add netlify.toml .nvmrc DEPLOYMENT.md
   git commit -m "Add Netlify deployment configuration"
   git push origin cursor/continue-prototype-work
   ```

2. **Connect to Netlify**:
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub, GitLab, etc.)
   - Select your repository
   - Netlify will auto-detect the settings from `netlify.toml`
   - Click "Deploy site"

### Option 3: Manual Deploy

1. **Build the project locally**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to [Netlify](https://app.netlify.com)
   - Drag and drop the `dist` folder to Netlify's deploy area

---

## Configuration

### Build Settings
The `netlify.toml` file is already configured with:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 20 (specified in `.nvmrc`)

### SPA Routing
The configuration includes redirects to handle single-page application routing:
- All routes redirect to `index.html` with a 200 status code
- This ensures direct URLs work correctly

### Security Headers
The following security headers are automatically added:
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### Asset Caching
Static assets in `/assets/*` are cached for 1 year for optimal performance.

---

## Environment Variables

If you need environment variables (for APIs, etc.):

1. **In Netlify Dashboard**:
   - Go to Site settings → Environment variables
   - Add your variables (e.g., `VITE_API_URL`)

2. **In your code**:
   ```typescript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

---

## Custom Domain

To add a custom domain:

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the instructions to update your DNS records

---

## Troubleshooting

### Build fails
- Check the build logs in Netlify dashboard
- Ensure all dependencies are in `package.json` (not just `devDependencies`)
- Verify Node version compatibility

### Routes not working
- Make sure the redirects configuration in `netlify.toml` is present
- Check that `publish = "dist"` matches your build output directory

### Styles not loading
- Verify Tailwind CSS is building correctly
- Check browser console for any errors
- Ensure `@tailwindcss/vite` plugin is in dependencies, not just devDependencies

---

## Preview Deployments

Every branch and pull request automatically gets a preview URL:
- Main branch: `https://your-site-name.netlify.app`
- Preview: `https://deploy-preview-123--your-site-name.netlify.app`

---

## Useful Commands

```bash
# Preview deployment (draft mode)
netlify deploy

# Production deployment
netlify deploy --prod

# Open site in browser
netlify open:site

# Open admin dashboard
netlify open:admin

# View deploy logs
netlify watch
```

---

## Next Steps

1. Deploy your site using one of the options above
2. Get your site URL (e.g., `https://your-site-name.netlify.app`)
3. Share it with your team! 🚀

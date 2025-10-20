# GitHub Pages Setup Instructions

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

## Setup Steps

### 1. Push to GitHub
First, make sure your code is pushed to a GitHub repository:

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```
(Or use `master` if that's your default branch)

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings**
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - Source: **GitHub Actions**

### 3. Automatic Deployment

The workflow will automatically:
- Trigger on every push to `main` or `master` branch
- Build the project with `npm run build`
- Deploy the `dist` folder to GitHub Pages

You can also manually trigger deployment:
1. Go to the **Actions** tab in your repository
2. Select the **Deploy to GitHub Pages** workflow
3. Click **Run workflow**

### 4. Access Your Site

After the first deployment completes (usually 2-3 minutes), your site will be available at:

```
https://<your-username>.github.io/<repository-name>/
```

For example:
- Repository: `https://github.com/johndoe/copado-ai-prototype`
- GitHub Pages URL: `https://johndoe.github.io/copado-ai-prototype/`

### 5. Custom Domain (Optional)

To use a custom domain:
1. Go to **Settings** → **Pages**
2. Enter your custom domain in the **Custom domain** field
3. Follow GitHub's instructions to configure your DNS

## Configuration Files

- **`.github/workflows/deploy.yml`** - GitHub Actions workflow for deployment
- **`vite.config.ts`** - Vite configuration with `base: './'` for proper asset paths

## Troubleshooting

### Deployment fails
- Check the **Actions** tab for error messages
- Ensure you've enabled GitHub Pages in repository settings
- Verify that the branch name in `deploy.yml` matches your default branch

### Page shows 404
- Wait a few minutes after first deployment
- Check that GitHub Pages is enabled in Settings
- Verify the URL includes your repository name

### Assets not loading
- The `base: './'` in `vite.config.ts` ensures relative paths work correctly
- If issues persist, you can set `base: '/<repository-name>/'` in `vite.config.ts`

## Local Development

Continue developing locally as usual:

```bash
npm run dev       # Development server
npm run build     # Build for production
npm run preview   # Preview production build
```

## Status Badge (Optional)

Add this to your README.md to show deployment status:

```markdown
![Deploy Status](https://github.com/<username>/<repository>/actions/workflows/deploy.yml/badge.svg)
```

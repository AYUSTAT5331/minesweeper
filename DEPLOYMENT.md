# Deployment Guide

This guide covers deploying the Minesweeper app to various hosting platforms.

## 📦 Build Output

After running `npm run build`, the production files are in the `dist/` directory:
- `dist/index.html` - Entry HTML file
- `dist/assets/` - Bundled JS and CSS files

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel offers zero-configuration deployment for Vite apps.

**Method 1: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Method 2: Using GitHub Integration**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Vercel auto-detects Vite configuration
6. Click "Deploy"

**Configuration:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Option 2: Netlify

Netlify also provides seamless Vite deployment.

**Method 1: Using Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

**Method 2: Drag and Drop**

1. Build your project: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist` folder to the deploy area

**Method 3: GitHub Integration**

1. Push to GitHub
2. Connect repository in Netlify
3. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

### Option 3: GitHub Pages

GitHub Pages can host static sites for free.

**Step 1: Configure Vite**

Update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/minesweeper/', // Replace with your repo name
  plugins: [react()],
  // ... rest of config
});
```

**Step 2: Add Deployment Script**

Add to `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

**Step 3: Install gh-pages**

```bash
npm install --save-dev gh-pages
```

**Step 4: Deploy**

```bash
npm run deploy
```

Your app will be available at: `https://username.github.io/minesweeper/`

### Option 4: Cloudflare Pages

Cloudflare Pages offers fast global deployment.

**Via Dashboard:**

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your Git repository
3. Configure build:
   - Build Command: `npm run build`
   - Build Output Directory: `dist`
4. Deploy

**Via Wrangler CLI:**

```bash
npm install -g wrangler
wrangler pages deploy dist
```

### Option 5: Firebase Hosting

Firebase provides hosting with CDN and SSL.

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Configure:
# - Public directory: dist
# - Single-page app: Yes
# - GitHub deploys: Optional

# Build and deploy
npm run build
firebase deploy
```

### Option 6: Surge

Simple CLI-based deployment.

```bash
# Install Surge
npm install -g surge

# Build
npm run build

# Deploy
cd dist
surge
```

## 🔧 Environment Variables

This app doesn't currently use environment variables, but if you add API integrations:

**Vite Environment Variables:**
- Prefix with `VITE_` to expose to client
- Example: `VITE_API_URL=https://api.example.com`

**Platform-specific:**
- **Vercel**: Add in Project Settings → Environment Variables
- **Netlify**: Add in Site Settings → Environment Variables
- **GitHub Actions**: Use secrets in workflow file

## ⚙️ Build Optimization

### Enable Compression

Most platforms automatically compress assets. To verify:

```bash
# Check gzip sizes
npm run build

# Output shows:
# dist/assets/index-xxxxx.js  203.06 kB │ gzip: 64.16 kB
```

### Custom Build Configuration

For advanced optimization, modify `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});
```

## 🌐 Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS (Vercel provides instructions)

### Netlify
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS or use Netlify DNS

### GitHub Pages
1. Add `CNAME` file in `public/` directory with your domain
2. Configure DNS with GitHub's IP addresses

## 📊 Monitoring

After deployment, consider:

- **Analytics**: Google Analytics, Plausible, or Vercel Analytics
- **Error Tracking**: Sentry or Rollbar
- **Performance**: Lighthouse CI, WebPageTest
- **Uptime**: UptimeRobot, Pingdom

## 🔒 Security Headers

Add security headers via platform configuration:

**Netlify (_headers file):**
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Vercel (vercel.json):**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

## 🎯 Deployment Checklist

Before deploying:

- [ ] Run `npm run lint` - No errors
- [ ] Run `npm run test` - All tests pass
- [ ] Run `npm run build` - Build succeeds
- [ ] Test production build locally: `npm run preview`
- [ ] Update `README.md` with live URL
- [ ] Configure custom domain (if applicable)
- [ ] Set up analytics (optional)
- [ ] Enable HTTPS (automatic on most platforms)
- [ ] Test on multiple devices/browsers

## 🆘 Troubleshooting

**Build fails on platform:**
- Check Node.js version matches local (18+)
- Ensure all dependencies are in `dependencies`, not `devDependencies`

**Blank page after deployment:**
- Check browser console for errors
- Verify `base` path in `vite.config.ts`
- Ensure 404 redirect to `index.html` for SPA routing

**Assets not loading:**
- Check asset paths (should be relative)
- Verify build output directory is correct
- Check CORS settings if using external CDN

**Performance issues:**
- Enable gzip/brotli compression
- Optimize images (use WebP format)
- Enable caching headers
- Consider code splitting

## 📝 Post-Deployment

After successful deployment:

1. Update README.md with live demo URL
2. Share your project! 🎉
3. Gather feedback
4. Plan next features
5. Keep dependencies updated

---

**Ready to deploy?** Choose your platform and follow the steps above. Good luck! 🚀

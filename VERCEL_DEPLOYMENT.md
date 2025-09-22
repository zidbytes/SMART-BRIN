# Vercel Deployment Guide for SMART-BRIN

This guide covers deploying the SMART-BRIN Laravel application with React/Inertia.js to Vercel.

## Prerequisites

1. A Vercel account
2. Vercel CLI installed (`npm i -g vercel`)
3. Your application repository on GitHub

## Deployment Steps

### 1. Environment Variables

Set the following environment variables in your Vercel project dashboard:

#### Required Variables
```
APP_NAME=SMART-BRIN
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-vercel-domain.vercel.app
APP_KEY=base64:your-32-character-base64-key
```

#### Database (if using external database)
```
DB_CONNECTION=mysql
DB_HOST=your-database-host
DB_PORT=3306
DB_DATABASE=your-database-name
DB_USERNAME=your-database-username
DB_PASSWORD=your-database-password
```

#### Session & Cache
```
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
CACHE_STORE=file
```

#### Optional API Keys
```
MISTRAL_API_KEY=your-mistral-api-key
PDFCO_API_KEY=your-pdfco-api-key
```

### 2. Deploy via Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Or deploy to production directly
vercel --prod
```

### 3. Deploy via GitHub Integration

1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on every push to main branch
3. Configure environment variables in Vercel dashboard

## Configuration Files

### vercel.json
The main Vercel configuration file that:
- Sets up PHP runtime for Laravel
- Configures routing for static assets and API requests
- Defines build settings and environment variables

### api/index.php
Entry point that forwards all requests to Laravel's public/index.php

### build-vercel.sh
Custom build script that:
- Installs dependencies
- Optimizes Laravel configuration
- Builds frontend assets with SSR support

## File Structure After Deployment

```
├── api/
│   └── index.php          # Vercel PHP entry point
├── public/
│   ├── build/             # Built Vite assets
│   └── ...                # Static assets
├── bootstrap/
│   └── ssr/               # Server-side rendering files
└── ...                    # Laravel application files
```

## Important Notes

1. **SSR Support**: The application includes server-side rendering for better SEO and initial page load performance.

2. **Static Assets**: CSS, JS, and image files are served directly from the public directory.

3. **Environment**: The application runs in production mode on Vercel with optimized caching.

4. **Database**: Consider using Vercel's database solutions or external services like PlanetScale, Supabase, or AWS RDS.

5. **File Storage**: For file uploads, consider using cloud storage services like AWS S3, Cloudinary, or Vercel Blob.

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that all dependencies are correctly specified in package.json and composer.json

2. **Environment Variables**: Ensure all required environment variables are set in Vercel dashboard

3. **Asset Loading**: Verify that Vite build outputs are correctly configured and assets are being served

4. **Database Connection**: If using external database, ensure connection details are correct

### Logs

View deployment and runtime logs in the Vercel dashboard under the "Functions" tab.

## Performance Optimization

1. **Asset Optimization**: Vite automatically optimizes CSS and JS bundles
2. **Image Optimization**: Consider using Vercel's Image Optimization features
3. **Caching**: Laravel's route and config caching is enabled in production
4. **CDN**: Vercel automatically serves assets via their global CDN

## Local Development

To test the Vercel configuration locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally
vercel dev
```

This will start a local development server that mimics the Vercel environment.
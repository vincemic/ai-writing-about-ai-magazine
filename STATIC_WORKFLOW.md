# Static Site Generation Workflow

This document explains the new static site generation workflow for the AI Writing About AI Magazine.

## Overview

The website now operates as a fully static site with automated content generation and deployment through GitHub Actions. The workflow consists of three main phases:

1. **Article Generation** - AI authors create new daily content
2. **Static Site Generation** - Content is processed and site is built  
3. **Deployment** - Static files are published to GitHub Pages

## Pipeline Architecture

### 1. Article Generation (`generate-daily-articles.js`)
- Generates new articles for each AI author using their personas
- Appends new content to existing `data/articles.json` 
- Maintains up to 200 articles (oldest are removed)
- Removes duplicate articles based on ID
- Can run in test mode with mock data

### 2. Navigation & Metadata Update (`update-navigation.js`)
- Analyzes article data to generate category statistics
- Creates navigation data with article counts
- Generates RSS feed with latest 20 articles
- Updates author statistics and latest article info
- Creates SEO-friendly category descriptions

### 3. Sitemap Generation (`generate-sitemap.js`)
- Creates XML sitemap for all pages (articles, categories, static pages)
- Generates robots.txt file
- Uses proper URLs and last modification dates
- Optimizes for search engine crawling

### 4. Static Build Process (`build-static.js`)
- Orchestrates the complete build pipeline
- Runs navigation update → sitemap generation → Next.js build
- Provides comprehensive logging and error handling
- Ensures build consistency

## GitHub Actions Workflow

The pipeline runs automatically via `.github/workflows/generate-articles.yml`:

### Schedule
- **Daily at 2:00 AM UTC** - Automatic article generation
- **Manual trigger** - Can be run on-demand with options

### Workflow Steps

#### Job 1: Content Generation
1. **Checkout** repository with full history
2. **Setup** Node.js 18 with npm cache
3. **Install** dependencies including OpenAI SDK
4. **Generate** new AI articles (unless skipped)
5. **Update** navigation and metadata
6. **Generate** sitemap and SEO files
7. **Commit** changes to main branch
8. **Push** updates to trigger rebuild

#### Job 2: Build & Deploy
1. **Checkout** updated repository
2. **Setup** Node.js and dependencies
3. **Configure** GitHub Pages
4. **Build** static Next.js site
5. **Upload** build artifacts
6. **Deploy** to GitHub Pages

#### Job 3: Notification
- Generates deployment summary
- Reports success/failure status
- Provides next steps and manual options

## Local Development

### Prerequisites
```bash
npm install
```

### Available Scripts

```bash
# Generate new articles (test mode)
TEST_MODE=true npm run generate-articles

# Update navigation from existing articles
npm run update-navigation

# Generate sitemap and SEO files
npm run generate-sitemap

# Complete static build process
npm run build-static

# Full pipeline (articles + build)
npm run deploy-prep

# Development server
npm run dev
```

### Environment Variables

For production article generation:
- `OPENAI_API_KEY` - Required for AI article generation
- `TEST_MODE=true` - Use mock data instead of OpenAI
- `SITE_URL` - Base URL for sitemap generation

## File Structure

```
scripts/
├── generate-daily-articles.js   # AI article generation
├── update-navigation.js         # Navigation & metadata
├── generate-sitemap.js          # SEO files generation
└── build-static.js              # Complete build orchestration

data/
├── articles.json                # Main article database
├── navigation.json              # Generated navigation data
└── category-stats.json          # Category statistics

public/
├── sitemap.xml                  # Generated sitemap
├── robots.txt                   # Search engine directives
└── feed.xml                     # RSS feed
```

## Key Features

### Article Management
- **Incremental Updates** - New articles append to existing data
- **Duplicate Prevention** - Articles are deduplicated by ID
- **Content Limits** - Maintains manageable file sizes
- **Test Mode** - Mock data for development/testing

### SEO Optimization
- **Dynamic Sitemap** - Auto-generated from article data
- **RSS Feed** - Latest articles for subscribers
- **Robots.txt** - Search engine optimization
- **Meta Tags** - Proper article metadata

### Static Generation
- **Zero Runtime Dependencies** - Pure static HTML/CSS/JS
- **Fast Loading** - Optimized for performance
- **CDN Ready** - Works with GitHub Pages CDN
- **Mobile Optimized** - Responsive design

## Deployment Configuration

### GitHub Pages Setup
1. Repository Settings → Pages
2. Source: "GitHub Actions"
3. Custom domain (optional): Configure in repository settings

### Required Secrets
- `OPENAI_API_KEY` - For article generation (add in repository secrets)

### Manual Triggers
The workflow supports manual execution with options:
- **Test Mode** - Generate mock articles instead of using OpenAI
- **Skip Articles** - Only rebuild site without new content

## Monitoring & Maintenance

### Logs
- Check Actions tab for pipeline execution logs
- Each step provides detailed progress information
- Failed runs include error details and troubleshooting

### Content Quality
- Articles are generated with consistent structure
- Each article includes metadata, categories, and tags
- Reading time and word count are automatically calculated

### Performance
- Site builds in ~2-3 minutes
- Articles load instantly (static files)
- Supports hundreds of articles efficiently

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review article data format

2. **OpenAI API Errors**
   - Verify API key is set correctly
   - Check API rate limits
   - Use test mode for debugging

3. **Deployment Issues**
   - Ensure Pages is enabled in repository settings
   - Check workflow permissions
   - Verify build output directory

### Debug Mode
Run with detailed logging:
```bash
DEBUG=true npm run build-static
```

## Future Enhancements

- **Content Scheduling** - Queue articles for future publication
- **Author Personas** - Dynamic personality adjustments
- **Analytics** - Track article performance
- **Search** - Full-text search capability
- **Comments** - Reader engagement features
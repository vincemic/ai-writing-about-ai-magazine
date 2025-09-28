#!/usr/bin/env node

/**
 * AI Writing About AI Magazine - Sitemap Generator
 * 
 * This script generates sitemap.xml from the articles data file for static site SEO.
 * It includes all article pages, category pages, and static pages.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DATA_DIR = path.join(__dirname, '../data');
const PUBLIC_DIR = path.join(__dirname, '../public');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');
const SITEMAP_FILE = path.join(PUBLIC_DIR, 'sitemap.xml');

// Get the base URL from environment or use default for GitHub Pages
const BASE_URL = process.env.SITE_URL || 'https://your-username.github.io/ai-ui-test-modern';

/**
 * Load articles data
 */
async function loadArticles() {
  try {
    if (fs.existsSync(ARTICLES_FILE)) {
      const content = fs.readFileSync(ARTICLES_FILE, 'utf8');
      return JSON.parse(content);
    } else {
      console.warn('⚠️ Articles file not found, generating empty sitemap');
      return { articles: [], categories: [] };
    }
  } catch (error) {
    console.error('Error loading articles:', error);
    return { articles: [], categories: [] };
  }
}

/**
 * Generate XML sitemap content
 */
function generateSitemap(articlesData) {
  const { articles, categories } = articlesData;
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/about/', priority: '0.8', changefreq: 'weekly' },
    { url: '/articles/', priority: '0.9', changefreq: 'daily' },
    { url: '/categories/', priority: '0.8', changefreq: 'weekly' }
  ];

  staticPages.forEach(page => {
    const lastmod = new Date().toISOString().split('T')[0];
    sitemap += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Add category pages
  if (categories && categories.length > 0) {
    categories.forEach(category => {
      const categorySlug = category.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
      const lastmod = new Date().toISOString().split('T')[0];
      sitemap += `  <url>
    <loc>${BASE_URL}/categories/${categorySlug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });
  }

  // Add article pages
  if (articles && articles.length > 0) {
    articles.forEach(article => {
      const publishedDate = new Date(article.publishedAt).toISOString().split('T')[0];
      const lastmod = new Date(article.updatedAt).toISOString().split('T')[0];
      
      sitemap += `  <url>
    <loc>${BASE_URL}/articles/${article.id}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    });
  }

  sitemap += '</urlset>';
  return sitemap;
}

/**
 * Generate robots.txt file
 */
function generateRobotsTxt() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
  
  const robotsFile = path.join(PUBLIC_DIR, 'robots.txt');
  fs.writeFileSync(robotsFile, robotsTxt);
  console.log('✅ Generated robots.txt');
}

/**
 * Main execution function
 */
async function main() {
  console.log('🗺️ Starting sitemap generation...');
  
  try {
    // Ensure public directory exists
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }
    
    // Load articles data
    console.log('📚 Loading articles data...');
    const articlesData = await loadArticles();
    console.log(`📄 Found ${articlesData.articles?.length || 0} articles`);
    console.log(`🏷️ Found ${articlesData.categories?.length || 0} categories`);
    
    // Generate sitemap
    console.log('🔧 Generating sitemap...');
    const sitemapContent = generateSitemap(articlesData);
    
    // Write sitemap file
    fs.writeFileSync(SITEMAP_FILE, sitemapContent);
    console.log(`✅ Generated sitemap with ${articlesData.articles?.length || 0} articles`);
    console.log(`📍 Sitemap saved to: ${SITEMAP_FILE}`);
    
    // Generate robots.txt
    generateRobotsTxt();
    
    console.log('🎉 Sitemap generation completed!');
    
  } catch (error) {
    console.error('❌ Sitemap generation failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { generateSitemap, loadArticles };
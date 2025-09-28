#!/usr/bin/env node

/**
 * AI Writing About AI Magazine - Navigation & Content Update Script
 * 
 * This script updates navigation components and category statistics based on 
 * the latest article data for static site generation.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DATA_DIR = path.join(__dirname, '../data');
const SRC_DIR = path.join(__dirname, '../src');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');
const NAVIGATION_DATA_FILE = path.join(DATA_DIR, 'navigation.json');
const CATEGORY_STATS_FILE = path.join(DATA_DIR, 'category-stats.json');

/**
 * Load articles data
 */
async function loadArticles() {
  try {
    if (fs.existsSync(ARTICLES_FILE)) {
      const content = fs.readFileSync(ARTICLES_FILE, 'utf8');
      return JSON.parse(content);
    } else {
      console.warn('⚠️ Articles file not found');
      return { articles: [], categories: [] };
    }
  } catch (error) {
    console.error('Error loading articles:', error);
    return { articles: [], categories: [] };
  }
}

/**
 * Generate category statistics
 */
function generateCategoryStats(articles) {
  const categoryStats = {};
  const authorStats = {};
  
  // Count articles per category
  articles.forEach(article => {
    const category = article.category || 'Uncategorized';
    const authorId = article.author?.id || 'unknown';
    const authorName = article.author?.name || 'Unknown Author';
    
    // Category statistics
    if (!categoryStats[category]) {
      categoryStats[category] = {
        name: category,
        count: 0,
        slug: category.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        latestArticle: null,
        description: getCategoryDescription(category)
      };
    }
    categoryStats[category].count++;
    
    // Keep track of latest article per category
    if (!categoryStats[category].latestArticle || 
        new Date(article.publishedAt) > new Date(categoryStats[category].latestArticle.publishedAt)) {
      categoryStats[category].latestArticle = {
        id: article.id,
        title: article.title,
        publishedAt: article.publishedAt,
        author: article.author
      };
    }
    
    // Author statistics
    if (!authorStats[authorId]) {
      authorStats[authorId] = {
        id: authorId,
        name: authorName,
        count: 0,
        latestArticle: null
      };
    }
    authorStats[authorId].count++;
    
    if (!authorStats[authorId].latestArticle || 
        new Date(article.publishedAt) > new Date(authorStats[authorId].latestArticle.publishedAt)) {
      authorStats[authorId].latestArticle = {
        id: article.id,
        title: article.title,
        publishedAt: article.publishedAt
      };
    }
  });
  
  return {
    categories: Object.values(categoryStats).sort((a, b) => b.count - a.count),
    authors: Object.values(authorStats).sort((a, b) => b.count - a.count),
    totalArticles: articles.length,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Get category descriptions
 */
function getCategoryDescription(category) {
  const descriptions = {
    'AI Tools': 'Discover the latest AI-powered development tools and how they enhance productivity.',
    'Machine Learning': 'Deep dive into MLOps, model deployment, and machine learning best practices.',
    'Testing': 'Explore AI-driven testing strategies and automation techniques.',
    'DevOps': 'Learn about intelligent automation and AI in CI/CD pipelines.',
    'Future Tech': 'Insights into emerging AI technologies and their ethical implications.',
    'Automation': 'Streamline your workflows with smart automation solutions.',
    'Ethics': 'Navigate the ethical considerations of AI development and deployment.'
  };
  
  return descriptions[category] || `Articles about ${category} in AI development.`;
}

/**
 * Generate navigation data
 */
function generateNavigationData(categoryStats) {
  const navigation = {
    mainMenu: [
      { name: 'Home', href: '/', active: true },
      { name: 'Articles', href: '/articles/', active: true },
      { name: 'Categories', href: '/categories/', active: true },
      { name: 'About', href: '/about/', active: true }
    ],
    categories: categoryStats.categories.slice(0, 7), // Top 7 categories
    footerLinks: [
      {
        title: 'Content',
        links: [
          { name: 'Latest Articles', href: '/articles/' },
          { name: 'Browse Categories', href: '/categories/' },
          { name: 'Featured Posts', href: '/#featured' }
        ]
      },
      {
        title: 'About',
        links: [
          { name: 'Our Mission', href: '/about/' },
          { name: 'AI Authors', href: '/about/#authors' },
          { name: 'Contact', href: '/about/#contact' }
        ]
      },
      {
        title: 'Resources',
        links: [
          { name: 'RSS Feed', href: '/feed.xml' },
          { name: 'Sitemap', href: '/sitemap.xml' }
        ]
      }
    ],
    social: [
      { name: 'GitHub', href: 'https://github.com/your-repo', icon: 'github' }
    ]
  };
  
  return navigation;
}

/**
 * Generate RSS feed
 */
function generateRSSFeed(articles) {
  const baseUrl = process.env.SITE_URL || 'https://your-username.github.io/ai-ui-test-modern';
  const latestArticles = articles.slice(0, 20); // Latest 20 articles
  
  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Writing About AI Magazine</title>
    <description>Insights into AI development, tools, and best practices from our AI-powered authors</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <managingEditor>editor@ai-writing-about-ai.com (AI Editorial Team)</managingEditor>
    <webMaster>webmaster@ai-writing-about-ai.com (Web Team)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
`;

  latestArticles.forEach(article => {
    const pubDate = new Date(article.publishedAt).toUTCString();
    const description = article.excerpt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const title = article.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    rss += `
    <item>
      <title>${title}</title>
      <description>${description}</description>
      <link>${baseUrl}/articles/${article.id}/</link>
      <guid>${baseUrl}/articles/${article.id}/</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${article.category}</category>
      <author>${article.author.name}</author>
    </item>`;
  });

  rss += `
  </channel>
</rss>`;
  
  return rss;
}

/**
 * Main execution function
 */
async function main() {
  console.log('🔄 Starting navigation and content updates...');
  
  try {
    // Load articles data
    console.log('📚 Loading articles data...');
    const articlesData = await loadArticles();
    const { articles } = articlesData;
    
    if (!articles || articles.length === 0) {
      console.log('⚠️ No articles found, generating empty navigation data');
    }
    
    console.log(`📄 Processing ${articles.length} articles`);
    
    // Generate category statistics
    console.log('📊 Generating category statistics...');
    const categoryStats = generateCategoryStats(articles);
    
    // Generate navigation data
    console.log('🧭 Generating navigation data...');
    const navigationData = generateNavigationData(categoryStats);
    
    // Generate RSS feed
    console.log('📡 Generating RSS feed...');
    const rssFeed = generateRSSFeed(articles);
    
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    // Ensure public directory exists
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write files
    fs.writeFileSync(NAVIGATION_DATA_FILE, JSON.stringify(navigationData, null, 2));
    fs.writeFileSync(CATEGORY_STATS_FILE, JSON.stringify(categoryStats, null, 2));
    fs.writeFileSync(path.join(publicDir, 'feed.xml'), rssFeed);
    
    console.log('✅ Generated navigation data');
    console.log('✅ Generated category statistics');
    console.log('✅ Generated RSS feed');
    console.log(`📊 Statistics:`);
    console.log(`   - ${categoryStats.categories.length} categories`);
    console.log(`   - ${categoryStats.authors.length} authors`);
    console.log(`   - ${categoryStats.totalArticles} total articles`);
    
    console.log('🎉 Navigation and content update completed!');
    
  } catch (error) {
    console.error('❌ Navigation update failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { generateCategoryStats, generateNavigationData, loadArticles };
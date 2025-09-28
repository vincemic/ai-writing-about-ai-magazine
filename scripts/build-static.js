#!/usr/bin/env node

/**
 * AI Writing About AI Magazine - Static Site Build Script
 * 
 * This script orchestrates the complete static site build process:
 * 1. Updates navigation and metadata from articles
 * 2. Generates sitemap and SEO files
 * 3. Triggers Next.js static build
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting complete static site build process...');
console.log('================================================');

try {
  // Step 1: Update navigation and metadata
  console.log('\n📊 Step 1: Updating navigation and metadata...');
  execSync('node scripts/update-navigation.js', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  // Step 2: Generate sitemap
  console.log('\n🗺️ Step 2: Generating sitemap and SEO files...');
  execSync('node scripts/generate-sitemap.js', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  // Step 3: Build Next.js static site
  console.log('\n🏗️ Step 3: Building Next.js static site...');
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ Static site build completed successfully!');
  console.log('================================================');
  console.log('📁 Output directory: ./out');
  console.log('🌐 Ready for deployment to GitHub Pages');
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
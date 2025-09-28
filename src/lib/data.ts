import fs from 'fs';
import path from 'path';

export interface Author {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  bannerImage?: {
    url: string;
    description: string;
    generatedAt: string;
    model: string;
    error?: string;
  };
  author: Author;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  readingTime: number;
  featured: boolean;
  metadata: {
    wordCount: number;
    generationPrompt: string;
    generatedBy: string;
    generationDate: string;
  };
}

export interface ArticlesData {
  articles: Article[];
  metadata: {
    lastUpdated: string;
    totalArticles: number;
    version: string;
  };
  categories: string[];
}

export interface AuthorProfile {
  id: string;
  name: string;
  title: string;
  specialization: string;
  gender: string;
  personality: {
    traits: string[];
    appearance: string;
  };
  writingStyle: {
    tone: string;
    voice: string;
    structure: string;
    signature: string;
  };
  expertise: string[];
  bio: string;
  agentPrompt: string;
}

/**
 * Load articles from the JSON data file
 */
export function getArticles(): ArticlesData {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'articles.json');
    
    // If file doesn't exist, try sample data
    if (!fs.existsSync(dataPath)) {
      const samplePath = path.join(process.cwd(), 'data', 'sample-articles.json');
      if (fs.existsSync(samplePath)) {
        const fileContent = fs.readFileSync(samplePath, 'utf8');
        return JSON.parse(fileContent);
      }
      
      // Return empty structure if no data files exist
      return {
        articles: [],
        metadata: {
          lastUpdated: new Date().toISOString(),
          totalArticles: 0,
          version: "1.0.0"
        },
        categories: [
          "AI Tools",
          "Machine Learning",
          "Automation", 
          "Future Tech",
          "Testing",
          "DevOps",
          "Ethics"
        ]
      };
    }
    
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error loading articles:', error);
    return {
      articles: [],
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalArticles: 0,
        version: "1.0.0"
      },
      categories: []
    };
  }
}

/**
 * Get featured articles (marked as featured or recent ones)
 */
export function getFeaturedArticles(limit = 4): Article[] {
  const data = getArticles();
  
  // Get articles marked as featured first
  const featuredArticles = data.articles.filter(article => article.featured);
  
  // If we need more articles, add recent ones
  if (featuredArticles.length < limit) {
    const recentArticles = data.articles
      .filter(article => !article.featured)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      
    const additionalCount = limit - featuredArticles.length;
    featuredArticles.push(...recentArticles.slice(0, additionalCount));
  }
  
  return featuredArticles.slice(0, limit);
}

/**
 * Get a single article by ID
 */
export function getArticleById(id: string): Article | null {
  const data = getArticles();
  return data.articles.find(article => article.id === id || article.slug === id) || null;
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string, limit?: number): Article[] {
  const data = getArticles();
  const filtered = data.articles.filter(article => 
    article.category.toLowerCase() === category.toLowerCase()
  );
  
  return limit ? filtered.slice(0, limit) : filtered;
}

/**
 * Get all categories with article counts
 */
export function getCategoriesWithCounts(): Array<{ name: string; count: number }> {
  const data = getArticles();
  const categoryCounts: Record<string, number> = {};
  
  // Initialize all categories
  data.categories.forEach(category => {
    categoryCounts[category] = 0;
  });
  
  // Count articles per category
  data.articles.forEach(article => {
    if (categoryCounts[article.category] !== undefined) {
      categoryCounts[article.category]++;
    }
  });
  
  return Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));
}

/**
 * Search articles by title, content, or tags
 */
export function searchArticles(query: string): Article[] {
  const data = getArticles();
  const searchTerm = query.toLowerCase();
  
  return data.articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm) ||
    article.excerpt.toLowerCase().includes(searchTerm) ||
    article.content.toLowerCase().includes(searchTerm) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    article.author.name.toLowerCase().includes(searchTerm)
  );
}

/**
 * Get author profiles
 */
export function getAuthors(): AuthorProfile[] {
  try {
    const authorsPath = path.join(process.cwd(), 'authors', 'index.json');
    const fileContent = fs.readFileSync(authorsPath, 'utf8');
    const authorsIndex = JSON.parse(fileContent);
    
    const authors: AuthorProfile[] = [];
    
    for (const authorRef of authorsIndex.authors) {
      const profilePath = path.join(process.cwd(), 'authors', 'profiles', `${authorRef.id}.json`);
      if (fs.existsSync(profilePath)) {
        const profileContent = fs.readFileSync(profilePath, 'utf8');
        const profile = JSON.parse(profileContent);
        authors.push(profile);
      }
    }
    
    return authors;
  } catch (error) {
    console.error('Error loading authors:', error);
    return [];
  }
}

/**
 * Get articles by author
 */
export function getArticlesByAuthor(authorId: string, limit?: number): Article[] {
  const data = getArticles();
  const filtered = data.articles.filter(article => 
    article.author.id === authorId
  );
  
  return limit ? filtered.slice(0, limit) : filtered;
}

/**
 * Get recent articles
 */
export function getRecentArticles(limit = 10): Article[] {
  const data = getArticles();
  return data.articles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format reading time
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}
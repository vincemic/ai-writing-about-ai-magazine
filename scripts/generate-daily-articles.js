#!/usr/bin/env node

/**
 * AI Writing About AI Magazine - Daily Article Generator
 * 
 * This script generates new articles for each of our 5 AI authors using their unique personas
 * and appends them to the articles.json data file.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DATA_DIR = path.join(__dirname, '../data');
const AUTHORS_DIR = path.join(__dirname, '../authors');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');
const AUTHORS_INDEX = path.join(AUTHORS_DIR, 'index.json');

// OpenAI client will be initialized only in production mode

/**
 * Load author profiles
 */
async function loadAuthors() {
  try {
    const authorsIndexContent = fs.readFileSync(AUTHORS_INDEX, 'utf8');
    const authorsIndex = JSON.parse(authorsIndexContent);
    const authors = [];
    
    for (const authorRef of authorsIndex.authors) {
      const profilePath = path.join(AUTHORS_DIR, authorRef.profilePath);
      const profileContent = fs.readFileSync(profilePath, 'utf8');
      const profile = JSON.parse(profileContent);
      authors.push(profile);
    }
    
    return authors;
  } catch (error) {
    console.error('Error loading authors:', error);
    throw error;
  }
}

/**
 * Load current articles
 */
async function loadArticles() {
  try {
    if (fs.existsSync(ARTICLES_FILE)) {
      const content = fs.readFileSync(ARTICLES_FILE, 'utf8');
      return JSON.parse(content);
    } else {
      return {
        articles: [],
        metadata: {
          lastUpdated: new Date().toISOString(),
          totalArticles: 0,
          version: "1.0.0",
          lastGenerationDate: new Date().toISOString(),
          newArticlesAdded: 0,
          articlesLimitReached: false
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
  } catch (error) {
    console.error('Error loading articles:', error);
    throw error;
  }
}

/**
 * Generate trending topics for article ideas
 */
async function generateTrendingTopics() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const topicsPrompt = `As an AI development industry analyst, generate 10 trending topics in AI development for ${currentDate}. 
  Focus on practical, implementable topics that would interest developers. Include:
  - New tools and frameworks
  - Best practices and methodologies  
  - Emerging technologies and techniques
  - Industry insights and analysis
  
  Return as a simple JSON array of topic strings.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system", 
          content: "You are an AI development industry expert who tracks emerging trends and technologies."
        },
        {
          role: "user",
          content: topicsPrompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error generating topics:', error);
    // Fallback topics
    return [
      "Advanced prompt engineering techniques for developers",
      "AI-powered code review automation",
      "Machine learning model versioning best practices", 
      "Ethical considerations in AI development tools",
      "Optimizing CI/CD pipelines with intelligent automation"
    ];
  }
}

/**
 * Generate article content for a specific author
 */
async function generateArticleForAuthor(author, availableTopics) {
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Select a topic that matches the author's specialization
  const relevantTopics = availableTopics.filter(topic => 
    topic.toLowerCase().includes(author.specialization.toLowerCase().split(' ')[0]) ||
    author.expertise.some(exp => topic.toLowerCase().includes(exp.toLowerCase().split(' ')[0]))
  );
  
  const selectedTopic = relevantTopics.length > 0 
    ? relevantTopics[Math.floor(Math.random() * relevantTopics.length)]
    : availableTopics[Math.floor(Math.random() * availableTopics.length)];

  const articlePrompt = `${author.agentPrompt}

Today is ${currentDate}. Write an article about: "${selectedTopic}"

Requirements:
- Title should be engaging and SEO-friendly
- Include practical examples and actionable insights
- Write 800-1200 words
- Use markdown formatting
- Include code examples where relevant
- End with a brief conclusion

Focus on your expertise in ${author.specialization} and write in your characteristic style.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are ${author.name}, ${author.title}. ${author.bio}`
        },
        {
          role: "user", 
          content: articlePrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    
    // Extract title from the content (first # heading)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : selectedTopic;
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 60);
    
    // Generate excerpt from first paragraph
    const paragraphs = content.split('\n\n').filter(p => !p.startsWith('#') && p.trim().length > 50);
    const excerpt = paragraphs[0] ? paragraphs[0].substring(0, 200) + '...' : title.substring(0, 150) + '...';
    
    // Calculate reading time (average 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    // Determine category based on author specialization
    const categoryMap = {
      'AI-Powered Development Tools': 'AI Tools',
      'Machine Learning Operations': 'Machine Learning', 
      'AI-Driven Testing & Automation': 'Testing',
      'Emerging AI Technologies & Ethics': 'Future Tech',
      'CI/CD Pipeline Automation & Workflow Intelligence': 'DevOps'
    };
    
    const category = categoryMap[author.specialization] || 'AI Tools';
    
    // Generate article ID
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const articleId = `${timestamp}-${author.id}-${slug.substring(0, 30)}`;
    
    return {
      id: articleId,
      title,
      slug,
      excerpt,
      content,
      author: {
        id: author.id,
        name: author.name,
        title: author.title,
        bio: author.bio,
        avatar: `/authors/images/${author.id}.png`
      },
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category,
      tags: generateTags(content, author.expertise),
      readingTime,
      featured: Math.random() < 0.3, // 30% chance of being featured
      metadata: {
        wordCount,
        generationPrompt: selectedTopic,
        generatedBy: "GPT-4",
        generationDate: new Date().toISOString()
      }
    };
    
  } catch (error) {
    console.error(`Error generating article for ${author.name}:`, error);
    throw error;
  }
}

/**
 * Generate tags based on content and author expertise
 */
function generateTags(content, expertise) {
  const tags = new Set();
  
  // Add tags based on author expertise
  expertise.slice(0, 3).forEach(exp => {
    const tag = exp.split(' ').slice(0, 2).join(' ');
    tags.add(tag);
  });
  
  // Add common AI development tags found in content
  const commonTags = [
    'AI', 'Machine Learning', 'Automation', 'DevOps', 'Testing',
    'Python', 'JavaScript', 'React', 'Node.js', 'Docker', 'Kubernetes',
    'GitHub', 'VS Code', 'OpenAI', 'TensorFlow', 'PyTorch'
  ];
  
  commonTags.forEach(tag => {
    if (content.toLowerCase().includes(tag.toLowerCase())) {
      tags.add(tag);
    }
  });
  
  return Array.from(tags).slice(0, 6);
}

/**
 * Test mode - generate mock articles
 */
function generateMockArticles(authors) {
  const mockTopics = [
    "AI-powered code completion tools comparison",
    "MLOps best practices for 2025", 
    "Automated testing with AI insights",
    "The future of human-AI collaboration",
    "Optimizing deployment pipelines with machine learning"
  ];
  
  return authors.map((author, index) => {
    const currentDate = new Date().toISOString();
    const dateString = currentDate.split('T')[0].replace(/-/g, '');
    const topic = mockTopics[index] || mockTopics[0];
    
    const slug = topic.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    const articleId = `${dateString}-${author.id}-${slug}`;
    
    return {
      id: articleId,
      title: topic,
      slug,
      excerpt: `A comprehensive analysis of ${topic.toLowerCase()} from the perspective of ${author.name}.`,
      content: `# ${topic}\n\nThis is a mock article generated for testing purposes. In production, this would contain a full AI-generated article about ${topic}.\n\n## Key Points\n\n- Point 1 about the topic\n- Point 2 with technical details\n- Point 3 with practical examples\n\n## Conclusion\n\nThis mock article demonstrates the structure and format that will be used for AI-generated content.`,
      author: {
        id: author.id,
        name: author.name, 
        title: author.title,
        bio: author.bio,
        avatar: `/authors/images/${author.id}.png`
      },
      publishedAt: currentDate,
      updatedAt: currentDate,
      category: author.specialization.includes('Tools') ? 'AI Tools' : 
               author.specialization.includes('Machine Learning') ? 'Machine Learning' :
               author.specialization.includes('Testing') ? 'Testing' :
               author.specialization.includes('Ethics') ? 'Future Tech' : 'DevOps',
      tags: ['Mock', 'Test', author.specialization.split(' ')[0]],
      readingTime: 3,
      featured: index < 2,
      metadata: {
        wordCount: 150,
        generationPrompt: topic,
        generatedBy: "Mock Generator",
        generationDate: currentDate
      }
    };
  });
}

/**
 * Main execution function
 */
async function main() {
  console.log('🤖 Starting AI Writing About AI Magazine article generation...');
  
  try {
    // Load data
    const authors = await loadAuthors();
    const articlesData = await loadArticles();
    
    console.log(`📚 Loaded ${authors.length} authors`);
    console.log(`📄 Current articles: ${articlesData.articles.length}`);
    
    let newArticles;
    
    if (process.env.TEST_MODE === 'true') {
      console.log('🧪 Running in test mode - generating mock articles');
      newArticles = generateMockArticles(authors);
    } else {
      // Generate trending topics
      console.log('🔍 Generating trending topics...');
      const trendingTopics = await generateTrendingTopics();
      console.log(`📈 Generated ${trendingTopics.length} trending topics`);
      
      // Generate articles for each author
      console.log('✍️ Generating articles for each author...');
      newArticles = [];
      
      for (const author of authors) {
        console.log(`  📝 Generating article for ${author.name}...`);
        try {
          const article = await generateArticleForAuthor(author, trendingTopics);
          newArticles.push(article);
          console.log(`  ✅ Generated: "${article.title}"`);
        } catch (error) {
          console.error(`  ❌ Failed to generate article for ${author.name}:`, error.message);
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    if (newArticles.length === 0) {
      console.log('⚠️ No articles were generated');
      return;
    }
    
    // Add new articles to existing data (newest first)
    articlesData.articles.unshift(...newArticles); // Add to beginning
    
    // Remove duplicates based on article ID
    const uniqueArticles = [];
    const seenIds = new Set();
    
    articlesData.articles.forEach(article => {
      if (!seenIds.has(article.id)) {
        seenIds.add(article.id);
        uniqueArticles.push(article);
      }
    });
    
    articlesData.articles = uniqueArticles;
    articlesData.metadata.totalArticles = articlesData.articles.length;
    articlesData.metadata.lastUpdated = new Date().toISOString();
    articlesData.metadata.lastGenerationDate = new Date().toISOString();
    articlesData.metadata.newArticlesAdded = newArticles.length;
    
    // Keep only the latest 200 articles to prevent file from growing too large
    if (articlesData.articles.length > 200) {
      articlesData.articles = articlesData.articles.slice(0, 200);
      articlesData.metadata.totalArticles = 200;
      articlesData.metadata.articlesLimitReached = true;
    }
    
    // Save updated articles
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articlesData, null, 2));
    
    console.log(`✅ Successfully generated ${newArticles.length} new articles`);
    console.log(`📊 Total articles: ${articlesData.articles.length}`);
    console.log('🎉 Article generation completed!');
    
  } catch (error) {
    console.error('❌ Article generation failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}
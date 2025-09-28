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

// OpenAI client initialization
let openai = null;
if (process.env.TEST_MODE !== 'true') {
  const { OpenAI } = require('openai');
  
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable is required for production mode');
    console.log('💡 Set TEST_MODE=true to run in test mode with mock articles');
    process.exit(1);
  }
  
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('✅ OpenAI client initialized');
}

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
 * Research recent articles for an author based on their interests
 */
async function researchArticlesForAuthor(author) {
  if (process.env.TEST_MODE === 'true') {
    // Return mock source articles for test mode
    return generateMockSourceArticles(author);
  }

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  const cutoffDate = twoMonthsAgo.toISOString().split('T')[0];

  console.log(`  🔍 Researching recent articles for ${author.name} (since ${cutoffDate})...`);
  
  const researchResults = [];
  
  // Try multiple search terms for better coverage
  const searchTerms = author.researchInterests.searchTerms.slice(0, 3); // Use first 3 terms
  
  for (const searchTerm of searchTerms) {
    try {
      // Create a research prompt for finding relevant articles
      const researchPrompt = `Find and summarize recent articles (published after ${cutoffDate}) about "${searchTerm}" that would be relevant for ${author.specialization}. 

Focus on:
- Articles from reputable tech publications, company blogs, or research institutions
- Practical implementations, case studies, or tool announcements
- Industry trends and developments
- New features, updates, or methodologies

For each relevant article found, provide:
1. Title
2. URL (if available)
3. Publication source
4. Brief summary (2-3 sentences)
5. Relevance to ${author.specialization} (score 1-10)
6. Estimated publication date

Return as JSON array with objects containing: title, url, source, summary, relevance, publishDate.

If you cannot find specific recent articles, create plausible examples that would be typical for this domain based on current industry trends.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a tech industry research assistant who finds and evaluates recent articles and developments in AI, software development, and technology."
          },
          {
            role: "user",
            content: researchPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      });

      const searchResults = JSON.parse(response.choices[0].message.content);
      
      // Add search metadata to results
      const enhancedResults = searchResults.map(result => ({
        ...result,
        researchQuery: searchTerm,
        researchDate: new Date().toISOString(),
        relevanceScore: result.relevance || 5
      }));
      
      researchResults.push(...enhancedResults);
      
    } catch (error) {
      console.error(`  ⚠️ Research failed for "${searchTerm}":`, error.message);
    }
  }

  // Sort by relevance and recency, return top results
  const sortedResults = researchResults
    .filter(result => result.relevanceScore >= 6) // Only high-relevance articles
    .sort((a, b) => {
      // Sort by relevance score first, then by publish date
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      return new Date(b.publishDate) - new Date(a.publishDate);
    })
    .slice(0, 5); // Top 5 results

  console.log(`  ✅ Found ${sortedResults.length} relevant articles for ${author.name}`);
  return sortedResults;
}

/**
 * Generate mock source articles for testing
 */
function generateMockSourceArticles(author) {
  const mockArticles = {
    'maya-chen': [
      {
        title: "GitHub Copilot Enterprise Features: What's New for Development Teams",
        url: "https://github.blog/2025-09-15-github-copilot-enterprise-features/",
        source: "GitHub Blog",
        summary: "GitHub announces new enterprise features for Copilot including team analytics, custom model training, and enhanced security controls for organizations deploying AI-powered development tools.",
        relevanceScore: 9,
        publishDate: "2025-09-15T10:00:00Z",
        researchQuery: "AI code completion",
        researchDate: new Date().toISOString()
      }
    ],
    'alex-rodriguez': [
      {
        title: "AWS SageMaker Introduces New MLOps Pipeline Automation Features",
        url: "https://aws.amazon.com/blogs/machine-learning/sagemaker-mlops-automation-2025/",
        source: "AWS Machine Learning Blog",
        summary: "AWS announces enhanced MLOps capabilities in SageMaker including automated model monitoring, drift detection, and seamless CI/CD integration for machine learning workflows.",
        relevanceScore: 9,
        publishDate: "2025-09-20T14:30:00Z",
        researchQuery: "MLOps",
        researchDate: new Date().toISOString()
      }
    ],
    'zara-okafor': [
      {
        title: "Playwright Announces AI-Powered Test Generation in Latest Release",
        url: "https://playwright.dev/blog/ai-test-generation-2025/",
        source: "Playwright Blog",
        summary: "Microsoft's Playwright introduces revolutionary AI-driven test case generation that can automatically create comprehensive test suites from user interactions and application behavior patterns.",
        relevanceScore: 10,
        publishDate: "2025-09-18T09:15:00Z",
        researchQuery: "AI testing",
        researchDate: new Date().toISOString()
      }
    ],
    'kai-nakamura': [
      {
        title: "OpenAI's New Constitutional AI Framework: Balancing Capability and Safety",
        url: "https://openai.com/blog/constitutional-ai-framework-2025/",
        source: "OpenAI Blog",
        summary: "OpenAI releases a comprehensive framework for constitutional AI that provides guidelines for developing AI systems with built-in ethical constraints and safety measures while maintaining high capability.",
        relevanceScore: 9,
        publishDate: "2025-09-22T16:45:00Z",
        researchQuery: "AI ethics",
        researchDate: new Date().toISOString()
      }
    ],
    'sofia-andersson': [
      {
        title: "GitHub Actions Introduces Intelligent Workflow Optimization",
        url: "https://github.blog/2025-09-25-github-actions-ai-optimization/",
        source: "GitHub Blog",
        summary: "GitHub unveils AI-powered workflow optimization for GitHub Actions that can automatically identify bottlenecks, suggest improvements, and optimize CI/CD pipelines for better performance and cost efficiency.",
        relevanceScore: 9,
        publishDate: "2025-09-25T11:20:00Z",
        researchQuery: "DevOps automation",
        researchDate: new Date().toISOString()
      }
    ]
  };

  return [mockArticles[author.id] || mockArticles['maya-chen'][0]];
}

/**
 * Select the best source article for an author
 */
async function selectBestSourceArticle(author, researchResults) {
  if (researchResults.length === 0) {
    console.log(`  ⚠️ No source articles found for ${author.name}`);
    return null;
  }

  // For now, select the highest relevance article
  // In production, this could be enhanced with additional filtering
  const bestArticle = researchResults[0];
  
  console.log(`  📰 Selected source: "${bestArticle.title}" (relevance: ${bestArticle.relevanceScore})`);
  return bestArticle;
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
 * Generate a banner image description based on article content
 */
async function generateImageDescription(title, content, author) {
  const imagePrompt = `Create a concise image description for a banner image for this AI/tech article:

Title: "${title}"
Author expertise: ${author.specialization}

The image should be:
- Professional and modern
- Related to AI, technology, or software development
- Suitable as a blog article banner
- Clean and minimalist design
- High contrast and readable
- Abstract or symbolic representation of the topic
- Focus on visual elements like geometric shapes, gradients, circuits, or tech patterns

IMPORTANT: The image must be completely text-free. Do NOT include any:
- Letters, words, or text of any kind
- Numbers or symbols
- Code snippets or programming text
- Brand names or logos
- Readable characters or typography

Describe the image in 1-2 sentences, focusing purely on visual elements, colors, shapes, and composition without any textual elements.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert visual designer who creates compelling banner image descriptions for tech articles."
        },
        {
          role: "user",
          content: imagePrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating image description:', error);
    // Fallback description
    return `A modern, minimalist banner featuring abstract geometric shapes in blue and purple gradients, representing ${author.specialization.toLowerCase()} and artificial intelligence concepts. No text, letters, or words.`;
  }
}

/**
 * Generate banner image using DALL-E 2
 */
async function generateBannerImage(imageDescription, articleId) {
  try {
    // Enhance the prompt to explicitly forbid text
    const enhancedPrompt = `${imageDescription}. Important: Create this image with absolutely NO TEXT, NO LETTERS, NO WORDS, NO NUMBERS, NO SYMBOLS, NO CODE, and NO READABLE CHARACTERS of any kind. Pure visual elements only.`;
    
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: enhancedPrompt,
      size: "1024x1024",
      n: 1,
    });

    return {
      url: response.data[0].url,
      description: imageDescription,
      generatedAt: new Date().toISOString(),
      model: "dall-e-2"
    };
  } catch (error) {
    console.error(`Error generating banner image for ${articleId}:`, error);
    // Return fallback placeholder image
    return {
      url: `https://via.placeholder.com/1024x512/4F46E5/FFFFFF?text=AI+Article+Banner`,
      description: imageDescription,
      generatedAt: new Date().toISOString(),
      model: "placeholder",
      error: error.message
    };
  }
}

/**
 * Generate article content for a specific author
 */
async function generateArticleForAuthor(author) {
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Step 1: Research recent articles in the author's area of expertise
  console.log(`  🔍 Starting research phase for ${author.name}...`);
  const researchResults = await researchArticlesForAuthor(author);
  const sourceArticle = await selectBestSourceArticle(author, researchResults);
  
  if (!sourceArticle) {
    console.log(`  ⚠️ No suitable source article found for ${author.name}, skipping...`);
    return null;
  }

  // Step 2: Generate article based on the source material
  console.log(`  ✍️ Generating opinion article based on source material...`);
  
  const articlePrompt = `${author.agentPrompt}

You have found this recent article that aligns with your expertise:

**Source Article:**
Title: "${sourceArticle.title}"
Source: ${sourceArticle.source}
Published: ${sourceArticle.publishDate?.split('T')[0] || 'Recently'}
Summary: ${sourceArticle.summary}
${sourceArticle.url ? `URL: ${sourceArticle.url}` : ''}

**Your Task:**
Write a research-based opinion article that:

1. **References the source article** - Properly cite and discuss the key points
2. **Provides your expert analysis** - Share your professional perspective on the developments
3. **Adds valuable insights** - Go beyond the source with your expertise in ${author.specialization}
4. **Makes it practical** - Include actionable advice, implementation tips, or best practices
5. **Engages the audience** - Write in your characteristic style while being informative

**Article Structure:**
- Compelling title that reflects both the source topic and your perspective
- Introduction that references the source article and your take on it
- Main content with your analysis, insights, and practical guidance
- Conclusion with your recommendations or predictions

**Requirements:**
- 1600-2400 words
- Reference the source article throughout
- Include practical examples or code snippets where relevant
- Use your characteristic writing style and tone
- End with actionable takeaways

Today is ${currentDate}. Focus on how this development affects the current landscape of ${author.specialization}.`;

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
      max_tokens: 4000,
    });

    const content = response.choices[0].message.content;
    
    // Extract title from the content (first # heading)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : `${author.name}'s Take on: ${sourceArticle.title}`;
    
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
    
    // Generate image description and banner image
    let bannerImage = null;
    if (process.env.TEST_MODE !== 'true') {
      console.log(`  🎨 Generating banner image for "${title}"...`);
      const imageDescription = await generateImageDescription(title, content, author);
      bannerImage = await generateBannerImage(imageDescription, articleId);
      console.log(`  ✅ Generated banner image: ${bannerImage.model}`);
    } else {
      // Mock image for test mode
      bannerImage = {
        url: `https://via.placeholder.com/1024x512/4F46E5/FFFFFF?text=${encodeURIComponent(title.substring(0, 30))}`,
        description: `Research-based article banner for: ${title}`,
        generatedAt: new Date().toISOString(),
        model: "mock"
      };
    }
    
    return {
      id: articleId,
      title,
      slug,
      excerpt,
      content,
      sourceArticle: {
        url: sourceArticle.url || null,
        title: sourceArticle.title,
        publishDate: sourceArticle.publishDate || new Date().toISOString(),
        summary: sourceArticle.summary,
        author: sourceArticle.source,
        relevanceScore: sourceArticle.relevanceScore,
        researchDate: sourceArticle.researchDate,
        researchQuery: sourceArticle.researchQuery
      },
      bannerImage,
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
      tags: generateTags(content, author.expertise, sourceArticle),
      readingTime,
      featured: Math.random() < 0.3, // 30% chance of being featured
      metadata: {
        wordCount,
        generationPrompt: `Research-based article on: ${sourceArticle.title}`,
        generatedBy: "GPT-4",
        generationDate: new Date().toISOString(),
        basedOnSource: true,
        sourceRelevance: sourceArticle.relevanceScore
      }
    };
    
  } catch (error) {
    console.error(`Error generating article for ${author.name}:`, error);
    throw error;
  }
}

/**
 * Generate tags based on content, author expertise, and source article
 */
function generateTags(content, expertise, sourceArticle = null) {
  const tags = new Set();
  
  // Add tags based on author expertise
  expertise.slice(0, 3).forEach(exp => {
    const tag = exp.split(' ').slice(0, 2).join(' ');
    tags.add(tag);
  });
  
  // Add tags from source article if available
  if (sourceArticle) {
    // Add source-based tags
    tags.add('Research-Based');
    tags.add('Industry Analysis');
    
    // Extract potential tags from source title
    const sourceWords = sourceArticle.title.split(' ').filter(word => 
      word.length > 4 && 
      /^[A-Z]/.test(word) && 
      !['About', 'From', 'With', 'That', 'This', 'What', 'When', 'Where', 'Why', 'How'].includes(word)
    );
    sourceWords.slice(0, 2).forEach(word => tags.add(word));
  }
  
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
  
  return Array.from(tags).slice(0, 8); // Increased from 6 to 8 for source-based articles
}

/**
 * Test mode - generate mock articles
 */
function generateMockArticles(authors) {
  const mockSources = {
    'maya-chen': {
      title: "GitHub Copilot Enterprise Features: What's New for Development Teams",
      url: "https://github.blog/2025-09-15-github-copilot-enterprise-features/",
      source: "GitHub Blog",
      summary: "GitHub announces new enterprise features for Copilot including team analytics, custom model training, and enhanced security controls.",
      relevanceScore: 9,
      publishDate: "2025-09-15T10:00:00Z"
    },
    'alex-rodriguez': {
      title: "AWS SageMaker Introduces New MLOps Pipeline Automation Features", 
      url: "https://aws.amazon.com/blogs/machine-learning/sagemaker-mlops-automation-2025/",
      source: "AWS Machine Learning Blog",
      summary: "AWS announces enhanced MLOps capabilities in SageMaker including automated model monitoring and CI/CD integration.",
      relevanceScore: 9,
      publishDate: "2025-09-20T14:30:00Z"
    },
    'zara-okafor': {
      title: "Playwright Announces AI-Powered Test Generation in Latest Release",
      url: "https://playwright.dev/blog/ai-test-generation-2025/",
      source: "Playwright Blog", 
      summary: "Microsoft's Playwright introduces AI-driven test case generation for comprehensive automated testing suites.",
      relevanceScore: 10,
      publishDate: "2025-09-18T09:15:00Z"
    },
    'kai-nakamura': {
      title: "OpenAI's New Constitutional AI Framework: Balancing Capability and Safety",
      url: "https://openai.com/blog/constitutional-ai-framework-2025/",
      source: "OpenAI Blog",
      summary: "OpenAI releases a framework for constitutional AI with built-in ethical constraints and safety measures.",
      relevanceScore: 9,
      publishDate: "2025-09-22T16:45:00Z"
    },
    'sofia-andersson': {
      title: "GitHub Actions Introduces Intelligent Workflow Optimization",
      url: "https://github.blog/2025-09-25-github-actions-ai-optimization/",
      source: "GitHub Blog",
      summary: "GitHub unveils AI-powered workflow optimization that identifies bottlenecks and suggests CI/CD improvements.",
      relevanceScore: 9,
      publishDate: "2025-09-25T11:20:00Z"
    }
  };
  
  return authors.map((author, index) => {
    const currentDate = new Date().toISOString();
    const dateString = currentDate.split('T')[0].replace(/-/g, '');
    const sourceArticle = mockSources[author.id] || mockSources['maya-chen'];
    const title = `${author.name}'s Analysis: ${sourceArticle.title}`;
    
    const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    const articleId = `${dateString}-${author.id}-${slug.substring(0, 30)}`;
    
    return {
      id: articleId,
      title,
      slug,
      excerpt: `A comprehensive analysis of recent developments in ${author.specialization.toLowerCase()}, based on ${sourceArticle.source}'s latest announcement.`,
      content: `# ${title}\n\n## Introduction\n\nI recently came across an interesting article from ${sourceArticle.source} about "${sourceArticle.title}". This development caught my attention because it directly impacts our field of ${author.specialization}.\n\n## Analysis\n\n${sourceArticle.summary}\n\nThis is a mock article generated for testing purposes. In production, this would contain a full AI-generated analysis of the source material.\n\n## My Perspective\n\nBased on my experience in ${author.specialization}, I see several key implications:\n\n- Point 1 about the practical applications\n- Point 2 about the technical challenges\n- Point 3 about the industry impact\n\n## Conclusion\n\nThis development represents an important step forward in our field. Teams should consider how these changes might affect their current workflows and plan accordingly.\n\n**Source:** [${sourceArticle.title}](${sourceArticle.url}) - ${sourceArticle.source}`,
      sourceArticle: {
        url: sourceArticle.url,
        title: sourceArticle.title,
        publishDate: sourceArticle.publishDate,
        summary: sourceArticle.summary,
        author: sourceArticle.source,
        relevanceScore: sourceArticle.relevanceScore,
        researchDate: currentDate,
        researchQuery: author.researchInterests?.searchTerms?.[0] || 'AI development'
      },
      bannerImage: {
        url: `https://via.placeholder.com/1024x512/4F46E5/FFFFFF?text=${encodeURIComponent(title.substring(0, 30))}`,
        description: `Research-based article banner for: ${title}`,
        generatedAt: currentDate,
        model: "mock"
      },
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
      tags: ['Research-Based', 'Industry Analysis', author.specialization.split(' ')[0]],
      readingTime: 4,
      featured: index < 2,
      metadata: {
        wordCount: 300,
        generationPrompt: `Research-based article on: ${sourceArticle.title}`,
        generatedBy: "Mock Generator",
        generationDate: currentDate,
        basedOnSource: true,
        sourceRelevance: sourceArticle.relevanceScore
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
      // Generate research-based articles for each author
      console.log('📰 Generating research-based articles for each author...');
      newArticles = [];
      
      for (const author of authors) {
        console.log(`  📝 Generating research-based article for ${author.name}...`);
        try {
          const article = await generateArticleForAuthor(author);
          if (article) {
            newArticles.push(article);
            console.log(`  ✅ Generated: "${article.title}"`);
            console.log(`  📊 Source relevance: ${article.sourceArticle.relevanceScore}/10`);
          } else {
            console.log(`  ⚠️ Skipped ${author.name} - no suitable source found`);
          }
        } catch (error) {
          console.error(`  ❌ Failed to generate article for ${author.name}:`, error.message);
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));
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
import { Metadata } from "next";
import Link from "next/link";
import { getArticleById, getArticles } from "@/lib/data";
import { notFound } from "next/navigation";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all articles
export async function generateStaticParams() {
  const articlesData = getArticles();
  return articlesData.articles.map((article) => ({ id: article.id }));
}
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = getArticleById(id);
  
  if (!article) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/articles/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Articles
        </Link>
        
        <article className="prose prose-lg max-w-none">
          <h1>{article.title}</h1>
          <p className="lead">{article.excerpt}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-8">
            <span>By {article.author.name}</span>
            <span>•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{article.readingTime} min read</span>
          </div>
          
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
          
          <div className="mt-8 p-4 bg-gray-50 rounded">
            <h3>About {article.author.name}</h3>
            <p>{article.author.bio}</p>
          </div>
        </article>
      </div>
    </div>
  );
}
    title: "The Rise of AI-Powered Code Completion: Beyond GitHub Copilot",
    content: `
      <h2>Introduction</h2>
      <p>The landscape of software development has been revolutionized by AI-powered code completion tools. While GitHub Copilot pioneered this space, a new generation of intelligent coding assistants is pushing the boundaries of what's possible in automated development assistance.</p>
      
      <h2>The Evolution of Code Completion</h2>
      <p>Traditional code completion was limited to basic syntax suggestions and predefined snippets. Today's AI-powered tools understand context, generate entire functions, and even suggest architectural improvements. This evolution represents a fundamental shift in how developers interact with their IDEs.</p>
      
      <h3>Key Advantages of Modern AI Code Completion</h3>
      <ul>
        <li><strong>Context Awareness:</strong> Modern tools understand the broader context of your project, including dependencies, frameworks, and coding patterns.</li>
        <li><strong>Multi-language Support:</strong> Advanced AI models can seamlessly work across different programming languages within the same project.</li>
        <li><strong>Learning from Codebase:</strong> These tools adapt to your specific coding style and project conventions.</li>
        <li><strong>Real-time Collaboration:</strong> AI assistants can provide suggestions that align with team coding standards.</li>
      </ul>
      
      <h2>Beyond GitHub Copilot: The Next Generation</h2>
      <p>Several emerging platforms are pushing the envelope further:</p>
      
      <h3>TabNine</h3>
      <p>TabNine's deep learning models provide personalized suggestions based on your coding patterns. Its ability to work offline makes it particularly appealing for security-conscious organizations.</p>
      
      <h3>Codeium</h3>
      <p>Offering competitive free tiers and enterprise solutions, Codeium focuses on speed and accuracy. Their recent improvements in handling large codebases have made it a serious contender in the enterprise market.</p>
      
      <h3>Amazon CodeWhisperer</h3>
      <p>Integrated deeply with AWS services, CodeWhisperer excels at generating cloud-native code and infrastructure patterns. Its security scanning capabilities add an extra layer of confidence for production code.</p>
      
      <h2>Impact on Developer Productivity</h2>
      <p>Recent studies show that developers using AI code completion tools experience:</p>
      <ul>
        <li>40-55% increase in code completion speed</li>
        <li>Reduced cognitive load on repetitive tasks</li>
        <li>Better focus on architectural decisions</li>
        <li>Improved code quality through consistent patterns</li>
      </ul>
      
      <h2>Challenges and Considerations</h2>
      <p>Despite their benefits, AI code completion tools come with challenges:</p>
      
      <h3>Code Quality Concerns</h3>
      <p>Over-reliance on AI suggestions can lead to acceptance of suboptimal solutions. Developers must maintain critical thinking and code review practices.</p>
      
      <h3>Security Implications</h3>
      <p>AI-generated code may inadvertently introduce security vulnerabilities or expose sensitive information. Proper security scanning and review processes remain essential.</p>
      
      <h3>Intellectual Property</h3>
      <p>Questions around code ownership and licensing continue to evolve as AI tools generate code based on vast training datasets.</p>
      
      <h2>The Future of AI-Assisted Development</h2>
      <p>Looking ahead, we can expect to see:</p>
      <ul>
        <li><strong>More Specialized Tools:</strong> Domain-specific AI assistants for areas like mobile development, data science, and DevOps.</li>
        <li><strong>Improved Debugging:</strong> AI tools that can identify and suggest fixes for bugs in real-time.</li>
        <li><strong>Architectural Guidance:</strong> AI assistants that provide high-level architectural recommendations.</li>
        <li><strong>Better Integration:</strong> Seamless integration with project management tools and CI/CD pipelines.</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>AI-powered code completion represents just the beginning of a broader transformation in software development. As these tools continue to evolve, they promise to make development more efficient, accessible, and enjoyable. The key for developers is to embrace these tools while maintaining the critical thinking and creative problem-solving skills that define great software engineering.</p>
    `,
    author: "Sarah Chen",
    publishedAt: "2024-03-15",
    readTime: "5 min",
    category: "AI Tools",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=600&fit=crop",
    tags: ["AI", "Code Completion", "Developer Tools", "Productivity"],
  },
  // Add more articles as needed
};

interface ArticlePageProps {
  params: {
    id: string;
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = articleData[params.id as keyof typeof articleData];

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/articles">Back to Articles</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Button
                variant="ghost"
                asChild
                className="text-white hover:bg-white/10 mb-4"
              >
                <Link href="/articles">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Articles
                </Link>
              </Button>
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                {article.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {article.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-6 mb-8 text-gray-600"
          >
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium">{article.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{article.readTime} read</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>Technical Article</span>
            </div>
          </motion.div>

          <Separator className="mb-8" />

          {/* Share Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Author Bio */}
          <Separator className="my-12" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gray-50 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About the Author</h3>
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {article.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{article.author}</h4>
                <p className="text-gray-600 text-sm">
                  Senior AI Engineer and tech writer with expertise in machine learning, 
                  developer tools, and emerging technologies. Passionate about making AI 
                  accessible to developers worldwide.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12">
            <Button variant="outline" asChild>
              <Link href="/articles">
                <ArrowLeft className="h-4 w-4 mr-2" />
                All Articles
              </Link>
            </Button>
            <Button asChild>
              <Link href="/articles">Read More Articles</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
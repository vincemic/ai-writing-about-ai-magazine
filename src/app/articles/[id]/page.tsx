import { Metadata } from "next";
import Link from "next/link";
import { getArticleById, getArticles, formatDate, formatReadingTime } from "@/lib/data";
import { notFound } from "next/navigation";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all articles
export async function generateStaticParams() {
  const articlesData = getArticles();
  return articlesData.articles.map((article) => ({ id: article.id }));
}

// Generate metadata for the article
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const article = getArticleById(id);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.bannerImage ? [article.bannerImage.url] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = getArticleById(id);
  
  if (!article) {
    notFound();
  }
  
  // Convert markdown content to HTML for display
  const processContent = (content: string) => {
    return content
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4 text-white">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mb-3 mt-6 text-white">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mb-2 mt-4 text-white">$1</h3>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="italic text-gray-300">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-2 py-1 rounded text-sm font-mono text-cyan-400">$1</code>')
      .replace(/^- (.+)$/gm, '<li class="mb-1 text-gray-300">$1</li>')
      .replace(/(<li.*<\/li>)/g, '<ul class="list-disc pl-6 mb-3 space-y-1">$1</ul>')
      .replace(/\n\n/g, '</p><p class="mb-3 text-gray-300 leading-relaxed">')
      .replace(/^(.+)$/gm, '<p class="mb-3 text-gray-300 leading-relaxed">$1</p>')
      .replace(/<p class="mb-3 text-gray-300 leading-relaxed"><h/g, '<h')
      .replace(/<\/h([123])><\/p>/g, '</h$1>');
  };
  
  return (
    <article className="min-h-screen bg-gray-950">
      {/* Banner Image */}
      {article.bannerImage && (
        <div className="relative h-96 overflow-hidden">
          <img
            src={article.bannerImage.url}
            alt={article.bannerImage.description}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 pb-6">
              <Link 
                href="/articles/" 
                className="inline-flex items-center text-white hover:text-cyan-400 mb-3 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Articles
              </Link>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-white bg-cyan-500/20 border border-cyan-400/50 px-2 py-1 rounded">
                  {article.category}
                </span>
                {article.featured && (
                  <span className="text-xs font-semibold text-white bg-purple-500/20 border border-purple-400/50 px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                {article.title}
              </h1>
            </div>
          </div>
        </div>
      )}
      
      {/* Article Content */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-400">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-white">{article.author.name}</p>
                <p className="text-sm text-gray-400">{article.author.title}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-400">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatReadingTime(article.readingTime)}</span>
            </div>
          </div>
          
          <hr className="border-gray-800 mb-6" />
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-cyan-400 bg-cyan-400/20 border border-cyan-400/30 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: processContent(article.content) }}
          />
          
          {/* Author Bio */}
          <hr className="border-gray-800 my-8" />
          
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">About the Author</h3>
            <div className="flex items-start space-x-4">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-14 h-14 rounded-full"
              />
              <div>
                <h4 className="font-medium text-white mb-1">{article.author.name}</h4>
                <p className="text-sm text-cyan-400 mb-2">{article.author.title}</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {article.author.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Link 
              href="/articles/"
              className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Articles
            </Link>
            <Link
              href="/articles/"
              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-colors"
            >
              Read More Articles
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
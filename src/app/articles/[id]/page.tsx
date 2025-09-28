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
      .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mb-6 text-gray-900">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold mb-4 mt-8 text-gray-900">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mb-3 mt-6 text-gray-900">$1</h3>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600">$1</code>')
      .replace(/^- (.+)$/gm, '<li class="mb-2">$1</li>')
      .replace(/(<li.*<\/li>)/g, '<ul class="list-disc pl-6 mb-4 space-y-2">$1</ul>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
      .replace(/^(.+)$/gm, '<p class="mb-4 text-gray-700 leading-relaxed">$1</p>')
      .replace(/<p class="mb-4 text-gray-700 leading-relaxed"><h/g, '<h')
      .replace(/<\/h([123])><\/p>/g, '</h$1>');
  };
  
  return (
    <article className="min-h-screen bg-white">
      {/* Banner Image */}
      {article.bannerImage && (
        <div className="relative h-96 overflow-hidden">
          <img
            src={article.bannerImage.url}
            alt={article.bannerImage.description}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-8">
              <Link 
                href="/articles/" 
                className="inline-flex items-center text-white hover:text-gray-200 mb-4 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Articles
              </Link>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-white bg-white/20 px-2 py-1 rounded">
                  {article.category}
                </span>
                {article.featured && (
                  <span className="text-xs font-semibold text-white bg-green-600/80 px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {article.title}
              </h1>
            </div>
          </div>
        </div>
      )}
      
      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-600">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{article.author.name}</p>
                <p className="text-sm text-gray-500">{article.author.title}</p>
              </div>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatReadingTime(article.readingTime)}</span>
            </div>
          </div>
          
          <hr className="border-gray-200 mb-8" />
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded"
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
          <hr className="border-gray-200 my-12" />
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
            <div className="flex items-start space-x-4">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">{article.author.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{article.author.title}</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {article.author.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12">
            <Link 
              href="/articles/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Articles
            </Link>
            <Link
              href="/articles/"
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Read More Articles
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
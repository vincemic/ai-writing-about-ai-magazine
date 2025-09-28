import { getRecentArticles } from "@/lib/data";
import Link from "next/link";
import { formatDate, formatReadingTime } from "@/lib/data";

export default function FeaturedArticles() {
  // Always show latest articles, regardless of featured status
  const articles = getRecentArticles(6);
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Latest Articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.length === 0 ? (
            <div className="col-span-full text-center text-gray-600">
              <p>No articles available yet. New AI-generated content will appear here daily!</p>
            </div>
          ) : (
            articles.map((article) => (
              <Link 
                key={article.id} 
                href={`/articles/${article.id}/`}
                className="group"
              >
                <article className="bg-gray-50 rounded-lg hover:shadow-lg transition-shadow h-full flex flex-col overflow-hidden">
                  {/* Banner Image */}
                  {article.bannerImage && (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={article.bannerImage.url}
                        alt={article.bannerImage.description}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          {article.category}
                        </span>
                        {article.featured && (
                          <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>
                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={article.author.avatar}
                            alt={article.author.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {article.author.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(article.publishedAt)}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatReadingTime(article.readingTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
        {articles.length > 0 && (
          <div className="text-center mt-12">
            <Link 
              href="/articles/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Articles
              <svg 
                className="ml-2 w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

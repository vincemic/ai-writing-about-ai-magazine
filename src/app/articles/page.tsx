import { getArticles, formatDate, formatReadingTime } from "@/lib/data";
import Link from "next/link";

export default function ArticlesPage() {
  const data = getArticles();
  const articles = data.articles;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">All Articles</h1>
          <p className="text-center text-gray-600 mb-12">Explore our collection of AI and technology insights</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.length === 0 ? (
              <div className="col-span-full text-center text-gray-600 py-12">
                <p className="text-lg">No articles available yet.</p>
                <p className="text-sm mt-2">New AI-generated content will appear here daily!</p>
              </div>
            ) : (
              articles.map((article) => (
                <Link 
                  key={article.id} 
                  href={`/articles/${article.id}/`}
                  className="group"
                >
                  <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-full flex flex-col overflow-hidden">
                    {/* Banner Image */}
                    {article.bannerImage && (
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={article.bannerImage.url}
                          alt={article.bannerImage.description}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      </div>
                    )}
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            {article.category}
                          </span>
                          {article.featured && (
                            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        
                        <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {article.title}
                        </h2>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
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
              <p className="text-gray-600">
                Showing {articles.length} article{articles.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

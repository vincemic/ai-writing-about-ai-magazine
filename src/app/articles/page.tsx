import { getArticles, formatDate, formatReadingTime } from "@/lib/data";
import Link from "next/link";

export default function ArticlesPage() {
  const data = getArticles();
  const articles = data.articles;

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2 text-white">All Articles</h1>
          <p className="text-center text-gray-400 mb-8">Explore our collection of AI and technology insights</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-8">
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
                  <article className="bg-gray-900 border border-gray-800 rounded-lg shadow-sm hover:shadow-lg hover:border-cyan-500/50 transition-all h-full flex flex-col overflow-hidden">
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
                    
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-cyan-400 bg-cyan-400/20 border border-cyan-400/30 px-2 py-1 rounded">
                            {article.category}
                          </span>
                          {article.featured && (
                            <span className="text-xs font-semibold text-purple-400 bg-purple-400/20 border border-purple-400/30 px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        
                        <h2 className="text-lg font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {article.title}
                        </h2>
                        
                        <p className="text-gray-400 mb-3 line-clamp-3 text-sm leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>
                      
                      <div className="border-t border-gray-800 pt-3 mt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={article.author.avatar}
                              alt={article.author.name}
                              className="w-7 h-7 rounded-full"
                            />
                            <div>
                              <p className="text-sm font-medium text-white">
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
            <div className="text-center mt-8">
              <p className="text-gray-400">
                Showing {articles.length} article{articles.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

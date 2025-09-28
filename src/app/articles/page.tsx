import { getArticles } from "@/lib/data";

export default function ArticlesPage() {
  const data = getArticles();
  const articles = data.articles;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Articles</h1>
        <div className="grid gap-6">
          {articles.length === 0 ? (
            <p className="text-center text-gray-600">No articles available yet. Check back soon!</p>
          ) : (
            articles.map((article) => (
              <div key={article.id} className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>By {article.author.name}</span>
                  <span>{article.readingTime} min read</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { getFeaturedArticles } from "@/lib/data";

export default function FeaturedArticles() {
  const articles = getFeaturedArticles(4);
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Articles</h2>
        <div className="grid gap-6">
          {articles.length === 0 ? (
            <p className="text-center text-gray-600">No articles available yet.</p>
          ) : (
            articles.map((article) => (
              <div key={article.id} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>By {article.author.name}</span>
                  <span>{article.category}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

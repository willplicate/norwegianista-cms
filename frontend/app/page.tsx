import Link from 'next/link';
import { getPublishedArticles } from '@/lib/queries';

export default async function HomePage() {
  const articles = await getPublishedArticles();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Cruise Ship Insights
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            In-depth reviews and guides for cruise ship experiences
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No Articles Yet
            </h2>
            <p className="text-gray-600">
              Articles will appear here once they are published.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/${article.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {article.featured_image && (
                  <img
                    src={article.featured_image.url}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{article.ship?.name}</span>
                    <span className="mx-2">•</span>
                    <span>{article.topic?.name}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-gray-600 text-sm">{article.excerpt}</p>
                  )}
                  <div className="mt-4 text-sm text-gray-500">
                    {new Date(article.published_at!).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Cruise Ship Insights. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

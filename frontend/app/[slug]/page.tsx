import Link from 'next/link';
import { getArticleBySlug, getPublishedArticles } from '@/lib/queries';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);

  if (!article || article.status !== 'published') {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {article.featured_image && (
          <img
            src={article.featured_image.url}
            alt={article.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span>{article.ship?.name}</span>
              <span className="mx-2">•</span>
              <span>{article.topic?.name}</span>
              <span className="mx-2">•</span>
              <time>
                {new Date(article.published_at!).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-xl text-gray-600">{article.excerpt}</p>
            )}
          </div>

          <div className="prose prose-lg max-w-none">
            {article.content.split('\n').map((paragraph, idx) => {
              // Handle markdown headings
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={idx} className="text-3xl font-bold mt-8 mb-4">
                    {paragraph.substring(2)}
                  </h1>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-2xl font-bold mt-6 mb-3">
                    {paragraph.substring(3)}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xl font-bold mt-4 mb-2">
                    {paragraph.substring(4)}
                  </h3>
                );
              }
              // Handle paragraphs
              if (paragraph.trim() === '') {
                return <br key={idx} />;
              }
              return (
                <p key={idx} className="mb-4 text-gray-700">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            About {article.ship?.name}
          </h3>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-gray-500">Cruise Line</dt>
              <dd className="text-gray-900">{article.ship?.cruise_line}</dd>
            </div>
            {article.ship?.year_built && (
              <div>
                <dt className="font-medium text-gray-500">Year Built</dt>
                <dd className="text-gray-900">{article.ship.year_built}</dd>
              </div>
            )}
            {article.ship?.capacity && (
              <div>
                <dt className="font-medium text-gray-500">Capacity</dt>
                <dd className="text-gray-900">
                  {article.ship.capacity.toLocaleString()} passengers
                </dd>
              </div>
            )}
            {article.ship?.gross_tonnage && (
              <div>
                <dt className="font-medium text-gray-500">Gross Tonnage</dt>
                <dd className="text-gray-900">
                  {article.ship.gross_tonnage.toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </article>

      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Cruise Ship Insights. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

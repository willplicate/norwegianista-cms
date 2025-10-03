import Link from 'next/link';
import { getShipById, getShipReviews, getShipImages } from '@/lib/queries';
import { notFound } from 'next/navigation';

export default async function ShipDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [ship, reviews, images] = await Promise.all([
    getShipById(params.id),
    getShipReviews(params.id),
    getShipImages(params.id),
  ]);

  if (!ship) {
    notFound();
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <Link
          href="/admin/ships"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          ← Back to Ships
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900">{ship.name}</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {ship.cruise_line}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Year Built</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {ship.year_built || 'N/A'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Passenger Capacity
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {ship.capacity?.toLocaleString() || 'N/A'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Gross Tonnage
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {ship.gross_tonnage?.toLocaleString() || 'N/A'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Average Rating
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {averageRating > 0 ? `${averageRating.toFixed(1)}/5` : 'No reviews'}
              </dd>
            </div>
            {ship.itineraries && ship.itineraries.length > 0 && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">
                  Itineraries
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {ship.itineraries.join(', ')}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Reviews ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet for this ship.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white shadow sm:rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {review.reviewer_name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {review.cruise_date
                        ? new Date(review.cruise_date).toLocaleDateString()
                        : 'Date not specified'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {review.rating}
                    </span>
                    <span className="text-gray-500 ml-1">/5</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{review.review_text}</p>
                {review.categories && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(review.categories).map(([key, value]) => (
                      <span
                        key={key}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {key}: {value}/5
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Images Section */}
      {images.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Images ({images.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="bg-white shadow rounded-lg p-4">
                <img
                  src={image.url}
                  alt={image.caption || ship.name}
                  className="w-full h-48 object-cover rounded"
                />
                {image.caption && (
                  <p className="mt-2 text-sm text-gray-700">{image.caption}</p>
                )}
                {image.credit && (
                  <p className="text-xs text-gray-500">Photo: {image.credit}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4">
        <Link
          href={`/admin/generate?ship=${ship.id}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Generate Article
        </Link>
      </div>
    </div>
  );
}

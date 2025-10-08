// PropertyCard component: Displays a single property summary
export default function PropertyCard({ property }) {
  // TODO: Render property image, title, price, etc.
  return (
    <div className="bg-white rounded shadow p-4">
      <div className="h-40 bg-gray-200 mb-2 rounded" />
      <h2 className="text-lg font-semibold">{property?.title || 'Property Title'}</h2>
      <p className="text-blue-600 font-bold">${property?.price || '0'}</p>
      {/* More property info */}
    </div>
  );
}

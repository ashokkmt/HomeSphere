// app/favorites/page.jsx
import PropertyCard from "../../components/PropertyCard";

const favs = [
  { id: 101, title: "Cozy 1BHK near river", price: "₹8,500", city: "Pune", beds: 1, baths: 1, area: "520 sqft", image: "/sample3.jpg" },
];

export default function Favorites() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Favorites</h1>
        <div className="text-sm text-gray-500">Saved places</div>
      </div>

      {favs.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">No favorites yet</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {favs.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
      )}
    </div>
  );
}

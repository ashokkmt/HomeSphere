// Homepage: Lists all properties with search and filters
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';

export default function HomePage() {
  // TODO: Fetch properties from GraphQL API
  return (
    <div>
      <SearchBar />
      <h1 className="text-4xl font-bold mb-12">Featured Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Map over properties and render <PropertyCard /> */}
      </div>
    </div>
  );
}

// Favorites page: Shows user's favorited properties
import ProtectedRoute from '../../components/ProtectedRoute';

export default function FavoritesPage() {
  // TODO: Fetch and display user's favorites
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold mb-4">My Favorites</h1>
        {/* List of favorited properties */}
      </div>
    </ProtectedRoute>
  );
}

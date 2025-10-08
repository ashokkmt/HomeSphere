// Profile page: Shows user info and their properties/inquiries
import ProtectedRoute from '../../components/ProtectedRoute';

export default function ProfilePage() {
  // TODO: Fetch and display user profile info
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        {/* User info, properties, inquiries */}
      </div>
    </ProtectedRoute>
  );
}

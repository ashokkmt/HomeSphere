// Create new property page (for agents)
import PropertyForm from '../../../components/PropertyForm';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function NewPropertyPage() {
  // TODO: Only allow agents to access
  return (
    <ProtectedRoute role="AGENT">
      <div>
        <h1 className="text-2xl font-bold mb-4">List a New Property</h1>
        <PropertyForm />
      </div>
    </ProtectedRoute>
  );
}

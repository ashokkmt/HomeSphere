// ProtectedRoute component: Restricts access to authenticated users (optionally by role)
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, role }) {
  // TODO: Check authentication and role
  const router = useRouter();
  useEffect(() => {
    // If not authenticated or role mismatch, redirect to login
    // router.push('/auth/login');
  }, []);
  return children;
}

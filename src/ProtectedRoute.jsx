import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('study-authenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/study" replace />;
  }

  return children;
}

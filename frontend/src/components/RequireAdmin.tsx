import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function RequireAdmin({ children }: { children: JSX.Element }) {
  const { authed, isAdmin } = useAuth();
  const loc = useLocation();
  if (!authed) return <Navigate to="/login" replace state={{ from: loc }} />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

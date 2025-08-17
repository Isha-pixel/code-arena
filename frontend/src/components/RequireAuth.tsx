// // src/components/RequireAuth.tsx
// import { Navigate } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';

// export default function RequireAuth({ children }: { children: JSX.Element }) {
//   const { authed } = useAuth();
//   return authed ? children : <Navigate to="/login" replace />;
// }


// components/RequireAuth.tsx
import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('access');
  const loc = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: loc }} />;
  return children;
}

import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface Props {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user) {
    const userRole = user.role.toUpperCase();
    const isAllowed = allowedRoles.some(role => role.toUpperCase() === userRole);
    
    if (!isAllowed) {
      // Redirección si se intenta acceder a un rol no permitido
      const redirectPath = userRole === 'VENDEDOR' ? '/vendedor/dashboard' : '/cliente/home';
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;

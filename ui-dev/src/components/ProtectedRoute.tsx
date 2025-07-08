import { Navigate, Outlet } from 'react-router-dom';
import PendingApproval from '@/pages/PendingApproval';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireAdmin?: boolean;
  requireApproved?: boolean;
}

// This is a mock function - replace with your actual auth check
const getAuthState = () => {
  const auth = localStorage.getItem('auth');
  return auth ? JSON.parse(auth) : null;
};

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  requireApproved = true 
}: ProtectedRouteProps) => {
  const auth = getAuthState();
  
  // If not authenticated, redirect to sign in
  if (!auth) {
    return <Navigate to="/signin" replace />;
  }
  
  // If admin access required but user is not admin
  if (requireAdmin && !auth.user?.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // If account requires approval and is not approved
  if (requireApproved && !auth.isApproved) {
    return <PendingApproval />;
  }
  
  // If all checks pass, render the children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;

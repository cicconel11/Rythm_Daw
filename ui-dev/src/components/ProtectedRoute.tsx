import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import PendingApproval from "@/pages/PendingApproval";
import { Auth } from "../types/auth";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireAdmin?: boolean;
  requireApproved?: boolean;
}

// This is a mock function - replace with your actual auth check
const getAuthState = () => {
  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth) : null;
};

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireApproved = true,
}: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  // Replace 'any' with a more specific type for authState
  const [authState, setAuthState] = useState<Auth | null>(null);

  useEffect(() => {
    const auth = getAuthState();
    setAuthState(auth);
    setIsLoading(false);
  }, []);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to sign in
  if (!authState) {
    return <Navigate to="/signin" replace />;
  }

  // If admin access required but user is not admin
  if (requireAdmin && !authState.user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If account requires approval and is not approved
  if (requireApproved && !authState.isApproved) {
    return <PendingApproval />;
  }

  // If all checks pass
  if (children) {
    return <>{children}</>;
  }

  // Render the nested routes
  return <Outlet />;
};

export default ProtectedRoute;

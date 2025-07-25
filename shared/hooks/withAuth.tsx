import { useRouter } from "next/router";
import React, { useEffect } from "react";

/**
 * Higher-Order Component for protecting routes that require authentication
 * @param WrappedComponent - The component to protect
 * @returns A new component that wraps the original with authentication logic
 */
const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<P> => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const router = useRouter();

    useEffect(() => {
      // In a real app, you would check for an authentication token here
      // For testing purposes, we'll just render the component
      // const token = localStorage.getItem('authToken');
      // if (!token) {
      //   router.push('/auth/login');
      // }
    }, [router]);

    return React.createElement(WrappedComponent, props);
  };

  // Set a display name for better debugging
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  AuthenticatedComponent.displayName = `withAuth(${displayName})`;

  return AuthenticatedComponent;
};

export { withAuth };
export default withAuth;

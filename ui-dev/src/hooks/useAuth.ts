import { useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  isAdmin: boolean;
  isApproved: boolean;
}

export interface AuthState {
  user: User;
  token: string;
  isAuthenticated: boolean;
  isApproved: boolean;
}

const useAuth = () => {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load auth state from localStorage on mount
    const loadAuth = () => {
      try {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
          setAuth(JSON.parse(storedAuth));
        }
      } catch (error) {
        console.error("Failed to parse auth data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuth();

    // Listen for storage events to sync auth state across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth") {
        loadAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (authData: AuthState) => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.email === authData.user.email);

    // Merge with existing user data (to preserve isAdmin status)
    const updatedAuth = {
      ...authData,
      user: {
        ...authData.user,
        isAdmin: user?.isAdmin || false,
        isApproved: user?.isApproved || false,
      },
    };

    localStorage.setItem("auth", JSON.stringify(updatedAuth));
    setAuth(updatedAuth);
    return updatedAuth;
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    window.location.href = "/signin"; // Force reload to clear all state
  };

  return {
    auth,
    isLoading,
    isAuthenticated: !!auth?.isAuthenticated,
    isAdmin: auth?.user?.isAdmin || false,
    isApproved: auth?.isApproved || false,
    login,
    logout,
  };
};

export default useAuth;

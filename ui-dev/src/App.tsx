import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import FileShare from "@/pages/FileShare";
import History from "@/pages/History";
import FriendsPage from "@/pages/Friends";
import ChatPage from "@/pages/Chat";
import LandingPage from "@/pages/LandingPage";
import Register from "@/pages/Register";
import SignIn from "@/pages/SignIn";
import PendingApproval from "@/pages/PendingApproval";
import Admin from "@/pages/Admin";
import AccountSettings from "@/pages/settings/AccountSettings";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect } from "react";

function App() {
  // Set theme class on mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Router>
        <Routes>
          {/* Public routes without layout */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          {process.env.NEXT_PUBLIC_ENABLE_ADMIN && (
            <Route path="/signin" element={<SignIn />} />
          )}
          {process.env.NEXT_PUBLIC_ENABLE_ADMIN && (
            <Route path="/pending-approval" element={<PendingApproval />} />
          )}

          {/* Main app routes with layout */}
          <Route
            element={
              <ProtectedRoute requireApproved={true}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="files" element={<FileShare />} />
            <Route path="history" element={<History />} />
            <Route path="friends" element={<FriendsPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="settings" element={<AccountSettings />} />
            {process.env.NEXT_PUBLIC_ENABLE_ADMIN && (
              <Route path="admin" element={<Admin />} />
            )}
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from 'next-themes';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import FileShare from '@/pages/FileShare';
import History from '@/pages/History';
import FriendsPage from '@/pages/Friends';
import ChatPage from '@/pages/Chat';
import LandingPage from '@/pages/LandingPage';
import Register from '@/pages/Register';
import SignIn from '@/pages/SignIn';
import PendingApproval from '@/pages/PendingApproval';
import Admin from '@/pages/Admin';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect } from 'react';

function App() {
  // Set theme class on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout><Outlet /></Layout>}>
            <Route index element={<Navigate to="/landing" replace />} />
            <Route path="landing" element={<LandingPage />} />
            <Route path="register" element={<Register />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="pending-approval" element={<PendingApproval />} />

            {/* Protected routes - require authentication and approval */}
            <Route element={<ProtectedRoute requireApproved={true} />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="files" element={<FileShare />} />
              <Route path="history" element={<History />} />
              <Route path="friends" element={<FriendsPage />} />
              <Route path="chat" element={<ChatPage />} />
              
              {/* Admin-only routes */}
              <Route path="admin" element={<Admin />} />
            </Route>

            <Route path="*" element={<Navigate to="/landing" replace />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;

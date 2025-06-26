import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from 'next-themes';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import FileShare from '@/pages/FileShare';
import History from '@/pages/History';
import FriendsPage from '@/pages/Friends';
import ChatPage from '@/pages/Chat';
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
          <Route path="/" element={<Layout><Outlet /></Layout>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="files" element={<FileShare />} />
            <Route path="history" element={<History />} />
            <Route path="friends" element={<FriendsPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;

import React, { useEffect } from 'react';
import useStore from '@/store';
import Navbar from './components/Navbar';
import TopBar from './components/TopBar';
import ChatTab from './Tabs/ChatTab';
import FilesTab from './Tabs/FilesTab';
import HistoryTab from './Tabs/HistoryTab';
import AccountTab from './Tabs/AccountTab';
import Friends from './Pages/Friends';

const App: React.FC = () => {
  const { activeTab, setActiveTab, fetchInitialData } = useStore();

  useEffect(() => {
    // Fetch initial data when the app loads
    fetchInitialData();
  }, [fetchInitialData]);

  const renderTab = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatTab />;
      case 'files':
        return <FilesTab />;
      case 'history':
        return <HistoryTab />;
      case 'account':
        return <AccountTab />;
      case 'friends':
        return <Friends />;
      default:
        return <ChatTab />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-text_primary overflow-hidden">
      <Navbar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 overflow-auto">
            {renderTab()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

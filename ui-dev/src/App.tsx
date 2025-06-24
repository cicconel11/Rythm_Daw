import React, { useEffect } from 'react';
import TopBar from '@/TopBar';
import Navbar from '@/Tabs/Navbar';
import ChatTab from '@/Tabs/ChatTab';
import FilesTab from '@/Tabs/FilesTab';
import HistoryTab from '@/Tabs/HistoryTab';
import AccountTab from '@/Tabs/AccountTab';
import { useStore } from '@store';

// Debug component to log props
const DebugWrapper: React.FC<{name: string; children: React.ReactNode}> = ({ name, children }) => {
  console.log(`Rendering ${name}`);
  return <>{children}</>;
};

function App() {
  console.log('App component rendering');
  
  const { activeTab } = useStore();
  console.log('Current active tab:', activeTab);

  // Log when the component mounts and unmounts
  useEffect(() => {
    console.log('App mounted');
    return () => console.log('App unmounted');
  }, []);

  const renderActiveTab = () => {
    try {
      console.log('Rendering tab:', activeTab);
      switch (activeTab) {
        case 'Chat':
          return <ChatTab />;
        case 'Files':
          return <FilesTab />;
        case 'History':
          return <HistoryTab />;
        case 'Account':
          return <AccountTab />;
        default:
          console.warn('Unknown tab, defaulting to Chat');
          return <ChatTab />;
      }
    } catch (error) {
      console.error('Error rendering tab:', error);
      return (
        <div className="p-4 text-red-500 bg-red-50">
          <h2>Error rendering tab: {activeTab}</h2>
          <pre>{error instanceof Error ? error.message : String(error)}</pre>
        </div>
      );
    }
  };

  try {
    return (
      <div className="min-w-[500px] min-h-screen bg-background text-text_primary flex flex-col md:flex-row">
        <DebugWrapper name="App Container">
          <div className="flex flex-col flex-1">
            <DebugWrapper name="TopBar">
              <TopBar />
            </DebugWrapper>
            <div className="flex flex-1 flex-col md:flex-row min-h-0">
              <DebugWrapper name="Navbar">
                <Navbar />
              </DebugWrapper>
              <div className="flex-1 overflow-auto bg-background rounded-br-xl">
                <DebugWrapper name={`TabContent-${activeTab}`}>
                  {renderActiveTab()}
                </DebugWrapper>
              </div>
            </div>
          </div>
        </DebugWrapper>
      </div>
    );
  } catch (error) {
    console.error('Error in App render:', error);
    return (
      <div className="p-4 text-red-500 bg-red-50">
        <h1>Error in Application</h1>
        <pre>{error instanceof Error ? error.message : 'Unknown error'}</pre>
        <p>Check the console for more details.</p>
      </div>
    );
  }
}

export default App;

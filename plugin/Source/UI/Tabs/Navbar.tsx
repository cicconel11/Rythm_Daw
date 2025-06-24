import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@store';

const tabs = ['Chat', 'Files', 'History', 'Account'];

const Navbar: React.FC = () => {
  const { activeTab, setActiveTab } = useStore();

  return (
    <nav className="bg-panel w-24 h-full rounded-r-xl shadow-outer-md flex flex-col items-center py-6 relative overflow-hidden justify-between">
      <div className="flex flex-col items-center space-y-6 w-full px-2 overflow-y-auto overflow-x-hidden h-full justify-center">
        {tabs.map((tab) => (
          <div key={tab} className="w-full flex justify-center relative">
            <button
              className={`text-sm font-medium w-full py-2 transition-colors duration-300 relative z-10 ${activeTab === tab ? 'text-brand' : 'text-text_secondary hover:text-text_primary'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
            {activeTab === tab && (
              <motion.span
                className="absolute left-0 top-2 bottom-2 w-1 bg-brand rounded-r-md z-0"
                layoutId="activeTab"
              />
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;

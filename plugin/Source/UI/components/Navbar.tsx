import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Store is not needed here as we're using props
// import { useStore } from '../../store';

export type Tab = 'chat' | 'files' | 'history' | 'account' | 'friends';

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }: NavbarProps) => {

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'chat', icon: '💬', label: 'Chat' },
    { id: 'friends', icon: '👥', label: 'Friends' },
    { id: 'files', icon: '📁', label: 'Files' },
    { id: 'history', icon: '⏱️', label: 'History' },
    { id: 'account', icon: '👤', label: 'Account' },
  ];

  return (
    <div className="flex flex-col items-center py-4 px-2 bg-panel border-r border-gray-700 h-full">
      <div className="space-y-2 w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors ${
                isActive ? 'bg-brand/20 text-brand' : 'text-text_secondary hover:bg-gray-700/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-xs mt-1">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-brand rounded-r-md"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
              {tab.id === 'friends' && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;

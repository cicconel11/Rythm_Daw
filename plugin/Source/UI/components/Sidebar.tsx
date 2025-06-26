// @ts-nocheck
import * as React from 'react';
import { useState } from 'react';
import { useStore } from '@store';
import { motion, AnimatePresence } from 'framer-motion';
import CreateGroupModal from './CreateGroupModal';

type User = {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'away' | 'busy';
};

type Channel = {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'project';
  participants: string[];
  unreadCount?: number;
};

const Sidebar = () => {
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const { 
    channels, 
    users, 
    activeChannel, 
    setActiveChannel,
    activeTab
  } = useStore();
  
  // Separate channels by type
  const projectChannels = channels.filter(c => c.type === 'project');
  const groupChannels = channels.filter(c => c.type === 'group');
  const directMessageChannels = channels.filter(c => c.type === 'direct');

  const getChannelDisplayName = (channel: Channel) => {
    if (channel.type === 'direct') {
      const user = users.find(u => u.id === channel.id);
      return user?.name || channel.name;
    }
    return channel.name;
  };

  const getChannelStatus = (channel: Channel) => {
    if (channel.type === 'direct') {
      const user = users.find(u => u.id === channel.id);
      return user?.status || 'offline';
    }
    return null;
  };

  const renderChannelItem = (channel: Channel) => (
    <motion.div
      key={channel.id}
      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      className={`px-4 py-2 cursor-pointer flex items-center justify-between ${
        activeChannel === channel.id ? 'bg-brand/10' : ''
      }`}
      onClick={() => setActiveChannel(channel.id)}
    >
      <div className="flex items-center space-x-2 truncate">
        {channel.type === 'direct' ? (
          <div className="relative flex-shrink-0">
            <div className={`w-2 h-2 rounded-full ${
              getChannelStatus(channel) === 'online' ? 'bg-green-500' : 
              getChannelStatus(channel) === 'away' ? 'bg-yellow-500' :
              getChannelStatus(channel) === 'busy' ? 'bg-red-500' : 'bg-gray-500'
            } absolute -left-3 top-1/2 transform -translate-y-1/2`} />
            <span className="text-text_primary truncate">
              {getChannelDisplayName(channel)}
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 truncate">
            {channel.type === 'project' ? (
              <span className="text-text_secondary">#</span>
            ) : (
              <span className="text-text_secondary">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
            )}
            <span className="text-text_primary truncate">
              {getChannelDisplayName(channel)}
            </span>
          </div>
        )}
      </div>
      {channel.unreadCount > 0 && (
        <span className="bg-brand text-white text-xs rounded-full h-5 w-5 flex-shrink-0 flex items-center justify-center">
          {channel.unreadCount}
        </span>
      )}
    </motion.div>
  );

  if (activeTab !== 'Chat') {
    return null;
  }

  return (
    <div className="w-64 border-r border-gray-700 bg-panel flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-text_primary">Channels</h2>
        <button
          onClick={() => setIsCreateGroupModalOpen(true)}
          className="text-text_secondary hover:text-brand transition-colors p-1"
          title="Create new group"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Project Channels */}
      {projectChannels.length > 0 && (
        <div className="mt-2">
          <div className="px-4 py-2 text-xs font-medium text-text_secondary uppercase tracking-wider">
            Projects
          </div>
          <div className="space-y-1">
            {projectChannels.map((channel) => renderChannelItem(channel))}
          </div>
        </div>
      )}

      {/* Group Chats */}
      <div className="mt-2">
        <div className="px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-medium text-text_secondary uppercase tracking-wider">
            Group Chats
          </span>
          <button
            onClick={() => setIsCreateGroupModalOpen(true)}
            className="text-xs text-brand hover:text-brand/80 transition-colors"
          >
            New
          </button>
        </div>
        <div className="space-y-1">
          {groupChannels.map((channel) => renderChannelItem(channel))}
          {groupChannels.length === 0 && (
            <div className="px-4 py-2 text-xs text-text_secondary">
              No group chats yet
            </div>
          )}
        </div>
      </div>

      {/* Direct Messages */}
      <div className="mt-2">
        <div className="px-4 py-2 text-xs font-medium text-text_secondary uppercase tracking-wider">
          Direct Messages
        </div>
        <div className="space-y-1">
          {directMessageChannels.map((channel) => renderChannelItem(channel))}
        </div>
      </div>

      {/* User Status */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full absolute -right-1 -bottom-0.5 border-2 border-panel" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center text-white font-semibold">
              Y
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-text_primary">You</p>
            <p className="text-xs text-text_muted">Online</p>
          </div>
        </div>
      </div>
      {/* Create Group Modal */}
      <AnimatePresence>
        {isCreateGroupModalOpen && (
          <CreateGroupModal 
            isOpen={isCreateGroupModalOpen} 
            onClose={() => setIsCreateGroupModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;

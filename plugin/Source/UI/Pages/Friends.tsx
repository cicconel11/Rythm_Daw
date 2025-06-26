import React, { useState } from 'react';
import useStore from '@/store';
import { User, FriendRequest } from '@/store';

type FriendTab = 'all' | 'online' | 'pending' | 'add';

const Friends: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FriendTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { users, currentUser, sendFriendRequest, acceptFriendRequest, declineFriendRequest } = useStore();

  // Filter out current user and apply search
  const filteredUsers = users.filter((user: User) => 
    user.id !== currentUser?.id &&
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get friends based on status
  const friends = {
    all: currentUser?.friends || [],
    online: (currentUser?.friends || []).filter((id: string) => 
      users.find((u: User) => u.id === id)?.status === 'online'
    ),
    pending: currentUser?.friendRequests?.received || []
  };

  const handleAddFriend = (userId: string) => {
    sendFriendRequest(userId);
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-text_primary mb-4">Friends</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search for friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-input text-text_primary rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
          <svg 
            className="absolute left-3 top-2.5 h-5 w-5 text-text_secondary" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Tabs */}
        <div className="flex mt-4 border-b border-gray-700">
          {(['all', 'online', 'pending', 'add'] as FriendTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? 'text-brand border-b-2 border-brand'
                  : 'text-text_secondary hover:text-text_primary'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'pending' && friends.pending.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {friends.pending.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'add' ? (
          // Add Friends Tab
          <div>
            <h2 className="text-lg font-semibold text-text_primary mb-4">Add Friends</h2>
            {filteredUsers.length > 0 ? (
              <div className="space-y-3">
                {filteredUsers.map((user: User) => (
                  <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-700/30 rounded-lg">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ${
                          user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                        }`}></span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-text_primary">{user.name}</p>
                        <p className="text-xs text-text_secondary">
                          {user.status === 'online' ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddFriend(user.id)}
                      className="px-3 py-1.5 bg-brand text-white text-sm font-medium rounded-md hover:bg-brand/90 transition-colors"
                    >
                      Add Friend
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text_secondary text-center py-8">
                {searchQuery 
                  ? 'No users found. Try a different search.' 
                  : 'Search for users to add as friends.'}
              </p>
            )}
          </div>
        ) : (
          // Friends List Tabs
          <div>
            {activeTab === 'pending' && friends.pending.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-text_secondary mb-2">FRIEND REQUESTS</h3>
                <div className="space-y-2">
                  {friends.pending.map((request: FriendRequest) => {
                    const user = users.find((u: User) => u.id === request.senderId);
                    if (!user) return null;
                    
                    return (
                      <div key={request.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-text_primary">{user.name}</p>
                            <p className="text-xs text-text_secondary">Incoming Friend Request</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => acceptFriendRequest(request.id)}
                            className="px-3 py-1.5 bg-brand text-white text-sm font-medium rounded-md hover:bg-brand/90 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => declineFriendRequest(request.id)}
                            className="px-3 py-1.5 bg-gray-700 text-text_primary text-sm font-medium rounded-md hover:bg-gray-600 transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <h3 className="text-sm font-medium text-text_secondary mb-2">
              {activeTab === 'online' ? 'ONLINE' : 'ALL FRIENDS'} 
              <span className="text-xs text-text_secondary ml-1">
                ({activeTab === 'online' ? friends.online.length : friends.all.length})
              </span>
            </h3>
            
            {friends[activeTab].length > 0 ? (
              <div className="space-y-2">
                {(friends[activeTab] as string[])
                  .map((id: string) => users.find((u: User) => u.id === id))
                  .filter(Boolean)
                  .filter((user: User | undefined): user is User => user !== undefined)
                  .filter((user: User) => activeTab !== 'online' || user.status === 'online')
                  .map((user: User) => (
                    <div key={user!.id} className="flex items-center justify-between p-3 hover:bg-gray-700/30 rounded-lg">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
                            {user!.name.charAt(0).toUpperCase()}
                          </div>
                          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ${
                            user!.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                          }`}></span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-text_primary">{user!.name}</p>
                          <p className="text-xs text-text_secondary">
                            {user!.status === 'online' ? 'Online' : 'Offline'}
                          </p>
                        </div>
                      </div>
                      <button className="text-text_secondary hover:text-text_primary p-1.5 rounded-full hover:bg-gray-700/50 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-text_secondary">
                  {activeTab === 'online'
                    ? 'No friends online right now.'
                    : 'No friends yet. Add some friends to get started!'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;

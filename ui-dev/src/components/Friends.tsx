import { useState } from 'react';
import { Button } from '@/components/ui/button';

// Define user type
type User = {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: string;
  friends?: string[];
  friendRequests?: {
    received: Array<{ id: string; senderId: string }>;
    sent: Array<{ id: string; receiverId: string }>;
  };
};

type FriendTab = 'all' | 'online' | 'pending' | 'add';

type FriendRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
};

// Mock data for now - replace with real store later
const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'John Doe', 
    status: 'online',
    friends: ['current-user'],
    friendRequests: { received: [], sent: [] }
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    status: 'offline',
    friends: ['current-user'],
    friendRequests: { received: [], sent: [] }
  },
  { 
    id: '3', 
    name: 'Mike Johnson', 
    status: 'away',
    friends: [],
    friendRequests: { received: [], sent: [] }
  },
  { 
    id: '4', 
    name: 'Sarah Williams', 
    status: 'busy',
    friends: [],
    friendRequests: { received: [], sent: [] }
  },
];

const mockCurrentUser: User = { 
  id: 'current-user', 
  name: 'Current User',
  status: 'online',
  friends: ['1', '2'], // Friends with John and Jane
  friendRequests: { 
    received: [
      { id: 'req1', senderId: '1' },
      { id: 'req2', senderId: '3' }
    ], 
    sent: [] 
  }
};

// Mock store functions
const mockStore = {
  users: mockUsers,
  currentUser: mockCurrentUser,
  sendFriendRequest: (userId: string) => {
    console.log('Sending friend request to', userId);
    // In a real app, this would update the store/API
  },
  acceptFriendRequest: (requestId: string) => {
    console.log('Accepting request', requestId);
    // In a real app, this would update the store/API
  },
  declineFriendRequest: (requestId: string) => {
    console.log('Declining request', requestId);
    // In a real app, this would update the store/API
  },
};

const Friends = () => {
  const [activeTab, setActiveTab] = useState<FriendTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { users, currentUser, sendFriendRequest, acceptFriendRequest, declineFriendRequest } = mockStore;

  // Filter users based on search query and exclude current user
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    user.id !== currentUser?.id
  );

  // Get friends list
  const friends = filteredUsers.filter(user => 
    currentUser?.friends?.includes(user.id)
  );

  // Get online friends
  const onlineFriends = filteredUsers.filter(
    user => user.status === 'online' && currentUser?.friends?.includes(user.id)
  );

  // Get pending friend requests with sender info
  const pendingRequests = (currentUser?.friendRequests?.received || [])
    .map(request => ({
      ...request,
      sender: users.find(u => u.id === request.senderId)
    }))
    .filter((request): request is { id: string; senderId: string; sender: User } => 
      request.sender !== undefined
    );

  // Get suggested friends (not friends and no pending request)
  const suggestedFriends = filteredUsers.filter(user => 
    !currentUser?.friends?.includes(user.id) &&
    !pendingRequests.some(req => req.senderId === user.id)
  );

  // Handle sending friend request
  const handleSendRequest = (userId: string) => {
    sendFriendRequest(userId);
  };

  // Handle accepting friend request
  const handleAcceptRequest = (requestId: string) => {
    acceptFriendRequest(requestId);
  };

  // Handle declining friend request
  const handleDeclineRequest = (requestId: string) => {
    declineFriendRequest(requestId);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Get content for the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'all':
        return renderFriendsList(friends, 'All Friends');
      case 'online':
        return renderFriendsList(onlineFriends, 'Online Now');
      case 'pending':
        return renderPendingRequests();
      case 'add':
        return renderAddFriends();
      default:
        return null;
    }
  };

  // Render a list of friends
  const renderFriendsList = (friendsList: User[], title: string) => (
    <div>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {friendsList.length === 0 ? (
        <p className="text-gray-500">No friends to display.</p>
      ) : (
        <ul className="space-y-2">
          {friendsList.map(user => (
            <li key={user.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  user.status === 'online' ? 'bg-green-500' :
                  user.status === 'away' ? 'bg-yellow-500' :
                  user.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                }`} />
                <span>{user.name}</span>
              </div>
              <span className="text-sm text-gray-400 capitalize">
                {user.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // Render pending friend requests
  const renderPendingRequests = () => (
    <div>
      <h2 className="text-lg font-semibold mb-4">Friend Requests</h2>
      {pendingRequests.length === 0 ? (
        <p className="text-gray-500">No pending friend requests.</p>
      ) : (
        <ul className="space-y-3">
          {pendingRequests.map(request => (
            <li key={request.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white mr-3">
                  {request.sender.name.charAt(0).toUpperCase()}
                </div>
                <span>{request.sender.name}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAcceptRequest(request.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDeclineRequest(request.id)}
                  className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700"
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // Render add friends section
  const renderAddFriends = () => (
    <div>
      <h2 className="text-lg font-semibold mb-4">Add Friends</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      
      <h3 className="font-medium mb-2">Suggested Friends</h3>
      {suggestedFriends.length === 0 ? (
        <p className="text-gray-500">No suggestions available.</p>
      ) : (
        <ul className="space-y-2">
          {suggestedFriends.map(user => (
            <li key={user.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white mr-3">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name}</span>
              </div>
              <button
                onClick={() => handleSendRequest(user.id)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Add Friend
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Friends</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        <Button
          variant="ghost"
          className={`px-4 py-3 h-auto rounded-none ${
            activeTab === 'all' 
              ? 'text-blue-400 border-b-2 border-blue-500' 
              : 'text-gray-400 hover:text-white hover:bg-transparent'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All Friends
          {friends.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-blue-900/50 text-blue-400 rounded-full text-xs">
              {friends.length}
            </span>
          )}
        </Button>
        
        <Button
          variant="ghost"
          className={`px-4 py-3 h-auto rounded-none ${
            activeTab === 'online' 
              ? 'text-green-400 border-b-2 border-green-500' 
              : 'text-gray-400 hover:text-white hover:bg-transparent'
          }`}
          onClick={() => setActiveTab('online')}
        >
          Online
          {onlineFriends.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-green-900/50 text-green-400 rounded-full text-xs">
              {onlineFriends.length}
            </span>
          )}
        </Button>
        
        <Button
          variant="ghost"
          className={`px-4 py-3 h-auto rounded-none ${
            activeTab === 'pending' 
              ? 'text-yellow-400 border-b-2 border-yellow-500' 
              : 'text-gray-400 hover:text-white hover:bg-transparent'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
          {pendingRequests.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-yellow-900/50 text-yellow-400 rounded-full text-xs">
              {pendingRequests.length}
            </span>
          )}
        </Button>
        
        <Button
          variant="ghost"
          className={`px-4 py-3 h-auto rounded-none ${
            activeTab === 'add' 
              ? 'text-purple-400 border-b-2 border-purple-500' 
              : 'text-gray-400 hover:text-white hover:bg-transparent'
          }`}
          onClick={() => setActiveTab('add')}
        >
          Add Friend
        </Button>
      </div>

      {/* Tab content */}
      <div className="bg-gray-800 rounded-xl p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Friends;

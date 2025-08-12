'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePageMeta } from '@/hooks/usePageMeta';
import { getFriends, addFriend, Friend } from '@/lib/dataClient';
import { Layout } from '@/components/Layout';

export default function FriendsPage() {
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');

  // Use dynamic page meta
  usePageMeta('friends');

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      setIsLoading(true);
      const friendsData = await getFriends();
      setFriends(friendsData);
    } catch (error) {
      console.error('Failed to load friends:', error);
      setError('Failed to load friends');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendEmail.trim()) return;

    try {
      setIsAddingFriend(true);
      const newFriend = await addFriend(newFriendEmail);
      setFriends(prev => [...prev, newFriend]);
      setNewFriendEmail('');
    } catch (error) {
      console.error('Failed to add friend:', error);
      setError('Failed to add friend');
    } finally {
      setIsAddingFriend(false);
    }
  };

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const friendsContent = () => {
    if (isLoading) {
      return (
        <div className="container mx-auto p-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading friends...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="container mx-auto p-4">
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadFriends}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Friends</h1>
          <p className="text-gray-600">Connect with your friends and team</p>
        </div>

        {/* Add Friend Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add Friend</h2>
          <form onSubmit={handleAddFriend} className="flex gap-4">
            <input
              type="email"
              value={newFriendEmail}
              onChange={(e) => setNewFriendEmail(e.target.value)}
              placeholder="Enter friend's email"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isAddingFriend}
            />
            <button
              type="submit"
              disabled={isAddingFriend || !newFriendEmail.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingFriend ? 'Adding...' : 'Add Friend'}
            </button>
          </form>
        </div>

        {/* Friends List */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Friends ({friends.length})
            </h2>
            <p className="text-sm text-gray-500">
              {friends.filter(f => f.status === 'online').length} online
            </p>
          </div>

          {friends.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No friends added yet</p>
              <p className="text-sm text-gray-400 mt-2">Add friends to start collaborating</p>
            </div>
          ) : (
            <div className="space-y-4">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={friend.avatarUrl}
                      alt={friend.name}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{friend.name}</h3>
                    <p className="text-sm text-gray-500">
                      {friend.status === 'online' ? 'Online' : `Last seen ${formatLastSeen(friend.lastSeen)}`} • {friend.mutualFriends} mutual friends
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`h-3 w-3 rounded-full ${
                      friend.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return <Layout>{friendsContent()}</Layout>;
}

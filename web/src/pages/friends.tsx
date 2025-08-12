import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  FriendsPanel, 
  Button, 
  Input, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Badge,
  Skeleton
} from '@/components/ui';
import { Search, UserPlus, MessageSquare, Music, Users } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ROUTES } from '@/lib/routes';
import { useFriends, useFriendRequests, useSendFriendRequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Friends() {
  usePageMeta(ROUTES.friends.name);
  
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendInput, setNewFriendInput] = useState('');

  const { data: friends = [], isLoading: friendsLoading } = useFriends();
  const { data: friendRequests = [], isLoading: requestsLoading } = useFriendRequests();
  const sendFriendRequestMutation = useSendFriendRequest();

  const filteredFriends = friends.filter(friend =>
    friend.user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onlineFriends = filteredFriends.filter(friend => friend.user.status === 'online');
  const offlineFriends = filteredFriends.filter(friend => friend.user.status !== 'online');

  // Transform friends data to match the expected format for FriendsPanel
  const friendsForPanel = filteredFriends.map(friend => ({
    id: friend.id,
    name: friend.user.displayName,
    avatar: friend.user.avatar || friend.user.displayName.substring(0, 2).toUpperCase(),
    status: friend.user.status,
    plugins: friend.sharedPlugins,
    mutualFriends: friend.mutualFriends.length,
    lastSeen: friend.user.lastSeen || 'unknown',
    reason: `${friend.compatibility}% compatibility`
  }));

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleSendFriendRequest = async () => {
    if (!newFriendInput.trim()) return;
    
    try {
      await sendFriendRequestMutation.mutateAsync({ 
        userId: newFriendInput, 
        message: 'Let\'s collaborate!' 
      });
      
      toast({
        title: 'Friend Request Sent',
        description: 'Your friend request has been sent successfully.',
      });
      
      setNewFriendInput('');
      setShowAddFriend(false);
    } catch (error) {
      toast({
        title: 'Request Failed',
        description: 'Failed to send friend request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Friends</h1>
          <p className="text-muted-foreground">Connect with fellow music producers</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => setShowAddFriend(!showAddFriend)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Friend
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="plugin-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Friends</p>
                {friendsLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-primary">{friends.length}</p>
                )}
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="plugin-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Online Now</p>
                {friendsLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-green-500">{onlineFriends.length}</p>
                )}
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="plugin-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offline</p>
                {friendsLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-gray-500">{offlineFriends.length}</p>
                )}
              </div>
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search friends..."
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {showAddFriend && (
        <Card className="plugin-card border-primary/50 mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Input
                placeholder="Enter username or ID..."
                value={newFriendInput}
                onChange={e => setNewFriendInput(e.target.value)}
                className="flex-1"
              />
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={handleSendFriendRequest}
                disabled={sendFriendRequestMutation.isPending}
              >
                {sendFriendRequestMutation.isPending ? 'Sending...' : 'Send Request'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <FriendsPanel 
        friends={friendsForPanel} 
        onNavigate={handleNavigate}
      />
    </div>
  );
}

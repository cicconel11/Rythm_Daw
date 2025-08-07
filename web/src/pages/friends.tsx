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
  Badge 
} from '@rythm/ui-kit';
import { Search, UserPlus, MessageSquare, Music, Users } from 'lucide-react';

interface Friend {
  id: number;
  username: string;
  status: 'online' | 'offline' | 'away';
  avatar: string;
  plugins: string[];
  mutualFriends: number;
  lastSeen: string;
}

const friends: Friend[] = [
  {
    id: 1,
    username: 'BeatMaker99',
    status: 'online',
    avatar: 'BM',
    plugins: ['Serum', 'Pro-Q 3', 'Ozone 10'],
    mutualFriends: 5,
    lastSeen: 'online',
  },
  {
    id: 2,
    username: 'ProducerX',
    status: 'offline',
    avatar: 'PX',
    plugins: ['Massive X', 'Waves SSL', 'Ableton Live'],
    mutualFriends: 3,
    lastSeen: '2h ago',
  },
  {
    id: 3,
    username: 'SynthMaster',
    status: 'away',
    avatar: 'SM',
    plugins: ['Serum', 'Ableton Live', 'ValhallaDSP'],
    mutualFriends: 7,
    lastSeen: '30m ago',
  },
  {
    id: 4,
    username: 'BassHunter',
    status: 'online',
    avatar: 'BH',
    plugins: ['Sylenth1', 'FabFilter', 'iZotope'],
    mutualFriends: 2,
    lastSeen: 'online',
  },
  {
    id: 5,
    username: 'MelodyMaker',
    status: 'offline',
    avatar: 'MM',
    plugins: ['Kontakt', 'Omnisphere', 'Native Instruments'],
    mutualFriends: 4,
    lastSeen: '5h ago',
  },
  {
    id: 6,
    username: 'DrumLord',
    status: 'online',
    avatar: 'DL',
    plugins: ['Superior Drummer', 'EZdrummer', 'Addictive Drums'],
    mutualFriends: 8,
    lastSeen: 'online',
  },
];

export default function Friends() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendInput, setNewFriendInput] = useState('');

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onlineFriends = filteredFriends.filter(friend => friend.status === 'online');
  const offlineFriends = filteredFriends.filter(friend => friend.status === 'offline');
  const awayFriends = filteredFriends.filter(friend => friend.status === 'away');

  // Transform friends data to match the expected format for FriendsPanel
  const friendsForPanel = filteredFriends.map(friend => ({
    id: friend.id,
    name: friend.username,
    avatar: friend.avatar,
    status: friend.status,
    plugins: friend.plugins,
    mutualFriends: friend.mutualFriends,
    lastSeen: friend.lastSeen,
    reason: ''
  }));

  const handleNavigate = (path: string) => {
    router.push(path);
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
                <p className="text-2xl font-bold text-primary">{friends.length}</p>
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
                <p className="text-2xl font-bold text-green-500">{onlineFriends.length}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="plugin-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Away</p>
                <p className="text-2xl font-bold text-yellow-500">{awayFriends.length}</p>
              </div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
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
              <Button className="bg-primary hover:bg-primary/90">Send Request</Button>
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, MessageSquare, Music, Users } from "lucide-react";
import { useState } from "react";

const friends = [
  {
    id: 1,
    username: "BeatMaker99",
    status: "online",
    avatar: "BM",
    plugins: ["Serum", "Pro-Q 3", "Ozone 10"],
    mutualFriends: 5,
    lastSeen: "online",
  },
  {
    id: 2,
    username: "ProducerX",
    status: "offline",
    avatar: "PX",
    plugins: ["Massive X", "Waves SSL", "Ableton Live"],
    mutualFriends: 12,
    lastSeen: "2 hours ago",
  },
  {
    id: 3,
    username: "SynthWave2024",
    status: "online",
    avatar: "SW",
    plugins: ["Sylenth1", "Diva", "FabFilter Pro-L"],
    mutualFriends: 8,
    lastSeen: "online",
  },
  {
    id: 4,
    username: "BasslineQueen",
    status: "offline",
    avatar: "BQ",
    plugins: ["SubBass Doctor", "Pro-Q 3", "Serum"],
    mutualFriends: 3,
    lastSeen: "1 day ago",
  },
  {
    id: 5,
    username: "DrumMachine",
    status: "online",
    avatar: "DM",
    plugins: ["Battery 4", "Superior Drummer", "EZDrummer"],
    mutualFriends: 15,
    lastSeen: "online",
  },
  {
    id: 6,
    username: "MelodyMaster",
    status: "offline",
    avatar: "MM",
    plugins: ["Omnisphere", "Kontakt", "Nexus"],
    mutualFriends: 7,
    lastSeen: "3 hours ago",
  },
];

export default function Friends() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendInput, setNewFriendInput] = useState("");

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const onlineFriends = filteredFriends.filter(
    (friend) => friend.status === "online",
  );
  const offlineFriends = filteredFriends.filter(
    (friend) => friend.status === "offline",
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Friends</h1>
          <p className="text-muted-foreground">
            Connect with fellow music producers
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => setShowAddFriend(!showAddFriend)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Friend
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="plugin-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Friends</p>
                <p className="text-2xl font-bold text-primary">
                  {friends.length}
                </p>
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
                <p className="text-2xl font-bold text-green-500">
                  {onlineFriends.length}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="plugin-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mutual Friends</p>
                <p className="text-2xl font-bold text-accent">
                  {Math.round(
                    friends.reduce(
                      (acc, friend) => acc + friend.mutualFriends,
                      0,
                    ) / friends.length,
                  )}
                </p>
              </div>
              <Music className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search friends..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {showAddFriend && (
        <Card className="plugin-card border-primary/50">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Input
                placeholder="Enter username or ID..."
                value={newFriendInput}
                onChange={(e) => setNewFriendInput(e.target.value)}
                className="flex-1"
              />
              <Button className="bg-primary hover:bg-primary/90">
                Send Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {onlineFriends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              Online - {onlineFriends.length}
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {onlineFriends.map((friend) => (
                <div key={friend.id} className="plugin-card group">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {friend.avatar}
                        </span>
                      </div>
                      <div className="status-online absolute -bottom-1 -right-1"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">
                        {friend.username}
                      </h3>
                      <p className="text-sm text-green-500">Online</p>
                      <p className="text-xs text-muted-foreground">
                        {friend.mutualFriends} mutual friends
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-2">
                      Recent Plugins:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {friend.plugins.slice(0, 2).map((plugin, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {plugin}
                        </Badge>
                      ))}
                      {friend.plugins.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{friend.plugins.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Chat
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Music className="w-3 h-3 mr-1" />
                      Plugins
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {offlineFriends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              Offline - {offlineFriends.length}
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offlineFriends.map((friend) => (
                <div key={friend.id} className="plugin-card group opacity-75">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {friend.avatar}
                        </span>
                      </div>
                      <div className="status-offline absolute -bottom-1 -right-1"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">
                        {friend.username}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {friend.lastSeen}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {friend.mutualFriends} mutual friends
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-2">
                      Recent Plugins:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {friend.plugins.slice(0, 2).map((plugin, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {plugin}
                        </Badge>
                      ))}
                      {friend.plugins.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{friend.plugins.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Music className="w-3 h-3 mr-1" />
                      Plugins
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { useState } from "react";
import {
  Search,
  UserPlus,
  MoreVertical,
  MessageCircle,
  UserX,
  UserCheck,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type FriendStatus = "online" | "offline" | "away" | "dnd" | "streaming";

type Friend = {
  id: string;
  name: string;
  username: string;
  status: FriendStatus;
  avatar?: string;
  lastSeen?: string;
  activity?: {
    type: "playing" | "listening" | "editing";
    name: string;
  };
};

type FriendRequest = {
  id: string;
  from: string;
  username: string;
  avatar?: string;
  mutualFriends: number;
  timestamp: string;
};

const friends: Friend[] = [
  {
    id: "1",
    name: "Alex Johnson",
    username: "alexj",
    status: "online",
    activity: {
      type: "playing",
      name: "Ableton Live",
    },
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "Jordan Smith",
    username: "jordans",
    status: "streaming",
    activity: {
      type: "playing",
      name: "FL Studio",
    },
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "3",
    name: "Taylor Swift",
    username: "taylors",
    status: "away",
    lastSeen: "2h ago",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "4",
    name: "Chris Martin",
    username: "chrism",
    status: "dnd",
    activity: {
      type: "editing",
      name: "New Track 5",
    },
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: "5",
    name: "Billie Eilish",
    username: "billiee",
    status: "offline",
    lastSeen: "1d ago",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
  },
];

const friendRequests: FriendRequest[] = [
  {
    id: "6",
    from: "Adele",
    username: "adelea",
    mutualFriends: 3,
    timestamp: "2h ago",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: "7",
    from: "The Weeknd",
    username: "theweeknd",
    mutualFriends: 2,
    timestamp: "1d ago",
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
  },
];

const suggestedFriends: Omit<Friend, "status">[] = [
  {
    id: "8",
    name: "Dua Lipa",
    username: "dualipa",
    avatar: "https://randomuser.me/api/portraits/women/24.jpg",
  },
  {
    id: "9",
    name: "Post Malone",
    username: "postmalone",
    avatar: "https://randomuser.me/api/portraits/men/36.jpg",
  },
  {
    id: "10",
    name: "Doja Cat",
    username: "dojacat",
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
  },
];

export default function Friends() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showAddFriendDialog, setShowAddFriendDialog] = useState(false);
  const [friendRequestInput, setFriendRequestInput] = useState("");

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusColor = (status: FriendStatus) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-500";
      case "away":
        return "bg-yellow-500";
      case "dnd":
        return "bg-red-500";
      case "streaming":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: FriendStatus) => {
    switch (status) {
      case "online":
        return "Online";
      case "offline":
        return "Offline";
      case "away":
        return "Away";
      case "dnd":
        return "Do Not Disturb";
      case "streaming":
        return "Streaming";
      default:
        return "Offline";
    }
  };

  const handleSendFriendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (friendRequestInput.trim()) {
      console.log("Sending friend request to:", friendRequestInput);
      setFriendRequestInput("");
      setShowAddFriendDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Friends</h1>
          <p className="text-sm text-gray-400">
            Connect and collaborate with other music creators
          </p>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search friends..."
              className="pl-8 bg-gray-800 border-gray-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setShowAddFriendDialog(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Friend
          </Button>
        </div>
      </div>

      {showAddFriendDialog && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Add Friend</CardTitle>
            <p className="text-sm text-gray-400">
              Enter a username or email address
            </p>
          </CardHeader>
          <form onSubmit={handleSendFriendRequest}>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Username#0000"
                  className="bg-gray-800 border-gray-700 text-white"
                  value={friendRequestInput}
                  onChange={(e) => setFriendRequestInput(e.target.value)}
                />
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Send Request
                </Button>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAddFriendDialog(false)}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-gray-700">
            All
          </TabsTrigger>
          <TabsTrigger
            value="online"
            className="data-[state=active]:bg-gray-700"
          >
            Online
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-gray-700"
          >
            Pending
            {friendRequests.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-purple-500 text-xs rounded-full">
                {friendRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="suggested"
            className="data-[state=active]:bg-gray-700"
          >
            Suggested
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFriends.map((friend) => (
              <Card
                key={friend.id}
                className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/30 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={friend.avatar} alt={friend.name} />
                          <AvatarFallback>
                            {friend.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-800 ${getStatusColor(friend.status)}`}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          {friend.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          @{friend.username}
                        </p>
                        <div className="flex items-center mt-1">
                          <div
                            className={`h-2 w-2 rounded-full mr-1.5 ${getStatusColor(friend.status)}`}
                          />
                          <span className="text-xs text-gray-400">
                            {friend.status === "offline" && friend.lastSeen
                              ? `Last seen ${friend.lastSeen}`
                              : getStatusText(friend.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {friend.activity && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-400">
                        {friend.activity.type === "playing" && "Playing"}
                        {friend.activity.type === "listening" && "Listening to"}
                        {friend.activity.type === "editing" && "Editing"}
                      </p>
                      <p className="text-sm text-white">
                        {friend.activity.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="online" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFriends
              .filter((friend) => friend.status !== "offline")
              .map((friend) => (
                <Card
                  key={friend.id}
                  className="bg-gray-800/50 border-gray-700"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={friend.avatar} alt={friend.name} />
                          <AvatarFallback>{friend.name[0]}</AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-gray-800 ${getStatusColor(friend.status)}`}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          {friend.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {friend.activity ? (
                            <span className="flex items-center">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                              {friend.activity.name}
                            </span>
                          ) : (
                            getStatusText(friend.status)
                          )}
                        </p>
                      </div>
                      <div className="ml-auto flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Friend Requests</CardTitle>
              <p className="text-sm text-gray-400">
                {friendRequests.length} pending requests
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {friendRequests.length > 0 ? (
                  friendRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={request.avatar}
                            alt={request.from}
                          />
                          <AvatarFallback>{request.from[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-white">
                            {request.from}
                          </h4>
                          <p className="text-xs text-gray-400">
                            @{request.username} • {request.mutualFriends} mutual
                            friends
                          </p>
                          <p className="text-xs text-gray-400">
                            {request.timestamp}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <UserCheck className="h-4 w-4 mr-1.5" /> Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <UserX className="h-4 w-4 mr-1.5" /> Decline
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                    <p className="text-gray-400">No pending friend requests</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggested" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suggestedFriends.map((friend) => (
              <Card key={friend.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback>{friend.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-white">
                          {friend.name}
                        </h3>
                        <p className="text-xs text-gray-400">
                          @{friend.username}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
                    >
                      <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

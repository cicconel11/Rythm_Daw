import React, { useState } from "react";
import { Card, CardContent } from "./ui/card.js";
import { Button } from "./ui/button.js";
import { Input } from "./ui/input.js";
import { ScrollArea } from "./ui/scroll-area.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog.js";
import { Search, UserPlus, MessageSquare, Users } from "lucide-react";

// Temporary type definitions until we fix the shared imports
interface Friend {
  id: number;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  plugins?: string[];
  mutualFriends: number;
  reason?: string;
}

interface SuggestedFriend {
  id: number;
  name: string;
  avatar: string;
  mutualFriends: number;
  reason: string;
  from?: string;
  status?: "pending" | "accepted" | "rejected";
}

interface FriendRequest {
  id: string;
  from: string;
  status: "pending" | "accepted" | "rejected";
  name: string;
  avatar: string;
  mutualFriends: number;
  reason?: string;
}

// Temporary mock hooks until we fix the shared imports
const useFriendRequests = () => ({
  data: [] as FriendRequest[],
  isLoading: false,
  error: null,
});

const useAcceptRequest = () => ({
  mutate: (requestId: string) => {
    console.log("Accepting request:", requestId);
  },
});

interface FriendsPanelProps {
  friends: Friend[];
  onNavigate?: (path: string) => void;
}

// Mock data for development
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockFriends: Friend[] = [
  {
    id: 1,
    name: "BeatMaker99",
    avatar: "/avatars/1.png",
    status: "online",
    plugins: ["Serum", "Massive"],
    mutualFriends: 12,
  },
  {
    id: 2,
    name: "SynthMaster",
    avatar: "/avatars/2.png",
    status: "offline",
    plugins: ["Serum", "Sylenth1"],
    mutualFriends: 8,
  },
  {
    id: 3,
    name: "DrumLord",
    avatar: "/avatars/3.png",
    status: "away",
    plugins: ["Serum", "Massive"],
    mutualFriends: 5,
  },
  {
    id: 4,
    name: "DrumMachine",
    avatar: "/avatars/4.png",
    status: "online",
    plugins: ["Battery 4", "Superior"],
    mutualFriends: 15,
  },
];

// Mock pending friend requests
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _pendingRequests: FriendRequest[] = [
  {
    id: "1",
    name: "NewProducer",
    avatar: "/avatars/5.png",
    mutualFriends: 2,
    status: "pending",
    from: "NewProducer",
  },
  {
    id: "2",
    name: "VocalMaster",
    avatar: "/avatars/6.png",
    mutualFriends: 1,
    status: "pending",
    from: "VocalMaster",
  },
];

const suggested: SuggestedFriend[] = [
  {
    id: 1,
    name: "ElectroWiz",
    avatar: "/avatars/7.png",
    mutualFriends: 8,
    reason: "Uses similar plugins",
    from: "ElectroWiz",
    status: "pending",
  },
  {
    id: 2,
    name: "BassMaster",
    avatar: "/avatars/8.png",
    mutualFriends: 3,
    reason: "Friend of ProducerX",
    from: "BassMaster",
    status: "pending",
  },
];

// Type guard for FriendRequest
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isFriendRequest(item: any): item is FriendRequest {
  return (
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    Array.isArray(item.plugins)
  );
}

export function FriendsPanel({ friends, onNavigate }: FriendsPanelProps) {
  type TabType = "all" | "online" | "pending" | "suggested";
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [addFriendInput, setAddFriendInput] = useState("");
  const { data: friendRequests } = useFriendRequests();
  const { mutate: acceptRequest } = useAcceptRequest();

  const handleAccept = (requestId: string) => {
    // TODO: Implement accept request
    console.log("Accept request", requestId);
    acceptRequest(requestId);
  };

  const handleReject = (requestId: string) => {
    // TODO: Implement reject request
    console.log("Reject request", requestId);
  };

  const handleAddFriend = (e: React.FormEvent | string) => {
    if (typeof e !== "string") {
      e.preventDefault();
    }
    const friendId = typeof e === "string" ? e : addFriendInput.trim();
    if (!friendId) return;

    // Implementation for adding a friend
    console.log("Adding friend:", addFriendInput);
    if (typeof e !== "string") {
      setAddFriendInput("");
    }
  };

  const handleChat = (friendId: string | number) => {
    // TODO: Implement chat
    console.log("Start chat with", friendId);
    if (onNavigate) {
      onNavigate(`/chat/${friendId}`);
    }
  };

  const filteredFriends = (friends || []).filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (friend.plugins || []).some((plugin) =>
        plugin.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const filteredRequests = (friendRequests || []).filter(
    (request: FriendRequest) =>
      request.status === "pending" &&
      (request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.reason?.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const filteredSuggested = suggested.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.reason?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const _getTabContent = (
    tab: TabType,
  ): Array<Friend | FriendRequest | SuggestedFriend> => {
    switch (tab) {
      case "pending":
        return filteredRequests;
      case "suggested":
        return filteredSuggested;
      case "online":
        return filteredFriends.filter((friend) => friend.status === "online");
      case "all":
      default:
        return [...filteredFriends];
    }
  };

  const tabs = [
    { key: "all" as TabType, label: "All" },
    { key: "online" as TabType, label: "Online" },
    {
      key: "pending" as TabType,
      label: `Pending (${friendRequests?.filter((request) => request.status === "pending").length || 0})`,
    },
    { key: "suggested" as TabType, label: "Suggested" },
  ];

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#0D1126] bg-gradient-to-br from-[#0D1126] via-[#141B33] to-[#0D1126] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white font-['Inter'] mb-2">
              Friends
            </h1>
            <p className="text-gray-400">Connect with fellow music producers</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-[#7E4FFF] to-[#6B3FE6] text-white rounded-md hover:from-[#6B3FE6] hover:to-[#5A34C2] transition-colors"
                onClick={handleAddFriend}
              >
                Add Friend
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#141B33] border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add Friend</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter username or email..."
                  value={addFriendInput}
                  onChange={(e) => setAddFriendInput(e.target.value)}
                  className="bg-[#0D1126] border-gray-600 text-white"
                />
                <Button
                  onClick={handleAddFriend}
                  className="w-full bg-[#7E4FFF] hover:bg-[#6B3FE6]"
                >
                  Send Friend Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Friends</p>
                  <p className="text-2xl font-bold text-[#7E4FFF]">
                    {friends.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-[#7E4FFF]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Online Now</p>
                  <p className="text-2xl font-bold text-green-400">
                    {friends.filter((f) => f.status === "online").length}
                  </p>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {friendRequests?.filter(
                      (request: FriendRequest) => request.status === "pending",
                    )?.length || 0}
                  </p>
                </div>
                <UserPlus className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#141B33] border-gray-600 text-white"
            />
          </div>
        </div>

        <Card className="bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700">
          <CardContent className="p-6">
            <ScrollArea className="h-[500px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {_getTabContent(activeTab).map((item) => {
                  const isFriend =
                    "status" in item &&
                    typeof item.status === "string" &&
                    ["online", "offline", "away"].includes(item.status);

                  const friendItem = isFriend ? (item as Friend) : null;
                  const requestItem = !isFriend
                    ? (item as FriendRequest)
                    : null;

                  const name =
                    friendItem?.name || requestItem?.from || "Unknown";
                  const id =
                    friendItem?.id?.toString() || requestItem?.id || "";
                  const avatar =
                    friendItem?.avatar || requestItem?.avatar || "";
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const mutualFriends =
                    friendItem?.mutualFriends ||
                    requestItem?.mutualFriends ||
                    0;
                  const plugins = friendItem?.plugins || [];

                  return (
                    <div
                      key={id}
                      className="bg-[#0D1126] rounded-lg p-4 border border-gray-700 group hover:border-[#7E4FFF]/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                              {name.charAt(0)}
                            </div>
                          )}
                          {friendItem?.status === "online" && (
                            <div
                              className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"
                              title="Online"
                            />
                          )}
                        </div>
                        <div className="flex-1 overflow-auto">
                          <h3 className="font-semibold text-white">{name}</h3>
                          {friendItem && (
                            <p
                              className={`text-sm ${
                                friendItem.status === "online"
                                  ? "text-green-400"
                                  : friendItem.status === "away"
                                    ? "text-yellow-400"
                                    : "text-gray-400"
                              }`}
                            >
                              {friendItem.status}
                            </p>
                          )}
                          {requestItem?.reason && (
                            <p className="text-xs text-gray-400">
                              {requestItem.reason}
                            </p>
                          )}
                        </div>
                      </div>
                      {plugins
                        .slice(0, 2)
                        .map((plugin: string, idx: number) => (
                          <span key={idx}>{plugin}</span>
                        ))}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {activeTab === "pending" ? (
                          <>
                            <button
                              className="px-2 py-1 text-sm text-green-500 rounded hover:bg-green-500/10 hover:text-green-400"
                              onClick={() => handleAccept(String(item.id))}
                            >
                              Accept
                            </button>
                            <button
                              className="px-2 py-1 text-sm text-red-500 rounded hover:bg-red-500/10 hover:text-red-400"
                              onClick={() => handleReject(String(item.id))}
                            >
                              Reject
                            </button>
                          </>
                        ) : activeTab === "suggested" ? (
                          <button
                            className="px-2 py-1 text-sm text-blue-500 rounded hover:bg-blue-500/10 hover:text-blue-400"
                            onClick={() => handleAddFriend(String(item.id))}
                          >
                            <UserPlus className="w-3 h-3 mr-1" />
                            Add
                          </button>
                        ) : (
                          <button
                            className="px-2 py-1 text-sm text-blue-500 rounded hover:bg-blue-500/10 hover:text-blue-400"
                            onClick={() => handleChat(item.id)}
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Chat
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

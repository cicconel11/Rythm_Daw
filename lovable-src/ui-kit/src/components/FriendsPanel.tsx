import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Search, UserPlus, MessageSquare, Music, Users } from "lucide-react";

interface FriendsPanelProps {
  onNavigate?: (path: string) => void;
}

const friends = [
  {
    id: 1,
    name: "BeatMaker99",
    avatar: "BM",
    status: "online",
    plugins: ["Serum", "Pro-Q 3"],
    mutualFriends: 5,
  },
  {
    id: 2,
    name: "ProducerX",
    avatar: "PX",
    status: "offline",
    plugins: ["Massive X", "Ozone"],
    mutualFriends: 12,
  },
  {
    id: 3,
    name: "SynthWave2024",
    avatar: "SW",
    status: "online",
    plugins: ["Sylenth1", "Diva"],
    mutualFriends: 8,
  },
  {
    id: 4,
    name: "DrumMachine",
    avatar: "DM",
    status: "online",
    plugins: ["Battery 4", "Superior"],
    mutualFriends: 15,
  },
];

const pendingRequests = [
  { id: 1, name: "NewProducer", avatar: "NP", mutualFriends: 2 },
  { id: 2, name: "VocalMaster", avatar: "VM", mutualFriends: 1 },
];

const suggested = [
  {
    id: 1,
    name: "ElectroWiz",
    avatar: "EW",
    mutualFriends: 8,
    reason: "Uses similar plugins",
  },
  {
    id: 2,
    name: "BassMaster",
    avatar: "BM",
    mutualFriends: 3,
    reason: "Friend of ProducerX",
  },
];

export function FriendsPanel({ onNavigate }: FriendsPanelProps) {
  const [activeTab, setActiveTab] = useState<
    "all" | "online" | "pending" | "suggested"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [addFriendInput, setAddFriendInput] = useState("");

  const handleAddFriend = () => {
    if (addFriendInput.trim()) {
      console.log("Adding friend:", addFriendInput);
      setAddFriendInput("");
    }
  };

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeTab === "all" ||
        (activeTab === "online" && friend.status === "online")),
  );

  const getTabContent = () => {
    switch (activeTab) {
      case "pending":
        return pendingRequests;
      case "suggested":
        return suggested;
      default:
        return filteredFriends;
    }
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
              <Button className="bg-[#7E4FFF] hover:bg-[#6B3FE6]">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Friend
              </Button>
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
                    {pendingRequests.length}
                  </p>
                </div>
                <UserPlus className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex space-x-2">
            {[
              { key: "all", label: "All" },
              { key: "online", label: "Online" },
              { key: "pending", label: `Pending (${pendingRequests.length})` },
              { key: "suggested", label: "Suggested" },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.key as any)}
                className={
                  activeTab === tab.key ? "bg-[#7E4FFF] hover:bg-[#6B3FE6]" : ""
                }
              >
                {tab.label}
              </Button>
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
                {getTabContent().map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#0D1126] rounded-lg p-4 border border-gray-700 group hover:border-[#7E4FFF]/50 transition-colors"
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {item.avatar}
                          </span>
                        </div>
                        {"status" in item && (
                          <div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0D1126] ${
                              item.status === "online"
                                ? "bg-green-400"
                                : "bg-gray-500"
                            }`}
                          ></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white">
                          {item.name}
                        </h3>
                        {"status" in item && (
                          <p
                            className={`text-sm ${item.status === "online" ? "text-green-400" : "text-gray-400"}`}
                          >
                            {item.status}
                          </p>
                        )}
                        {"reason" in item && (
                          <p className="text-sm text-gray-400">{item.reason}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {item.mutualFriends} mutual friends
                        </p>
                      </div>
                    </div>

                    {"plugins" in item && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 mb-1">
                          Recent plugins:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {item.plugins.slice(0, 2).map((plugin, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {plugin}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {activeTab === "pending" ? (
                        <>
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            Decline
                          </Button>
                        </>
                      ) : activeTab === "suggested" ? (
                        <Button
                          size="sm"
                          className="flex-1 bg-[#7E4FFF] hover:bg-[#6B3FE6]"
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Chat
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Music className="w-3 h-3 mr-1" />
                            Plugins
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

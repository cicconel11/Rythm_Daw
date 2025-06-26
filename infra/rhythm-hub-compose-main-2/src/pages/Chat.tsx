import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Music, Search, MoreVertical, Check, X } from "lucide-react";
import { useState } from "react";

const chatFriends = [
  { id: 1, username: "BeatMaker99", avatar: "BM", status: "online", lastMessage: "Check out this new beat!", time: "2m", unread: 2 },
  { id: 2, username: "ProducerX", avatar: "PX", status: "offline", lastMessage: "What DAW are you using?", time: "1h", unread: 0 },
  { id: 3, username: "SynthWave2024", avatar: "SW", status: "online", lastMessage: "Thanks for the plugin recommendation!", time: "3h", unread: 1 },
  { id: 4, username: "DrumMachine", avatar: "DM", status: "online", lastMessage: "Wanna collab on a track?", time: "5h", unread: 0 },
];

const chatRequests = [
  { id: 1, username: "NewProducer", avatar: "NP", message: "Hey! Would love to chat about music production", time: "1h" },
  { id: 2, username: "VocalMaster", avatar: "VM", message: "Interested in collaborating on some tracks", time: "3h" },
];

const messages = [
  { id: 1, sender: "BeatMaker99", content: "Hey! Check out this new beat I made", timestamp: "10:30 AM", isOwn: false },
  { id: 2, sender: "You", content: "That sounds amazing! What plugins did you use?", timestamp: "10:32 AM", isOwn: true },
  { id: 3, sender: "BeatMaker99", content: "Mostly Serum for the lead and some FabFilter for EQ", timestamp: "10:33 AM", isOwn: false },
  { id: 4, sender: "You", content: "Nice! I love Serum's wavetables", timestamp: "10:35 AM", isOwn: true },
  { id: 5, sender: "BeatMaker99", content: "Same here! The modulation possibilities are endless", timestamp: "10:36 AM", isOwn: false },
  { id: 6, sender: "BeatMaker99", content: "Want to collab on something?", timestamp: "10:38 AM", isOwn: false },
];

const friendPlugins = [
  { name: "Serum", type: "Synthesizer", version: "1.365" },
  { name: "FabFilter Pro-Q 3", type: "EQ", version: "3.24" },
  { name: "Ozone 10", type: "Mastering", version: "10.0.2" },
  { name: "Massive X", type: "Synthesizer", version: "1.4.1" },
  { name: "Waves SSL G-Master", type: "Compressor", version: "14.0" },
];

const userPlugins = [
  "Serum",
  "FabFilter Pro-Q 3", 
  "Massive X"
];

export default function Chat() {
  const [selectedFriend, setSelectedFriend] = useState(chatFriends[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("conversations");

  const filteredFriends = chatFriends.filter(friend =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendMessage = () => {
    if (messageInput.trim()) {
      // Add message logic here
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  const acceptChatRequest = (requestId: number) => {
    console.log("Accepting chat request:", requestId);
    // Add logic to accept chat request
  };

  const declineChatRequest = (requestId: number) => {
    console.log("Declining chat request:", requestId);
    // Add logic to decline chat request
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Friends List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground mb-3">Messages</h2>
          
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-3">
            <Button
              variant={activeTab === "conversations" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("conversations")}
              className="flex-1"
            >
              Conversations
            </Button>
            <Button
              variant={activeTab === "requests" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("requests")}
              className="flex-1"
            >
              Requests
              {chatRequests.length > 0 && (
                <Badge className="ml-1 bg-primary text-primary-foreground">
                  {chatRequests.length}
                </Badge>
              )}
            </Button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {activeTab === "conversations" && filteredFriends.map((friend) => (
            <div
              key={friend.id}
              onClick={() => setSelectedFriend(friend)}
              className={`p-4 border-b border-border cursor-pointer transition-colors hover:bg-secondary/50 ${
                selectedFriend.id === friend.id ? "bg-secondary" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">{friend.avatar}</span>
                  </div>
                  <div className={friend.status === "online" ? "status-online absolute -bottom-1 -right-1" : "status-offline absolute -bottom-1 -right-1"}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground truncate">{friend.username}</h3>
                    <span className="text-xs text-muted-foreground">{friend.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{friend.lastMessage}</p>
                </div>
                {friend.unread > 0 && (
                  <Badge className="bg-primary text-primary-foreground">{friend.unread}</Badge>
                )}
              </div>
            </div>
          ))}

          {activeTab === "requests" && chatRequests.map((request) => (
            <div key={request.id} className="p-4 border-b border-border">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">{request.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{request.username}</h3>
                    <span className="text-xs text-muted-foreground">{request.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{request.message}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => acceptChatRequest(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => declineChatRequest(request.id)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">{selectedFriend.avatar}</span>
              </div>
              <div className={selectedFriend.status === "online" ? "status-online absolute -bottom-1 -right-1" : "status-offline absolute -bottom-1 -right-1"}></div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{selectedFriend.username}</h3>
              <p className="text-sm text-muted-foreground">{selectedFriend.status}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isOwn
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage} className="bg-primary hover:bg-primary/90">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Friend's Plugins Panel */}
      <div className="w-80 border-l border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Music className="w-5 h-5" />
            {selectedFriend.username}'s Plugins
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {friendPlugins.map((plugin, index) => (
            <div key={index} className="plugin-card">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-foreground">{plugin.name}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    v{plugin.version}
                  </Badge>
                  {userPlugins.includes(plugin.name) && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{plugin.type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

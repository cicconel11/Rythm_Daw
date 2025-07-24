import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import {
  Upload,
  Search,
  FileText,
  Music,
  Download,
  Share,
  X,
  Check,
  Clock,
  AlertCircle,
  ChevronDown,
  Users,
  Send,
  GripVertical,
} from "lucide-react";
import { useFriends } from "@shared/hooks/useFriends";
import { useTransfers } from "@shared/hooks/useTransfers";
import { useFileUpload } from "@shared/hooks/useFileUpload";
import { useFileTransferWS } from "@shared/hooks/useFileTransferWS";
import { FileTransferSchema, FriendSchema } from "@shared/types";
import { z } from "zod";

// Helper functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const getFileIcon = (type: string) => {
  if (type.startsWith("audio/"))
    return <Music className="w-5 h-5 text-primary" />;
  return <FileText className="w-5 h-5 text-muted-foreground" />;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "sent":
    case "received":
      return "bg-green-500/20 text-green-500";
    case "pending":
    case "uploading":
      return "bg-yellow-500/20 text-yellow-500";
    case "failed":
    case "declined":
      return "bg-red-500/20 text-red-500";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "sent":
    case "received":
      return <Check className="w-3 h-3" />;
    case "pending":
    case "uploading":
      return <Clock className="w-3 h-3" />;
    case "failed":
    case "declined":
      return <AlertCircle className="w-3 h-3" />;
    default:
      return null;
  }
};

// Upload Card Component
const UploadCard = () => {
  const { data: friends = [] } = useFriends();
  const uploadMutation = useFileUpload();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [friendsDropdownOpen, setFriendsDropdownOpen] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    },
    [],
  );

  const removeFile = useCallback((fileName: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.name !== fileName));
  }, []);

  const toggleFriend = useCallback((friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId],
    );
  }, []);

  const handleSendFiles = useCallback(() => {
    if (selectedFiles.length === 0 || selectedFriends.length === 0) return;
    selectedFiles.forEach((file) => {
      selectedFriends.forEach((friendId) => {
        uploadMutation.mutate({ file, toUserId: friendId });
      });
    });
    setSelectedFiles([]);
    setSelectedFriends([]);
  }, [selectedFiles, selectedFriends, uploadMutation]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share className="w-5 h-5" />
          Send Files
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drag and Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
            dragOver ? "border-primary bg-primary/5" : "border-border"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Drop files here to upload
          </h3>
          <p className="text-muted-foreground mb-4">
            Or click to browse files from your computer
          </p>
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              Browse Files
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </Button>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">
              Selected Files
            </h4>
            {selectedFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFile(file.name)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Friend Picker */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">Send To</h4>
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setFriendsDropdownOpen(!friendsDropdownOpen)}
              className="w-full justify-between"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {selectedFriends.length === 0
                  ? "Select friends..."
                  : `${selectedFriends.length} friend${selectedFriends.length > 1 ? "s" : ""} selected`}
              </div>
              <ChevronDown className="w-4 h-4" />
            </Button>
            {friendsDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-xl shadow-lg z-10 p-2">
                {friends.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => toggleFriend(friend.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        {friend.avatar && (
                          <img src={friend.avatar} alt={friend.name} />
                        )}
                      </Avatar>
                      {friend.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <span className="font-medium text-sm">{friend.name}</span>
                    {selectedFriends.includes(friend.id) && (
                      <Check className="w-4 h-4 text-primary ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Friends Display */}
        {selectedFriends.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedFriends.map((friendId) => {
              const friend = friends.find((f) => f.id === friendId);
              if (!friend) return null;
              return (
                <Badge key={friend.id} variant="outline" className="gap-2">
                  <Avatar className="w-4 h-4">
                    {friend.avatar && (
                      <img src={friend.avatar} alt={friend.name} />
                    )}
                  </Avatar>
                  {friend.name}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleFriend(friend.id)}
                    className="h-auto p-0 w-4 h-4"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        )}

        {/* Send Button */}
        <Button
          onClick={handleSendFiles}
          disabled={
            selectedFiles.length === 0 ||
            selectedFriends.length === 0 ||
            uploadMutation.isLoading
          }
          className="w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          {uploadMutation.isLoading ? "Sending..." : "Send Files"}
        </Button>
      </CardContent>
    </Card>
  );
};

// Incoming List Component
const IncomingList = () => {
  const { data: transfers = [] } = useTransfers();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");

  // Validate runtime payloads
  const safeTransfers = transfers.filter((t) => {
    try {
      FileTransferSchema.parse(t);
      return true;
    } catch {
      return false;
    }
  });

  const filteredTransfers = safeTransfers
    .filter((transfer) =>
      transfer.file.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((transfer) => {
      if (activeTab === "inbox") return transfer.direction === "received";
      if (activeTab === "sent") return transfer.direction === "sent";
      return true;
    });

  // TODO: Accept/decline/download logic (call backend)
  const handleAccept = useCallback((transferId: string) => {
    // TODO: Implement accept logic with backend
  }, []);
  const handleDecline = useCallback((transferId: string) => {
    // TODO: Implement decline logic with backend
  }, []);
  const handleDownload = useCallback((transferId: string) => {
    // TODO: Implement download logic
  }, []);
  const handleDragStart = useCallback((e: React.DragEvent, transfer: any) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/plain", transfer.file.name);
    e.dataTransfer.setData(
      "DownloadURL",
      `${transfer.file.type}:${transfer.file.name}:#`,
    );
  }, []);

  if (filteredTransfers.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
            <FileText className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No files yet
          </h3>
          <p className="text-muted-foreground">
            Send your first file to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>File History</CardTitle>
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-3">
              {filteredTransfers.map((transfer) => (
                <div
                  key={transfer.id}
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors cursor-move"
                  draggable={
                    transfer.status === "received" || transfer.status === "sent"
                  }
                  onDragStart={(e) => handleDragStart(e, transfer)}
                >
                  <div className="flex items-center gap-4">
                    {(transfer.status === "received" ||
                      transfer.status === "sent") && (
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                    )}
                    {getFileIcon(transfer.file.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {transfer.file.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatFileSize(transfer.file.size)}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {transfer.direction === "received" ? "from" : "to"}
                          <Avatar className="w-4 h-4 mx-1">
                            {transfer.fromUser && transfer.fromUser.avatar && (
                              <img
                                src={transfer.fromUser.avatar}
                                alt={transfer.fromUser.name}
                              />
                            )}
                            {transfer.toUser && transfer.toUser.avatar && (
                              <img
                                src={transfer.toUser.avatar}
                                alt={transfer.toUser.name}
                              />
                            )}
                          </Avatar>
                          {(transfer.fromUser || transfer.toUser)?.name}
                        </div>
                        <span>•</span>
                        <span>{transfer.timestamp.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`text-xs ${getStatusColor(transfer.status)}`}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon(transfer.status)}
                        {transfer.status}
                      </div>
                    </Badge>
                    {transfer.direction === "received" &&
                      transfer.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDecline(transfer.id)}
                          >
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAccept(transfer.id)}
                          >
                            Accept
                          </Button>
                        </div>
                      )}
                    {(transfer.status === "received" ||
                      transfer.status === "sent") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(transfer.id)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Transfer Progress Modal Component (placeholder, can be wired to live progress)
const TransferProgressModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  // TODO: Get active transfers from useTransfers or WS
  const activeTransfers: any[] = [];
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>File Transfers</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {activeTransfers.map((transfer) => (
            <div key={transfer.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium truncate flex-1">
                  {transfer.fileName}
                </span>
                <span className="text-muted-foreground">
                  {transfer.progress}%
                </span>
              </div>
              <Progress value={transfer.progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{transfer.speed}</span>
                <span>{transfer.eta}</span>
              </div>
            </div>
          ))}
          {activeTransfers.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No active transfers
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main FileShare Component
export default function FileShare() {
  useFileTransferWS(); // subscribe to WS events for live cache
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">File Share</h1>
          <p className="text-muted-foreground">
            Send files to friends and manage your transfers
          </p>
        </div>
        <Button variant="outline" onClick={() => setProgressModalOpen(true)}>
          <Clock className="w-4 h-4 mr-2" />
          View Transfers
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UploadCard />
        <div className="lg:col-span-1">
          <IncomingList />
        </div>
      </div>
      <TransferProgressModal
        isOpen={progressModalOpen}
        onClose={() => setProgressModalOpen(false)}
      />
    </div>
  );
}

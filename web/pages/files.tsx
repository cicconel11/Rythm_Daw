'use client';

import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { usePageMeta } from '@/hooks/usePageMeta';
import { getFiles, uploadFile, FileItem } from '@/lib/dataClient';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  FileAudio,
  FileVideo,
  FileImage,
  FileArchive
} from 'lucide-react';

// Types for file sharing
interface FileShareItem {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface FileTransfer {
  id: string;
  file: FileShareItem;
  fromUser?: Friend;
  toUser?: Friend;
  status: 'pending' | 'uploading' | 'sent' | 'received' | 'failed' | 'declined';
  progress: number;
  timestamp: Date;
  direction: 'sent' | 'received';
}

// Mock data - TODO: Replace with real data from backend
const mockFriends: Friend[] = [
  { id: '1', name: 'Alex Producer', avatar: '/api/placeholder/40/40', isOnline: true },
  { id: '2', name: 'Sarah Beats', avatar: '/api/placeholder/40/40', isOnline: false },
  { id: '3', name: 'Mike Mixer', avatar: '/api/placeholder/40/40', isOnline: true },
  { id: '4', name: 'DJ Producer', avatar: '/api/placeholder/40/40', isOnline: true },
  { id: '5', name: 'SoundDesigner', avatar: '/api/placeholder/40/40', isOnline: false },
];

const mockTransfers: FileTransfer[] = [
  {
    id: '1',
    file: { id: '1', name: 'Track_01_Master.wav', size: 45200000, type: 'audio/wav', lastModified: Date.now() - 7200000 },
    fromUser: mockFriends[0],
    status: 'received',
    progress: 100,
    timestamp: new Date(Date.now() - 7200000),
    direction: 'received'
  },
  {
    id: '2', 
    file: { id: '2', name: 'Bass_Line_v2.mid', size: 2100, type: 'audio/midi', lastModified: Date.now() - 18000000 },
    toUser: mockFriends[1],
    status: 'sent',
    progress: 100,
    timestamp: new Date(Date.now() - 18000000),
    direction: 'sent'
  },
  {
    id: '3',
    file: { id: '3', name: 'Drum_Pattern.flp', size: 12800000, type: 'application/octet-stream', lastModified: Date.now() - 86400000 },
    fromUser: mockFriends[2],
    status: 'pending',
    progress: 0,
    timestamp: new Date(Date.now() - 86400000),
    direction: 'received'
  },
  {
    id: '4',
    file: { id: '4', name: 'Mixdown_Final.mp3', size: 32000000, type: 'audio/mp3', lastModified: Date.now() - 3600000 },
    toUser: mockFriends[3],
    status: 'uploading',
    progress: 65,
    timestamp: new Date(Date.now() - 3600000),
    direction: 'sent'
  }
];

// Helper functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileIcon = (type: string) => {
  if (type.startsWith('audio/')) return <Music className="w-5 h-5 text-primary" />;
  if (type.startsWith('video/')) return <FileVideo className="w-5 h-5 text-blue-500" />;
  if (type.startsWith('image/')) return <FileImage className="w-5 h-5 text-green-500" />;
  if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return <FileArchive className="w-5 h-5 text-orange-500" />;
  return <FileText className="w-5 h-5 text-muted-foreground" />;
};

const getStatusColor = (status: FileTransfer['status']) => {
  switch (status) {
    case 'sent':
    case 'received':
      return 'bg-green-500/20 text-green-500';
    case 'pending':
    case 'uploading':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'failed':
    case 'declined':
      return 'bg-red-500/20 text-red-500';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatusIcon = (status: FileTransfer['status']) => {
  switch (status) {
    case 'sent':
    case 'received':
      return <Check className="w-3 h-3" />;
    case 'pending':
    case 'uploading':
      return <Clock className="w-3 h-3" />;
    case 'failed':
    case 'declined':
      return <AlertCircle className="w-3 h-3" />;
    default:
      return null;
  }
};

// Upload Card Component
const UploadCard = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileShareItem[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
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
    
    const files = Array.from(e.dataTransfer.files).map(file => ({
      id: Math.random().toString(36),
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }));
    
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files).map(file => ({
      id: Math.random().toString(36),
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }));
    
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const toggleFriend = useCallback((friend: Friend) => {
    setSelectedFriends(prev => 
      prev.find(f => f.id === friend.id) 
        ? prev.filter(f => f.id !== friend.id)
        : [...prev, friend]
    );
  }, []);

  const handleSendFiles = useCallback(() => {
    if (selectedFiles.length === 0 || selectedFriends.length === 0) return;
    
    // TODO: Implement actual file sending with WebSocket events
    console.log('Sending files:', { files: selectedFiles, friends: selectedFriends });
    setSelectedFiles([]);
    setSelectedFriends([]);
  }, [selectedFiles, selectedFriends]);

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
            dragOver ? 'border-primary bg-primary/5' : 'border-border'
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
            <h4 className="font-medium text-sm text-muted-foreground">Selected Files</h4>
            {selectedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="font-medium text-foreground text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFile(file.id)}
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
                  ? 'Select friends...' 
                  : `${selectedFriends.length} friend${selectedFriends.length > 1 ? 's' : ''} selected`
                }
              </div>
              <ChevronDown className="w-4 h-4" />
            </Button>
            
            {friendsDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-xl shadow-lg z-10 p-2">
                {mockFriends.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => toggleFriend(friend)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {friend.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <span className="font-medium text-sm">{friend.name}</span>
                    {selectedFriends.find(f => f.id === friend.id) && (
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
            {selectedFriends.map((friend) => (
              <Badge key={friend.id} variant="outline" className="gap-2">
                <Avatar className="w-4 h-4">
                  <AvatarImage src={friend.avatar} alt={friend.name} />
                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {friend.name}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleFriend(friend)}
                  className="h-auto p-0 w-4 h-4"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Send Button */}
        <Button
          onClick={handleSendFiles}
          disabled={selectedFiles.length === 0 || selectedFriends.length === 0}
          className="w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          Send Files
        </Button>
      </CardContent>
    </Card>
  );
};

// Incoming List Component
const IncomingList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");

  const filteredTransfers = mockTransfers
    .filter(transfer => transfer.file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(transfer => {
      if (activeTab === "inbox") return transfer.direction === 'received';
      if (activeTab === "sent") return transfer.direction === 'sent';
      return true;
    });

  const handleAccept = useCallback((transferId: string) => {
    // TODO: Implement accept logic with backend
    console.log('Accepting transfer:', transferId);
  }, []);

  const handleDecline = useCallback((transferId: string) => {
    // TODO: Implement decline logic with backend
    console.log('Declining transfer:', transferId);
  }, []);

  const handleDownload = useCallback((transferId: string) => {
    // TODO: Implement download logic
    const transfer = mockTransfers.find(t => t.id === transferId);
    if (transfer) {
      // Create a mock download - in real app, this would download from server
      const link = document.createElement('a');
      link.href = '#'; // TODO: Replace with actual file URL from backend
      link.download = transfer.file.name;
      link.click();
      console.log('Downloading file:', transfer.file.name);
    }
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, transfer: FileTransfer) => {
    // Enable dragging files out of the browser
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', transfer.file.name);
    e.dataTransfer.setData('DownloadURL', `${transfer.file.type}:${transfer.file.name}:#`); // TODO: Replace # with actual file URL
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
                  draggable={transfer.status === 'received' || transfer.status === 'sent'}
                  onDragStart={(e) => handleDragStart(e, transfer)}
                >
                  <div className="flex items-center gap-4">
                    {(transfer.status === 'received' || transfer.status === 'sent') && (
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                    )}
                    {getFileIcon(transfer.file.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{transfer.file.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatFileSize(transfer.file.size)}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {transfer.direction === 'received' ? 'from' : 'to'}
                          <Avatar className="w-4 h-4 mx-1">
                            <AvatarImage 
                              src={(transfer.fromUser || transfer.toUser)?.avatar} 
                              alt={(transfer.fromUser || transfer.toUser)?.name} 
                            />
                            <AvatarFallback>{(transfer.fromUser || transfer.toUser)?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {(transfer.fromUser || transfer.toUser)?.name}
                        </div>
                        <span>•</span>
                        <span>{transfer.timestamp.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={`text-xs ${getStatusColor(transfer.status)}`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(transfer.status)}
                        {transfer.status}
                      </div>
                    </Badge>
                    
                    {transfer.direction === 'received' && transfer.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleDecline(transfer.id)}>
                          Decline
                        </Button>
                        <Button size="sm" onClick={() => handleAccept(transfer.id)}>
                          Accept
                        </Button>
                      </div>
                    )}
                    
                    {(transfer.status === 'received' || transfer.status === 'sent') && (
                      <Button size="sm" variant="outline" onClick={() => handleDownload(transfer.id)}>
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

// Transfer Progress Modal Component
const TransferProgressModal = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
  // TODO: Get active transfers from useTransferProgress hook
  const activeTransfers = [
    {
      id: '1',
      fileName: 'Track_Master_v3.wav',
      progress: 65,
      speed: '2.4 MB/s',
      eta: '12s remaining'
    }
  ];

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
                <span className="font-medium truncate flex-1">{transfer.fileName}</span>
                <span className="text-muted-foreground">{transfer.progress}%</span>
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
export default function FilesPage() {
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const { toast } = useToast();

  // Use dynamic page meta
  usePageMeta('File Share');

  return (
    <Layout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">File Share</h1>
            <p className="text-muted-foreground">Send files to friends and manage your transfers</p>
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
        
        <Toaster />
      </div>
    </Layout>
  );
}

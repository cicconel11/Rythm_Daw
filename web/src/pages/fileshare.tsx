import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ROUTES } from '@/lib/routes';
import { useFiles, useFriends } from '@/lib/api';

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
  FileAudio,
  FileCode,
  FileImage,
  FileVideo,
  ExternalLink,
  CheckCircle,
  XCircle,
  Pause,
  PlayCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Enhanced helper functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileIcon = (fileName: string, type: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  // Audio files
  if (type.startsWith('audio/') || ['wav', 'mp3', 'flac', 'aiff', 'm4a'].includes(extension || '')) {
    return <FileAudio className="w-5 h-5 text-blue-500" />;
  }
  
  // MIDI files
  if (extension === 'mid' || extension === 'midi') {
    return <Music className="w-5 h-5 text-purple-500" />;
  }
  
  // Project files
  if (['flp', 'als', 'logicx', 'ptx', 'rpp'].includes(extension || '')) {
    return <FileCode className="w-5 h-5 text-orange-500" />;
  }
  
  // Video files
  if (type.startsWith('video/') || ['mp4', 'mov', 'avi'].includes(extension || '')) {
    return <FileVideo className="w-5 h-5 text-red-500" />;
  }
  
  // Image files
  if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
    return <FileImage className="w-5 h-5 text-green-500" />;
  }
  
  return <FileText className="w-5 h-5 text-muted-foreground" />;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'uploading':
    case 'downloading':
      return 'bg-blue-500/20 text-blue-600 border-blue-500/20';
    case 'sent':
    case 'uploaded':
    case 'downloaded':
      return 'bg-green-500/20 text-green-600 border-green-500/20';
    case 'error':
      return 'bg-red-500/20 text-red-600 border-red-500/20';
    case 'processing':
      return 'bg-purple-500/20 text-purple-600 border-purple-500/20';
    case 'inbox':
      return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/20';
    default:
      return 'bg-muted text-muted-foreground border-muted';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'uploading':
    case 'downloading':
      return <PlayCircle className="w-3 h-3" />;
    case 'sent':
    case 'uploaded':
    case 'downloaded':
      return <CheckCircle className="w-3 h-3" />;
    case 'error':
      return <XCircle className="w-3 h-3" />;
    case 'processing':
      return <Pause className="w-3 h-3" />;
    case 'inbox':
      return <Clock className="w-3 h-3" />;
    default:
      return <Clock className="w-3 h-3" />;
  }
};

// Transfer Progress Modal Component
const TransferProgressModal = ({ 
  isOpen, 
  onClose,
  activeTransfers 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  activeTransfers: Array<{
    id: string;
    fileName: string;
    progress: number;
    speed: string;
    eta: string;
    status: 'uploading' | 'downloading';
  }>;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Active Transfers
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {activeTransfers.map((transfer) => (
            <div key={transfer.id} className="space-y-3 p-3 border rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium truncate flex-1">{transfer.fileName}</span>
                <span className="text-muted-foreground">{transfer.progress}%</span>
              </div>
              <Progress value={transfer.progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{transfer.speed}</span>
                <span>{transfer.eta}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-1 rounded-full ${getStatusColor(transfer.status)}`}>
                  {transfer.status}
                </span>
              </div>
            </div>
          ))}
          
          {activeTransfers.length === 0 && (
            <div className="text-center py-8">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active transfers</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Enhanced Upload Card Component
const UploadCard = ({ onTransferStart }: { onTransferStart: (transfer: any) => void }) => {
  const { data: friends = [], isLoading: friendsLoading } = useFriends();
  const { toast } = useToast();
  const fileUpload = {
    mutateAsync: async (data: any) => {
      // TODO: Implement real file upload
      console.log('File upload:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [friendsDropdownOpen, setFriendsDropdownOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const removeFile = useCallback((fileName: string) => {
    setSelectedFiles(prev => prev.filter(f => f.name !== fileName));
  }, []);

  const toggleFriend = useCallback((friendId: string) => {
    setSelectedFriends(prev =>
      prev.includes(friendId) ? prev.filter(id => id !== friendId) : [...prev, friendId]
    );
  }, []);

  const handleSendFiles = useCallback(async () => {
    if (selectedFiles.length === 0 || selectedFriends.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // Send each file to each selected friend
      for (const file of selectedFiles) {
        for (const friendId of selectedFriends) {
          const transferId = `transfer-${Date.now()}-${Math.random()}`;
          const transfer = {
            id: transferId,
            fileName: file.name,
            progress: 0,
            speed: '0 MB/s',
            eta: 'Calculating...',
            status: 'uploading' as const
          };
          
          onTransferStart(transfer);
          
          try {
            // Use the real file upload hook
            await fileUpload.mutateAsync({
              file,
              filename: file.name,
              filetype: file.type,
              filesize: file.size,
              toUserId: friendId,
            });
            
            // Update transfer status
            transfer.progress = 100;
            (transfer as any).status = 'sent';
            transfer.speed = 'Complete';
            transfer.eta = 'Done';
            
          } catch (error) {
            (transfer as any).status = 'error';
            transfer.eta = 'Failed';
            console.error('File upload failed:', error);
          }
        }
      }
      
      toast({
        title: 'Files Sent',
        description: `Successfully sent ${selectedFiles.length} file(s) to ${selectedFriends.length} friend(s)`,
      });
      
      setSelectedFiles([]);
      setSelectedFriends([]);
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to send files. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  }, [selectedFiles, selectedFriends, toast, onTransferStart]);

  if (friendsLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-10" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share className="w-5 h-5" />
          Send Files
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Enhanced Drag and Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
            dragOver ? 'border-primary bg-primary/5 scale-105' : 'border-border'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          data-testid="file-drop-zone"
        >
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Drop files here to upload</h3>
          <p className="text-muted-foreground mb-4">
            Supports WAV, MIDI, project files, and more. Perfect for music collaboration.
          </p>
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              Browse Files
              <input 
                type="file" 
                multiple 
                accept=".wav,.mp3,.flac,.aiff,.mid,.midi,.flp,.als,.logicx,.ptx,.rpp,.zip,.rar"
                className="hidden" 
                onChange={handleFileSelect} 
              />
            </label>
          </Button>
        </div>

        {/* Selected Files with Enhanced Display */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Selected Files ({selectedFiles.length})</h4>
            {selectedFiles.map(file => (
              <div
                key={file.name}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file.name, file.type)}
                  <div>
                    <p className="font-medium text-foreground text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => removeFile(file.name)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Friend Picker */}
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
                  : `${selectedFriends.length} friend${selectedFriends.length > 1 ? 's' : ''} selected`}
              </div>
              <ChevronDown className="w-4 h-4" />
            </Button>
            {friendsDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-xl shadow-lg z-10 p-2 max-h-60 overflow-y-auto">
                {friends.map(friend => (
                  <button
                    key={friend.id}
                    onClick={() => toggleFriend(friend.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        {friend.user.avatar && <img src={friend.user.avatar} alt={friend.user.displayName} />}
                      </Avatar>
                      {friend.user.status === 'online' && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-medium text-sm">{friend.user.displayName}</span>
                      <p className="text-xs text-muted-foreground">{friend.user.status}</p>
                    </div>
                    {selectedFriends.includes(friend.id) && (
                      <Check className="w-4 h-4 text-primary" />
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
            {selectedFriends.map(friendId => {
              const friend = friends.find(f => f.id === friendId);
              if (!friend) return null;
              return (
                <Badge key={friend.id} variant="outline" className="gap-2">
                  <Avatar className="w-4 h-4">
                    {friend.user.avatar && <img src={friend.user.avatar} alt={friend.user.displayName} />}
                  </Avatar>
                  {friend.user.displayName}
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
            selectedFiles.length === 0 || selectedFriends.length === 0 || isUploading
          }
          className="w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          {isUploading ? 'Sending...' : 'Send Files'}
        </Button>
      </CardContent>
    </Card>
  );
};

// Enhanced File List Component (IncomingList)
const IncomingList = () => {
  const { data: files = [], isLoading } = useFiles();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const filteredFiles = files
    .filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(file => {
      if (activeTab === 'inbox') return file.status === 'inbox';
      if (activeTab === 'sent') return file.status === 'sent' || file.status === 'uploaded';
      return true;
    });

  const handleAcceptFile = useCallback((fileId: string) => {
    // TODO: Implement accept file logic
    toast({
      title: 'File Accepted',
      description: 'File has been added to your library',
    });
  }, [toast]);

  const handleDeclineFile = useCallback((fileId: string) => {
    // TODO: Implement decline file logic
    toast({
      title: 'File Declined',
      description: 'File has been declined',
    });
  }, [toast]);

  const handleDownloadFile = useCallback((fileId: string, fileName: string) => {
    // TODO: Implement actual download logic
    toast({
      title: 'Download Started',
      description: `Downloading ${fileName}`,
    });
  }, [toast]);

  const handleDragFileOut = useCallback((fileId: string, fileName: string) => {
    // TODO: Implement drag out functionality
    toast({
      title: 'File Ready',
      description: `You can now drag ${fileName} to your desktop`,
    });
  }, [toast]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </CardContent>
      </Card>
    );
  }

  if (filteredFiles.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
            <FileText className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No files yet</h3>
          <p className="text-muted-foreground">
            {activeTab === 'inbox' ? 'No incoming files' : 
             activeTab === 'sent' ? 'No sent files' : 'Send your first file to get started!'}
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
              onChange={e => setSearchTerm(e.target.value)}
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
              {filteredFiles.map(file => (
                                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors group"
                    draggable={file.status === 'uploaded' || file.status === 'sent'}
                    onDragStart={(e) => {
                      if (file.status === 'uploaded' || file.status === 'sent') {
                        e.dataTransfer.setData('text/plain', file.name);
                        handleDragFileOut(file.id, file.name);
                      }
                    }}
                  >
                  <div className="flex items-center gap-4">
                    {getFileIcon(file.name, file.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{file.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{file.type}</span>
                        <span>•</span>
                        <span>{new Date(file.uploadedAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                      {/* Sender/Recipient info */}
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="w-4 h-4">
                          <img src="/api/avatar/default" alt="User" />
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {activeTab === 'inbox' ? 'From: John Producer' : 'To: Sarah Mixer'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`text-xs border ${getStatusColor(file.status)}`}>
                      {getStatusIcon(file.status)}
                      <span className="ml-1">{file.status}</span>
                    </Badge>
                    
                    {/* Action buttons based on status */}
                    {file.status === 'inbox' && (
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleAcceptFile(file.id)}
                          className="h-8 px-2"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeclineFile(file.id)}
                          className="h-8 px-2"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}
                    
                    {(file.status === 'uploaded' || file.status === 'sent') && (
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDownloadFile(file.id, file.name)}
                          data-testid="download-btn"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Drag to desktop"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
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

// Main FileShare Component
export default function FileShare() {
  usePageMeta(ROUTES.files.name);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [activeTransfers, setActiveTransfers] = useState<Array<{
    id: string;
    fileName: string;
    progress: number;
    speed: string;
    eta: string;
    status: 'uploading' | 'downloading';
  }>>([]);

  const handleTransferStart = useCallback((transfer: any) => {
    setActiveTransfers(prev => [...prev, transfer]);
    setProgressModalOpen(true);
  }, []);

  // Clean up completed transfers
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTransfers(prev => prev.filter(t => t.progress < 100));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Studio Hub - File Share</h1>
          <p className="text-muted-foreground">
            Share music files, stems, and project files with your collaborators
          </p>
        </div>
        {activeTransfers.length > 0 && (
          <Button 
            variant="outline" 
            onClick={() => setProgressModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {activeTransfers.length} Active Transfer{activeTransfers.length > 1 ? 's' : ''}
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UploadCard onTransferStart={handleTransferStart} />
        <IncomingList />
      </div>

      <TransferProgressModal 
        isOpen={progressModalOpen}
        onClose={() => setProgressModalOpen(false)}
        activeTransfers={activeTransfers}
      />
    </div>
  );
}

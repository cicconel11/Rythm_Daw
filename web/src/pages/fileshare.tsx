import { useState, useCallback } from 'react';
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
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  return <FileText className="w-5 h-5 text-muted-foreground" />;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'uploaded':
    case 'sent':
      return 'bg-green-500/20 text-green-500';
    case 'uploading':
    case 'processing':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'error':
      return 'bg-red-500/20 text-red-500';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

// Upload Card Component
const UploadCard = () => {
  const { data: friends = [], isLoading: friendsLoading } = useFriends();
  const { toast } = useToast();
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
      // Mock file upload - would integrate with actual upload API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
  }, [selectedFiles, selectedFriends, toast]);

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
        {/* Drag and Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
            dragOver ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          data-testid="file-drop-zone"
        >
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Drop files here to upload</h3>
          <p className="text-muted-foreground mb-4">Or click to browse files from your computer</p>
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              Browse Files
              <input type="file" multiple className="hidden" onChange={handleFileSelect} />
            </label>
          </Button>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Selected Files</h4>
            {selectedFiles.map(file => (
              <div
                key={file.name}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file.type)}
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
                  : `${selectedFriends.length} friend${selectedFriends.length > 1 ? 's' : ''} selected`}
              </div>
              <ChevronDown className="w-4 h-4" />
            </Button>
            {friendsDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-xl shadow-lg z-10 p-2">
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
                    <span className="font-medium text-sm">{friend.user.displayName}</span>
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

// File List Component
const FileList = () => {
  const { data: files = [], isLoading } = useFiles();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredFiles = files
    .filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(file => {
      if (activeTab === 'inbox') return file.status === 'inbox';
      if (activeTab === 'sent') return file.status === 'sent';
      return true;
    });

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
          <p className="text-muted-foreground">Send your first file to get started!</p>
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
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{file.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{file.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`text-xs ${getStatusColor(file.status)}`}>
                      {file.status}
                    </Badge>
                    <Button size="sm" variant="outline" data-testid="download-btn">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
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
  
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">File Share</h1>
          <p className="text-muted-foreground">Send files to friends and manage your transfers</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UploadCard />
        <div className="lg:col-span-1">
          <FileList />
        </div>
      </div>
    </div>
  );
}

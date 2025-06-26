import { useState, useCallback } from 'react';
import { File, Folder, Upload, Search, MoreVertical, Download, Trash2, Share2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type FileItem = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: string;
  modified: string;
  sharedWith: string[];
  icon: React.ReactNode;
};

const files: FileItem[] = [
  {
    id: '1',
    name: 'Project_Alpha',
    type: 'folder',
    size: '--',
    modified: '2 hours ago',
    sharedWith: ['Alex', 'Jordan'],
    icon: <Folder className="h-5 w-5 text-yellow-400" />,
  },
  {
    id: '2',
    name: 'Drum_Loop_1.wav',
    type: 'file',
    size: '4.2 MB',
    modified: '5 hours ago',
    sharedWith: ['Alex'],
    icon: <File className="h-5 w-5 text-blue-400" />,
  },
  {
    id: '3',
    name: 'Bassline_Project',
    type: 'folder',
    size: '--',
    modified: '1 day ago',
    sharedWith: [],
    icon: <Folder className="h-5 w-5 text-yellow-400" />,
  },
  {
    id: '4',
    name: 'Vocal_Take_3.mp3',
    type: 'file',
    size: '12.8 MB',
    modified: '2 days ago',
    sharedWith: ['Jordan', 'Taylor'],
    icon: <File className="h-5 w-5 text-blue-400" />,
  },
  {
    id: '5',
    name: 'Mixing_Preset_1',
    type: 'file',
    size: '0.5 MB',
    modified: '3 days ago',
    sharedWith: [],
    icon: <File className="h-5 w-5 text-purple-400" />,
  },
];

export default function FileShare() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Handle file upload
      const files = Array.from(e.dataTransfer.files);
      console.log('Files to upload:', files);
      // Here you would typically upload the files to your server
    }
  }, []);

  const handleFileSelect = (id: string, ctrlKey: boolean) => {
    if (ctrlKey) {
      setSelectedFiles(prev => 
        prev.includes(id) 
          ? prev.filter(fileId => fileId !== id)
          : [...prev, id]
      );
    } else {
      setSelectedFiles([id]);
    }
  };

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const files = Array.from(target.files);
        console.log('Files to upload:', files);
        // Handle file upload
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">File Share</h1>
          <p className="text-sm text-gray-400">Share and collaborate on your music projects</p>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search files..."
              className="pl-8 bg-gray-800 border-gray-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleUploadClick} className="bg-purple-600 hover:bg-purple-700">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <div
        className={`rounded-lg border-2 border-dashed ${
          isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 bg-gray-800/50'
        } p-8 text-center transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="rounded-full bg-purple-500/10 p-3">
            <Upload className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-medium text-white">
            {isDragging ? 'Drop files here' : 'Drag and drop files here'}
          </h3>
          <p className="text-sm text-gray-400">
            {isDragging ? 'Release to upload' : 'or click to browse files'}
          </p>
        </div>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white">My Files</CardTitle>
            {selectedFiles.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gray-700 hover:text-white">
                  <Download className="h-4 w-4 mr-1.5" />
                  Download
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gray-700 hover:text-white">
                  <Share2 className="h-4 w-4 mr-1.5" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="text-red-400 hover:bg-gray-700 hover:text-red-300">
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Modified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Shared with
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredFiles.map((file) => (
                  <tr 
                    key={file.id}
                    className={`${
                      selectedFiles.includes(file.id) ? 'bg-purple-500/10' : 'hover:bg-gray-700/30'
                    } transition-colors cursor-pointer`}
                    onClick={(e) => handleFileSelect(file.id, e.ctrlKey || e.metaKey)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {file.icon}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{file.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{file.size}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{file.modified}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex -space-x-2">
                        {file.sharedWith.map((person, idx) => (
                          <div
                            key={idx}
                            className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-medium text-white border-2 border-gray-800"
                            title={person}
                          >
                            {person.charAt(0)}
                          </div>
                        ))}
                        {file.sharedWith.length === 0 && (
                          <span className="text-xs text-gray-400">Only you</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-white">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

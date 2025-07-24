import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, Search, FileText, Music, Download, Share } from "lucide-react";
import { useState } from "react";

const files = [
  {
    id: 1,
    name: "Track_01_Master.wav",
    type: "audio",
    size: "45.2 MB",
    modified: "2 hours ago",
    shared: true,
  },
  {
    id: 2,
    name: "Bass_Line_v2.mid",
    type: "midi",
    size: "2.1 KB",
    modified: "5 hours ago",
    shared: false,
  },
  {
    id: 3,
    name: "Drum_Pattern.flp",
    type: "project",
    size: "12.8 MB",
    modified: "1 day ago",
    shared: true,
  },
  {
    id: 4,
    name: "Vocal_Sample.wav",
    type: "audio",
    size: "28.7 MB",
    modified: "2 days ago",
    shared: false,
  },
  {
    id: 5,
    name: "Synth_Preset.fxp",
    type: "preset",
    size: "1.4 KB",
    modified: "3 days ago",
    shared: true,
  },
  {
    id: 6,
    name: "Mix_Reference.mp3",
    type: "audio",
    size: "8.9 MB",
    modified: "1 week ago",
    shared: false,
  },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case "audio":
      return <Music className="w-5 h-5 text-accent" />;
    case "midi":
    case "project":
    case "preset":
      return <FileText className="w-5 h-5 text-primary" />;
    default:
      return <FileText className="w-5 h-5 text-muted-foreground" />;
  }
};

const getFileTypeColor = (type: string) => {
  switch (type) {
    case "audio":
      return "bg-accent/20 text-accent";
    case "midi":
      return "bg-green-500/20 text-green-500";
    case "project":
      return "bg-primary/20 text-primary";
    case "preset":
      return "bg-orange-500/20 text-orange-500";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function FileShare() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Handle file upload logic here
    console.log("Files dropped:", e.dataTransfer.files);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">File Share</h1>
          <p className="text-muted-foreground">
            Upload, organize, and share your music files
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card
        className={`border-2 border-dashed transition-all duration-200 ${
          dragOver ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Drop files here to upload
          </h3>
          <p className="text-muted-foreground mb-4">
            Or click to browse files from your computer
          </p>
          <Button variant="outline">Browse Files</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Your Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => (
              <div key={file.id} className="plugin-card group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">
                        {file.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {file.size}
                      </p>
                    </div>
                  </div>
                  {file.shared && (
                    <Badge variant="outline" className="text-xs">
                      Shared
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={`text-xs ${getFileTypeColor(file.type)}`}>
                    {file.type.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {file.modified}
                  </span>
                </div>

                <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Share className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

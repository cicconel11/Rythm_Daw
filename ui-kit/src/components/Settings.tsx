
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Settings, RefreshCw, User, Download } from 'lucide-react';

interface SettingsProps {
  onUpdateAccount: (data: { displayName: string; email: string; bio: string }) => void;
  onRescanPlugins: () => void;
  onDownloadPlugin: () => void;
}

export function Settings({ onUpdateAccount, onRescanPlugins, onDownloadPlugin }: SettingsProps) {
  const [displayName, setDisplayName] = useState('DJ Producer');
  const [email, setEmail] = useState('dj@producer.com');
  const [bio, setBio] = useState('Making beats and collaborating with artists worldwide.');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAccount({ displayName, email, bio });
  };

  const handleRescan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          onRescanPlugins();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const detectOS = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Windows')) return 'Windows';
    return 'your OS';
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and plugin library</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateAccount} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-muted-foreground">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-background border-border text-foreground placeholder-muted-foreground"
                    placeholder="Enter your display name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-muted-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-border text-foreground placeholder-muted-foreground"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-muted-foreground">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-background border-border text-foreground placeholder-muted-foreground min-h-[100px]"
                    placeholder="Tell us about yourself..."
                    maxLength={140}
                  />
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">{bio.length}/140</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                >
                  Update Account
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Plugin Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Plugin Library
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Download Plugin */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">RHYTHM Plugin</h3>
                <p className="text-muted-foreground text-sm">
                  Download the latest version of the RHYTHM plugin for your DAW
                </p>
                <Button
                  onClick={onDownloadPlugin}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download for {detectOS()}
                </Button>
              </div>

              {/* Rescan Plugins */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground">Rescan Library</h3>
                <p className="text-muted-foreground text-sm">
                  Refresh your plugin library to detect new installations
                </p>
                
                {isScanning ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Scanning plugins...</span>
                      <span className="text-primary">{scanProgress}%</span>
                    </div>
                    <Progress value={scanProgress} className="h-2" />
                  </div>
                ) : (
                  <Button
                    onClick={handleRescan}
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-primary/10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Rescan Plugin Library
                  </Button>
                )}
              </div>

              {/* Current Stats */}
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Plugins:</span>
                  <span className="text-foreground">6</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active:</span>
                  <span className="text-green-400">4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Scan:</span>
                  <span className="text-foreground">2 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

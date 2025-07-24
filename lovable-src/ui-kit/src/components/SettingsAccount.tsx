import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  User,
  Upload,
  RefreshCw,
  Settings as SettingsIcon,
} from "lucide-react";
import { PluginList } from "./PluginList";

interface SettingsAccountProps {
  onUpdateAccount: (data: {
    displayName: string;
    email: string;
    bio: string;
  }) => void;
  onAvatarChange: (file: File) => void;
  onRescanPlugins: () => void;
}

export function SettingsAccount({
  onUpdateAccount,
  onAvatarChange,
  onRescanPlugins,
}: SettingsAccountProps) {
  const [displayName, setDisplayName] = useState("DJ Producer");
  const [email] = useState("dj@producer.com");
  const [bio, setBio] = useState(
    "Making beats and collaborating with artists worldwide.",
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showInactive, setShowInactive] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setIsDirty(true);
    if (field === "displayName") setDisplayName(value);
    if (field === "bio") setBio(value);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAccount({ displayName, email, bio });
    setIsDirty(false);
  };

  const handleRescan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
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

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarChange(file);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and plugin library
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      DJ
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label
                      htmlFor="avatar"
                      className="text-muted-foreground cursor-pointer"
                    >
                      <div className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-secondary transition-colors">
                        <Upload className="w-4 h-4" />
                        Upload Avatar
                      </div>
                    </Label>
                    <input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Max 2MB, JPG or PNG
                    </p>
                  </div>
                </div>

                {/* Display Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="displayName"
                    className="text-muted-foreground"
                  >
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) =>
                      handleInputChange("displayName", e.target.value)
                    }
                    className="bg-background border-border text-foreground placeholder-muted-foreground"
                    placeholder="Enter your display name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-muted-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-muted border-border text-muted-foreground cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground/70">
                    Email cannot be changed
                  </p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-muted-foreground">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="bg-background border-border text-foreground placeholder-muted-foreground min-h-[100px]"
                    placeholder="Tell us about yourself..."
                    maxLength={140}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground/70">
                      {bio.length}/140 characters
                    </span>
                    {bio.length > 120 && (
                      <span className="text-xs text-orange-400">
                        Approaching limit
                      </span>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <Button
                  type="submit"
                  disabled={!isDirty}
                  className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Plugin Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Plugin Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rescan Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Plugin Library
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Scan for new and updated plugins
                    </p>
                  </div>
                  <Button
                    onClick={handleRescan}
                    disabled={isScanning}
                    variant="outline"
                    className="border-border text-foreground hover:bg-primary/10"
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${isScanning ? "animate-spin" : ""}`}
                    />
                    {isScanning ? "Scanning..." : "Re-scan"}
                  </Button>
                </div>

                {/* Progress Bar */}
                {isScanning && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Scanning plugins...
                      </span>
                      <span className="text-primary">{scanProgress}%</span>
                    </div>
                    <Progress value={scanProgress} className="h-2" />
                  </div>
                )}
              </div>

              {/* Show Inactive Toggle */}
              <div className="flex items-center justify-between py-3 border-t border-border">
                <div>
                  <Label
                    htmlFor="show-inactive"
                    className="text-muted-foreground font-medium"
                  >
                    Show inactive plugins
                  </Label>
                  <p className="text-xs text-muted-foreground/70">
                    Display plugins that are not currently loaded
                  </p>
                </div>
                <Switch
                  id="show-inactive"
                  checked={showInactive}
                  onCheckedChange={setShowInactive}
                />
              </div>

              {/* Plugin List */}
              <PluginList showInactive={showInactive} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

interface SettingsAccountProps {
  className?: string;
  initialData: {
    displayName: string;
    email: string;
    bio: string;
    avatar?: string;
  };
  onUpdateAccount: (data: {
    displayName: string;
    email: string;
    bio: string;
  }) => void;
  onRescanPlugins: () => void;
  onAvatarChange: (file: File) => void;
}

export const SettingsAccount = ({
  className,
  initialData,
  onUpdateAccount,
  onRescanPlugins,
  onAvatarChange,
}: SettingsAccountProps) => {
  const [formData, setFormData] = React.useState(initialData);
  const [isLoading, _setIsLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAccount(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarChange(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-lg font-medium">Profile</h2>
        <p className="text-sm text-gray-400">
          Update your account information and settings.
        </p>
      </div>

      <div className="flex items-center space-x-6">
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Avatar
            className="h-20 w-20 cursor-pointer"
            onClick={handleAvatarClick}
          >
            <AvatarImage src={formData.avatar} />
            <AvatarFallback>
              {formData.displayName?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <Button variant="outline" type="button" onClick={handleAvatarClick}>
            Change Avatar
          </Button>
          <p className="mt-2 text-xs text-gray-400">
            JPG, GIF or PNG. Max size of 2MB
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="mt-1"
              placeholder="Tell us a little bit about yourself"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      <div className="pt-8 border-t border-gray-800">
        <h3 className="text-lg font-medium">Plugins</h3>
        <p className="text-sm text-gray-400 mt-1 mb-4">
          Rescan your plugin directory to detect new plugins.
        </p>
        <Button
          variant="outline"
          onClick={onRescanPlugins}
          disabled={isLoading}
        >
          Rescan Plugins
        </Button>
      </div>
    </div>
  );
};

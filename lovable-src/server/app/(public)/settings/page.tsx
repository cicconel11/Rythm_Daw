"use client";

import { useState } from "react";
import { SettingsAccount } from "@rythm/ui-kit";

export default function SettingsPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateAccount = (data: {
    displayName: string;
    email: string;
    bio: string;
  }) => {
    console.log("Update account:", data);
    showToast("Account updated successfully");
  };

  const handleAvatarChange = (file: File) => {
    console.log("Avatar changed:", file.name);
    showToast("Avatar updated successfully");
  };

  const handleRescanPlugins = () => {
    console.log("Rescan plugins completed");
    showToast("Re-scan started");
    setTimeout(() => {
      showToast("Plugin scan completed successfully");
    }, 3000);
  };

  return (
    <>
      <SettingsAccount
        onUpdateAccount={handleUpdateAccount}
        onAvatarChange={handleAvatarChange}
        onRescanPlugins={handleRescanPlugins}
      />
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </>
  );
}

import React, { ReactNode } from "react";

interface SettingsLayoutProps {
  children: ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="settings-layout">
      <div className="settings-sidebar">{/* Add navigation items here */}</div>
      <div className="settings-content">{children}</div>
    </div>
  );
}

export default SettingsLayout;

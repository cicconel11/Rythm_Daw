"use client";

import { Dashboard } from "@rythm/ui-kit";

export default function DashboardPage() {
  const handleNavigate = (path: string) => {
    console.log("Navigate to:", path);
  };

  return <Dashboard onNavigate={handleNavigate} />;
}

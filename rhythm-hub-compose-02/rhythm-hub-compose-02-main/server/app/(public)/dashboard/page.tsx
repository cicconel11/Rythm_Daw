
'use client';

import { Dashboard } from 'ui-kit';

export default function DashboardPage() {
  const handleNavigate = (path: string) => {
    console.log('Navigate to:', path);
  };

  return <Dashboard onNavigate={handleNavigate} />;
}

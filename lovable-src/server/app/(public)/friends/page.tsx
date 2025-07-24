
'use client';

import { FriendsPanel } from '@rythm/ui-kit';

export default function FriendsPage() {
  const handleNavigate = (path: string) => {
    console.log('Navigate to:', path);
  };

  return <FriendsPanel onNavigate={handleNavigate} />;
}

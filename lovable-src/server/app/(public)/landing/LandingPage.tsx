
'use client';

import { LandingPage } from '@rythm/ui-kit';

export default function LandingPageWrapper() {
  const handleCreateAccount = () => {
    console.log('Navigate to /register/credentials');
  };

  const handleLogin = () => {
    console.log('Navigate to /login');
  };

  return (
    <LandingPage 
      onCreateAccount={handleCreateAccount}
      onLogin={handleLogin}
    />
  );
}


'use client';

import { LandingPage } from 'ui-kit';

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

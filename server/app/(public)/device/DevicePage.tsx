
'use client';

import { DeviceConnect } from 'ui-kit';

export default function DevicePageWrapper() {
  const handleConnected = () => {
    console.log('Device connected, navigate to dashboard');
  };

  return <DeviceConnect onConnected={handleConnected} />;
}

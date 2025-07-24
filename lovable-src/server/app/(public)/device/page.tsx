
'use client';

import { useRouter } from 'next/navigation';
import { DeviceConnect } from '@rythm/ui-kit';

export default function DevicePage() {
  const router = useRouter();

  const handleConnected = () => {
    console.log('Device connected, navigate to /dashboard');
    router.push('/dashboard');
  };

  return <DeviceConnect onConnected={handleConnected} />;
}

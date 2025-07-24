
'use client';

import { useRouter } from 'next/navigation';
import { OnboardScan } from '@rythm/ui-kit';

export default function ScanPage() {
  const router = useRouter();

  const handleDownload = () => {
    console.log('Download plugin for current OS');
    // In a real app, this would trigger the download
  };

  const handleSkip = () => {
    console.log('Navigate to /dashboard');
    router.push('/dashboard');
  };

  return <OnboardScan onDownload={handleDownload} onSkip={handleSkip} />;
}

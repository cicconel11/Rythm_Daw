
'use client';

import { OnboardScan } from 'ui-kit';

export default function ScanPageWrapper() {
  const handleDownload = () => {
    console.log('Download plugin for current OS');
  };

  const handleSkip = () => {
    console.log('Navigate to dashboard');
  };

  return <OnboardScan onDownload={handleDownload} onSkip={handleSkip} />;
}

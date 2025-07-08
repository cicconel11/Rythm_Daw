
'use client';

import { RegisterCredentials } from 'ui-kit';

export default function StepOneWrapper() {
  const handleContinue = (data: { email: string; password: string; displayName: string }) => {
    console.log('Continue to step 2:', data);
  };

  return <RegisterCredentials onContinue={handleContinue} />;
}

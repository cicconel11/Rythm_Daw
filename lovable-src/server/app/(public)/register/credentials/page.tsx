
'use client';

import { useRouter } from 'next/navigation';
import { RegisterCredentials } from '@rythm/ui-kit';

export default function RegisterCredentialsPage() {
  const router = useRouter();

  const handleContinue = (data: { email: string; password: string; displayName: string }) => {
    console.log('Continue to /register/bio:', data);
    router.push('/register/bio');
  };

  return <RegisterCredentials onContinue={handleContinue} />;
}

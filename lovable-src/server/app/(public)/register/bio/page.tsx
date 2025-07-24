
'use client';

import { useRouter } from 'next/navigation';
import { RegisterBio } from '@rythm/ui-kit';

export default function RegisterBioPage() {
  const router = useRouter();

  const handleCreateAccount = (bio: string) => {
    console.log('Create account with bio:', bio);
    router.push('/scan');
  };

  return <RegisterBio onCreateAccount={handleCreateAccount} />;
}

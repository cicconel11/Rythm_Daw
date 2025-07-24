
'use client';

import { RegisterBio } from '@rythm/ui-kit';

export default function StepTwoWrapper() {
  const handleCreateAccount = (bio: string) => {
    console.log('Create account with bio:', bio);
  };

  return <RegisterBio onCreateAccount={handleCreateAccount} />;
}

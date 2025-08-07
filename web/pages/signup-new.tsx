"use client";

import { useMachine } from '@xstate/react';
import { registrationMachine } from '../src/machines/registrationMachine';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';

// Types
type RegistrationEvent = 
  | { type: 'SUBMIT_CREDENTIALS' }
  | { type: 'SUBMIT_PROFILE'; displayName: string; avatar?: string };

type RegistrationContext = {
  email: string;
  password: string;
  displayName: string;
  avatar?: string;
  recaptchaToken?: string;
};

// Dynamically import ReCAPTCHA with no SSR
const ReCAPTCHA = dynamic(
  () => import('react-google-recaptcha').then(mod => mod.default),
  { ssr: false }
);

export default function SignupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const recaptchaRef = useRef<{ executeAsync: () => Promise<string> } | null>(null);
  
  const [state, send] = useMachine(registrationMachine, {
    actions: {
      onCredentialsValid: () => {
        // No-op - handled by UI kit component
      },
      onRegistrationComplete: () => {
        // No-op - handled by UI kit component
      },
      onError: (_, event: any) => {
        console.error('Registration error:', event.error);
      },
    },
    services: {
      validateCredentials: async () => {
        if (!recaptchaRef.current) {
          throw new Error('reCAPTCHA not loaded');
        }
        
        const token = await recaptchaRef.current.executeAsync();
        if (!token) {
          throw new Error('reCAPTCHA verification failed');
        }
        
        return { recaptchaToken: token };
      },
      submitProfile: async () => {
        // No-op - handled by UI kit component
        return Promise.resolve();
      },
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleCredentialsSubmit = () => {
    send({ type: 'SUBMIT_CREDENTIALS' } as const);
  };

  const handleProfileComplete = () => {
    // Get the form data from session storage
    const formData = JSON.parse(sessionStorage.getItem('rtm_reg_creds') || '{}');
    send({
      type: 'SUBMIT_PROFILE',
      displayName: formData.displayName || '',
      avatar: formData.avatar
    } as const);
  };

  if (status === 'loading' || status === 'authenticated') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Dynamically import UI kit components with SSR disabled
  const DynamicRegisterCredentials = dynamic(
    () => import('@rythm/ui-kit').then(mod => mod.RegisterCredentials),
    { ssr: false }
  );

  const DynamicRegisterBio = dynamic(
    () => import('@rythm/ui-kit').then(mod => mod.RegisterBio),
    { ssr: false }
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D1126] to-[#1A1F3D] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {typeof window !== 'undefined' && (
          <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
          />
        )}
        
        {state.matches('credentials') && (
          <DynamicRegisterCredentials onContinue={handleCredentialsSubmit} />
        )}
        
        {state.matches('profile') && (
          <DynamicRegisterBio 
            onSuccess={handleProfileComplete}
            onNavigate={(path: string) => router.push(path)}
          />
        )}
      </div>
    </div>
  );
}

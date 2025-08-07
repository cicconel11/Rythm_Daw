"use client";

import { useMachine } from '@xstate/react';
import { registrationMachine } from '../src/machines/registrationMachine';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';

// ReCAPTCHA component with proper typing
const ReCAPTCHA = dynamic(
  () => import('react-google-recaptcha').then((mod) => mod.default),
  { ssr: false }
);

interface RegisterCredentialsProps {
  onContinue: () => void;
  error?: string;
}

interface RegisterBioProps {
  onSuccess: () => void;
  onNavigate: (path: string) => void;
  error?: string;
}

// Create a custom hook to handle the registration machine
function useRegistrationMachine() {
  const router = useRouter();
  const recaptchaRef = useRef<any>(null);
  
  const [state, send] = useMachine(registrationMachine.provide({
    actions: {
      onRegistrationComplete: () => {
        // Clear any stored credentials on successful registration
        sessionStorage.removeItem('rtm_reg_creds');
        sessionStorage.removeItem('rtm_reg_profile');
        router.push('/dashboard');
      },
    },
  }));

  // Wrap the send function to handle reCAPTCHA before submitting credentials
  const sendWithRecaptcha = async (event: Parameters<typeof send>[0]) => {
    if (event.type === 'SUBMIT_CREDENTIALS' && recaptchaRef.current) {
      try {
        const token = await recaptchaRef.current.executeAsync();
        if (!token) {
          throw new Error('reCAPTCHA verification failed');
        }
        
        // Get form data from session storage
        const formData = JSON.parse(sessionStorage.getItem('rtm_reg_creds') || '{}');
        
        // Send the complete credentials with reCAPTCHA token
        send({ 
          type: 'SUBMIT_CREDENTIALS',
          email: formData.email || '',
          password: formData.password || '',
          recaptchaToken: token 
        });
      } catch (error) {
        console.error('reCAPTCHA error:', error);
        send({ 
          type: 'error.platform', 
          error: { message: 'Failed to verify reCAPTCHA. Please try again.' } 
        });
      }
    } else if (event.type === 'SUBMIT_PROFILE') {
      // Get profile data from session storage
      const formData = JSON.parse(sessionStorage.getItem('rtm_reg_profile') || '{}');
      send({
        type: 'SUBMIT_PROFILE',
        displayName: formData.displayName || '',
        avatar: formData.avatar
      });
    } else {
      send(event);
    }
  };

  return { state, send: sendWithRecaptcha, recaptchaRef };
}

export default function SignupPage() {
  const { data: session, status } = useSession();
  const { state, send, recaptchaRef } = useRegistrationMachine();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  // Handle form submission from RegisterCredentials
  const handleCredentialsSubmit = (email: string, password: string) => {
    // Store credentials in session storage
    sessionStorage.setItem('rtm_reg_creds', JSON.stringify({ email, password }));
    // Trigger reCAPTCHA verification which will then submit the form
    send({ type: 'SUBMIT_CREDENTIALS', email, password, recaptchaToken: '' });
  };

  // Handle profile submission from RegisterBio
  const handleProfileSubmit = (displayName: string, avatar?: string) => {
    // Store profile data in session storage
    sessionStorage.setItem('rtm_reg_profile', JSON.stringify({ displayName, avatar }));
    // Submit the profile
    send({ type: 'SUBMIT_PROFILE', displayName, avatar });
  };

  // Render the appropriate step based on the current state
  const renderStep = () => {
    if (state.matches({ credentials: 'idle' })) {
      return (
        <DynamicRegisterCredentials 
          onContinue={handleCredentialsSubmit}
          error={state.context.error}
        />
      );
    }

    if (state.matches({ credentials: 'validating' })) {
      return <div className="text-center text-white p-4">Verifying your information...</div>;
    }

    if (state.matches({ profile: 'idle' })) {
      return (
        <DynamicRegisterBio 
          onSuccess={handleProfileSubmit}
          onNavigate={() => router.push('/')}
          error={state.context.error}
        />
      );
    }

    if (state.matches({ profile: 'submitting' })) {
      return <div className="text-center text-white p-4">Creating your account...</div>;
    }

    if (state.matches('complete')) {
      return <div className="text-center text-white p-4">Registration complete! Redirecting...</div>;
    }

    return null;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0D1126] to-[#1A1F3D]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  
  if (status === 'authenticated') {
    return null; // Will redirect from useEffect
  }

  // Update the RegisterCredentialsProps to match the expected interface
interface RegisterCredentialsProps {
  onContinue: (email: string, password: string) => void;
  error?: string;
}

// Update the RegisterBioProps to match the expected interface
interface RegisterBioProps {
  onSuccess: (displayName: string, avatar?: string) => void;
  onNavigate: (path: string) => void;
  error?: string;
}

// Dynamically import UI kit components with SSR disabled
const DynamicRegisterCredentials = dynamic<RegisterCredentialsProps>(
  () => import('@rythm/ui-kit').then((mod) => mod.RegisterCredentials as React.ComponentType<RegisterCredentialsProps>),
  { 
    ssr: false, 
    loading: () => (
      <div className="text-white text-center p-4">Loading registration form...</div>
    ) 
  }
);

const DynamicRegisterBio = dynamic<RegisterBioProps>(
  () => import('@rythm/ui-kit').then((mod) => mod.RegisterBio as React.ComponentType<RegisterBioProps>),
  { 
    ssr: false, 
    loading: () => (
      <div className="text-white text-center p-4">Loading profile form...</div>
    ) 
  }
);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D1126] to-[#1A1F3D] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            size="invisible"
          />
        )}
        {renderStep()}
      </div>
    </div>
  );
}

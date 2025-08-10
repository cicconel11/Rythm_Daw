'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, ReactNode } from 'react';
import { useMachine } from '@xstate/react';
import { registrationMachine, RegistrationMachine } from '../machines/registrationMachine';
import { useRouter } from 'next/navigation';

// Context type
type RegistrationContextType = {
  state: ReturnType<typeof useMachine<RegistrationMachine>>[0];
  send: ReturnType<typeof useMachine<RegistrationMachine>>[1];
};

// Create context
const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEY = 'registration_state';
const STORAGE_FIELDS = ['email', 'requestId', 'token'] as const;

type StoredState = Pick<
  Parameters<typeof registrationMachine.getInitialState>[0],
  (typeof STORAGE_FIELDS)[number]
>;

// Provider component
export function RegistrationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const initialized = useRef(false);
  
  // Initialize the machine
  const [state, send, actor] = useMachine(registrationMachine, {
    actions: {
      redirectToSuccess: () => {
        // Clear stored state on success
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem(STORAGE_KEY);
        }
        router.push('/register/success');
      },
    },
  });

  // Persist state to sessionStorage on changes
  useEffect(() => {
    if (!initialized.current) {
      // Skip the first effect run to prevent hydration issues
      initialized.current = true;
      return;
    }

    // Only persist the necessary fields
    const stateToPersist = STORAGE_FIELDS.reduce((acc, key) => {
      if (state.context[key] !== null) {
        acc[key] = state.context[key];
      }
      return acc;
    }, {} as StoredState);

    if (Object.keys(stateToPersist).length > 0) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    }
  }, [state.context]);

  // Load persisted state on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved) as StoredState;
      
      // Only restore if we have a valid email
      if (parsed.email) {
        // Determine which step to redirect to based on stored state
        if (parsed.token) {
          // Already verified, go to profile
          send({ type: 'SUBMIT_EMAIL', email: parsed.email });
          // We can't directly set the token, so we'll let the component handle this
        } else if (parsed.requestId) {
          // Email submitted but not verified, go to code entry
          send({ type: 'SUBMIT_EMAIL', email: parsed.email });
        }
      }
    } catch (error) {
      console.error('Failed to parse stored registration state', error);
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [send]);

  const value = useMemo(() => ({ state, send }), [state, send]);

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

// Hook to use the registration context
export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
}

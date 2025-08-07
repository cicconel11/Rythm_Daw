import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import React from 'react';

export function withAuth<P>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'unauthenticated') {
        signIn(); // Redirect to login page
      }
    }, [status, router]);

    if (status === 'loading') {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
}

export default withAuth;

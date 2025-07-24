'use client';

import { useRouter } from 'next/navigation';
import { LoginPage } from '@rythm/ui-kit';

export default function LoginPageWrapper() {
  const router = useRouter();

  const handleLogin = async (data: { email: string; password: string }) => {
    console.log('Login attempt:', data);
    
    // Mock API call
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login successful, navigating to dashboard');
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // Toast would be shown here in real implementation
    }
  };

  const handleCreateAccount = () => {
    router.push('/register/credentials');
  };

  const handleForgotPassword = () => {
    console.log('Navigate to forgot password');
    // router.push('/auth/forgot-password');
  };

  return (
    <LoginPage 
      onLogin={handleLogin}
      onCreateAccount={handleCreateAccount}
      onForgotPassword={handleForgotPassword}
    />
  );
}
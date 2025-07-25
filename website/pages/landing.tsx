import { LandingPage } from '@ui-kit/components/LandingPage';
import { useRouter } from 'next/router';

export default function Landing() {
  const router = useRouter();
  return (
    <LandingPage
      onGetStarted={() => router.push('/register/credentials')}
      onLogin={() => router.push('/auth/login')}
    />
  );
}

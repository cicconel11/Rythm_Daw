import { useRouter } from 'next/router';
import { NotFound } from '@rythm/ui-kit';

export default function NotFoundPage() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/');
  };

  return <NotFound onNavigate={handleNavigate} />;
}

import { useRouter } from 'next/router';
import { NotFound } from '@rythm/ui-kit';
import { usePageMetaByPath } from '@/hooks/usePageMeta';

export default function NotFoundPage() {
  const router = useRouter();

  // Use dynamic page meta for 404
  usePageMetaByPath('*', 'Page Not Found');

  const handleNavigate = () => {
    router.push('/');
  };

  return <NotFound onNavigate={handleNavigate} />;
}

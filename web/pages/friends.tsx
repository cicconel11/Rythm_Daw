import { FriendsPanel } from '@ui-kit/components/friendspanel';
import { useFriends } from '@shared/hooks/useFriends';
import { useRouter } from 'next/router';

export default function FriendsPage() {
  const router = useRouter();
  const { data: friends, isLoading, error } = useFriends();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading friends: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <FriendsPanel friends={friends || []} onNavigate={path => router.push(path)} />
    </div>
  );
}

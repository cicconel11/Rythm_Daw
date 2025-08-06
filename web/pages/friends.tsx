import { FriendsPanel } from '@ui-kit/components/FriendsPanel';
import { useFriends } from '@shared/hooks/useFriends';

export default function FriendsPage() {
  const hook = useFriends();
  return <FriendsPanel {...hook} />;
}

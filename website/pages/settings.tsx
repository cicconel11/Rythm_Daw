import { SettingsAccount } from '@ui-kit/components/SettingsAccount';
import { useUser } from '@shared/hooks/useUser';

export default function SettingsPage() {
  const hook = useUser();
  return <SettingsAccount {...hook} />;
}

import { RegisterCredentials } from '@ui-kit/components/RegisterCredentials';
import { useRegisterCredentials } from '@shared/hooks/useRegisterCredentials';

export default function RegisterCredentialsPage() {
  const hook = useRegisterCredentials();
  return <RegisterCredentials {...hook} />;
} 
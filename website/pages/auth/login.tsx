import { LoginPage } from '@ui-kit/components/LoginPage';
import { useLogin } from '@shared/hooks/useLogin';

export default function LoginPageRoute() {
  const hook = useLogin();
  return <LoginPage {...hook} />;
}

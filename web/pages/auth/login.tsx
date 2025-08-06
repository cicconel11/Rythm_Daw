import { getProviders, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Login() {
  const [providers, setProviders] = useState<any>({});
  const isProd = process.env.NODE_ENV === 'production';

  useEffect(() => {
    (async () => {
      setProviders(await getProviders());
    })();
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '2rem' }}>
      <h1>Sign in</h1>
      {providers &&
        Object.values(providers).map((provider: any) => {
          if (provider.id === 'credentials' && !isProd) {
            // Render credentials form for E2E/admin only in non-prod
            return (
              <form
                key="credentials"
                onSubmit={async e => {
                  e.preventDefault();
                  const email = (e.target as any).email.value;
                  const password = (e.target as any).password.value;
                  await signIn('credentials', { email, password, callbackUrl: '/' });
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}
              >
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  data-testid="input-email"
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  data-testid="input-password"
                />
                <button type="submit" data-testid="btn-credentials">
                  Sign in with Credentials
                </button>
              </form>
            );
          }
          if (provider.id !== 'credentials') {
            return (
              <div key={provider.name} style={{ marginTop: 16 }}>
                <button
                  data-testid={`btn-${provider.id}`}
                  onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                >
                  Sign in with {provider.name}
                </button>
              </div>
            );
          }
          return null;
        })}
    </div>
  );
}

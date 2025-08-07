# Rythm DAW – Website

## Quick Start

```sh
pnpm i
cp .env.example .env   # Fill in GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET, E2E_CREDENTIALS_EMAIL, E2E_CREDENTIALS_PASSWORD
pnpm dev               # open http://localhost:3000/landing
```

- Google OAuth is required for production login. Set up credentials in your Google Cloud Console.
- In development/CI, fallback Credentials login is enabled using `E2E_CREDENTIALS_EMAIL` and `E2E_CREDENTIALS_PASSWORD` from your `.env`.
- The landing page (`/landing`) is public and links to the login flow.
- All protected routes (including `/dashboard`) require authentication.

## Run E2E tests

```sh
pnpm run ci:e2e  # spins up server, seeds auth, runs all tests
```

- E2E tests use the Credentials provider if `NODE_ENV !== 'production'`.
- Test user is defined in `tests/auth.setup.ts`.
- The happy path test (`tests/landing-login.spec.ts`) verifies the full login funnel.

## OAuth & Auth Notes

- NextAuth is configured for Google OAuth and (in non-production) fallback Credentials login for E2E.
- Middleware protects `/dashboard`, `/files`, `/friends`, `/history`, `/chat`, `/settings` (redirects to `/auth/login?next=...`).
- `/landing`, `/auth/*`, `/api/auth/*` are always public.
- Logout available via the sidebar.

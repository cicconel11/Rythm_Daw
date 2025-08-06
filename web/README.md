# Rythm DAW – Website

## Getting Started

```sh
pnpm i
cp .env.example .env           # Fill in secrets for NextAuth, Google OAuth, etc.
pnpm dev                       # Start local dev server
```

- Configure Google OAuth in `.env` with your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
- In non-production, a Credentials provider is available for E2E/admin testing via `E2E_CREDENTIALS_*`.

## Run E2E tests

```sh
pnpm run ci:e2e  # spins up server, seeds auth, runs all tests
```

- The first command seeds Playwright's storage state using the Credentials provider (or Google, if creds are not set).
- All protected routes require authentication via NextAuth.

## OAuth & Auth Notes

- NextAuth is configured for Google OAuth and (in non-production) fallback Credentials login for E2E.
- Middleware protects `/files`, `/friends`, `/history`, `/chat`, `/settings` (redirects to `/landing?next=...`).
- Logout available via the sidebar.

# P-2 Two-Step Registration

- Machine: `web/src/machines/registrationMachine.ts` (XState v5, sessionStorage persistence)
- Hooks: `web/src/hooks/useRegistration.ts`
- Pages: `/register/credentials`, `/register/bio` (App Router)
- API: `web/app/api/auth/register/route.ts`
- Redirect rules:
  - Step1 done ⇒ `/register/bio`
  - Visit bio without step1 ⇒ redirect to `/register/credentials`
  - Completed ⇒ redirect to `/dashboard`
- E2E: `web/tests/e2e/register.spec.ts`

Run:
```bash
pnpm --filter web dev
# in another terminal
pnpm --filter web test:e2e
```

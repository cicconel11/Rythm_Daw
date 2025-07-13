# RHYTHM Collaboration Suite

> **One-liner:** *Real-time, cross-DAW collaboration that brings secure chat, file-sharing and project snapshots to any music project in minutes.*

---

## 🚀 Quick-Start (Local Dev)

### 1. Clone & install
```bash
# SSH
 git clone git@github.com:your-org/rhythm.git
# or HTTPS
# git clone https://github.com/your-org/rhythm.git
cd rhythm

# install JS deps (server & build scripts)
npm ci
```

### 2. Environment
Create a `.env` in `server/`:
```env
NEXTAUTH_SECRET=replace_me
NEXTAUTH_URL=http://localhost:3000
POSTGRES_URL=postgres://user:pass@localhost:5432/rhythm
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
```

### 3. Run services
```bash
# launch database (Docker example)
docker compose up -d postgres

# generate Prisma client
a=server
npm run prisma:generate --workspace $a

# start the server (Next.js + WS gateway)
cd server
npm run dev
```

### 4. Build the plug-in (JUCE 7)
```bash
cd plugin
cmake -B build -DJUCE_ENABLE_REACT=ON
cmake --build build --config Release
```
The React UI panel will auto-bundle via `npm run build:ui` and is baked into the binary.

---

## 🏗️ High-Level Architecture
```mermaid
graph LR
  subgraph "Client (C++)"
    Plugin["🎚️ RHYTHM Plug-in"]
    Plugin -->|WebSocket /ws/chat| ChatGW
    Plugin -->|WebRTC SCTP| FileShare
  end

  subgraph "Server (Node 20)"
    ChatGW["NestJS ChatGateway"]
    FileRelay["S3 Relay"]
    NextAPI["Next.js API Routes"]
    Auth["NextAuth.js"]
    DB[(PostgreSQL 14)]
  end

  ChatGW --> DB
  NextAPI --> DB
  Auth --> DB
  FileShare -->|Fallback| FileRelay
  Analytics((Redshift))
  NextAPI -->|bulk events| Analytics
```

---

## 🤝 Contribution Guide

1. **Fork & branch:** `main` is protected. Create feature branches: `feat/<scope>` or `fix/<scope>`.
2. **Commit style:** Conventional Commits *(e.g. `feat(chat): add back-pressure`)*. Lint-staged & Husky enforce on commit.
3. **Tests:**
   - **Server:** `npm test` (Jest + ts-jest).
   - **Plug-in:** CTest targets run via `cmake --build build --target test`.
4. **Formatting:** `pnpm lint` (ESLint, Prettier) & `clang-format` for C++.
5. **PR checklist:**
   - [ ] Tests added/updated & passing.
   - [ ] No new ESLint/Type errors.
   - [ ] Docs/README updated if behavior changes.
6. **CI/CD:** GitHub Actions run full matrix. Green checks required before merge.

---

## 📜 License
Free Beta — proprietary (contact <lociccone11@gmail.com> for details).

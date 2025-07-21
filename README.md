# RHYTHM Collaboration Suite

> **One-liner:** *Real-time, cross-DAW collaboration that brings secure chat, file-sharing and project snapshots to any music project in minutes.*

---

## 🚀 Quick-Start (Local Dev)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- pnpm 8.x
- Docker (for local development)

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

# install dependencies
cd server
pnpm install

# generate Prisma client
pnpm prisma:generate

# run database migrations
pnpm prisma:migrate:dev

# start the development server
pnpm start:dev
```

### 4. Build the plug-in (JUCE 7)
```bash
cd plugin
cmake -B build -DJUCE_ENABLE_REACT=ON
cmake --build build --config Release
```
The React UI panel will auto-bundle via `npm run build:ui` and is baked into the binary.

---

## 🔐 Authentication System

The application uses JWT-based authentication with the following features:

- **Stateless JWT Authentication**
  - Access tokens (15m expiry)
  - Refresh tokens (7d expiry)
  - Secure HTTP-only cookies for token storage
  - CSRF protection

- **Key Endpoints**
  - `POST /auth/signup` - Register new user
  - `POST /auth/login` - Authenticate user
  - `POST /auth/refresh` - Refresh access token
  - `POST /auth/logout` - Invalidate tokens

- **Security Features**
  - Password hashing with bcrypt (12 rounds)
  - Input validation using class-validator
  - Rate limiting on auth endpoints
  - Secure cookie settings (httpOnly, sameSite, secure)

## 🧪 Testing

Run the test suite with:
```bash
# Run all tests
pnpm test

# Run auth service tests only
pnpm test test/auth/auth.service.spec.ts

# Run with coverage
pnpm test:cov
```

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

## 🛠️ Development

### Environment Variables
Create a `.env` file in the `server` directory with the following variables:

```env
# App
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rhythm?schema=public"

# JWT
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_SALT_ROUNDS=12
```

### Database Management

```bash
# Generate and run migrations
pnpm prisma:migrate:dev

# Reset database
pnpm prisma:reset

# Open Prisma Studio
pnpm prisma:studio
```

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

---

## 🐳 Docker & Deployment

### Environment Variables

| Variable              | Description                        | Example Value                                      |
|----------------------|------------------------------------|----------------------------------------------------|
| NODE_ENV             | Node environment                    | production                                         |
| PORT                 | App port                            | 3000                                               |
| DATABASE_URL         | Postgres connection string          | postgresql://postgres:postgres@db:5432/rhythm       |
| REDIS_URL            | Redis connection string             | redis://redis:6379                                 |
| JWT_ACCESS_SECRET    | JWT access token secret             | your_jwt_access_secret                             |
| JWT_REFRESH_SECRET   | JWT refresh token secret            | your_jwt_refresh_secret                            |
| JWT_ACCESS_EXPIRES_IN| JWT access token expiry             | 15m                                                |
| JWT_REFRESH_EXPIRES_IN| JWT refresh token expiry           | 7d                                                 |
| BCRYPT_SALT_ROUNDS   | Bcrypt salt rounds                  | 12                                                 |

### Quick Start

```bash
docker compose up --build
```

- The app will be available at [http://localhost:3000](http://localhost:3000)
- Health check: [http://localhost:3000/](http://localhost:3000/) or `/healthz` if implemented
- Postgres: port 5432, Redis: port 6379

---

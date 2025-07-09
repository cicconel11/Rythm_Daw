# Rythm Server

NestJS server for the Rythm DAW application.

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start:dev

# Run tests
pnpm test

# Lint code
pnpm lint

# Typecheck
pnpm typecheck
```

## CI/CD Pipeline

The project uses GitHub Actions for CI/CD with the following workflows:

### Continuous Integration (CI)
- Runs on every push and pull request to `main`
- Lints TypeScript code
- Runs type checking
- Executes tests with coverage
- Uploads coverage to Codecov

### Docker Build & Publish
- Triggered on version tags (v*)
- Builds a production-ready Docker image
- Pushes to GitHub Container Registry (GHCR)
- Tags with both version and git SHA

## Docker

### Building Locally

```bash
docker build -t rythm-server .
docker run -p 3000:3000 rythm-server
```

### Environment Variables

Create a `.env` file in the root directory with the required environment variables (see `.env.example`).

## Code Quality

[![CI Status](https://github.com/your-org/Rythm_Daw/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/your-org/Rythm_Daw/actions)
[![codecov](https://codecov.io/gh/your-org/Rythm_Daw/branch/main/graph/badge.svg)](https://codecov.io/gh/your-org/Rythm_Daw)
[![Docker Image Size](https://img.shields.io/docker/image-size/ghcr.io/your-org/Rythm_Daw/latest)](https://github.com/your-org/Rythm_Daw/pkgs/container/rythm-server)

## License

MIT

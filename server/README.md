# RHYTHM Server

This is the backend server for the RHYTHM Collaboration Suite, built with NestJS and TypeScript.

## Development

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Docker (for database in development)

### Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Copy `.env.example` to `.env` and update the values as needed.

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The server will be available at `http://localhost:3000` by default.

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

### Testing Guidelines

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test the entire application flow

### Test Isolation

- Test code should not be included in production builds
- Use dependency injection for test doubles
- Keep test utilities in the `test/` directory

## Production

### Building for Production

```bash
npm run build
```

### Starting in Production

```bash
npm run start:prod
```

## Code Quality

### Linting

```bash
# Check for linting issues
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Formatting

```bash
# Format code
npm run format
```

## Contributing

1. Create a new branch for your feature or bugfix
2. Write tests for your changes
3. Ensure all tests pass
4. Submit a pull request

## License

MIT

# File Sharing E2E Tests

This directory contains comprehensive end-to-end tests for the file sharing functionality in the RHYTHM Collaboration Suite.

## Test Files

### `file-share.spec.ts`
Basic file sharing tests covering:
- User authentication and login
- File upload via drag & drop
- File transfer between users
- Accept/decline transfers
- File download functionality
- WebSocket real-time updates
- File search and filtering
- Plugin-specific transfer fields

### `file-share-comprehensive.spec.ts`
Advanced tests using helper functions:
- Complete file transfer workflows
- Multiple file type handling
- Batch file operations
- Database verification
- Error handling

### `helpers/file-sharing.helper.ts`
Reusable test utilities:
- Test user creation and cleanup
- File upload helpers
- Database verification functions
- Common test data

## Running the Tests

### Prerequisites
1. Ensure the server is running with database migrations applied
2. Set up test environment variables:
   ```bash
   DATABASE_URL="file:./test.db"
   JWT_SECRET="test-secret"
   AWS_REGION="us-east-1"
   ```

### Run All File Sharing Tests
```bash
cd server
pnpm test:e2e --grep "File Share"
```

### Run Specific Test File
```bash
# Run basic tests
pnpm test:e2e file-share.spec.ts

# Run comprehensive tests
pnpm test:e2e file-share-comprehensive.spec.ts
```

### Run with Debug
```bash
# Run with browser visible
pnpm test:e2e --headed

# Run with slow motion
pnpm test:e2e --headed --slowmo=1000

# Run with trace
pnpm test:e2e --trace=on
```

## Test Coverage

### Core Functionality
- ✅ File upload (drag & drop, file picker)
- ✅ Friend selection and recipient management
- ✅ File transfer initiation
- ✅ Real-time status updates via WebSocket
- ✅ Accept/decline incoming transfers
- ✅ File download with presigned URLs
- ✅ Transfer history and search
- ✅ Tab navigation (Inbox, Sent, All)

### File Types
- ✅ Audio files (WAV, MP3, FLAC, AIFF)
- ✅ MIDI files (.mid, .midi)
- ✅ Project files (FL Studio, Logic, Pro Tools, Reaper)
- ✅ Video files (MP4, MOV, AVI)
- ✅ Image files (JPG, PNG, GIF)
- ✅ Large file handling (>100MB)

### Plugin Integration
- ✅ Plugin-specific transfer fields (projectId, peerId, transferType)
- ✅ WebRTC vs S3 transfer method selection
- ✅ File integrity verification (SHA256)
- ✅ Chunked transfer support
- ✅ Transfer progress monitoring

### Error Handling
- ✅ Network failures
- ✅ Invalid file types
- ✅ Missing recipients
- ✅ Authentication errors
- ✅ Database connection issues

## Test Data

### Test Users
- `userA@example.com` - Primary test user
- `userB@example.com` - Secondary test user
- `userC@example.com` - Additional test user

### Test Files
- `test-audio.wav` - Standard audio file
- `test-midi.mid` - MIDI file
- `test-project.flp` - FL Studio project
- `large-audio.wav` - Large file (1MB)

## Database Verification

Tests verify that transfers are properly stored in the database with:
- Correct file metadata
- Proper user relationships
- Transfer status tracking
- Plugin-specific fields
- Timestamps for all events

## WebSocket Testing

Tests monitor WebSocket connections for:
- Real-time transfer status updates
- File transfer events
- Connection establishment
- Error handling

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure test database is accessible
   - Check DATABASE_URL environment variable
   - Run migrations: `pnpm prisma migrate dev`

2. **Authentication Failures**
   - Verify JWT_SECRET is set
   - Check test user creation in beforeAll hooks

3. **File Upload Timeouts**
   - Increase test timeout for large files
   - Check S3 configuration for test environment

4. **WebSocket Connection Issues**
   - Verify server is running on correct port
   - Check CORS configuration
   - Ensure WebSocket gateway is properly initialized

### Debug Commands

```bash
# Run single test with debug
pnpm test:e2e --grep "Complete file transfer workflow" --headed --debug

# Run with verbose logging
DEBUG=pw:api pnpm test:e2e

# Generate test report
pnpm test:e2e --reporter=html
```

## CI/CD Integration

These tests are designed to run in CI/CD pipelines with:
- Headless browser execution
- Automatic test data cleanup
- Parallel test execution where possible
- Comprehensive error reporting
- Integration with test coverage tools

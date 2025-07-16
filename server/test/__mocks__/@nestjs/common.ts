// Import the actual module first
const actual = jest.requireActual('@nestjs/common');

// Create a proper Logger class
class NoopLogger {
  constructor(private context?: string) {}
  
  log(message: any, context?: string) {}
  error(message: any, trace?: string, context?: string) {}
  warn(message: any, context?: string) {}
  debug(message: any, context?: string) {}
  verbose(message: any, context?: string) {}
  static overrideLogger(logger: any) {}
  static flush() {}
}

// Create a new object with all the actual exports
const mocks = {
  ...actual,
  Logger: NoopLogger,
};

// Export all the actual exports plus our mocks
module.exports = {
  ...mocks,
  // Make sure all decorators are properly exported
  Injectable: actual.Injectable,
  Inject: actual.Inject,
  // Export our mocked Logger
  Logger: NoopLogger,
  // Re-export other commonly used items
  HttpStatus: actual.HttpStatus,
  HttpException: actual.HttpException,
  UnauthorizedException: actual.UnauthorizedException,
  ForbiddenException: actual.ForbiddenException,
  NotFoundException: actual.NotFoundException,
  BadRequestException: actual.BadRequestException,
  InternalServerErrorException: actual.InternalServerErrorException,
  // Add other commonly used exports as needed
};

// Also export the Logger as a named export
export const Logger = NoopLogger;

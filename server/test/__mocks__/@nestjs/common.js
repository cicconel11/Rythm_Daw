// Re-export the actual @nestjs/common module
const actual = jest.requireActual('@nestjs/common');

// Mock the REQUEST token
exports.REQUEST = 'REQUEST';

// Create a mock Logger class
class MockLogger {
  constructor(context) {
    this.context = context;
  }
  log(message, context) {
    console.log(`[${context || this.context}]`, message);
  }
  error(message, trace, context) {
    console.error(`[${context || this.context}]`, message, trace);
  }
  warn(message, context) {
    console.warn(`[${context || this.context}]`, message);
  }
  debug(message, context) {
    console.debug(`[${context || this.context}]`, message);
  }
  verbose(message, context) {
    console.log(`[${context || this.context}] VERBOSE:`, message);
  }
  static overrideLogger(logger) {
    // Mock implementation
    console.log('Logger.overrideLogger called with:', logger);
  }
}

// Common decorators
const createDecorator = (name) => {
  return jest.fn().mockImplementation(() => {
    return (target, key, descriptor) => {
      return descriptor || {};
    };
  });
};

// Mock the module
module.exports = {
  // Keep all actual implementations by default
  ...actual,
  
  // Override specific exports with mocks
  Logger: MockLogger,
  
  // HTTP decorators
  Controller: createDecorator('Controller'),
  Get: createDecorator('Get'),
  Post: createDecorator('Post'),
  Put: createDecorator('Put'),
  Delete: createDecorator('Delete'),
  Patch: createDecorator('Patch'),
  
  // Parameter decorators
  Body: createDecorator('Body'),
  Query: createDecorator('Query'),
  Param: createDecorator('Param'),
  Headers: createDecorator('Headers'),
  Req: createDecorator('Req'),
  Res: createDecorator('Res'),
  Next: createDecorator('Next'),
  
  // Other common decorators
  UseGuards: () => (target, propertyKey, descriptor) => {},
  UsePipes: () => (target, propertyKey, descriptor) => {},
  UseInterceptors: () => (target, propertyKey, descriptor) => {},
  SetMetadata: () => (target, propertyKey, descriptor) => {},
  
  // Common utilities
  Module: () => (target) => target,
  Controller: () => (target) => target,
  
  // Add any other commonly used exports from @nestjs/common
};

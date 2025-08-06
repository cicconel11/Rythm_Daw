// Mock common NestJS decorators

// Controller decorator
function Controller(prefix) {
  return function (target) {
    return target;
  };
}

// HTTP method decorators
function Post(path) {
  return function (target, propertyKey, descriptor) {
    return descriptor;
  };
}

function Get(path) {
  return function (target, propertyKey, descriptor) {
    return descriptor;
  };
}

function Put(path) {
  return function (target, propertyKey, descriptor) {
    return descriptor;
  };
}

function Delete(path) {
  return function (target, propertyKey, descriptor) {
    return descriptor;
  };
}

function Patch(path) {
  return function (target, propertyKey, descriptor) {
    return descriptor;
  };
}

// Parameter decorators
function Body() {
  return function (target, propertyKey, parameterIndex) {
    return target;
  };
}

function Query() {
  return function (target, propertyKey, parameterIndex) {
    return target;
  };
}

function Param() {
  return function (target, propertyKey, parameterIndex) {
    return target;
  };
}

function Req() {
  return function (target, propertyKey, parameterIndex) {
    return target;
  };
}

function Res() {
  return function (target, propertyKey, parameterIndex) {
    return target;
  };
}

// Other common decorators
function UsePipes() {
  return function (target, propertyKey, descriptor) {
    return descriptor;
  };
}

function UseGuards() {
  return function (target, propertyKey, descriptor) {
    return descriptor;
  };
}

function SetMetadata() {
  return function (target, propertyKey, descriptor) {
    return descriptor;
  };
}

// Common classes
class ValidationPipe {}

class HttpException extends Error {
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

class HttpStatus {}
HttpStatus.BAD_REQUEST = 400;
HttpStatus.UNAUTHORIZED = 401;
HttpStatus.FORBIDDEN = 403;
HttpStatus.NOT_FOUND = 404;
HttpStatus.CONFLICT = 409;
HttpStatus.INTERNAL_SERVER_ERROR = 500;

// Common classes
class Request {}

class Response {
  status() {
    return this;
  }
  json() {}
  send() {}
  cookie() {}
  clearCookie() {}
}

// Common utilities
class Logger {
  static log(message: string, context: string) {
    console.log(`[${context || 'App'}]`, message);
  }
  
  static error(message: string, trace: unknown, context: string) {
    console.error(`[${context || 'App'}] ERROR:`, message, trace || '');
  }
  
  static warn(message: string, context: string) {
    console.warn(`[${context || 'App'}] WARN:`, message);
  }
  
  static debug(message: string, context: string) {
    console.debug(`[${context || 'App'}] DEBUG:`, message);
  }
  
  static verbose(message: string, context: string) {
    console.log(`[${context || 'App'}] VERBOSE:`, message);
  }
}

// Also provide instance methods for backward compatibility
Logger.prototype.log = jest.fn();
Logger.prototype.error = jest.fn();
Logger.prototype.warn = jest.fn();
Logger.prototype.debug = jest.fn();
Logger.prototype.verbose = jest.fn();

// Request-scoped provider token
export const REQUEST = 'REQUEST';

// Export all mocks
module.exports = {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Patch,
  Body,
  Query,
  Param,
  Req,
  Res,
  UsePipes,
  UseGuards,
  SetMetadata,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Request,
  Response,
  Logger,
  Injectable: (target: unknown) => (target: unknown) => target,
  Inject: (target: unknown, propertyKey: string, parameterIndex: number) => {},
  Optional: (target: unknown, propertyKey: string, parameterIndex: number) => {},
  CACHE_MANAGER: 'CACHE_MANAGER',
  Cache: (target: unknown, propertyKey: string, parameterIndex: number) => {},
  CacheKey: (target: unknown, propertyKey: string) => {},
  CacheTTL: (target: unknown, propertyKey: string) => {},
  createParamDecorator: (factory: (arg0: { arg: unknown; arg1: unknown; arg2: unknown }) => unknown) => (target: unknown, key: string, index: number) => {},
  REQUEST: REQUEST,
};

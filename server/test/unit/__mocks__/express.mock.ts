import { EventEmitter } from 'events';

// Mock Request interface
interface MockRequest {
  body: any;
  params: any;
  query: any;
  headers: any;
  method: string;
  url: string;
  originalUrl: string;
  path: string;
  cookies: any;
  session: any;
  user: any;
  [key: string]: any;
}

// Mock Response interface
interface MockResponse {
  status: (code: number) => MockResponse;
  json: (data: any) => MockResponse;
  send: (data: any) => MockResponse;
  end: () => MockResponse;
  set: (key: string, value: string) => MockResponse;
  header: (key: string, value: string) => MockResponse;
  redirect: (url: string) => MockResponse;
  render: (view: string, data?: any) => MockResponse;
  locals: any;
  [key: string]: any;
}

// Mock Next function
type MockNext = (error?: any) => void;

// Create mock request
const createMockRequest = (overrides: Partial<MockRequest> = {}): MockRequest => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    method: 'GET',
    url: '/',
    originalUrl: '/',
    path: '/',
    cookies: {},
    session: {},
    user: null,
    ...overrides,
  };
};

// Create mock response
const createMockResponse = (): MockResponse => {
  const res = {
    statusCode: 200,
    locals: {},
    headers: {},
  } as unknown as MockResponse;

  // Chainable methods
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  res.header = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);

  return res;
};

// Create mock next function
const createMockNext = (): MockNext => jest.fn();

// Mock Router
const Router = jest.fn().mockReturnValue({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  use: jest.fn(),
  param: jest.fn(),
  route: jest.fn(),
  stack: [],
});

// Mock middleware functions
const json = jest.fn().mockReturnValue((req: any, res: any, next: any) => next());
const urlencoded = jest.fn().mockReturnValue((req: any, res: any, next: any) => next());
const staticMiddleware = jest.fn().mockReturnValue((req: any, res: any, next: any) => next());
const cors = jest.fn().mockReturnValue((req: any, res: any, next: any) => next());

// Mock express function
const express = jest.fn().mockReturnValue({
  use: jest.fn().mockImplementation(function (middleware) {
    // Accept helmet(), rateLimiter, or any middleware and return 'this' for chaining
    return this;
  }),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  listen: jest.fn(),
  set: jest.fn(),
  engine: jest.fn(),
  Router,
  json,
  urlencoded,
  cors,
});

// Export as default and named exports
export default express;
export { Router, json, urlencoded, cors };
export { staticMiddleware as static };
export { createMockRequest, createMockResponse, createMockNext };
export type { MockRequest, MockResponse, MockNext }; 
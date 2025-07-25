export const attachMockServer = (gateway: unknown, mock: unknown) =>
  Object.defineProperty(gateway, 'server', { get: () => mock }); 
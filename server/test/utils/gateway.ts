export const attachMockServer = (gateway: any, mock: any) =>
  Object.defineProperty(gateway, 'server', { get: () => mock }); 
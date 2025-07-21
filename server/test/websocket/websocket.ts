export class WebSocket {
  on = jest.fn();
  send = jest.fn();
  close = jest.fn();
  readyState = 1; // OPEN
  CONNECTING = 0;
  OPEN = 1;
  CLOSING = 2;
  CLOSED = 3;
}

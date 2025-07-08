/// <reference types="jest" />
/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class MockWebSocket extends EventEmitter implements WebSocket {
    id: string;
    constructor(id?: string);
    readonly CONNECTING = 0;
    readonly OPEN = 1;
    readonly CLOSING = 2;
    readonly CLOSED = 3;
    binaryType: BinaryType;
    readonly bufferedAmount: number;
    readonly extensions: string;
    readonly protocol: string;
    readonly url: string;
    onopen: ((this: WebSocket, ev: Event) => any) | null;
    onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null;
    onclose: ((this: WebSocket, ev: CloseEvent) => any) | null;
    onerror: ((this: WebSocket, ev: Event) => any) | null;
    readyState: number;
    send: jest.Mock<void, [data: string | ArrayBufferView | Blob | ArrayBufferLike], any>;
    close: jest.Mock<void, [code?: number | undefined, reason?: string | undefined], any>;
    terminate: jest.Mock<void, [], any>;
    pause: jest.Mock<any, any, any>;
    resume: jest.Mock<any, any, any>;
    ping: jest.Mock<void | undefined, [cb?: (() => void) | undefined], any>;
    isAlive: boolean;
    on: <K>(eventName: string | symbol, listener: (...args: any[]) => void) => this;
    once: <K>(eventName: string | symbol, listener: (...args: any[]) => void) => this;
    addEventListener: jest.Mock<void, [type: any, listener: (this: WebSocket, ev: any) => any, options?: boolean | AddEventListenerOptions | undefined], any>;
    removeEventListener: jest.Mock<void, [type: any, listener: (this: WebSocket, ev: any) => any, options?: boolean | EventListenerOptions | undefined], any>;
    dispatchEvent: jest.Mock<boolean, [event: Event], any>;
    _triggerOpen(): void;
    _triggerMessage(data: any): void;
    _triggerClose(code?: number, reason?: string): void;
    _triggerError(error: any): void;
}
export declare const WebSocket: jest.Mock<any, any, any>;
export default WebSocket;

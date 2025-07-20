// Global type declarations for WebRTC and other globals
declare namespace NodeJS {
  interface Global {
    WebSocket: typeof WebSocket;
  }
}

// Extend Socket.IO Handshake to include user
declare module 'socket.io' {
  interface Handshake {
    user?: {
      id: string;
      email: string;
      name?: string;
    };
  }
}

// WebRTC types
type RTCIceServer = {
  urls: string | string[];
  username?: string;
  credential?: string;
};

type RTCSessionDescriptionInit = {
  type: 'offer' | 'answer' | 'pranswer' | 'rollback';
  sdp?: string;
};

type RTCIceCandidate = {
  candidate: string;
  sdpMid: string | null;
  sdpMLineIndex: number | null;
  usernameFragment?: string;
};

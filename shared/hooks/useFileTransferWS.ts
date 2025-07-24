import { useEffect, useRef } from "react";

export function useFileTransferWS() {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(
      (process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000") +
        "/ws/file-transfer",
    );
    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      // TODO: handle transfer-initiated, transfer-status, etc.
    };
    return () => ws.current?.close();
  }, []);

  return {
    send: (msg: any) => ws.current?.send(JSON.stringify(msg)),
  };
}

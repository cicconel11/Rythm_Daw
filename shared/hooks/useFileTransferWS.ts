import { useEffect, useRef } from "react";
import { FileTransferGatewayEventSchema } from "../types/index.js";

export function useFileTransferWS() {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(
      (process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000") +
        "/ws/file-transfer",
    );
    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      // Parse and validate event
      const parsed = FileTransferGatewayEventSchema.safeParse(msg);
      if (!parsed.success) {
        console.error("Invalid WS event", parsed.error, msg);
        return;
      }
      // TODO: handle parsed.data
    };
    return () => ws.current?.close();
  }, []);

  return {
    send: (msg: unknown) => ws.current?.send(JSON.stringify(msg)),
  };
}

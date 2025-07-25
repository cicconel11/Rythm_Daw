import { useState, useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

interface FileTransferOptions {
  onProgress?: (progress: number) => void;
  onComplete?: (fileUrl: string) => void;
  onError?: (error: Error) => void;
}

export const useFileTransfer = (userId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferProgress, setTransferProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const ws = useRef<WebSocket | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);
  const fileChunks = useRef<ArrayBuffer[]>([]);
  const currentFile = useRef<File | null>(null);
  const currentOptions = useRef<FileTransferOptions | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/file-transfer`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("Connected to file transfer server");
      setIsConnected(true);
    };

    ws.current.onclose = () => {
      console.log("Disconnected from file transfer server");
      setIsConnected(false);
    };

    ws.current.onmessage = handleMessage;

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userId]);

  const handleMessage = useCallback(async (event: MessageEvent) => {
    const message = JSON.parse(event.data);
    console.log("Received message:", message);

    switch (message.event) {
      case "transfer-initiated":
        handleTransferInitiated(message.data);
        break;
      case "offer":
        await handleOffer(message.data);
        break;
      case "answer":
        await handleAnswer(message.data);
        break;
      case "ice-candidate":
        await handleIceCandidate(message.data);
        break;
      default:
        console.warn("Unknown message type:", message.event);
    }
  }, []);

  const initializePeerConnection = useCallback(() => {
    if (peerConnection.current) return;

    const config: RTCConfiguration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    const pc = new RTCPeerConnection(config);

    pc.onicecandidate = (event) => {
      if (event.candidate && ws.current) {
        ws.current.send(
          JSON.stringify({
            event: "ice-candidate",
            data: {
              to: "server", // This would be the target user ID in a real implementation
              candidate: event.candidate,
            },
          }),
        );
      }
    };

    pc.ondatachannel = (event) => {
      console.log("Data channel received");
      dataChannel.current = event.channel;
      setupDataChannel(event.channel);
    };

    peerConnection.current = pc;
  }, []);

  const setupDataChannel = useCallback((dc: RTCDataChannel) => {
    dc.binaryType = "arraybuffer";

    dc.onopen = () => {
      console.log("Data channel opened");
      sendFile();
    };

    dc.onmessage = (event) => {
      console.log("Received message on data channel:", event.data);
    };

    dc.onclose = () => {
      console.log("Data channel closed");
      cleanup();
    };

    dc.onerror = (error) => {
      console.error("Data channel error:", error);
      currentOptions.current?.onError?.(new Error("Data channel error"));
      cleanup();
    };
  }, []);

  const sendFile = useCallback(async () => {
    if (!currentFile.current || !dataChannel.current) return;

    const file = currentFile.current;
    const chunkSize = 16 * 1024; // 16KB chunks
    let offset = 0;

    try {
      while (offset < file.size) {
        const chunk = file.slice(offset, offset + chunkSize);
        const buffer = await chunk.arrayBuffer();

        if (dataChannel.current.readyState === "open") {
          dataChannel.current.send(buffer);
          offset += chunk.size;

          const progress = Math.min(
            Math.round((offset / file.size) * 100),
            100,
          );
          setTransferProgress(progress);
          currentOptions.current?.onProgress?.(progress);

          // Small delay to prevent overwhelming the channel
          await new Promise((resolve) => setTimeout(resolve, 10));
        } else {
          throw new Error("Data channel closed during transfer");
        }
      }

      // Notify completion
      currentOptions.current?.onComplete?.(URL.createObjectURL(file));
    } catch (error) {
      console.error("Error sending file:", error);
      currentOptions.current?.onError?.(error as Error);
    } finally {
      cleanup();
    }
  }, []);

  const cleanup = useCallback(() => {
    if (dataChannel.current) {
      dataChannel.current.close();
      dataChannel.current = null;
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    fileChunks.current = [];
    currentFile.current = null;
    setIsTransferring(false);
  }, []);

  const handleTransferInitiated = useCallback((data: unknown) => {
    console.log("Transfer initiated with data:", data);
    // Store the S3 URL for fallback
    // In a real implementation, you would use this for the fallback mechanism
  }, []);

  const handleOffer = useCallback(
    async (data: unknown) => {
      if (!peerConnection.current) initializePeerConnection();
      if (!peerConnection.current) return;

      try {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.offer),
        );
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        if (ws.current) {
          ws.current.send(
            JSON.stringify({
              event: "answer",
              data: {
                to: data.from,
                answer: peerConnection.current.localDescription,
              },
            }),
          );
        }
      } catch (error) {
        console.error("Error handling offer:", error);
        currentOptions.current?.onError?.(error as Error);
      }
    },
    [initializePeerConnection],
  );

  const handleAnswer = useCallback(async (data: unknown) => {
    if (!peerConnection.current) return;

    try {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(data.answer),
      );
    } catch (error) {
      console.error("Error handling answer:", error);
      currentOptions.current?.onError?.(error as Error);
    }
  }, []);

  const handleIceCandidate = useCallback(async (data: unknown) => {
    if (!peerConnection.current) return;

    try {
      await peerConnection.current.addIceCandidate(
        new RTCIceCandidate(data.candidate),
      );
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
      currentOptions.current?.onError?.(error as Error);
    }
  }, []);

  const sendFileP2P = useCallback(
    async (
      file: File,
      recipientId: string,
      options: FileTransferOptions = {},
    ) => {
      if (!ws.current || !isConnected) {
        throw new Error("Not connected to the server");
      }

      if (isTransferring) {
        throw new Error("A file transfer is already in progress");
      }

      setIsTransferring(true);
      setTransferProgress(0);
      currentFile.current = file;
      currentOptions.current = options;

      try {
        initializePeerConnection();

        // Initialize data channel
        if (peerConnection.current) {
          const dc = peerConnection.current.createDataChannel("fileTransfer");
          dataChannel.current = dc;
          setupDataChannel(dc);

          // Create and send offer
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);

          ws.current.send(
            JSON.stringify({
              event: "init-transfer",
              data: {
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type,
                recipientId,
                offer,
              },
            }),
          );
        }
      } catch (error) {
        console.error("Error initiating file transfer:", error);
        setIsTransferring(false);
        currentOptions.current?.onError?.(error as Error);
        throw error;
      }
    },
    [initializePeerConnection, isConnected, isTransferring, setupDataChannel],
  );

  return {
    isConnected,
    isTransferring,
    transferProgress,
    error,
    sendFileP2P,
  };
};

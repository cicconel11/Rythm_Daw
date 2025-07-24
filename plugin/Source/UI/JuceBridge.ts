interface FileMeta {
  name: string;
  type: string;
  size: number;
  // The actual file data (if available)
  data?: Blob | File;
  // Add any additional file metadata fields as needed
}

interface JuceBridgeMessage {
  type: string;
  data: any;
}

type EventHandler = (data: any) => void;

class JuceBridgeClass {
  private eventHandlers: Map<string, EventHandler[]> = new Map();

  send(type: string, data: any) {
    const message: JuceBridgeMessage = { type, data };

    // In a real JUCE plugin, this would send to the native layer
    if (typeof window !== "undefined" && (window as any).juce) {
      (window as any).juce.postMessage(JSON.stringify(message));
    } else {
      console.log("JuceBridge send:", message);
    }
  }

  on(type: string, handler: EventHandler) {
    if (!this.eventHandlers.has(type)) {
      this.eventHandlers.set(type, []);
    }
    this.eventHandlers.get(type)?.push(handler);
  }

  off(type: string, handler: EventHandler) {
    const handlers = this.eventHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private handleMessage(message: JuceBridgeMessage) {
    const handlers = this.eventHandlers.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => handler(message.data));
    }
  }

  init() {
    // In a real JUCE plugin, this would listen for messages from native layer
    if (typeof window !== "undefined") {
      (window as any).juceBridge = this;
      (window as any).handleJuceMessage = (messageString: string) => {
        try {
          const message = JSON.parse(messageString);
          this.handleMessage(message);
        } catch (error) {
          console.error("Failed to parse JUCE message:", error);
        }
      };
    }
  }
}

export const JuceBridge = new JuceBridgeClass();

// WebRTC connection state
let rtcConnection: RTCPeerConnection | null = null;
let dataChannel: RTCDataChannel | null = null;

/**
 * Check if WebRTC is ready for file transfer
 */
function webrtcReady(): boolean {
  // TODO: Implement proper WebRTC connection check
  return (
    typeof RTCPeerConnection !== "undefined" &&
    typeof RTCDataChannel !== "undefined"
  );
}

/**
 * Send file via WebRTC data channel
 */
async function rtcSend(file: FileMeta) {
  if (!rtcConnection) {
    // TODO: Initialize WebRTC connection with STUN servers
    // Adjust the import path based on your project structure
    const { getIceServers } = await import("../../../shared/src/rtc/stun-list");

    rtcConnection = new RTCPeerConnection({
      iceServers: getIceServers(),
    });

    // Set up data channel
    dataChannel = rtcConnection.createDataChannel("fileTransfer");

    dataChannel.onopen = () => {
      console.log("Data channel opened");
      // TODO: Implement file chunking and sending logic
      // This is a simplified example
      const reader = new FileReader();
      reader.onload = (e) => {
        if (dataChannel?.readyState === "open" && e.target?.result) {
          dataChannel.send(e.target.result as ArrayBuffer);
        }
      };
      // TODO: Get actual file object from file metadata
      // reader.readAsArrayBuffer(file);
    };

    dataChannel.onclose = () => {
      console.log("Data channel closed");
      cleanupRtc();
    };

    // TODO: Set up signaling and ICE candidate exchange
  }

  // TODO: Handle file transfer
  console.log("Sending file via WebRTC:", file);
}

/**
 * Clean up WebRTC resources
 */
function cleanupRtc() {
  if (dataChannel) {
    dataChannel.close();
    dataChannel = null;
  }
  if (rtcConnection) {
    rtcConnection.close();
    rtcConnection = null;
  }
}

/**
 * Upload file via REST API with pre-signed URL
 */
async function restPresignAndUpload(file: FileMeta) {
  try {
    // 1. Get pre-signed URL from server
    const presignResponse = await fetch("/api/files/presign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // TODO: Add authentication token if needed
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        name: file.name,
        mime: file.type || "application/octet-stream",
        size: file.size,
      }),
    });

    if (!presignResponse.ok) {
      throw new Error("Failed to get pre-signed URL");
    }

    const { putUrl } = await presignResponse.json();

    // 2. Upload file to pre-signed URL
    if (!file.data) {
      throw new Error("No file data available for upload");
    }

    const uploadResponse = await fetch(putUrl, {
      method: "PUT",
      body: file.data,
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "Content-Length": file.size.toString(),
      },
    });

    if (!uploadResponse.ok) {
      throw new Error("File upload failed");
    }

    console.log("File uploaded successfully");
  } catch (error) {
    console.error("File upload error:", error);
    throw error;
  }
}

/**
 * Send a file using the appropriate method based on file size and WebRTC availability
 * @param file File metadata including name, type, and size
 */
export function sendFile(file: FileMeta) {
  if (file.size < 300 * 1024 * 1024 && webrtcReady()) {
    rtcSend(file); // Uses STUN list for direct transfer
  } else {
    restPresignAndUpload(file); // Fallback to REST API with pre-signed URL
  }
}

// Initialize on import
JuceBridge.init();

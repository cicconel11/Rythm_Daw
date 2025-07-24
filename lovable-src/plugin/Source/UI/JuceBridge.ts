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

// Initialize on import
JuceBridge.init();

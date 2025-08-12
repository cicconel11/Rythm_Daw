export interface JuceMessage {
  type: string
  data: any
}

export class JuceBridge {
  private static messageCallback: ((message: JuceMessage) => void) | null = null

  static init() {
    // Expose bridge to global scope for JUCE to access
    ;(window as any).JuceBridge = {
      send: (type: string, data: any) => {
        this.send(type, data)
      },
      onmessage: (fn: (message: JuceMessage) => void) => {
        this.onMessage(fn)
      }
    }

    // Set up message handler for JUCE
    ;(window as any).__JUCE_ONMESSAGE__ = (message: JuceMessage) => {
      if (this.messageCallback) {
        this.messageCallback(message)
      }
    }
  }

  static send(type: string, data: any) {
    const message = JSON.stringify({ type, data })
    
    // Send to JUCE via the global function
    if ((window as any).JUCE_POST) {
      ;(window as any).JUCE_POST(message)
    } else {
      console.log('JUCE bridge not ready, message:', message)
    }
  }

  static onMessage(callback: (message: JuceMessage) => void) {
    this.messageCallback = callback
  }

  // Helper methods for common operations
  static sendParameterChange(id: string, value: number) {
    this.send('parameter-change', { id, value })
  }

  static sendPairingSubmit(deviceCode: string) {
    this.send('pairing-submit', { deviceCode })
  }

  static sendFilesDownload(id: string) {
    this.send('files-download', { id })
  }

  static sendFilesUpload(name: string, size: number, mime: string) {
    this.send('files-upload', { name, size, mime })
  }
}

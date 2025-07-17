import { Socket } from 'socket.io';

export interface QueuedMessage {
  event: string;
  payload: any;
}

export class MessageQueue {
  private queue: QueuedMessage[] = [];
  private isProcessing = false;
  private client: Socket;
  private isActive = true;

  constructor(client: Socket) {
    this.client = client;
  }

  /**
   * Add a message to the queue and start processing if not already
   */
  enqueue(event: string, payload: any): void {
    if (!this.isActive) return;

    this.queue.push({ event, payload });
    this.processQueue();
  }

  /**
   * Process messages in the queue with a small delay between each
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0 || !this.isActive) {
      return;
    }

    this.isProcessing = true;

    try {
      // Process messages with a small delay between each
      while (this.queue.length > 0 && this.isActive) {
        const { event, payload } = this.queue.shift()!;
        
        // Emit the message to the client
        this.client.emit(event, payload);
        
        // Add a small delay between messages if there are more in the queue
        if (this.queue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }
    } catch (error) {
      console.error('Error processing message queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Stop processing and clean up the queue
   */
  stop(): void {
    this.isActive = false;
    this.queue = [];
  }

  /**
   * Get the current queue size
   */
  get size(): number {
    return this.queue.length;
  }

  /**
   * Check if the queue is currently processing messages
   */
  get processing(): boolean {
    return this.isProcessing;
  }
}

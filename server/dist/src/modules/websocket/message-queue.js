"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageQueue = void 0;
class MessageQueue {
    constructor(client) {
        this.queue = [];
        this.isProcessing = false;
        this.isActive = true;
        this.client = client;
    }
    enqueue(event, payload) {
        if (!this.isActive)
            return;
        this.queue.push({ event, payload });
        this.processQueue();
    }
    async processQueue() {
        if (this.isProcessing || this.queue.length === 0 || !this.isActive) {
            return;
        }
        this.isProcessing = true;
        try {
            while (this.queue.length > 0 && this.isActive) {
                const { event, payload } = this.queue.shift();
                this.client.emit(event, payload);
                if (this.queue.length > 0) {
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
            }
        }
        catch (error) {
            console.error('Error processing message queue:', error);
        }
        finally {
            this.isProcessing = false;
        }
    }
    stop() {
        this.isActive = false;
        this.queue = [];
    }
    get size() {
        return this.queue.length;
    }
    get processing() {
        return this.isProcessing;
    }
}
exports.MessageQueue = MessageQueue;
//# sourceMappingURL=message-queue.js.map
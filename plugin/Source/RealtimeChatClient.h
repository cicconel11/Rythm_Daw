#pragma once

#include <juce_events/juce_events.h>
#include <juce_data_structures/juce_data_structures.h>
#include <juce_websockets/juce_websockets.h>
#include <nlohmann/json.hpp>
#include <functional>
#include <mutex>
#include <queue>

using json = nlohmann::json;

class RealtimeChatClient : private juce::WebSocket::Listener,
                          private juce::AsyncUpdater,
                          private juce::Timer {
public:
    // Message structure matching the server's schema
    struct Message {
        std::string roomId;
        std::string userId;
        int64_t ts = 0;
        std::string type;  // "chat" | "presence" | "inventory" | "system"
        json payload;

        std::string toJsonString() const;
        static Message fromJson(const std::string& jsonStr);
    };

    // Listener interface for message callbacks
    class Listener {
    public:
        virtual ~Listener() = default;
        virtual void onMessageReceived(const Message& message) = 0;
        virtual void onConnectionStatusChanged(bool isConnected) = 0;
        virtual void onError(const std::string& error) = 0;
    };

    RealtimeChatClient();
    ~RealtimeChatClient() override;

    // Connection management
    void connect(const std::string& authToken);
    void disconnect();
    bool isConnected() const;

    // Message sending
    void sendMessage(const Message& message);
    void joinRoom(const std::string& roomId);
    void leaveRoom(const std::string& roomId);
    void updatePresence(const std::string& status);

    // Listener management
    void addListener(Listener* listener);
    void removeListener(Listener* listener);

private:
    // WebSocket callbacks
    void connectionOpened() override;
    void connectionClosed(int status, const juce::String& reason) override;
    void connectionError(const juce::String& error) override;
    void dataReceived(const juce::MemoryBlock& data) override;

    // Async callbacks
    void handleAsyncUpdate() override;
    void timerCallback() override;

    // Thread-safe message queue
    template<typename T>
    class ThreadSafeQueue {
    public:
        void push(const T& item) {
            std::lock_guard<std::mutex> lock(mutex);
            queue.push(item);
        }

        bool pop(T& item) {
            std::lock_guard<std::mutex> lock(mutex);
            if (queue.empty()) return false;
            item = queue.front();
            queue.pop();
            return true;
        }

        bool empty() const {
            std::lock_guard<std::mutex> lock(mutex);
            return queue.empty();
        }

    private:
        std::queue<T> queue;
        mutable std::mutex mutex;
    };

    std::unique_ptr<juce::WebSocket> webSocket;
    std::vector<Listener*> listeners;
    ThreadSafeQueue<Message> incomingMessages;
    ThreadSafeQueue<std::string> outgoingMessages;
    std::mutex listenersMutex;
    bool connected = false;
    std::string authToken;
    static constexpr int RECONNECT_DELAY_MS = 5000;
    static constexpr int HEARTBEAT_INTERVAL_MS = 15000;
};

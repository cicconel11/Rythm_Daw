#include "RealtimeChatClient.h"
#include <juce_events/juce_events.h>

// Message serialization
std::string RealtimeChatClient::Message::toJsonString() const {
    json j;
    j["roomId"] = roomId;
    j["userId"] = userId;
    j["ts"] = ts;
    j["type"] = type;
    j["payload"] = payload;
    return j.dump();
}

RealtimeChatClient::Message RealtimeChatClient::Message::fromJson(const std::string& jsonStr) {
    try {
        auto j = json::parse(jsonStr);
        Message msg;
        msg.roomId = j.value("roomId", "");
        msg.userId = j.value("userId", "");
        msg.ts = j.value("ts", 0);
        msg.type = j.value("type", "");
        msg.payload = j.value("payload", json::object());
        return msg;
    } catch (const std::exception& e) {
        throw std::runtime_error("Failed to parse message: " + std::string(e.what()));
    }
}

RealtimeChatClient::RealtimeChatClient() {
    startTimer(HEARTBEAT_INTERVAL_MS);
}

RealtimeChatClient::~RealtimeChatClient() {
    disconnect();
    stopTimer();
}

void RealtimeChatClient::connect(const std::string& token) {
    if (connected) {
        return;
    }

    authToken = token;
    
    // Create WebSocket on the message thread
    juce::MessageManager::callAsync([this]() {
        webSocket = std::make_unique<juce::WebSocket>("wss://api.rhythm.app/ws/chat?token=" + authToken);
        webSocket->addListener(this);
    });
}

void RealtimeChatClient::disconnect() {
    if (webSocket) {
        webSocket->removeListener(this);
        webSocket->close();
        webSocket.reset();
    }
    connected = false;
}

bool RealtimeChatClient::isConnected() const {
    return connected && webSocket && webSocket->getState() == juce::WebSocket::connected;
}

void RealtimeChatClient::sendMessage(const Message& message) {
    if (!isConnected()) {
        // Try to reconnect if we're not connected
        if (!authToken.empty()) {
            connect(authToken);
        }
        return;
    }

    outgoingMessages.push(message.toJsonString());
    triggerAsyncUpdate();
}

void RealtimeChatClient::joinRoom(const std::string& roomId) {
    Message msg{
        .roomId = roomId,
        .userId = "",  // Will be set by the server
        .type = "system",
        .payload = {
            {"action", "join"}
        }
    };
    sendMessage(msg);
}

void RealtimeChatClient::leaveRoom(const std::string& roomId) {
    Message msg{
        .roomId = roomId,
        .userId = "",  // Will be set by the server
        .type = "system",
        .payload = {
            {"action", "leave"}
        }
    };
    sendMessage(msg);
}

void RealtimeChatClient::updatePresence(const std::string& status) {
    Message msg{
        .type = "presence",
        .payload = {
            {"status", status}
        }
    };
    sendMessage(msg);
}

void RealtimeChatClient::addListener(Listener* listener) {
    std::lock_guard<std::mutex> lock(listenersMutex);
    listeners.push_back(listener);
}

void RealtimeChatClient::removeListener(Listener* listener) {
    std::lock_guard<std::mutex> lock(listenersMutex);
    listeners.erase(
        std::remove(listeners.begin(), listeners.end(), listener),
        listeners.end()
    );
}

// WebSocket callbacks
void RealtimeChatClient::connectionOpened() {
    connected = true;
    
    juce::MessageManager::callAsync([this]() {
        std::lock_guard<std::mutex> lock(listenersMutex);
        for (auto* listener : listeners) {
            listener->onConnectionStatusChanged(true);
        }
    });
    
    // Send initial presence
    updatePresence("online");
}

void RealtimeChatClient::connectionClosed(int status, const juce::String& reason) {
    connected = false;
    
    juce::MessageManager::callAsync([this]() {
        std::lock_guard<std::mutex> lock(listenersMutex);
        for (auto* listener : listeners) {
            listener->onConnectionStatusChanged(false);
        }
    });
    
    // Try to reconnect
    if (!authToken.empty()) {
        juce::Timer::callAfterDelay(RECONNECT_DELAY_MS, [this]() {
            connect(authToken);
        });
    }
}

void RealtimeChatClient::connectionError(const juce::String& error) {
    juce::Logger::writeToLog("WebSocket error: " + error);
    
    juce::MessageManager::callAsync([this, error]() {
        std::lock_guard<std::mutex> lock(listenersMutex);
        for (auto* listener : listeners) {
            listener->onError(error.toStdString());
        }
    });
}

void RealtimeChatClient::dataReceived(const juce::MemoryBlock& data) {
    try {
        std::string messageStr(data.getData(), data.getSize());
        auto message = Message::fromJson(messageStr);
        incomingMessages.push(std::move(message));
        triggerAsyncUpdate();
    } catch (const std::exception& e) {
        juce::Logger::writeToLog("Failed to parse incoming message: " + juce::String(e.what()));
    }
}

// Async callbacks
void RealtimeChatClient::handleAsyncUpdate() {
    // Process incoming messages on the message thread
    Message msg;
    while (incomingMessages.pop(msg)) {
        std::lock_guard<std::mutex> lock(listenersMutex);
        for (auto* listener : listeners) {
            listener->onMessageReceived(msg);
        }
    }
    
    // Process outgoing messages
    std::string outMsg;
    while (outgoingMessages.pop(outMsg)) {
        if (webSocket && webSocket->getState() == juce::WebSocket::connected) {
            webSocket->send(outMsg);
        }
    }
}

// Heartbeat timer
void RealtimeChatClient::timerCallback() {
    if (isConnected()) {
        // Send ping to keep connection alive
        if (webSocket) {
            webSocket->send("\n");
        }
    } else if (!authToken.empty()) {
        // Try to reconnect if we're not connected
        connect(authToken);
    }
}

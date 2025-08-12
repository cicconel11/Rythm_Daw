#pragma once

#include <juce_core/juce_core.h>
#include <juce_data_structures/juce_data_structures.h>
#include <functional>
#include <memory>

class BridgeClient : public juce::Timer
{
public:
    BridgeClient();
    ~BridgeClient() override;
    
    // Connection management
    void connect(const juce::String& url = "ws://localhost:3001/ws/plugin");
    void disconnect();
    bool isConnected() const;
    
    // Message sending
    void sendPluginLoaded();
    void sendPluginUnloaded();
    void sendParameterChanged(const juce::String& parameterId, float value);
    
    // Callbacks
    using MessageCallback = std::function<void(const juce::String& message)>;
    void setMessageCallback(MessageCallback callback);
    
    // Timer callback for connection management
    void timerCallback() override;
    
private:
    class Impl;
    std::unique_ptr<Impl> pImpl;
    
    MessageCallback messageCallback;
    bool connected = false;
    juce::String serverUrl;
    
    // Connection retry logic
    static constexpr int reconnectIntervalMs = 5000;
    int reconnectAttempts = 0;
    static constexpr int maxReconnectAttempts = 10;
    
    void attemptReconnect();
    void sendMessage(const juce::String& message);
    
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(BridgeClient)
};

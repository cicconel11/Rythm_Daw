#include "BridgeClient.h"
#include <juce_core/juce_core.h>
#include <juce_data_structures/juce_data_structures.h>

// Simple implementation using JUCE's URL class for now
// In a full implementation, you'd use a proper WebSocket library
class BridgeClient::Impl
{
public:
    Impl() = default;
    ~Impl() = default;
    
    bool connect(const juce::String& url)
    {
        // For now, just simulate connection
        // In a real implementation, you'd establish WebSocket connection
        return true;
    }
    
    void disconnect()
    {
        // Simulate disconnection
    }
    
    bool isConnected() const
    {
        return connected;
    }
    
    void sendMessage(const juce::String& message)
    {
        if (connected)
        {
            // In a real implementation, send via WebSocket
            juce::Logger::writeToLog("Bridge: " + message);
        }
    }
    
private:
    bool connected = false;
};

//==============================================================================
BridgeClient::BridgeClient()
    : pImpl(std::make_unique<Impl>())
{
    startTimer(1000); // Check connection every second
}

BridgeClient::~BridgeClient()
{
    stopTimer();
    disconnect();
}

void BridgeClient::connect(const juce::String& url)
{
    serverUrl = url;
    connected = pImpl->connect(url);
    
    if (connected)
    {
        reconnectAttempts = 0;
        sendPluginLoaded();
    }
}

void BridgeClient::disconnect()
{
    if (connected)
    {
        sendPluginUnloaded();
        connected = false;
        pImpl->disconnect();
    }
}

bool BridgeClient::isConnected() const
{
    return connected && pImpl->isConnected();
}

void BridgeClient::sendPluginLoaded()
{
    juce::var message = juce::var(new juce::DynamicObject());
    message.getDynamicObject()->setProperty("type", "plugin-loaded");
    message.getDynamicObject()->setProperty("timestamp", juce::Time::getCurrentTime().toMilliseconds());
    
    sendMessage(message.toString());
}

void BridgeClient::sendPluginUnloaded()
{
    juce::var message = juce::var(new juce::DynamicObject());
    message.getDynamicObject()->setProperty("type", "plugin-unloaded");
    message.getDynamicObject()->setProperty("timestamp", juce::Time::getCurrentTime().toMilliseconds());
    
    sendMessage(message.toString());
}

void BridgeClient::sendParameterChanged(const juce::String& parameterId, float value)
{
    juce::var message = juce::var(new juce::DynamicObject());
    message.getDynamicObject()->setProperty("type", "parameter-changed");
    message.getDynamicObject()->setProperty("parameterId", parameterId);
    message.getDynamicObject()->setProperty("value", value);
    message.getDynamicObject()->setProperty("timestamp", juce::Time::getCurrentTime().toMilliseconds());
    
    sendMessage(message.toString());
}

void BridgeClient::setMessageCallback(MessageCallback callback)
{
    messageCallback = callback;
}

void BridgeClient::timerCallback()
{
    // Check connection status and attempt reconnect if needed
    if (!isConnected() && reconnectAttempts < maxReconnectAttempts)
    {
        attemptReconnect();
    }
}

void BridgeClient::attemptReconnect()
{
    reconnectAttempts++;
    juce::Logger::writeToLog("Bridge: Attempting reconnect " + juce::String(reconnectAttempts));
    
    // In a real implementation, you'd attempt to reconnect here
    // For now, just simulate
    if (reconnectAttempts >= maxReconnectAttempts)
    {
        juce::Logger::writeToLog("Bridge: Max reconnect attempts reached");
    }
}

void BridgeClient::sendMessage(const juce::String& message)
{
    pImpl->sendMessage(message);
    
    if (messageCallback)
    {
        messageCallback(message);
    }
}

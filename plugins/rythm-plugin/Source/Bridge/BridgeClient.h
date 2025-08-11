#pragma once

#include <juce_core/juce_core.h>
#include <thread>
#include <atomic>
#include <queue>
#include <mutex>

class BridgeClient : public juce::Timer
{
public:
    BridgeClient();
    ~BridgeClient() override;

    void start();
    void stop();
    bool isConnected() const { return connected.load(); }

    // Send messages to web app
    void sendPluginLoaded();
    void sendParameterChanged(const juce::String& parameterId, float value);
    void sendPluginUnloaded();

    // Callback for received commands
    std::function<void(const juce::String& command, const juce::var& data)> onCommandReceived;

private:
    std::atomic<bool> connected{false};
    std::atomic<bool> shouldStop{false};
    std::thread websocketThread;
    
    std::queue<juce::String> sendQueue;
    std::mutex sendQueueMutex;

    void timerCallback() override;
    void websocketLoop();
    void sendMessage(const juce::String& message);
    void processIncomingMessage(const juce::String& message);

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(BridgeClient)
};

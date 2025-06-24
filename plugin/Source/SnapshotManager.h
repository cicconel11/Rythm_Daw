#pragma once

#include <JuceHeader.h>
#include <functional>
#include <memory>
#include <mutex>
#include <atomic>

class SnapshotManager : private juce::Timer,
                       private juce::AsyncUpdater,
                       private juce::ChangeListener {
public:
    struct Snapshot {
        juce::String id;
        juce::String name;
        juce::String description;
        juce::Time createdAt;
        juce::String projectId;
        juce::String downloadUrl;
    };

    struct Listener {
        virtual ~Listener() = default;
        virtual void snapshotCreated(const Snapshot& snapshot) {}
        virtual void snapshotError(const juce::String& error) {}
        virtual void snapshotProgress(float progress) {}
    };

    SnapshotManager();
    ~SnapshotManager() override;

    // Project state management
    void setProjectId(const juce::String& projectId);
    void setAuthToken(const juce::String& authToken);
    void setApiBaseUrl(const juce::String& url);
    
    // Snapshot operations
    void takeSnapshot(const juce::String& name = "", const juce::String& description = "");
    void loadSnapshot(const juce::String& snapshotId);
    juce::Array<Snapshot> getSnapshots() const;
    
    // State serialization (to be implemented by plugin)
    using StateSerializer = std::function<juce::var()>;
    using StateDeserializer = std::function<void(const juce::var& state)>;
    
    void setStateSerializer(StateSerializer serializer) { stateSerializer = std::move(serializer); }
    void setStateDeserializer(StateDeserializer deserializer) { stateDeserializer = std::move(deserializer); }
    
    // Auto-save
    void setAutoSaveEnabled(bool enabled);
    void resetInactivityTimer();
    
    // Listeners
    void addListener(Listener* listener);
    void removeListener(Listener* listener);

private:
    // Timer callbacks
    void timerCallback() override;
    void handleAsyncUpdate() override;
    void changeListenerCallback(juce::ChangeBroadcaster* source) override;
    
    // Network operations
    void sendSnapshotToServer(const juce::String& name, const juce::String& description, const juce::MemoryBlock& projectData);
    void fetchSnapshots();
    
    // State
    juce::String projectId;
    juce::String authToken;
    juce::String apiBaseUrl = "https://api.rhythm.app";
    
    std::atomic_bool isUploading{false};
    std::atomic<float> uploadProgress{0.0f};
    
    juce::Time lastActivityTime;
    std::atomic_bool autoSaveEnabled{true};
    static constexpr int autoSaveIntervalMs = 1000 * 60 * 5; // 5 minutes
    
    // Callbacks
    StateSerializer stateSerializer;
    StateDeserializer stateDeserializer;
    
    juce::ListenerList<Listener> listeners;
    juce::CriticalSection listenerLock;
    
    // Thread safety
    std::mutex stateMutex;
    juce::Array<Snapshot> snapshots;
    
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(SnapshotManager)
};

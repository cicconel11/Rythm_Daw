#pragma once

#include <string>
#include <vector>
#include <functional>
#include <memory>
#include <mutex>
#include <queue>
#include <atomic>
#include <rtc/rtc.hpp>
#include <juce_events/juce_events.h>

class FileShareClient : private juce::Thread {
public:
    // Progress callback: bytesSent, totalBytes, progress (0.0-1.0)
    using ProgressCallback = std::function<void(int64_t, int64_t, float)>;
    
    // State change callback: newState, message
    using StateChangeCallback = std::function<void(const std::string&, const std::string&)>;
    
    // File transfer result
    enum class TransferResult {
        Success,
        Cancelled,
        ConnectionError,
        DataError,
        Timeout
    };
    
    // File metadata
    struct FileInfo {
        std::string name;
        std::string mimeType;
        int64_t size = 0;
        std::string sha256; // SHA-256 hash of file contents
    };
    
    // Chunk header (64 bytes total)
    #pragma pack(push, 1)
    struct ChunkHeader {
        uint64_t sequence = 0;     // 8 bytes
        uint64_t totalSize = 0;    // 8 bytes
        uint32_t chunkSize = 0;    // 4 bytes
        uint32_t totalChunks = 0;  // 4 bytes
        char sha256[32]{};         // 32 bytes (binary)
        uint8_t flags = 0;         // 1 byte (bit 0: isLastChunk)
        uint8_t reserved[7]{};     // 7 bytes padding
    };
    #pragma pack(pop)
    
    static_assert(sizeof(ChunkHeader) == 64, "ChunkHeader must be 64 bytes");
    
    // Configuration
    struct Config {
        std::string signalingServerUrl = "wss://api.rhythm.app/ws/signal";
        int maxChunkSize = 64 * 1024; // 64 KiB
        int connectionTimeoutMs = 30000;
        int maxRetryAttempts = 3;
    };
    
    // Constructor/Destructor
    FileShareClient();
    ~FileShareClient() override;
    
    // Setup and connection
    bool initialize(const std::string& authToken);
    void shutdown();
    
    // File transfer
    bool sendFile(const std::string& filePath, const std::string& peerId, const std::string& projectId);
    void cancelTransfer();
    
    // Callbacks
    void setProgressCallback(ProgressCallback cb) { progressCallback = std::move(cb); }
    void setStateChangeCallback(StateChangeCallback cb) { stateChangeCallback = std::move(cb); }
    
    // State
    bool isConnected() const { return state == State::Connected; }
    bool isTransferring() const { return state == State::Sending || state == State::Receiving; }
    
private:
    enum class State {
        Disconnected,
        Connecting,
        Connected,
        Sending,
        Receiving,
        Error
    };
    
    // Thread overrides
    void run() override;
    
    // WebRTC callbacks
    void onDataChannel(std::shared_ptr<rtc::DataChannel> dc);
    void onTrack(std::shared_ptr<rtc::Track> track);
    void onLocalDescription(rtc::Description description);
    void onLocalCandidate(rtc::Candidate candidate);
    void onStateChange(rtc::PeerConnection::State state);
    void onGatheringStateChange(rtc::PeerConnection::GatheringState state);
    
    // File operations
    bool prepareFileForSending(const std::string& filePath, FileInfo& outInfo);
    void sendNextChunk();
    void processReceivedChunk(const uint8_t* data, size_t size);
    
    // Helpers
    void changeState(State newState, const std::string& message = "");
    void reportError(const std::string& message);
    
    // Members
    std::unique_ptr<rtc::PeerConnection> peerConnection;
    std::shared_ptr<rtc::DataChannel> dataChannel;
    std::unique_ptr<rtc::WebSocket> signalingSocket;
    
    Config config;
    std::string authToken;
    std::string peerId;
    std::string projectId;
    
    std::atomic<State> state{State::Disconnected};
    std::atomic<bool> shouldStop{false};
    std::atomic<bool> transferCancelled{false};
    
    // File transfer state
    struct TransferState {
        FileInfo fileInfo;
        std::ifstream fileStream;
        uint64_t bytesSent = 0;
        uint32_t chunksSent = 0;
        std::vector<uint8_t> sendBuffer;
        std::mutex mutex;
    };
    
    std::unique_ptr<TransferState> transferState;
    
    // Callbacks
    ProgressCallback progressCallback;
    StateChangeCallback stateChangeCallback;
    
    // Thread safety
    std::mutex mutex;
    std::condition_variable cv;
    
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(FileShareClient)
};

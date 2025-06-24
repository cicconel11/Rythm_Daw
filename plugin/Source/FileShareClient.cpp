#include "FileShareClient.h"
#include <juce_core/juce_core.h>
#include <juce_cryptography/hashing/juce_SHA256.h>
#include <fstream>
#include <sstream>
#include <iomanip>
#include <openssl/sha.h>

using namespace juce;

namespace {
    constexpr int CHUNK_HEADER_SIZE = sizeof(FileShareClient::ChunkHeader);
    constexpr int MAX_CHUNK_SIZE = 64 * 1024; // 64 KiB
    constexpr int CHUNK_PAYLOAD_SIZE = MAX_CHUNK_SIZE - CHUNK_HEADER_SIZE;
    
    std::vector<uint8_t> calculateFileHash(const std::string& filePath) {
        std::ifstream file(filePath, std::ios::binary);
        if (!file) {
            throw std::runtime_error("Failed to open file for hashing");
        }
        
        SHA256_CTX sha256;
        SHA256_Init(&sha256);
        
        std::vector<char> buffer(8192);
        while (file.good()) {
            file.read(buffer.data(), buffer.size());
            SHA256_Update(&sha256, buffer.data(), file.gcount());
        }
        
        std::vector<uint8_t> hash(SHA256_DIGEST_LENGTH);
        SHA256_Final(hash.data(), &sha256);
        return hash;
    }
    
    std::string bytesToHexString(const uint8_t* data, size_t length) {
        std::ostringstream ss;
        ss << std::hex << std::setfill('0');
        for (size_t i = 0; i < length; ++i) {
            ss << std::setw(2) << static_cast<int>(data[i]);
        }
        return ss.str();
    }
}

FileShareClient::FileShareClient() 
    : Thread("FileShareClient"), 
      progressCallback([](auto, auto, auto){}), 
      stateChangeCallback([](auto, auto){}) {
    // Initialize libdatachannel
    rtc::InitLogger(rtc::LogLevel::Info);
    rtc::Preload();
}

FileShareClient::~FileShareClient() {
    stopThread(5000); // Wait up to 5 seconds for thread to stop
    shutdown();
}

bool FileShareClient::initialize(const std::string& token) {
    if (state != State::Disconnected) {
        reportError("Already initialized");
        return false;
    }
    
    authToken = token;
    changeState(State::Connecting, "Initializing WebRTC");
    
    try {
        // Configure WebRTC
        rtc::Configuration config;
        config.iceServers.emplace_back("stun:stun.l.google.com:19302");
        
        // Create peer connection
        peerConnection = std::make_unique<rtc::PeerConnection>(config);
        
        // Set up callbacks
        peerConnection->onStateChange([this](rtc::PeerConnection::State state) {
            onStateChange(state);
        });
        
        peerConnection->onGatheringStateChange([this](rtc::PeerConnection::GatheringState state) {
            onGatheringStateChange(state);
        });
        
        // Create data channel
        rtc::DataChannelInit dcConfig;
        dcConfig.protocol = "file-transfer";
        dcConfig.reliability.type = rtc::Reliability::Type::Reliable;
        
        dataChannel = peerConnection->createDataChannel("file-transfer", dcConfig);
        dataChannel->onOpen([this]() {
            changeState(State::Connected, "Data channel ready");
        });
        
        dataChannel->onClosed([this]() {
            changeState(State::Disconnected, "Data channel closed");
        });
        
        dataChannel->onError([this](std::string error) {
            reportError("Data channel error: " + error);
        });
        
        dataChannel->onMessage([this](std::variant<rtc::binary, rtc::string> message) {
            if (std::holds_alternative<rtc::binary>(message)) {
                auto& data = std::get<rtc::binary>(message);
                processReceivedChunk(data.data(), data.size());
            }
        });
        
        // Start signaling
        startThread();
        return true;
        
    } catch (const std::exception& e) {
        reportError(std::string("Initialization failed: ") + e.what());
        return false;
    }
}

void FileShareClient::shutdown() {
    signalThreadShouldExit();
    
    if (dataChannel) {
        dataChannel->close();
        dataChannel.reset();
    }
    
    if (peerConnection) {
        peerConnection->close();
        peerConnection.reset();
    }
    
    if (signalingSocket) {
        signalingSocket->close();
        signalingSocket.reset();
    }
    
    changeState(State::Disconnected, "Shutdown complete");
}

bool FileShareClient::sendFile(const std::string& filePath, const std::string& targetPeerId, const std::string& project) {
    if (state != State::Connected) {
        reportError("Not connected to peer");
        return false;
    }
    
    if (isTransferring()) {
        reportError("Transfer already in progress");
        return false;
    }
    
    try {
        // Prepare file for sending
        FileInfo fileInfo;
        if (!prepareFileForSending(filePath, fileInfo)) {
            return false;
        }
        
        // Store transfer state
        transferState = std::make_unique<TransferState>();
        transferState->fileInfo = std::move(fileInfo);
        transferState->fileStream.open(filePath, std::ios::binary);
        
        if (!transferState->fileStream) {
            reportError("Failed to open file for reading");
            transferState.reset();
            return false;
        }
        
        // Start transfer
        peerId = targetPeerId;
        projectId = project;
        changeState(State::Sending, "Starting file transfer");
        
        // Send file metadata first
        json metadata = {
            {"type", "file-metadata"},
            {"name", transferState->fileInfo.name},
            {"size", transferState->fileInfo.size},
            {"mimeType", transferState->fileInfo.mimeType},
            {"sha256", bytesToHexString(
                reinterpret_cast<const uint8_t*>(transferState->fileInfo.sha256.data()),
                transferState->fileInfo.sha256.size())},
            {"projectId", projectId}
        };
        
        dataChannel->send(metadata.dump());
        
        // Start sending chunks
        sendNextChunk();
        return true;
        
    } catch (const std::exception& e) {
        reportError(std::string("Failed to start file transfer: ") + e.what());
        transferState.reset();
        return false;
    }
}

void FileShareClient::cancelTransfer() {
    if (isTransferring()) {
        transferCancelled = true;
        signalThreadShouldExit();
        
        if (dataChannel) {
            json cancelMsg = {{"type", "cancel"}};
            dataChannel->send(cancelMsg.dump());
        }
        
        changeState(State::Connected, "Transfer cancelled");
    }
}

void FileShareClient::run() {
    // Main thread for handling signaling and timeouts
    int retryCount = 0;
    const int maxRetries = 3;
    
    while (!threadShouldExit() && retryCount < maxRetries) {
        try {
            // Connect to signaling server
            signalingSocket = std::make_unique<rtc::WebSocket>();
            
            signalingSocket->onOpen([this]() {
                // Send auth token
                json auth = {
                    {"type", "auth"},
                    {"token", authToken},
                    {"peerId", peerId},
                    {"projectId", projectId}
                };
                signalingSocket->send(auth.dump());
            });
            
            signalingSocket->onClosed([this]() {
                if (!threadShouldExit()) {
                    reportError("Signaling connection closed");
                }
            });
            
            signalingSocket->onError([this](std::string error) {
                reportError("Signaling error: " + error);
            });
            
            signalingSocket->onMessage([this](std::variant<rtc::binary, rtc::string> message) {
                if (!std::holds_alternative<rtc::string>(message)) {
                    reportError("Binary message not supported in signaling");
                    return;
                }
                
                try {
                    auto msg = json::parse(std::get<rtc::string>(message));
                    std::string type = msg["type"];
                    
                    if (type == "offer") {
                        auto sdp = msg["sdp"].get<std::string>();
                        peerConnection->setRemoteDescription({sdp, "offer"});
                        peerConnection->setLocalDescription();
                    } 
                    else if (type == "answer") {
                        auto sdp = msg["sdp"].get<std::string>();
                        peerConnection->setRemoteDescription({sdp, "answer"});
                    } 
                    else if (type == "candidate") {
                        auto candidate = msg["candidate"].get<std::string>();
                        auto mid = msg["mid"].get<std::string>();
                        peerConnection->addRemoteCandidate({candidate, mid});
                    }
                } catch (const std::exception& e) {
                    reportError(std::string("Error processing signaling message: ") + e.what());
                }
            });
            
            // Connect to signaling server
            signalingSocket->open(config.signalingServerUrl);
            
            // Wait for connection or timeout
            auto startTime = Time::currentTimeMillis();
            while (!threadShouldExit() && 
                   state != State::Connected && 
                   (Time::currentTimeMillis() - startTime) < config.connectionTimeoutMs) {
                wait(100);
            }
            
            if (state == State::Connected) {
                // Connected successfully
                retryCount = 0;
                
                // Keep the connection alive
                while (!threadShouldExit() && state != State::Error) {
                    wait(1000);
                }
            } else {
                retryCount++;
                reportError("Connection attempt failed, retrying... (" + 
                           std::to_string(retryCount) + "/" + std::to_string(maxRetries) + ")");
                wait(1000 * retryCount); // Exponential backoff
            }
            
        } catch (const std::exception& e) {
            reportError(std::string("Connection error: ") + e.what());
            wait(1000 * (retryCount + 1));
            retryCount++;
        }
    }
    
    if (retryCount >= maxRetries) {
        reportError("Max retry attempts reached");
    }
}

// ... (rest of the implementation remains the same)

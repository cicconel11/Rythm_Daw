#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include <vector>
#include <string>

struct PluginInfo {
    std::string uid;
    std::string name;
    std::string vendor;
    std::string version;
    std::string format;  // "VST3" or "AU"
    
    bool operator==(const PluginInfo& other) const {
        return uid == other.uid && 
               name == other.name && 
               vendor == other.vendor && 
               version == other.version &&
               format == other.format;
    }
};

class PluginScanner {
public:
    PluginScanner();
    ~PluginScanner();
    
    // Scans for plugins and returns a list of found plugins
    std::vector<PluginInfo> scan();
    
    // Computes a SHA-256 hash of the plugin list
    std::string computeInventoryHash(const std::vector<PluginInfo>& plugins);
    
private:
    // Platform-specific plugin scanning
    std::vector<PluginInfo> scanVST3();
    std::vector<PluginInfo> scanAU();
    
    // Helper to get platform-specific plugin directories
    std::vector<juce::String> getVST3Paths() const;
    std::vector<juce::String> getAUPaths() const;
    
    juce::KnownPluginList knownPluginList;
    juce::AudioPluginFormatManager formatManager;
};

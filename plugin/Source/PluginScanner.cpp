#include "PluginScanner.h"
#include <juce_core/juce_core.h>
#include <juce_cryptography/hashing/juce_MD5.h>

PluginScanner::PluginScanner() {
    formatManager.addDefaultFormats();
}

PluginScanner::~PluginScanner() {}

std::vector<PluginInfo> PluginScanner::scan() {
    std::vector<PluginInfo> results;
    
    // Scan for VST3 plugins
    auto vst3Plugins = scanVST3();
    results.insert(results.end(), vst3Plugins.begin(), vst3Plugins.end());
    
    // On macOS, scan for AU plugins
#if JUCE_MAC
    auto auPlugins = scanAU();
    results.insert(results.end(), auPlugins.begin(), auPlugins.end());
#endif
    
    return results;
}

std::string PluginScanner::computeInventoryHash(const std::vector<PluginInfo>& plugins) {
    juce::MD5 md5;
    
    for (const auto& plugin : plugins) {
        md5.update(plugin.uid);
        md5.update(":");
        md5.update(plugin.name);
        md5.update(":");
        md5.update(plugin.vendor);
        md5.update(":");
        md5.update(plugin.version);
        md5.update(":");
        md5.update(plugin.format);
        md5.update(";");
    }
    
    return md5.toString().toStdString();
}

std::vector<PluginInfo> PluginScanner::scanVST3() {
    std::vector<PluginInfo> results;
    juce::StringArray paths = getVST3Paths();
    
    for (const auto& path : paths) {
        juce::File dir(path);
        if (!dir.exists() || !dir.isDirectory())
            continue;
            
        juce::Array<juce::File> vst3Files;
        dir.findChildFiles(vst3Files, juce::File::findFiles, false, "*.vst3");
        
        for (const auto& file : vst3Files) {
            juce::PluginDescription desc;
            desc.fileOrIdentifier = file.getFullPathName();
            desc.pluginFormatName = "VST3";
            
            // Skip if already in our list
            if (knownPluginList.getTypeForFile(file) != nullptr)
                continue;
                
            // Try to create the plugin to get its info
            std::unique_ptr<juce::AudioPluginInstance> instance;
            String errorMessage;
            
            if (auto* format = formatManager.findFormatForFileExtension("vst3")) {
                instance.reset(format->createInstanceFromDescription(desc, 44100.0, 512, errorMessage));
                
                if (instance) {
                    PluginInfo info;
                    info.uid = instance->getPluginDescription().uniqueId;
                    info.name = instance->getPluginDescription().name.toStdString();
                    info.vendor = instance->getPluginDescription().manufacturerName.toStdString();
                    info.version = instance->getPluginDescription().version.toStdString();
                    info.format = "VST3";
                    
                    // Clean up the vendor string
                    if (info.vendor.isEmpty() && info.name.contains(" "))
                        info.vendor = info.name.upToFirstOccurrenceOf(" ", false, false).toStdString();
                    
                    results.push_back(info);
                }
            }
        }
    }
    
    return results;
}

std::vector<PluginInfo> PluginScanner::scanAU() {
    std::vector<PluginInfo> results;
    
#if JUCE_MAC
    juce::StringArray paths = getAUPaths();
    
    for (const auto& path : paths) {
        juce::File dir(path);
        if (!dir.exists() || !dir.isDirectory())
            continue;
            
        juce::Array<juce::File> componentFiles;
        dir.findChildFiles(componentFiles, juce::File::findDirectories, false, "*.component");
        
        for (const auto& file : componentFiles) {
            juce::PluginDescription desc;
            desc.fileOrIdentifier = file.getFullPathName();
            desc.pluginFormatName = "AudioUnit";
            
            // Skip if already in our list
            if (knownPluginList.getTypeForFile(file) != nullptr)
                continue;
                
            // Try to create the plugin to get its info
            std::unique_ptr<juce::AudioPluginInstance> instance;
            String errorMessage;
            
            if (auto* format = formatManager.findFormatForFileExtension("component")) {
                instance.reset(format->createInstanceFromDescription(desc, 44100.0, 512, errorMessage));
                
                if (instance) {
                    PluginInfo info;
                    info.uid = instance->getPluginDescription().uniqueId;
                    info.name = instance->getPluginDescription().name.toStdString();
                    info.vendor = instance->getPluginDescription().manufacturerName.toStdString();
                    info.version = instance->getPluginDescription().version.toStdString();
                    info.format = "AU";
                    
                    // Clean up the vendor string
                    if (info.vendor.isEmpty() && info.name.contains(" "))
                        info.vendor = info.name.upToFirstOccurrenceOf(" ", false, false).toStdString();
                    
                    results.push_back(info);
                }
            }
        }
    }
#endif
    
    return results;
}

std::vector<juce::String> PluginScanner::getVST3Paths() const {
    std::vector<juce::String> paths;
    
    // Standard VST3 paths
#if JUCE_MAC
    paths.push_back("/Library/Audio/Plug-Ins/VST3");
    paths.push_back(juce::File::getSpecialLocation(juce::File::userHomeDirectory)
        .getChildFile("Library/Audio/Plug-Ins/VST3").getFullPathName());
#elif JUCE_WINDOWS
    paths.push_back("C:\\Program Files\\Common Files\\VST3");
    paths.push_back("C:\\Program Files\\VST3");
    paths.push_back(juce::File::getSpecialLocation(juce::File::userHomeDirectory)
        .getChildFile("AppData/Local/Programs/Common/VST3").getFullPathName());
#endif
    
    // Add any paths from environment variables
    if (juce::CharPointer_UTF8 vstPath = ::getenv("VST3_PATH"))
        paths.push_back(juce::String(vstPath));
    
    return paths;
}

std::vector<juce::String> PluginScanner::getAUPaths() const {
    std::vector<juce::String> paths;
    
#if JUCE_MAC
    // Standard AU paths on macOS
    paths.push_back("/Library/Audio/Plug-Ins/Components");
    paths.push_back(juce::File::getSpecialLocation(juce::File::userHomeDirectory)
        .getChildFile("Library/Audio/Plug-Ins/Components").getFullPathName());
#endif
    
    return paths;
}

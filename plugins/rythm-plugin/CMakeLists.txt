cmake_minimum_required(VERSION 3.22)

project(RythmPlugin VERSION 1.0.0)

# Add JUCE as a subdirectory with explicit binary directory
add_subdirectory(../../third_party/JUCE JUCE)

# Create the RHYTHM plugin
juce_add_plugin(RythmPlugin
    COMPANY_NAME "RHYTHM"
    PLUGIN_MANUFACTURER_CODE Rytm
    PLUGIN_CODE Rytm
    FORMATS AU VST3
    PRODUCT_NAME "RythmPlugin"
)

# Add source files
target_sources(RythmPlugin
    PRIVATE
        Source/PluginProcessor.cpp
        Source/PluginProcessor.h
        Source/PluginEditor.cpp
        Source/PluginEditor.h
        Source/Bridge/BridgeClient.cpp
        Source/Bridge/BridgeClient.h
)

# Set compile definitions
target_compile_definitions(RythmPlugin
    PUBLIC
        JUCE_WEB_BROWSER=0
        JUCE_USE_CURL=0
        JUCE_VST3_CAN_REPLACE_VST2=0
)

# Link JUCE modules
target_link_libraries(RythmPlugin
    PRIVATE
        juce::juce_audio_utils
        juce::juce_dsp
    PUBLIC
        juce::juce_recommended_config_flags
        juce::juce_recommended_lto_flags
        juce::juce_recommended_warning_flags
)

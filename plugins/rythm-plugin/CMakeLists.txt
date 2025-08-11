cmake_minimum_required(VERSION 3.20)

# Add JUCE as a subdirectory
add_subdirectory(${CMAKE_SOURCE_DIR}/third_party/JUCE)

# Find JUCE packages
find_package(JUCE REQUIRED)

# Create the RHYTHM plugin
juce_add_plugin(RythmPlugin
    COMPANY_NAME "RHYTHM"
    BUNDLE_ID "com.rythm.audio.RythmPlugin"
    PRODUCT_NAME "RythmPlugin"
    IS_SYNTH FALSE
    NEEDS_MIDI_INPUT FALSE
    NEEDS_MIDI_OUTPUT FALSE
    IS_MIDI_EFFECT FALSE
    COPY_PLUGIN_AFTER_BUILD FALSE
    PLUGIN_MANUFACTURER_CODE Rytm
    PLUGIN_CODE Rytm
    FORMATS AU VST3
    VST3_CATEGORIES "Fx"
    AU_MAIN_TYPE "aufx"
    AU_EXPORT_PREFIX "Rythm"
    SOURCES
        Source/PluginProcessor.cpp
        Source/PluginProcessor.h
        Source/PluginEditor.cpp
        Source/PluginEditor.h
        Source/UI/Sidebar.cpp
        Source/UI/Sidebar.h
        Source/UI/SectionView.cpp
        Source/UI/SectionView.h
        Source/Bridge/BridgeClient.cpp
        Source/Bridge/BridgeClient.h
        Source/Bridge/Json.cpp
        Source/Bridge/Json.h
        Source/DSP/Meters.cpp
        Source/DSP/Meters.h
)

# Set target properties for universal binary
set_target_properties(RythmPlugin PROPERTIES
    CMAKE_OSX_ARCHITECTURES "arm64;x86_64"
    MACOSX_BUNDLE_GUI_IDENTIFIER "com.rythm.audio.RythmPlugin"
)

# Set C++20 standard
target_compile_features(RythmPlugin PRIVATE cxx_std_20)

# Configure the Info.plist for Audio Unit
configure_file(Resources/Info-AU.plist.in ${CMAKE_CURRENT_BINARY_DIR}/Info.plist)

# Link JUCE modules
target_link_libraries(RythmPlugin
    juce::juce_audio_basics
    juce::juce_audio_devices
    juce::juce_audio_formats
    juce::juce_audio_plugin_client
    juce::juce_audio_processors
    juce::juce_audio_utils
    juce::juce_core
    juce::juce_data_structures
    juce::juce_events
    juce::juce_graphics
    juce::juce_gui_basics
    juce::juce_gui_extra
)

# Set compile definitions
target_compile_definitions(RythmPlugin PRIVATE
    JUCE_DISPLAY_SPLASH_SCREEN=0
    JUCE_REPORT_APP_USAGE=0
    JUCE_STRICT_REFCOUNTEDPTR=1
    JUCE_USE_CURL=0
    JUCE_WEB_BROWSER=0
    JUCE_USE_MP3AUDIOFORMAT=0
    JUCE_USE_OGGVORBIS=0
    JUCE_USE_FLAC=0
    JUCE_USE_LAME_AUDIO_FORMAT=0
    JUCE_USE_WINDOWS_MEDIA_FORMAT=0
)

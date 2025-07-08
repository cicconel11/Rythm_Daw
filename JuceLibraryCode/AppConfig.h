// This file is part of the JUCE library.
// Copyright (c) 2022 - Raw Material Software Limited

#ifndef JUCE_APP_CONFIG_H_INCLUDED
#define JUCE_APP_CONFIG_H_INCLUDED

// Project-specific definitions
#define JUCE_MODULE_AVAILABLE_juce_audio_basics         1
#define JUCE_MODULE_AVAILABLE_juce_audio_devices        1
#define JUCE_MODULE_AVAILABLE_juce_audio_formats        1
#define JUCE_MODULE_AVAILABLE_juce_audio_plugin_client  1
#define JUCE_MODULE_AVAILABLE_juce_audio_processors     1
#define JUCE_MODULE_AVAILABLE_juce_audio_utils          1
#define JUCE_MODULE_AVAILABLE_juce_core                 1
#define JUCE_MODULE_AVAILABLE_juce_data_structures      1
#define JUCE_MODULE_AVAILABLE_juce_events               1
#define JUCE_MODULE_AVAILABLE_juce_graphics             1
#define JUCE_MODULE_AVAILABLE_juce_gui_basics           1
#define JUCE_MODULE_AVAILABLE_juce_gui_extra            1

// Plugin configuration
#ifndef JucePlugin_Build_VST3
 #define JucePlugin_Build_VST3 1
#endif

#ifndef JucePlugin_Build_AU
 #define JucePlugin_Build_AU 1
#endif

#ifndef JucePlugin_Build_Standalone
 #define JucePlugin_Build_Standalone 1
#endif

// Plugin formats
#define JucePlugin_Build_AU       1
#define JucePlugin_Build_AUv3     1

// Plugin characteristics
#define JucePlugin_IsSynth        0
#define JucePlugin_WantsMidiInput 0
#define JucePlugin_ProducesMidiOutput 0
#define JucePlugin_IsMidiEffect   0
#define JucePlugin_EditorRequiresKeyboardFocus 0

// Plugin version
#define JucePlugin_VersionCode    0x10000
#define JucePlugin_VersionString  "1.0.0"

// ... other plugin configurations ...

// Platform-specific settings
#if defined (__APPLE__) || defined (__APPLE_CPP__) || defined (__APPLE_CC__)
 #define JUCE_PUSH_NOTIFICATIONS 0
 #define JUCE_PUSH_NOTIFICATIONS_ACTIVITY "com/roli/juce/JuceActivity"
 #define JUCE_PLUGINHOST_VST3 0
 #define JUCE_PLUGINHOST_AU 0
#endif

// Disable some modules we don't need
#define JUCE_WEB_BROWSER 0
#define JUCE_USE_CURL 0
#define JUCE_USE_MP3AUDIOFORMAT 0
#define JUCE_USE_OGGVORBIS 0
#define JUCE_USE_FLAC 0

// Enable some useful debugging features in debug builds
#if ! JUCE_DEBUG
 #define JUCE_CHECK_MEMORY_LEAKS 0
 #define JUCE_DISABLE_ASSERTIONS 1
#endif

#endif // JUCE_APP_CONFIG_H_INCLUDED

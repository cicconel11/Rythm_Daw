// This file is part of the JUCE library.
// Copyright (c) 2022 - Raw Material Software Limited

#ifndef JUCE_HEADER_H_INCLUDED
#define JUCE_HEADER_H_INCLUDED

// Include the main JUCE module header
#include <juce_core/juce_core.h>

// Include other JUCE module headers
#include <juce_audio_basics/juce_audio_basics.h>
#include <juce_audio_devices/juce_audio_devices.h>
#include <juce_audio_formats/juce_audio_formats.h>
#include <juce_audio_plugin_client/juce_audio_plugin_client.h>
#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_audio_utils/juce_audio_utils.h>
#include <juce_core/juce_core.h>
#include <juce_data_structures/juce_data_structures.h>
#include <juce_events/juce_events.h>
#include <juce_graphics/juce_graphics.h>
#include <juce_gui_basics/juce_gui_basics.h>
#include <juce_gui_extra/juce_gui_extra.h>

// Global module settings
#ifndef JUCE_GLOBAL_MODULE_SETTINGS_INCLUDED
 #define JUCE_GLOBAL_MODULE_SETTINGS_INCLUDED 1
 #define JUCE_STANDALONE_APPLICATION 0
 #define JUCE_USE_CURL 0
 #define JUCE_USE_WEB_BROWSER 0
 #define JUCE_WEB_BROWSER 0
 #define JUCE_USE_MP3AUDIOFORMAT 0
 #define JUCE_USE_OGGVORBIS 0
 #define JUCE_USE_FLAC 0
 #define JUCE_MODULE_AVAILABLE_juce_audio_basics 1
 #define JUCE_MODULE_AVAILABLE_juce_audio_devices 1
 #define JUCE_MODULE_AVAILABLE_juce_audio_formats 1
 #define JUCE_MODULE_AVAILABLE_juce_audio_plugin_client 1
 #define JUCE_MODULE_AVAILABLE_juce_audio_processors 1
 #define JUCE_MODULE_AVAILABLE_juce_audio_utils 1
 #define JUCE_MODULE_AVAILABLE_juce_core 1
 #define JUCE_MODULE_AVAILABLE_juce_data_structures 1
 #define JUCE_MODULE_AVAILABLE_juce_events 1
 #define JUCE_MODULE_AVAILABLE_juce_graphics 1
 #define JUCE_MODULE_AVAILABLE_juce_gui_basics 1
 #define JUCE_MODULE_AVAILABLE_juce_gui_extra 1
#endif

// Include the JUCE application configuration
#include "AppConfig.h"

// Core JUCE modules
#include <juce_core/juce_core.h>
#include <juce_events/juce_events.h>
#include <juce_data_structures/juce_data_structures.h>

// Audio modules
#include <juce_audio_basics/juce_audio_basics.h>
#include <juce_audio_devices/juce_audio_devices.h>
#include <juce_audio_formats/juce_audio_formats.h>
#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_audio_utils/juce_audio_utils.h>
#include <juce_audio_plugin_client/juce_audio_plugin_client.h>

// GUI modules
#include <juce_graphics/juce_graphics.h>
#include <juce_gui_basics/juce_gui_basics.h>
#include <juce_gui_extra/juce_gui_extra.h>

// Project-specific includes
#include "AppConfig.h"

#endif // JUCE_HEADER_H_INCLUDED

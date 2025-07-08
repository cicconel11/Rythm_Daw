cmake_minimum_required(VERSION 3.15)
project(RHYTHM VERSION 1.0.0 LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Set output directories
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

# Set JUCE module path
# Use latest JUCE 7 modules
set(JUCE_MODULE_PATH "/Users/louisciccone/JUCE7/modules" CACHE PATH "Path to JUCE modules")

# Define JUCE modules to use
set(JUCE_MODULES
    juce_audio_basics
    juce_audio_devices
    juce_audio_formats
    juce_audio_plugin_client
    juce_audio_processors
    juce_audio_utils
    juce_core
    juce_data_structures
    juce_events
    juce_graphics
    juce_gui_basics
    juce_gui_extra
)

# Add JUCE module include paths
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/JuceLibraryCode
    ${JUCE_MODULE_PATH}
    ${JUCE_MODULE_PATH}/juce_audio_plugin_client/AU
)

# Create a target for the JUCE modules
add_library(juce_modules INTERFACE)

target_compile_definitions(juce_modules INTERFACE
    $<$<CONFIG:Debug>:DEBUG=1>
    $<$<CONFIG:Debug>:_DEBUG=1>
    $<$<NOT:$<CONFIG:Debug>>:NDEBUG=1>
    JUCE_MODULE_AVAILABLE_juce_audio_basics=1
    JUCE_MODULE_AVAILABLE_juce_audio_devices=1
    JUCE_MODULE_AVAILABLE_juce_audio_formats=1
    JUCE_MODULE_AVAILABLE_juce_audio_plugin_client=1
    JUCE_MODULE_AVAILABLE_juce_audio_processors=1
    JUCE_MODULE_AVAILABLE_juce_audio_utils=1
    JUCE_MODULE_AVAILABLE_juce_core=1
    JUCE_MODULE_AVAILABLE_juce_data_structures=1
    JUCE_MODULE_AVAILABLE_juce_events=1
    JUCE_MODULE_AVAILABLE_juce_graphics=1
    JUCE_MODULE_AVAILABLE_juce_gui_basics=1
    JUCE_MODULE_AVAILABLE_juce_gui_extra=1
    JUCE_GLOBAL_MODULE_SETTINGS_INCLUDED=1
    JUCE_STANDALONE_APPLICATION=0
    JUCE_USE_CURL=0
    JUCE_WEB_BROWSER=0
    JUCE_USE_MP3AUDIOFORMAT=0
    JUCE_USE_OGGVORBIS=0
    JUCE_USE_FLAC=0
)

# Add platform-specific definitions and libraries
if(APPLE)
    target_compile_definitions(juce_modules INTERFACE
        JUCE_PLUGINHOST_VST=0
        JUCE_PLUGINHOST_VST3=0
        JUCE_PLUGINHOST_AU=1
        JUCE_PLUGINHOST_LADSPA=0
        JUCE_PLUGINHOST_LV2=0
    )
    
    target_link_libraries(juce_modules INTERFACE
        "-framework Cocoa"
        "-framework QuartzCore"
        "-framework AudioToolbox"
        "-framework CoreAudio"
        "-framework CoreMIDI"
        "-framework Accelerate"
        "-framework Foundation"
        "-framework IOKit"
        "-framework Security"
        "-framework SystemConfiguration"
        "-framework WebKit"
    )
    

endif()

# Add JUCE modules as source files
file(GLOB JUCE_SOURCES CONFIGURE_DEPENDS "${JUCE_MODULE_PATH}/**/*.cpp" "${JUCE_MODULE_PATH}/**/*.mm")
file(GLOB JUCE_HEADERS CONFIGURE_DEPENDS "${JUCE_MODULE_PATH}/**/*.h")

# Exclude any test or example files if necessary
list(FILTER JUCE_SOURCES EXCLUDE REGEX ".*/tests/.*")
list(FILTER JUCE_SOURCES EXCLUDE REGEX ".*/examples/.*")
list(FILTER JUCE_SOURCES EXCLUDE REGEX ".*/AudioUnitSDK/.*")

# Add the JUCE sources to the target
set(PLUGIN_SOURCES ${JUCE_SOURCES})
set(PLUGIN_SOURCES ${PLUGIN_SOURCES} ${JUCE_HEADERS})

# Add the plugin source files
list(APPEND PLUGIN_SOURCES
    ${PROJECT_SOURCE_DIR}/Source/PluginProcessor.cpp
    ${PROJECT_SOURCE_DIR}/Source/PluginProcessor.h
    ${PROJECT_SOURCE_DIR}/Source/PluginEditor.cpp
    ${PROJECT_SOURCE_DIR}/Source/PluginEditor.h
)

# Create the plugin target
add_library(${PROJECT_NAME} MODULE ${PLUGIN_SOURCES})

# macOS-specific settings
if(APPLE)
    set(CMAKE_OSX_DEPLOYMENT_TARGET "10.13" CACHE STRING "macOS deployment target")
    set(SDK_PATH "/Library/Developer/CommandLineTools/SDKs/MacOSX15.0.sdk")
    if(EXISTS "${SDK_PATH}")
        set(CMAKE_OSX_SYSROOT "${SDK_PATH}" CACHE PATH "macOS SDK path" FORCE)
    else()
        message(WARNING "Specified SDK not found, using default SDK")
    endif()
    set(CMAKE_OSX_ARCHITECTURES "x86_64;arm64" CACHE STRING "Build architectures for macOS")
    # Set language standards and suppress warnings
    set(CMAKE_C_STANDARD 11 CACHE STRING "C standard")
    set(CMAKE_CXX_STANDARD 20 CACHE STRING "C++ standard")
    set(CMAKE_CXX_STANDARD_REQUIRED ON CACHE BOOL "Require C++ standard")
    # Ensure ARC is disabled
string(REPLACE "-fobjc-arc" "" CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS}")
string(REPLACE "-fobjc-arc-exceptions" "" CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS}")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -x objective-c++ -std=c++20 -Wno-objc-root-class -Wno-objc-method-access -Wno-objc-property-no-attribute -Wno-objc-protocol-qualifiers -Wno-objc-interface-ivars -Wno-deprecated-objc-isa-usage -Wno-objc-missing-property-synthesis" CACHE STRING "CXX flags" FORCE)
endif()

# Compile Objective-C++ files with C++20
if(APPLE)
    target_compile_options(${PROJECT_NAME} PRIVATE $<$<COMPILE_LANGUAGE:OBJCXX>:-std=c++20>)
endif()

# Additional macOS build settings
if(APPLE)
    # Additional include directories for AudioUnitSDK
    include_directories(SYSTEM "/Library/Developer/CommandLineTools/SDKs/MacOSX15.0.sdk/System/Library/Frameworks/AudioUnit.framework/Headers")
    include_directories(SYSTEM "/Library/Developer/CommandLineTools/SDKs/MacOSX15.0.sdk/usr/include")
    include_directories(SYSTEM "/Library/Developer/CommandLineTools/SDKs/MacOSX15.0.sdk/System/Library/Frameworks/AudioUnit.framework/Versions/A/Headers")
    include_directories(SYSTEM "/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/System/Library/Frameworks/AudioUnit.framework/Headers")
    include_directories(SYSTEM "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk/System/Library/Frameworks/AudioUnit.framework/Headers")
    # Link frameworks
    set(CMAKE_FRAMEWORK_PATH "/Library/Developer/CommandLineTools/SDKs/MacOSX15.0.sdk/System/Library/Frameworks" CACHE STRING "Frameworks path")
    find_library(AUDIOUNIT_FRAMEWORK AudioUnit)
    find_library(AUDIOTOOLBOX_FRAMEWORK AudioToolbox)
    find_library(COREAUDIO_FRAMEWORK CoreAudio)
    find_library(COREMIDI_FRAMEWORK CoreMIDI)
    find_library(CORESERVICES_FRAMEWORK CoreServices)
    target_link_libraries(${PROJECT_NAME} PRIVATE
        ${AUDIOUNIT_FRAMEWORK}
        ${AUDIOTOOLBOX_FRAMEWORK}
        ${COREAUDIO_FRAMEWORK}
        ${COREMIDI_FRAMEWORK}
        ${CORESERVICES_FRAMEWORK}
    )
    set_target_properties(${PROJECT_NAME} PROPERTIES
        XCODE_ATTRIBUTE_CODE_SIGN_IDENTITY "iPhone Developer"
        XCODE_ATTRIBUTE_DEVELOPMENT_TEAM ""
        XCODE_ATTRIBUTE_PRODUCT_BUNDLE_IDENTIFIER "com.yourcompany.${PROJECT_NAME}"
        XCODE_ATTRIBUTE_SWIFT_VERSION "5.0"
        XCODE_ATTRIBUTE_TARGETED_DEVICE_FAMILY "1,2"
        XCODE_ATTRIBUTE_CLANG_ENABLE_OBJC_ARC "NO"
    )
endif()

# Link JUCE modules
target_link_libraries(${PROJECT_NAME} PRIVATE
    juce_modules
)

# Set plugin properties
set_target_properties(${PROJECT_NAME} PROPERTIES
    BUNDLE_MACOSX 1
    MACOSX_BUNDLE_BUNDLE_NAME "RHYTHM"
    MACOSX_BUNDLE_BUNDLE_VERSION "${PROJECT_VERSION}"
    MACOSX_BUNDLE_LONG_VERSION_STRING "${PROJECT_VERSION}"
    MACOSX_BUNDLE_SHORT_VERSION_STRING "${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}"
    MACOSX_BUNDLE_COPYRIGHT "Copyright 2023 RHYTHM. All rights reserved."
    MACOSX_BUNDLE_GUI_IDENTIFIER "com.yourcompany.rhythm"
    OUTPUT_NAME "RHYTHM"
    XCODE_ATTRIBUTE_PRODUCT_BUNDLE_IDENTIFIER "com.yourcompany.rhythm"
    XCODE_ATTRIBUTE_CODE_SIGNING_ALLOWED "NO"
    XCODE_ATTRIBUTE_CODE_SIGNING_REQUIRED "NO"
    CXX_VISIBILITY_PRESET hidden
    VISIBILITY_INLINES_HIDDEN ON
)

# Add include directories
target_include_directories(${PROJECT_NAME} PRIVATE
    ${PROJECT_SOURCE_DIR}/Source
    ${PROJECT_SOURCE_DIR}/JuceLibraryCode
    ${JUCE_MODULE_PATH}
)

# Add compile definitions
target_compile_definitions(${PROJECT_NAME} PRIVATE
    $<$<CONFIG:Debug>:DEBUG=1>
    $<$<CONFIG:Debug>:_DEBUG=1>
    $<$<NOT:$<CONFIG:Debug>>:NDEBUG=1>
    
    # Plugin configuration - use simple definitions instead of generator expressions
    # to avoid CMake generator expression evaluation issues
    JucePlugin_Build_VST3=0
    JucePlugin_Build_AU=1
    JucePlugin_Build_Standalone=1
    
    # Disable other formats
    JucePlugin_Build_VST=0
    JucePlugin_Build_AUv3=0
    JucePlugin_Build_RTAS=0
    JucePlugin_Build_AAX=0
    JucePlugin_Build_Unity=0
    JucePlugin_Build_LV2=0
    
    # Plugin info
    JucePlugin_Name="RHYTHM"
    JucePlugin_Desc="RHYTHM Audio Plugin"
    JucePlugin_Manufacturer="Your Company"
    JucePlugin_ManufacturerWebsite="www.yourcompany.com"
    JucePlugin_ManufacturerEmail=""
    JucePlugin_ManufacturerCode=0x4d616e75  # 'Manu'
    JucePlugin_PluginCode=0x52687974     # 'Rhyt'
    
    # Version info
    JucePlugin_Version=0.1.0
    JucePlugin_VersionCode=0x100
    JucePlugin_VersionString="0.1.0"
    
    # Plugin formats
    JucePlugin_VSTUniqueID=JucePlugin_PluginCode
    JucePlugin_VSTCategory=kPlugCategEffect
    JucePlugin_Vst3Category="Fx"
    JucePlugin_AUMainType='aumf'
    JucePlugin_AUSubType=JucePlugin_PluginCode
    JucePlugin_AUExportPrefix=RHYTHMAU
    JucePlugin_CFBundleIdentifier=com.yourcompany.rhythm
    
    # Plugin capabilities
    JucePlugin_MaxNumInputChannels=2
    JucePlugin_MaxNumOutputChannels=2
    JucePlugin_IsSynth=0
    JucePlugin_WantsMidiInput=1
    JucePlugin_ProducesMidiOutput=1
    JucePlugin_EditorRequiresKeyboardFocus=0
    
    # Disable features we don't need
    JucePlugin_Enable_ARA=0
    JucePlugin_Enable_ARA_DRAFT=0
    JucePlugin_ARA_DISABLE_EDITSTAGE=0
    JucePlugin_ARA_LEGACY=0
    JucePlugin_ARA_DEBUG=0
)

# Add include directories with SYSTEM to prevent warnings from JUCE headers
target_include_directories(${PROJECT_NAME} SYSTEM PRIVATE
    ${PROJECT_SOURCE_DIR}/Source
    ${PROJECT_SOURCE_DIR}/JuceLibraryCode
    ${JUCE_MODULE_PATH}
)

# Set Xcode attributes for macOS
if(APPLE)
    # Debugging
    set(CMAKE_XCODE_ATTRIBUTE_DEBUG_INFORMATION_FORMAT "dwarf")
    set(CMAKE_XCODE_ATTRIBUTE_DEAD_CODE_STRIPPING "YES")
    set(CMAKE_XCODE_ATTRIBUTE_STRIP_INSTALLED_PRODUCT "YES")
    set(CMAKE_XCODE_ATTRIBUTE_COPY_PHASE_STRIP "YES")
    
    # Enable C++17 for Xcode
    set(CMAKE_XCODE_ATTRIBUTE_CLANG_CXX_LANGUAGE_STANDARD "c++17")
    set(CMAKE_XCODE_ATTRIBUTE_CLANG_CXX_LIBRARY "libc++")
    
    # Enable modules and ARC
    set(CMAKE_XCODE_ATTRIBUTE_CLANG_ENABLE_MODULES "YES")
    set(CMAKE_XCODE_ATTRIBUTE_CLANG_ENABLE_OBJC_ARC "NO")
    set(CMAKE_XCODE_ATTRIBUTE_CLANG_ENABLE_OBJC_WEAK "YES")
    
    # Disable code signing for development
    set(CMAKE_XCODE_ATTRIBUTE_CODE_SIGN_IDENTITY "")
    set(CMAKE_XCODE_ATTRIBUTE_CODE_SIGNING_REQUIRED "NO")
    set(CMAKE_XCODE_ATTRIBUTE_CODE_SIGNING_ALLOWED "NO")
    
    # Link required frameworks
    target_link_libraries(${PROJECT_NAME} PRIVATE
        "-framework Cocoa"
        "-framework QuartzCore"
        "-framework AudioToolbox"
        "-framework CoreAudio"
        "-framework CoreMIDI"
        "-framework Accelerate"
        "-framework Foundation"
        "-framework IOKit"
        "-framework Security"
        "-framework SystemConfiguration"
        "-framework WebKit"
    )
endif()

# Set output directories for all platforms
set_target_properties(${PROJECT_NAME} PROPERTIES
    LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin
    ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib
)

# Set build type if not specified
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Debug)
endif()

# Set compiler flags
if(MSVC)
    target_compile_options(${PROJECT_NAME} PRIVATE /W4 /WX)
else()
    target_compile_options(${PROJECT_NAME} PRIVATE -Wall -Wextra -Wpedantic)
    
    if(APPLE)

    endif()
endif()

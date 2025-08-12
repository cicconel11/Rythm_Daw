# RHYTHM Plugin

A real-time collaboration plugin for Digital Audio Workstations (DAWs) that enables musicians to collaborate seamlessly across different DAWs and locations.

## Features

### ✅ **Implemented Features**

#### **DSP Processing**
- **Input Gain**: -24dB to +24dB with smooth parameter changes
- **Output Gain**: -24dB to +24dB with hard clip protection
- **Dry/Wet Mix**: 0% to 100% for effect blending
- **Parameter Smoothing**: 50ms time constant for artifact-free changes
- **Stereo Processing**: Full stereo pass-through with parameter control

#### **User Interface**
- **Modern Dark Theme**: Professional dark UI with blue accents
- **Sidebar Navigation**: Dashboard, Files, History, Friends, Chat, Settings
- **Parameter Controls**: Rotary knobs for all DSP parameters
- **Section View**: Main content area for future collaboration features
- **Status Bar**: Real-time connection and plugin status

#### **Build System**
- **CMake Integration**: Proper JUCE 8 integration with CMake presets
- **Universal Binary**: Supports both arm64 (Apple Silicon) and x86_64 (Intel)
- **Audio Unit (AU)**: Native macOS plugin format
- **VST3**: Cross-platform plugin format (builds but has helper issues)
- **macOS 12.0+**: Modern deployment target

#### **Bridge Communication**
- **WebSocket Client**: Background communication with web app
- **JSON Messages**: Structured communication protocol
- **Plugin State**: Automatic loaded/unloaded notifications
- **Parameter Sync**: Real-time parameter change broadcasting
- **Connection Management**: Automatic reconnection with retry logic

### 🔄 **In Progress**

#### **Web App Integration**
- **Plugin Bridge Page**: Development interface at `/dev/plugin-bridge`
- **Message Logging**: Real-time message display and testing
- **Connection Status**: Visual feedback for plugin connectivity

## Installation

### Prerequisites
- macOS 12.0 or later
- CMake 3.22 or later
- Xcode Command Line Tools

### Quick Start

1. **Bootstrap the project**:
   ```bash
   ./plugins/rythm-plugin/scripts/bootstrap.sh
   ```

2. **Build the plugin**:
   ```bash
   ./plugins/rythm-plugin/scripts/build_release.sh
   ```

3. **Install locally**:
   ```bash
   ./plugins/rythm-plugin/scripts/install_local.sh
   ```

4. **Validate installation**:
   ```bash
   ./plugins/rythm-plugin/scripts/auval.sh
   ```

### Manual Installation

The plugin is installed to:
- **Audio Unit**: `~/Library/Audio/Plug-Ins/Components/RythmPlugin.component`
- **VST3**: `~/Library/Audio/Plug-Ins/VST3/RythmPlugin.vst3`

## Usage

### In Your DAW

1. **Load the Plugin**: Add RHYTHM as an Audio Unit or VST3 plugin to a track
2. **Adjust Parameters**: Use the knobs to control Input Gain, Output Gain, and Dry/Wet
3. **Monitor Bridge**: Visit `http://localhost:3000/dev/plugin-bridge` to see real-time messages

### Parameter Ranges

- **Input Gain**: -24dB to +24dB (0dB default)
- **Output Gain**: -24dB to +24dB (0dB default)  
- **Dry/Wet**: 0% to 100% (50% default)

## Development

### Project Structure

```
plugins/rythm-plugin/
├── Source/
│   ├── PluginProcessor.h/cpp    # DSP and parameter management
│   ├── PluginEditor.h/cpp       # UI implementation
│   └── Bridge/
│       └── BridgeClient.h/cpp   # WebSocket communication
├── Resources/
│   └── Info-AU.plist.in        # Audio Unit metadata
├── scripts/                    # Build and installation scripts
└── CMakeLists.txt             # Build configuration
```

### Building

```bash
# Debug build
./plugins/rythm-plugin/scripts/build_debug.sh

# Release build
./plugins/rythm-plugin/scripts/build_release.sh
```

### Testing

```bash
# Validate Audio Unit
./plugins/rythm-plugin/scripts/auval.sh

# Test in DAW
# Load in Logic Pro, Ableton Live, or any AU-compatible DAW
```

## Bridge Protocol

The plugin communicates with the web app using JSON messages:

### Message Types

#### Plugin Loaded
```json
{
  "type": "plugin-loaded",
  "timestamp": 1234567890
}
```

#### Plugin Unloaded
```json
{
  "type": "plugin-unloaded", 
  "timestamp": 1234567890
}
```

#### Parameter Changed
```json
{
  "type": "parameter-changed",
  "parameterId": "inputGain",
  "value": 0.5,
  "timestamp": 1234567890
}
```

## Troubleshooting

### Common Issues

1. **Plugin not appearing in DAW**:
   - Restart your DAW after installation
   - Check that the plugin is installed in the correct location
   - Run `auval.sh` to validate the Audio Unit

2. **Build errors**:
   - Ensure CMake 3.22+ is installed
   - Run `bootstrap.sh` to set up JUCE submodule
   - Check that Xcode Command Line Tools are installed

3. **VST3 build fails**:
   - This is a known issue with the VST3 helper
   - Audio Unit format works perfectly and is recommended for macOS

### Validation

The plugin passes Audio Unit validation:
```bash
auval -v aufx Rytm Rytm
# Should show: * * PASS
```

## Future Enhancements

- **Real-time Collaboration**: Multi-user session management
- **File Sharing**: Direct file transfer between collaborators
- **Chat Integration**: In-plugin messaging system
- **Session Recording**: Automatic session backup and sharing
- **Advanced DSP**: Reverb, delay, and other effects
- **MIDI Support**: MIDI parameter automation and sync

## License

This plugin is part of the RHYTHM collaboration suite.

---

**Status**: ✅ **Production Ready** - Audio Unit format fully functional and validated

# RHYTHM Plugin

A real-time collaboration plugin for digital audio workstations (DAWs) built with JUCE.

## Features

- **Real-time collaboration** with other musicians
- **Cloud synchronization** of projects
- **Plugin support** for major DAWs (Logic Pro, Ableton Live, Pro Tools, etc.)
- **Low-latency audio streaming**
- **Session management** and version control
- **WebSocket bridge** to web application

## Supported Formats

- **Audio Unit (AU)** - Native macOS plugin format
- **VST3** - Cross-platform plugin format

## System Requirements

- **macOS 12.0** or later
- **Universal Binary** (arm64 + x86_64)
- **Compatible DAW** (Logic Pro, Ableton Live, Pro Tools, etc.)
- **Internet connection** for collaboration features
- **4GB RAM** minimum, 8GB recommended

## Quick Start

### 1. Bootstrap the Environment

```bash
./plugins/rythm-plugin/scripts/bootstrap.sh
```

This will:
- Add JUCE as a git submodule
- Set up CMake build configuration
- Create build directories

### 2. Build the Plugin

```bash
./plugins/rythm-plugin/scripts/build_release.sh
```

This creates:
- `build/release/RythmPlugin.vst3` (VST3 plugin)
- `build/release/RythmPlugin.component` (Audio Unit plugin)

### 3. Install Locally

```bash
./plugins/rythm-plugin/scripts/install_local.sh
```

This copies plugins to:
- `~/Library/Audio/Plug-Ins/VST3/RythmPlugin.vst3`
- `~/Library/Audio/Plug-Ins/Components/RythmPlugin.component`

### 4. Validate Installation

```bash
./plugins/rythm-plugin/scripts/auval.sh
```

This runs Audio Unit validation to ensure the plugin is properly installed.

### 5. Test in Logic Pro

1. Restart Logic Pro
2. Create a new project
3. Add an audio track
4. Insert RHYTHM under **Audio Units > Music Effect**
5. Open the plugin editor to see the interface

## Development

### Project Structure

```
plugins/rythm-plugin/
├── Source/
│   ├── PluginProcessor.h/cpp     # Main audio processing
│   ├── PluginEditor.h/cpp        # Plugin UI
│   ├── UI/
│   │   ├── Sidebar.h/cpp         # Navigation sidebar
│   │   └── SectionView.h/cpp     # Content sections
│   ├── Bridge/
│   │   ├── BridgeClient.h/cpp    # WebSocket client
│   │   └── Json.h/cpp            # JSON utilities
│   └── DSP/
│       └── Meters.h/cpp          # Audio level meters
├── Resources/
│   └── Info-AU.plist.in          # Audio Unit metadata
├── scripts/
│   ├── bootstrap.sh              # Environment setup
│   ├── build_debug.sh            # Debug build
│   ├── build_release.sh          # Release build
│   ├── install_local.sh          # Local installation
│   ├── codesign_local.sh         # Code signing
│   ├── auval.sh                  # Audio Unit validation
│   └── make_pkg.sh               # Package creation
└── README.md
```

### Build Scripts

| Script | Purpose |
|--------|---------|
| `bootstrap.sh` | Set up JUCE submodule and build environment |
| `build_debug.sh` | Build debug version with symbols |
| `build_release.sh` | Build release version for distribution |
| `install_local.sh` | Install plugins to user directories |
| `codesign_local.sh` | Sign plugins for distribution |
| `auval.sh` | Validate Audio Unit installation |
| `make_pkg.sh` | Create installer package |

### DSP Parameters

The plugin includes three main parameters:

1. **Input Gain** (0.0 to +24.0 dB)
   - Controls the input signal level
   - Smooth parameter changes to prevent clicks

2. **Output Gain** (0.0 to +24.0 dB)
   - Controls the output signal level
   - Applied after processing

3. **Dry/Wet** (0.0 to 100.0%)
   - Controls the mix between dry and processed signal
   - 100% = fully processed, 0% = fully dry

### WebSocket Bridge

The plugin communicates with the web application via WebSocket:

**Outgoing Messages:**
```json
{"type": "plugin-loaded", "version": "1.0.0"}
{"type": "parameter-changed", "id": "inputGain", "value": 6.0}
{"type": "plugin-unloaded"}
```

**Incoming Commands:**
```json
{"type": "command", "name": "setPreset", "data": {...}}
```

### UI Sections

The plugin interface includes six main sections:

1. **Dashboard** - Overview and status
2. **Files** - Project file management
3. **History** - Session history and versions
4. **Friends** - Collaboration partners
5. **Chat** - Real-time messaging
6. **Settings** - Plugin configuration

## Distribution

### Code Signing

For distribution, the plugin should be signed with a Developer ID certificate:

```bash
./plugins/rythm-plugin/scripts/codesign_local.sh
```

### Package Creation

Create an installer package:

```bash
./plugins/rythm-plugin/scripts/make_pkg.sh
```

This creates `dist/RythmPlugin-macOS-1.0.0.pkg` for distribution.

## Troubleshooting

### Plugin Not Appearing in DAW

1. Check installation: `ls ~/Library/Audio/Plug-Ins/Components/`
2. Clear Audio Unit cache: `rm -rf ~/Library/Caches/AudioUnitCache`
3. Restart the DAW
4. Run validation: `./plugins/rythm-plugin/scripts/auval.sh`

### Build Errors

1. Ensure JUCE submodule is initialized: `git submodule update --init --recursive`
2. Check CMake version: `cmake --version` (requires 3.20+)
3. Verify Xcode command line tools: `xcode-select --install`

### WebSocket Connection Issues

1. Ensure web dev server is running on port 5173
2. Check firewall settings
3. Verify WebSocket endpoint: `ws://127.0.0.1:5173/rythm-plugin`

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Test on both Intel and Apple Silicon Macs

## License

Copyright 2024 RHYTHM. All rights reserved.

#!/bin/bash

set -e

echo "=========================================="
echo "RHYTHM Plugin Local Installation"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "../../CMakeLists.txt" ]; then
    echo "Error: This script must be run from plugins/rythm-plugin/scripts/"
    exit 1
fi

# Go to project root
cd ../..

# Check if build files exist
if [ ! -f "build/release/RythmPlugin.vst3/Contents/MacOS/RythmPlugin" ]; then
    echo "Error: VST3 plugin not found. Run build_release.sh first."
    exit 1
fi

if [ ! -f "build/release/RythmPlugin.component/Contents/MacOS/RythmPlugin" ]; then
    echo "Error: Audio Unit plugin not found. Run build_release.sh first."
    exit 1
fi

# Create plugin directories if they don't exist
echo "Creating plugin directories..."
mkdir -p ~/Library/Audio/Plug-Ins/VST3
mkdir -p ~/Library/Audio/Plug-Ins/Components

# Remove existing plugins
echo "Removing existing plugins..."
rm -rf ~/Library/Audio/Plug-Ins/VST3/RythmPlugin.vst3
rm -rf ~/Library/Audio/Plug-Ins/Components/RythmPlugin.component

# Copy new plugins
echo "Installing VST3 plugin..."
cp -R build/release/RythmPlugin.vst3 ~/Library/Audio/Plug-Ins/VST3/

echo "Installing Audio Unit plugin..."
cp -R build/release/RythmPlugin.component ~/Library/Audio/Plug-Ins/Components/

# Clear Audio Unit cache
echo "Clearing Audio Unit cache..."
rm -rf ~/Library/Caches/AudioUnitCache
killall -9 AudioComponentRegistrar 2>/dev/null || true

echo ""
echo "=========================================="
echo "Installation complete!"
echo "=========================================="
echo ""
echo "Plugins installed:"
echo "- VST3: ~/Library/Audio/Plug-Ins/VST3/RythmPlugin.vst3"
echo "- Audio Unit: ~/Library/Audio/Plug-Ins/Components/RythmPlugin.component"
echo ""
echo "Next: Run ./plugins/rythm-plugin/scripts/auval.sh to validate"
echo "Then restart Logic Pro and look for 'RHYTHM' in Audio Units > Music Effect"

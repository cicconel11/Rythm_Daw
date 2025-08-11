#!/bin/bash

set -e

echo "=========================================="
echo "RHYTHM Plugin Debug Build"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "../../CMakeLists.txt" ]; then
    echo "Error: This script must be run from plugins/rythm-plugin/scripts/"
    exit 1
fi

# Go to project root
cd ../..

# Build with CMake presets
echo "Building RHYTHM plugin (Debug)..."
cmake --build build/debug --config Debug --parallel

echo ""
echo "=========================================="
echo "Debug build complete!"
echo "=========================================="
echo ""
echo "Plugin files created:"
echo "- build/debug/RythmPlugin.vst3"
echo "- build/debug/RythmPlugin.component"
echo ""
echo "Next: Run ./plugins/rythm-plugin/scripts/install_local.sh"

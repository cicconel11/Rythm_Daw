#!/bin/bash

set -e

echo "=========================================="
echo "RHYTHM Plugin Release Build"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "../../CMakeLists.txt" ]; then
    echo "Error: This script must be run from plugins/rythm-plugin/scripts/"
    exit 1
fi

# Go to project root
cd ../..

# Build with CMake presets
echo "Building RHYTHM plugin..."
cmake --build build/release --config Release --parallel

echo ""
echo "=========================================="
echo "Build complete!"
echo "=========================================="
echo ""
echo "Plugin files created:"
echo "- build/release/RythmPlugin.vst3"
echo "- build/release/RythmPlugin.component"
echo ""
echo "Next: Run ./plugins/rythm-plugin/scripts/install_local.sh"

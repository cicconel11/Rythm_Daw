#!/bin/bash

set -e

echo "=========================================="
echo "RHYTHM Plugin Release Build"
echo "=========================================="

# Determine the project root
if [ -f "CMakeLists.txt" ]; then
    # We're in the project root
    PROJECT_ROOT="."
elif [ -f "../../../CMakeLists.txt" ]; then
    # We're in plugins/rythm-plugin/scripts/
    PROJECT_ROOT="../../.."
else
    echo "Error: This script must be run from the project root or plugins/rythm-plugin/scripts/"
    exit 1
fi

# Go to project root
cd "$PROJECT_ROOT"

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

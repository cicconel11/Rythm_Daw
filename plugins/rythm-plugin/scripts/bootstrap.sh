#!/bin/bash

set -e

echo "=========================================="
echo "RHYTHM Plugin Bootstrap Script"
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

# Check if JUCE submodule exists
if [ ! -d "third_party/JUCE" ]; then
    echo "Adding JUCE submodule..."
    git submodule add https://github.com/juce-framework/JUCE.git third_party/JUCE
else
    echo "JUCE submodule already exists, updating..."
    git submodule update --init --recursive
fi

# Create build directory with CMake presets
echo "Creating build directory..."
cmake --preset=release -B build/release

echo ""
echo "=========================================="
echo "Bootstrap complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Run: ./plugins/rythm-plugin/scripts/build_release.sh"
echo "2. Run: ./plugins/rythm-plugin/scripts/install_local.sh"
echo "3. Run: ./plugins/rythm-plugin/scripts/auval.sh"
echo ""
echo "Then start your web dev server and test in Logic Pro!"

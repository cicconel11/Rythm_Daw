#!/bin/bash

set -e

echo "=========================================="
echo "RHYTHM Plugin Audio Unit Validation"
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

# Check if plugin is installed
if [ ! -f "$HOME/Library/Audio/Plug-Ins/Components/RythmPlugin.component/Contents/MacOS/RythmPlugin" ]; then
    echo "Error: Audio Unit plugin not found. Run install_local.sh first."
    exit 1
fi

echo "Running Audio Unit validation..."
echo "Manufacturer: Rytm, Subtype: Rytm, Type: aufx"
echo ""

# Run auval
auval -v aufx Rytm Rytm

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✅ Audio Unit validation PASSED!"
    echo "=========================================="
    echo ""
    echo "The RHYTHM plugin is ready to use in Logic Pro!"
    echo "Look for 'RHYTHM' in Audio Units > Music Effect"
else
    echo ""
    echo "=========================================="
    echo "❌ Audio Unit validation FAILED!"
    echo "=========================================="
    echo ""
    echo "Check the build and installation steps."
    exit 1
fi

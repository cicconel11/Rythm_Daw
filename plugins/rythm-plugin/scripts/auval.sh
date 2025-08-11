#!/bin/bash

set -e

echo "=========================================="
echo "RHYTHM Plugin Audio Unit Validation"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "../../CMakeLists.txt" ]; then
    echo "Error: This script must be run from plugins/rythm-plugin/scripts/"
    exit 1
fi

# Go to project root
cd ../..

# Check if plugin is installed
if [ ! -f "~/Library/Audio/Plug-Ins/Components/RythmPlugin.component/Contents/MacOS/RythmPlugin" ]; then
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

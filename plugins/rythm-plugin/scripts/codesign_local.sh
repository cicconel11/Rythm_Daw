#!/bin/bash

set -e

echo "=========================================="
echo "RHYTHM Plugin Code Signing"
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

# Check for Developer ID certificate
if security find-identity -v -p codesigning | grep -q "Developer ID Application"; then
    echo "Found Developer ID Application certificate, signing with hardened runtime disabled..."
    
    # Get the certificate name
    CERT_NAME=$(security find-identity -v -p codesigning | grep "Developer ID Application" | head -1 | cut -d'"' -f2)
    
    # Sign VST3
    echo "Signing VST3 plugin..."
    codesign --force --deep --sign "$CERT_NAME" --options runtime build/release/RythmPlugin.vst3
    
    # Sign Audio Unit
    echo "Signing Audio Unit plugin..."
    codesign --force --deep --sign "$CERT_NAME" --options runtime build/release/RythmPlugin.component
    
    echo "✅ Plugins signed with Developer ID Application certificate"
else
    echo "No Developer ID Application certificate found, performing ad-hoc signing..."
    
    # Ad-hoc sign VST3
    echo "Ad-hoc signing VST3 plugin..."
    codesign --force --deep --sign - build/release/RythmPlugin.vst3
    
    # Ad-hoc sign Audio Unit
    echo "Ad-hoc signing Audio Unit plugin..."
    codesign --force --deep --sign - build/release/RythmPlugin.component
    
    echo "✅ Plugins signed with ad-hoc signature"
fi

echo ""
echo "=========================================="
echo "Code signing complete!"
echo "=========================================="
echo ""
echo "Next: Run ./plugins/rythm-plugin/scripts/install_local.sh"

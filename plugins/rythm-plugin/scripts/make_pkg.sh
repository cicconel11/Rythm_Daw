#!/bin/bash

set -e

echo "=========================================="
echo "RHYTHM Plugin Package Builder"
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

# Create distribution directory
echo "Creating distribution directory..."
mkdir -p dist/RythmPlugin

# Copy plugins to distribution directory
echo "Copying plugins to distribution directory..."
cp -R build/release/RythmPlugin.vst3 dist/RythmPlugin/
cp -R build/release/RythmPlugin.component dist/RythmPlugin/

# Create component plist
echo "Creating component plist..."
cat > dist/RythmPlugin/component.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<array>
    <dict>
        <key>BundleHasStrictIdentifier</key>
        <true/>
        <key>BundleIsRelocatable</key>
        <false/>
        <key>BundleIsVersionChecked</key>
        <true/>
        <key>BundleOverwriteAction</key>
        <string>upgrade</string>
        <key>RootRelativeBundlePath</key>
        <string>RythmPlugin.vst3</string>
    </dict>
    <dict>
        <key>BundleHasStrictIdentifier</key>
        <true/>
        <key>BundleIsRelocatable</key>
        <false/>
        <key>BundleIsVersionChecked</key>
        <true/>
        <key>BundleOverwriteAction</key>
        <string>upgrade</string>
        <key>RootRelativeBundlePath</key>
        <string>RythmPlugin.component</string>
    </dict>
</array>
</plist>
EOF

# Create distribution plist
echo "Creating distribution plist..."
cat > dist/distribution.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>identifier</key>
    <string>com.rythm.audio.RythmPlugin</string>
    <key>title</key>
    <string>RHYTHM Plugin</string>
    <key>version</key>
    <string>1.0.0</string>
    <key>install-location</key>
    <string>/Library/Audio/Plug-Ins</string>
    <key>domains</key>
    <dict>
        <key>system</key>
        <true/>
    </dict>
</dict>
</plist>
EOF

# Build the package
echo "Building package..."
VERSION="1.0.0"
PKG_NAME="RythmPlugin-macOS-${VERSION}.pkg"

# Check for Developer ID Installer certificate
if security find-identity -v -p codesigning | grep -q "Developer ID Installer"; then
    echo "Found Developer ID Installer certificate, signing package..."
    CERT_NAME=$(security find-identity -v -p codesigning | grep "Developer ID Installer" | head -1 | cut -d'"' -f2)
    
    pkgbuild --root dist/RythmPlugin \
             --component-plist dist/RythmPlugin/component.plist \
             --identifier com.rythm.audio.RythmPlugin \
             --version ${VERSION} \
             --install-location /Library/Audio/Plug-Ins \
             dist/RythmPlugin.pkg
    
    productbuild --distribution dist/distribution.plist \
                 --package-path dist \
                 --sign "$CERT_NAME" \
                 dist/${PKG_NAME}
    
    echo "✅ Package signed with Developer ID Installer certificate"
else
    echo "No Developer ID Installer certificate found, creating unsigned package..."
    
    pkgbuild --root dist/RythmPlugin \
             --component-plist dist/RythmPlugin/component.plist \
             --identifier com.rythm.audio.RythmPlugin \
             --version ${VERSION} \
             --install-location /Library/Audio/Plug-Ins \
             dist/RythmPlugin.pkg
    
    productbuild --distribution dist/distribution.plist \
                 --package-path dist \
                 dist/${PKG_NAME}
    
    echo "✅ Package created (unsigned)"
fi

# Clean up temporary files
rm -f dist/RythmPlugin.pkg
rm -f dist/RythmPlugin/component.plist
rm -f dist/distribution.plist

echo ""
echo "=========================================="
echo "Package build complete!"
echo "=========================================="
echo ""
echo "Package created: dist/${PKG_NAME}"
echo ""
echo "To install: sudo installer -pkg dist/${PKG_NAME} -target /"

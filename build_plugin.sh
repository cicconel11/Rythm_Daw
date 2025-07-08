#!/bin/bash

# Exit on error
set -e

echo "Building React UI..."
cd "$(dirname "$0")/ui-dev"
pnpm install
pnpm run build
cd ..

# Create build directory
echo "Configuring build..."
mkdir -p build
cd build

# Configure with CMake
cmake .. -DCMAKE_BUILD_TYPE=Release -DJUCE_BUILD_AU=ON -DJUCE_BUILD_AUv3=ON

# Build the plugin
echo "Building plugin..."
cmake --build . --config Release -- -j$(sysctl -n hw.ncpu)

# Install to user's AU components
echo "Installing plugin..."
cmake --install . --prefix ~/Library/Audio/Plug-Ins/Components

echo "Build and installation complete! Please rescan plugins in your DAW."

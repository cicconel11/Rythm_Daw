#!/bin/bash

# Set strict error handling
set -euo pipefail

# Plugin path
VST3_PLUGIN="Rythm_Daw.vst3"

# Installation directories
USER_VST3_DIR="$HOME/.vst3"
SYSTEM_VST3_DIR="/usr/local/lib/vst3"

# Create directories
mkdir -p "$USER_VST3_DIR"

# Check if we have sudo access for system-wide installation
if sudo -n true 2>/dev/null; then
  echo "Installing system-wide..."
  sudo mkdir -p "$SYSTEM_VST3_DIR"
  INSTALL_DIR="$SYSTEM_VST3_DIR"
else
  echo "Installing to user directory..."
  INSTALL_DIR="$USER_VST3_DIR"
fi

# Copy plugin
if [ -d "$VST3_PLUGIN" ]; then
  echo "Installing VST3 plugin..."
  cp -R "$VST3_PLUGIN" "$INSTALL_DIR/"
  echo "VST3 plugin installed to $INSTALL_DIR"
else
  echo "Error: Plugin file not found"
  exit 1
fi

# Validate installation
validate_plugin() {
  local plugin_path="$1"
  if [ ! -d "$plugin_path" ]; then
    echo "Error: Failed to install plugin to $plugin_path"
    exit 1
  fi

  # Run plugin validation
  echo "Validating plugin at $plugin_path..."
  plugin-val "$plugin_path" --headless
  if [ $? -ne 0 ]; then
    echo "Error: Plugin validation failed"
    exit 1
  fi
}

# Validate installation
validate_plugin "$INSTALL_DIR/$VST3_PLUGIN"

echo "Installation and validation successful!"

#!/bin/bash

# Set strict error handling
set -euo pipefail

# Plugin paths
AU_PLUGIN="Rythm_Daw.component"
VST3_PLUGIN="Rythm_Daw.vst3"

# Installation directories
AU_DIR="/Library/Audio/Plug-Ins/Components/"
VST3_DIR="/Library/Audio/Plug-Plugins/VST3/"

# Check if we need sudo
if [ ! -w "$AU_DIR" ] || [ ! -w "$VST3_DIR" ]; then
  echo "Requesting sudo for installation..."
  sudo -v
fi

# Create directories with sudo if needed
sudo mkdir -p "$AU_DIR" "$VST3_DIR"

# Copy plugins
if [ -f "$AU_PLUGIN" ]; then
  echo "Installing AU plugin..."
  sudo cp -R "$AU_PLUGIN" "$AU_DIR/"
  echo "AU plugin installed to $AU_DIR"
fi

if [ -d "$VST3_PLUGIN" ]; then
  echo "Installing VST3 plugin..."
  sudo cp -R "$VST3_PLUGIN" "$VST3_DIR/"
  echo "VST3 plugin installed to $VST3_DIR"
fi

# Validate installation
validate_plugin() {
  local plugin_path="$1"
  if [ ! -e "$plugin_path" ]; then
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

# Validate both plugins
if [ -f "$AU_DIR/$AU_PLUGIN" ]; then
  validate_plugin "$AU_DIR/$AU_PLUGIN"
fi

if [ -d "$VST3_DIR/$VST3_PLUGIN" ]; then
  validate_plugin "$VST3_DIR/$VST3_PLUGIN"
fi

echo "Installation and validation successful!"

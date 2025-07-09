#!/bin/bash

# Set strict error handling
set -euo pipefail

# Function to check Trivy vulnerabilities
check_trivy() {
  echo "Running Trivy security scan..."
  trivy fs "$1"
  if [ $? -ne 0 ]; then
    echo "Error: Trivy scan failed for $1"
    exit 1
  fi
}

# Function to check macOS AU security
check_macos_au() {
  echo "Checking macOS AU security..."
  codesign --verify --verbose "$1"
  if [ $? -ne 0 ]; then
    echo "Error: Code signature verification failed for $1"
    exit 1
  fi

  spctl --assess --type execute "$1"
  if [ $? -ne 0 ]; then
    echo "Error: Notarization verification failed for $1"
    exit 1
  fi
}

# Function to check Windows VST3 signature
check_windows_vst3() {
  echo "Checking Windows VST3 signature..."
  signtool verify /pa "$1"
  if [ $? -ne 0 ]; then
    echo "Error: Windows signature verification failed for $1"
    exit 1
  fi
}

# Function to calculate and verify checksums
check_checksum() {
  local file="$1"
  local expected_checksum="$2"
  local actual_checksum=$(shasum -a 256 "$file" | cut -d' ' -f1)
  
  if [ "$actual_checksum" != "$expected_checksum" ]; then
    echo "Error: Checksum mismatch for $file"
    echo "Expected: $expected_checksum"
    echo "Actual: $actual_checksum"
    exit 1
  fi
}

# Main execution
AU_FILE="Rythm_Daw.component"
VST3_FILE="Rythm_Daw.vst3"

# Check security
check_trivy "$AU_FILE"
check_trivy "$VST3_FILE"

# Platform-specific checks
if [ "$OSTYPE" == "darwin"* ]; then
  check_macos_au "$AU_FILE"
fi

# Check checksums
check_checksum "$AU_FILE" "$AU_CHECKSUM"
check_checksum "$VST3_FILE" "$VST3_CHECKSUM"

# If we got here, all checks passed
echo "All security checks passed!"

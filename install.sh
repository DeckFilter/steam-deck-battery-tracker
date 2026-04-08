#!/usr/bin/env bash

set -euo pipefail

PACKAGE="steam-deck-battery-tracker"
RELEASE_URL="https://github.com/felixhirschfeld/${PACKAGE}/releases/latest/download/${PACKAGE}.tar.gz"

if [[ "${EUID}" -eq 0 ]]; then
  echo "Please run this script as your normal user, not root."
  exit 1
fi

if [[ -d "/home/deck/homebrew" ]]; then
  DECKY_HOME="/home/deck/homebrew"
elif [[ -d "${HOME}/homebrew" ]]; then
  DECKY_HOME="${HOME}/homebrew"
else
  echo "Error: Could not find the Decky homebrew directory." >&2
  echo "Expected one of:" >&2
  echo "  - /home/deck/homebrew" >&2
  echo "  - ${HOME}/homebrew" >&2
  exit 1
fi

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

PLUGINS_DIR="${DECKY_HOME}/plugins"
PLUGIN_DIR="${PLUGINS_DIR}/${PACKAGE}"
ARCHIVE_PATH="${TMP_DIR}/${PACKAGE}.tar.gz"
EXTRACTED_DIR="${TMP_DIR}/${PACKAGE}"

download_release() {
  if command -v curl >/dev/null 2>&1; then
    curl -L "${RELEASE_URL}" -o "${ARCHIVE_PATH}"
    return
  fi

  if command -v wget >/dev/null 2>&1; then
    wget -O "${ARCHIVE_PATH}" "${RELEASE_URL}"
    return
  fi

  echo "Error: curl or wget is required to download ${PACKAGE}." >&2
  exit 1
}

echo "Installing ${PACKAGE}"
echo "Decky homebrew: ${DECKY_HOME}"

download_release
tar -xzf "${ARCHIVE_PATH}" -C "${TMP_DIR}"

if [[ ! -d "${EXTRACTED_DIR}" ]]; then
  echo "Error: Unexpected archive structure. Expected ${PACKAGE}/ at the archive root." >&2
  exit 1
fi

sudo mkdir -p "${PLUGINS_DIR}"
sudo rm -rf "${PLUGIN_DIR}"
sudo cp -R "${EXTRACTED_DIR}" "${PLUGIN_DIR}"
sudo systemctl restart plugin_loader.service

echo "Installed ${PACKAGE} to ${PLUGIN_DIR}"
echo "Decky has been restarted."

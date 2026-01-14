#!/bin/bash

# Path to your local Electron build
ELECTRON_DIR="${ELECTRON_DIR:-/path/to/electron/src/out/Testing}"
DIST_DIR="dist/cookie-encryption-fuse-test-linux-x64"

if [ ! -f "$ELECTRON_DIR/electron" ]; then
    echo "Error: electron not found at $ELECTRON_DIR"
    echo "Set ELECTRON_DIR environment variable or build Electron first (e build)"
    exit 1
fi

echo "=== Packaging with local Electron build ==="
echo "Source: $ELECTRON_DIR"
echo ""

echo "Creating app bundle..."
npx electron-packager . --platform=linux --arch=x64 --out=dist --overwrite
echo ""

echo "Replacing Electron files with local build..."

# Copy the main executable
cp "$ELECTRON_DIR/electron" "$DIST_DIR/cookie-encryption-fuse-test"

# Copy all .so files
cp "$ELECTRON_DIR"/*.so* "$DIST_DIR/" 2>/dev/null

# Copy all .bin files (V8 snapshots, etc.)
cp "$ELECTRON_DIR"/*.bin "$DIST_DIR/" 2>/dev/null

# Copy all .pak files
cp "$ELECTRON_DIR"/*.pak "$DIST_DIR/" 2>/dev/null

# Copy all .dat files
cp "$ELECTRON_DIR"/*.dat "$DIST_DIR/" 2>/dev/null

# Copy locales
if [ -d "$ELECTRON_DIR/locales" ]; then
    cp -R "$ELECTRON_DIR/locales" "$DIST_DIR/"
fi

# Copy resources
if [ -d "$ELECTRON_DIR/resources" ]; then
    cp -R "$ELECTRON_DIR/resources"/* "$DIST_DIR/resources/" 2>/dev/null
fi

echo ""

echo "Flipping cookie encryption fuse..."
node flip-fuse.js linux
echo ""

echo "=== Done! ==="
echo "Run the packaged app with: npm run test-packaged-linux"
echo "Or directly: $DIST_DIR/cookie-encryption-fuse-test"

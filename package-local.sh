#!/bin/bash

# Path to your local Electron build
ELECTRON_APP="${ELECTRON_APP:-/path/to/electron/src/out/Testing/Electron.app}"
DIST_APP="dist/cookie-encryption-fuse-test-darwin-arm64/cookie-encryption-fuse-test.app"

if [ ! -d "$ELECTRON_APP" ]; then
    echo "Error: Electron.app not found at $ELECTRON_APP"
    echo "Set ELECTRON_APP environment variable or build Electron first (e build)"
    exit 1
fi

echo "=== Packaging with local Electron build ==="
echo "Source: $ELECTRON_APP"
echo ""

echo "Creating app bundle..."
npx electron-packager . --platform=darwin --arch=arm64 --out=dist --overwrite
echo ""

echo "Replacing Electron.framework with local build..."
rm -rf "$DIST_APP/Contents/Frameworks/Electron Framework.framework"
cp -R "$ELECTRON_APP/Contents/Frameworks/Electron Framework.framework" \
      "$DIST_APP/Contents/Frameworks/"
rm -rf "$DIST_APP/Contents/MacOS/cookie-encryption-fuse-test"
cp "$ELECTRON_APP/Contents/MacOS/Electron" "$DIST_APP/Contents/MacOS/cookie-encryption-fuse-test"

# Copy helper apps
for helper in "$ELECTRON_APP/Contents/Frameworks/"*Helper*.app; do
    if [ -d "$helper" ]; then
        helper_name=$(basename "$helper")
        rm -rf "$DIST_APP/Contents/Frameworks/$helper_name"
        cp -R "$helper" "$DIST_APP/Contents/Frameworks/"
    fi
done
echo ""

echo "Flipping cookie encryption fuse..."
node flip-fuse.js
echo ""

echo "Re-signing app (ad-hoc)..."
xattr -cr "$DIST_APP"
codesign --deep --force --sign - "$DIST_APP"

echo ""
echo "=== Done! ==="
echo "Run the packaged app with: npm run test-packaged-mac"

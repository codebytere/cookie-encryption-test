# Cookie Encryption Fuse Test

Minimal reproduction app for testing Electron's cookie encryption fuse (`EnableCookieEncryption`).

### Package with released Electron

| Platform | Command |
|----------|---------|
| macOS | `npm run package-mac` |
| Windows | `npm run package-win` |
| Linux | `npm run package-linux` |

### Package with local Electron build

| Platform | Setup | Command |
|----------|-------|---------|
| macOS | Set `ELECTRON_APP` env var | `npm run package-mac-local` |
| Windows | Set `ELECTRON_DIR` env var | `npm run package-win-local` |
| Linux | Set `ELECTRON_DIR` env var | `npm run package-linux-local` |

### Run packaged app

| Platform | Command |
|----------|---------|
| macOS | `npm run test-packaged-mac` |
| Windows | `npm run test-packaged-win` |
| Linux | `npm run test-packaged-linux` |

## Expected Behavior

This repro should work on Electron 39.x and is borked on all Electron 40 alphas and betas up to 40.0.0-beta.8.

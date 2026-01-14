const { flipFuses, FuseVersion, FuseV1Options } = require('@electron/fuses');
const path = require('path');
const fs = require('fs');

// Allow overriding platform via command line arg (e.g., node flip-fuse.js win32)
const targetPlatform = process.argv[2] || process.platform;
let appPath;

if (targetPlatform === 'darwin') {
  appPath = path.join(__dirname, 'dist/cookie-encryption-fuse-test-darwin-arm64/cookie-encryption-fuse-test.app');
} else if (targetPlatform === 'win32') {
  appPath = path.join(__dirname, 'dist/cookie-encryption-fuse-test-win32-x64/cookie-encryption-fuse-test.exe');
} else {
  appPath = path.join(__dirname, 'dist/cookie-encryption-fuse-test-linux-x64/cookie-encryption-fuse-test');
}

if (!fs.existsSync(appPath)) {
  console.error(`Error: Packaged app not found at ${appPath}`);
  console.error('Run "npm run package" or "npm run package-win" first');
  process.exit(1);
}

console.log(`Flipping fuses for: ${appPath}`);
console.log('Enabling: EnableCookieEncryption');
console.log('');

flipFuses(appPath, {
  version: FuseVersion.V1,
  [FuseV1Options.EnableCookieEncryption]: true,
}).then(() => {
  console.log('✓ Fuses flipped successfully!');
  console.log('');
  console.log('Run the packaged app to test:');
  if (targetPlatform === 'darwin') {
    console.log('  npm run test-packaged-mac');
  } else if (targetPlatform === 'win32') {
    console.log('  npm run test-packaged-win');
  } else {
    console.log('  npm run test-packaged-linux');
  }
}).catch((err) => {
  console.error('Error flipping fuses:', err);
  process.exit(1);
});

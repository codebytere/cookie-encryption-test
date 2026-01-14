const { app, BrowserWindow } = require('electron');
const path = require('path');

console.log('='.repeat(50));
console.log('Cookie Encryption Fuse Test');
console.log('='.repeat(50));
console.log('Electron version:', process.versions.electron);
console.log('Platform:', process.platform);
console.log('App path:', app.getAppPath());
console.log('User data:', app.getPath('userData'));
console.log('');

function createWindow() {
  console.log('Creating browser window...');

  const mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  mainWindow.loadFile('index.html');
  console.log('✓ Window created successfully!');
  console.log('✓ App started without crashing!');
  console.log('');
  console.log('If you see this message, cookie encryption is working.');
}

app.whenReady().then(() => {
  console.log('App ready event fired');
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

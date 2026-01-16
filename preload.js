const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronInfo', {
  version: process.versions.electron,
  platform: process.platform
});

contextBridge.exposeInMainWorld('cookieTest', {
  onResults: (callback) => {
    ipcRenderer.on('cookie-test-results', (event, results) => {
      callback(results);
    });
  }
});

console.log('Preload script loaded successfully');

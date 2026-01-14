const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronInfo', {
  version: process.versions.electron,
  platform: process.platform
});

console.log('Preload script loaded successfully');

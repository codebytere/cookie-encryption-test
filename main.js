const { app, BrowserWindow, session, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

console.log('='.repeat(50));
console.log('Cookie Encryption Fuse Test');
console.log('='.repeat(50));
console.log('Electron version:', process.versions.electron);
console.log('Platform:', process.platform);
console.log('App path:', app.getAppPath());
console.log('User data:', app.getPath('userData'));
console.log('');

// Check cookie encryption status by looking at the Cookies file
function checkCookieEncryption() {
  const cookiesPath = path.join(app.getPath('userData'), 'Cookies');
  if (fs.existsSync(cookiesPath)) {
    const stats = fs.statSync(cookiesPath);
    console.log(`Cookies file exists: ${cookiesPath}`);
    console.log(`Cookies file size: ${stats.size} bytes`);
    return true;
  }
  return false;
}

async function testCookies(window) {
  console.log('\n--- Testing Cookie Functionality ---');

  const testUrl = 'https://example.com';
  const ses = session.defaultSession;

  try {
    // Clear existing cookies first
    await ses.clearStorageData({ storages: ['cookies'] });
    console.log('✓ Cleared existing cookies');

    // Set a test cookie
    const testCookie = {
      url: testUrl,
      name: 'test_cookie',
      value: 'encrypted_value_12345',
      expirationDate: Math.floor(Date.now() / 1000) + 3600
    };

    await ses.cookies.set(testCookie);
    console.log('✓ Set test cookie:', testCookie.name);

    // Set a second cookie with different attributes
    const secureCookie = {
      url: testUrl,
      name: 'secure_cookie',
      value: 'secret_data_67890',
      secure: true,
      httpOnly: true,
      expirationDate: Math.floor(Date.now() / 1000) + 7200
    };

    await ses.cookies.set(secureCookie);
    console.log('✓ Set secure cookie:', secureCookie.name);

    // Read cookies back
    const cookies = await ses.cookies.get({ url: testUrl });
    console.log(`✓ Retrieved ${cookies.length} cookies`);

    const results = {
      success: true,
      cookiesSet: 2,
      cookiesRetrieved: cookies.length,
      cookies: cookies.map(c => ({
        name: c.name,
        value: c.value,
        secure: c.secure,
        httpOnly: c.httpOnly
      })),
      encryptionFileExists: checkCookieEncryption()
    };

    // Verify the cookies match what we set
    const testCookieFound = cookies.find(c => c.name === 'test_cookie');
    const secureCookieFound = cookies.find(c => c.name === 'secure_cookie');

    if (!testCookieFound || testCookieFound.value !== testCookie.value) {
      results.success = false;
      results.error = 'Test cookie not found or value mismatch';
    } else if (!secureCookieFound || secureCookieFound.value !== secureCookie.value) {
      results.success = false;
      results.error = 'Secure cookie not found or value mismatch';
    }

    console.log('✓ Cookie validation:', results.success ? 'PASSED' : 'FAILED');
    if (results.error) {
      console.log('  Error:', results.error);
    }

    // Send results to renderer
    window.webContents.send('cookie-test-results', results);

    return results;

  } catch (error) {
    console.error('✗ Cookie test failed:', error.message);
    window.webContents.send('cookie-test-results', {
      success: false,
      error: error.message
    });
    return { success: false, error: error.message };
  }
}

function createWindow() {
  console.log('Creating browser window...');

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  mainWindow.loadFile('index.html');
  console.log('✓ Window created successfully!');

  // Run cookie tests after window loads
  mainWindow.webContents.on('did-finish-load', async () => {
    console.log('✓ Window loaded, running cookie tests...');
    await testCookies(mainWindow);
  });
}

app.whenReady().then(() => {
  console.log('App ready event fired');
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

document.getElementById('version').textContent = window.electronInfo.version;
document.getElementById('platform').textContent = window.electronInfo.platform;
document.getElementById('status').textContent = '⏳ Running tests...';
document.getElementById('status').style.color = '#fbbf24';

// Listen for cookie test results
window.cookieTest.onResults((results) => {
  console.log('Cookie test results:', results);

  const statusEl = document.getElementById('status');
  const resultsEl = document.getElementById('results');

  if (results.success) {
    statusEl.textContent = '✓ All Tests Passed!';
    statusEl.style.color = '#22c55e';

    let html = '<div class="test-success">';
    html += '<h3>Cookie Encryption Test Results</h3>';
    html += `<p>✓ Cookies Set: ${results.cookiesSet}</p>`;
    html += `<p>✓ Cookies Retrieved: ${results.cookiesRetrieved}</p>`;
    html += `<p>✓ Encryption File Exists: ${results.encryptionFileExists ? 'Yes' : 'No'}</p>`;
    html += '<h4>Cookie Details:</h4>';
    html += '<ul>';
    results.cookies.forEach(cookie => {
      html += `<li><strong>${cookie.name}</strong>: ${cookie.value}`;
      if (cookie.secure) html += ' [Secure]';
      if (cookie.httpOnly) html += ' [HttpOnly]';
      html += '</li>';
    });
    html += '</ul>';
    html += '</div>';

    resultsEl.innerHTML = html;
  } else {
    statusEl.textContent = '✗ Tests Failed';
    statusEl.style.color = '#ef4444';

    let html = '<div class="test-failure">';
    html += '<h3>Cookie Test Failed</h3>';
    html += `<p>Error: ${results.error || 'Unknown error'}</p>`;
    html += '</div>';

    resultsEl.innerHTML = html;
  }
});

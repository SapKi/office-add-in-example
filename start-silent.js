const { exec } = require('child_process');
const path = require('path');

console.log('Starting webpack dev server (hidden)...');

// Start webpack dev server in hidden window using PowerShell
const webpackCmd = 'powershell -WindowStyle Hidden -Command "Start-Process -FilePath \'npx\' -ArgumentList \'webpack\',\'serve\',\'--mode\',\'development\' -WindowStyle Hidden"';
exec(webpackCmd, { cwd: __dirname }, (error) => {
  if (error) {
    console.error('Error starting webpack:', error);
    return;
  }
  
  console.log('Waiting 8 seconds for server to start...');
  
  // Wait 8 seconds for webpack to start, then sideload
  setTimeout(() => {
    console.log('Sideloading add-in into Word...');
    
    // Word should open visibly, auto-answer "Yes" to loopback question
    const officeCmd = 'powershell -Command "$input = \'Yes\'; $input | npx office-addin-debugging start manifest.xml desktop"';
    exec(officeCmd, { cwd: __dirname }, (error) => {
      if (error) {
        console.error('Error sideloading:', error);
      } else {
        console.log('Done! Word should open now.');
        console.log('The webpack server is running in the background.');
      }
      // Exit after a moment
      setTimeout(() => process.exit(0), 2000);
    });
  }, 8000);
});

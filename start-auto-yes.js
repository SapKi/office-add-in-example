const { spawn } = require('child_process');
const readline = require('readline');

console.log('Starting webpack dev server...');

// Start webpack dev server
const webpack = spawn('npx', ['webpack', 'serve', '--mode', 'development'], {
  stdio: 'inherit',
  shell: true,
  windowsHide: true,
});

// Wait for server to start, then sideload with auto-yes
setTimeout(() => {
  console.log('Sideloading add-in into Word (auto-answering Yes)...');
  
  // Use echo to pipe "Yes" to the office-addin-debugging command
  const officeDebug = spawn('cmd', ['/c', 'echo Yes | npx office-addin-debugging start manifest.xml desktop'], {
    shell: true,
    stdio: 'inherit',
    windowsHide: true,
  });

  officeDebug.on('close', (code) => {
    console.log(`Add-in sideloaded. Word should open.`);
  });
}, 8000);

webpack.on('close', (code) => {
  process.exit(code);
});

process.on('SIGINT', () => {
  webpack.kill();
  process.exit();
});

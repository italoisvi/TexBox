const path = require('path');
const url = require('url');
const { spawn } = require('child_process');

ipcMain.on('execute-command', (event, command) => {
  const child = spawn('node', [path.join(__dirname, 'countlines.js'), command]);

  let outputData = '';
  child.stdout.on('data', (data) => {
    outputData += data;
  });

  child.stderr.on('data', (data) => {
    outputData += data;
  });

  child.on('close', () => {
    mainWindow.webContents.send('command-result', outputData);
  });
});
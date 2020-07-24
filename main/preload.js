const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('main', {
  request: (request) => ipcRenderer.send('request', request),
  onResponse: (fn) => {
    // Do not send the event since it includes the sender.
    ipcRenderer.on('response', (_event, response) => fn(response));
  }
});

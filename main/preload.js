const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('main', {
  request: (request) => {
    ipcRenderer.send('request', request);
    return new Promise((resolve, _reject) => {
      // Do not send the event since it includes the sender.
      ipcRenderer.once('response', (_event, response) => resolve(response));
    });
  }
});

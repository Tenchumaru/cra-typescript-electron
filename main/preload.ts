const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('main', {
  showMessageBox: (message, buttons, title, type) => {
    return request({ kind: 'showMessageBox', buttons, message, title, type });
  },
  showOpenDialog: (defaultPath, title) => {
    return request({ kind: 'showOpenDialog', defaultPath, title });
  },
  showSaveDialog: (defaultPath, title) => {
    return request({ kind: 'showSaveDialog', defaultPath, title });
  },
});

function request(request) {
  ipcRenderer.send('request', request);
  return new Promise((resolve, _reject) => {
    // Do not send the event since it includes the sender.
    ipcRenderer.once('response', (_event, response) => resolve(response));
  });
}

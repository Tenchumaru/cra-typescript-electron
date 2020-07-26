import { contextBridge, ipcRenderer } from 'electron';
import { Request } from './request';

type MessageBoxType = 'none' | 'info' | 'error' | 'question' | 'warning';

contextBridge.exposeInMainWorld('main', {
  readFile: (filePath: string): Promise<string> => {
    return request({ kind: 'readFile', filePath });
  },
  showMessageBox: (message: string, buttons?: string[], title?: string, type?: MessageBoxType): Promise<number> => {
    return request({ kind: 'showMessageBox', buttons, message, title, type });
  },
  showOpenDialog: (defaultPath?: string, title?: string): Promise<string | undefined> => {
    return request({ kind: 'showOpenDialog', defaultPath, title });
  },
  showSaveDialog: (defaultPath?: string, title?: string): Promise<string | undefined> => {
    return request({ kind: 'showSaveDialog', defaultPath, title });
  },
  writeFile: (filePath: string, data: string): Promise<void> => {
    return request({ kind: 'writeFile', filePath, data });
  },
});

function request<T>(request: Request): Promise<T> {
  ipcRenderer.send('request', request);
  return new Promise<T>((resolve, reject) => {
    // Do not include the event since it includes the sender.
    ipcRenderer.once('response', (_event, response, ex: Error) => {
      if (ex) {
        reject(ex);
      } else {
        resolve(response);
      }
    });
  });
}

import { contextBridge, ipcRenderer } from 'electron';

interface Entry {
  reject: Function;
  resolve: Function;
}

interface Response {
  data: unknown;
  id: number;
}

type MessageBoxType = 'none' | 'info' | 'error' | 'question' | 'warning';
type ObserverFn = (message: string) => void;

(() => {
  const entries: { [key: number]: Entry } = {};
  let messageHandler: ObserverFn = (_) => { };

  ipcRenderer.on('main', (_event, message: string) => {
    // Do not include the event since it includes the sender.
    messageHandler(message);
  });

  ipcRenderer.on('response', (_event, id: number, response: Response, ex: Error) => {
    // Do not include the event since it includes the sender.
    const entry = entries[id];
    delete entries[id];
    if (ex) {
      entry.reject(ex);
    } else {
      entry.resolve(response);
    }
  });

  contextBridge.exposeInMainWorld('main', {
    delayResponse: (duration: number, value: string): Promise<string> => {
      return ipcRenderer.invoke('delayResponse', duration, value);
    },
    readFile: (filePath: string): Promise<string> => {
      return ipcRenderer.invoke('readFile', filePath);
    },
    showMessageBox: (message: string, buttons?: string[], title?: string, type?: MessageBoxType): Promise<number> => {
      return ipcRenderer.invoke('showMessageBox', { buttons, message, title, type });
    },
    showOpenDialog: (defaultPath?: string, title?: string): Promise<string | undefined> => {
      return ipcRenderer.invoke('showOpenDialog', { defaultPath, title });
    },
    showSaveDialog: (defaultPath?: string, title?: string): Promise<string | undefined> => {
      return ipcRenderer.invoke('showSaveDialog', { defaultPath, title });
    },
    setMessageHandler: (fn: ObserverFn): void => {
      messageHandler = fn;
    },
    writeFile: (filePath: string, data: string): Promise<void> => {
      return ipcRenderer.invoke('writeFile', filePath, data);
    },
  });
})();

import { contextBridge, ipcRenderer, MessageBoxOptions } from 'electron';

type ObserverFn = (message: string) => void;

(() => {
  let messageHandler: ObserverFn = (_) => { };

  ipcRenderer.on('main', (_event, message: string) => {
    // Do not include the event since it includes the sender.
    messageHandler(message);
  });

  contextBridge.exposeInMainWorld('main', {
    delayResponse: (duration: number, value: string): Promise<string> => {
      return ipcRenderer.invoke('delayResponse', duration, value);
    },
    readFile: (filePath: string): Promise<string> => {
      return ipcRenderer.invoke('readFile', filePath);
    },
    showMessageBox: (options: MessageBoxOptions): Promise<number> => {
      return ipcRenderer.invoke('showMessageBox', options);
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
    startTimer: (): void => {
      ipcRenderer.send('startTimer');
    },
    stopTimer: (): void => {
      ipcRenderer.send('stopTimer');
    },
    writeFile: (filePath: string, data: string): Promise<void> => {
      return ipcRenderer.invoke('writeFile', filePath, data);
    },
  });
})();

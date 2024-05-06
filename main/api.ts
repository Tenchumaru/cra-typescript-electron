import { BrowserWindow, ipcMain, dialog, MessageBoxOptions, OpenDialogOptions, SaveDialogOptions } from 'electron';
import { readFile, writeFile } from 'fs/promises';
import { EOL } from 'os';

export interface IApi {
  startTimer: () => void;
  stopTimer: () => void;
  activeWindow: BrowserWindow;
}

export function createApi(): IApi {
  let activeWindow: BrowserWindow;
  let timerId: ReturnType<typeof setInterval> | undefined;

  ipcMain.handle('delayResponse', async (_event, duration: number, value: string) => {
    console.log('received delayResponse:', duration, value);
    await new Promise<void>((resolve) => {
      setTimeout(resolve, duration);
    });
    console.log('responding to delayResponse:', value);
    return value;
  });
  ipcMain.handle('readFile', (_event, filePath: string) => {
    return readFile(filePath, 'utf8');
  });
  ipcMain.handle('showMessageBox', async (_event, request: MessageBoxOptions) => {
    const { response } = await dialog.showMessageBox(activeWindow, request);
    return response;
  });
  ipcMain.handle('showOpenDialog', async (_event, request: OpenDialogOptions) => {
    const response = await dialog.showOpenDialog(activeWindow, request);
    return response.filePaths[0];
  });
  ipcMain.handle('showSaveDialog', async (_event, request: SaveDialogOptions) => {
    const response = await dialog.showSaveDialog(activeWindow, request);
    return response.filePath;
  });
  ipcMain.handle('writeFile', (_event, filePath: string, data: string) => {
    if (process.platform === 'win32' && !~data.indexOf('\r\n')) {
      data = data.replace(/\n/g, EOL);
    }
    return writeFile(filePath, data, 'utf8');
  });
  ipcMain.on('startTimer', (_event) => {
    startTimer();
  });
  ipcMain.on('stopTimer', (_event) => {
    stopTimer();
  });

  return {
    startTimer,
    stopTimer,
    get activeWindow() {
      return activeWindow;
    },
    set activeWindow(value: BrowserWindow) {
      activeWindow = value;
    },
  };

  function startTimer() {
    if (!timerId) {
      timerId = setInterval(() => activeWindow.webContents.send('now', new Date().toString()), 1000);
    }
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = undefined;
    }
  }
}

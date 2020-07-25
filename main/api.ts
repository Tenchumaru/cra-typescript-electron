import { BrowserWindow, ipcMain, dialog } from 'electron';

interface MessageBoxOptions {
  kind: 'showMessageBox';
  buttons?: string[];
  message: string;
  title?: string;
  type?: 'none' | 'info' | 'error' | 'question' | 'warning';
}

interface OpenDialogOptions {
  kind: 'showOpenDialog';
  defaultPath?: string;
  title?: string;
}

interface SaveDialogOptions {
  kind: 'showSaveDialog';
  defaultPath?: string;
  title?: string;
}

type Request = MessageBoxOptions | OpenDialogOptions | SaveDialogOptions;

export function configure(window: BrowserWindow) {
  ipcMain.removeAllListeners('request');
  ipcMain.on('request', async (_event, request: Request) => {
    let response: number | string | undefined;
    switch (request.kind) {
      case 'showMessageBox':
        delete request.kind;
        const a = await dialog.showMessageBox(window, request);
        response = a.response;
        break;
      case 'showOpenDialog':
        delete request.kind;
        const b = await dialog.showOpenDialog(window, request);
        response = b.filePaths[0];
        break;
      case 'showSaveDialog':
        delete request.kind;
        const c = await dialog.showSaveDialog(window, request);
        response = c.filePath;
        break;
    }
    window.webContents.send('response', response);
  });
}

import { BrowserWindow, ipcMain, dialog } from 'electron';
import { Request } from './request';

export function configure(window: BrowserWindow) {
  ipcMain.removeAllListeners('request');
  ipcMain.on('request', async (_event, request: Request) => {
    let response: number | string | undefined;
    switch (request.kind) {
      case 'showMessageBox':
        delete request.kind;
        response = (await dialog.showMessageBox(window, request)).response;
        break;
      case 'showOpenDialog':
        delete request.kind;
        response = (await dialog.showOpenDialog(window, request)).filePaths[0];
        break;
      case 'showSaveDialog':
        delete request.kind;
        response = (await dialog.showSaveDialog(window, request)).filePath;
        break;
    }
    window.webContents.send('response', response);
  });
}

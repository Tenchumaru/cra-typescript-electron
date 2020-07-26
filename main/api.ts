import { BrowserWindow, ipcMain, dialog } from 'electron';
import fs from 'fs';
import { EOL } from 'os';
import { Request } from './request';

export function configure(window: BrowserWindow) {
  ipcMain.removeAllListeners('request');
  ipcMain.on('request', (_event, request: Request) => fulfillRequest(window, request));
}

async function fulfillRequest(window: BrowserWindow, request: Request) {
  try {
    let response: number | string | undefined;
    switch (request.kind) {
      case 'readFile':
        response = await readFile(request.filePath);
        break;
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
      case 'writeFile':
        await writeFile(request.filePath, process.platform === 'win32' ? request.data.replace(/\\n/g, EOL) : request.data);
        break;
    }
    window.webContents.send('response', response);
  } catch (ex) {
    window.webContents.send('response', undefined, ex);
  }
}

function readFile(filePath: string): Promise<string> {
  return new Promise<string>((resove, reject) => {
    fs.readFile(filePath, { encoding: 'utf8' }, (ex, data) => {
      if (ex) {
        reject(ex);
      } else {
        resove(data);
      }
    });
  });
}

function writeFile(filePath: string, data: string): Promise<void> {
  return new Promise<void>((resove, reject) => {
    fs.writeFile(filePath, data, { encoding: 'utf8' }, (ex) => {
      if (ex) {
        reject(ex);
      } else {
        resove();
      }
    });
  });
}

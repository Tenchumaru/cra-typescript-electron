import { IpcMainEvent, BrowserWindow, ipcMain, dialog } from 'electron';
import { readFile, writeFile } from 'fs/promises';
import { EOL } from 'os';
import { Request } from './request';

let activeWindow: BrowserWindow;

ipcMain.on('request', fulfillRequest);

export function setActiveWindow(window: BrowserWindow) {
  activeWindow = window;
}

async function fulfillRequest(event: IpcMainEvent, id: number, request: Request) {
  try {
    let response: number | string | undefined;
    switch (request.kind) {
      case 'delayResponse':
        console.log('received delayResponse:', request.duration, request.value);
        await new Promise<void>((resolve) => {
          setTimeout(resolve, request.duration);
        });
        console.log('responding to delayResponse:', request.value);
        response = request.value;
        break;
      case 'readFile':
        response = await readFile(request.filePath, 'utf8');
        break;
      case 'showMessageBox':
        delete request.kind;
        response = (await dialog.showMessageBox(activeWindow, request)).response;
        break;
      case 'showOpenDialog':
        delete request.kind;
        response = (await dialog.showOpenDialog(activeWindow, request)).filePaths[0];
        break;
      case 'showSaveDialog':
        delete request.kind;
        response = (await dialog.showSaveDialog(activeWindow, request)).filePath;
        break;
      case 'writeFile':
        await writeFile(request.filePath, process.platform === 'win32' ? request.data.replace(/\\n/g, EOL) : request.data, 'utf8');
        break;
    }
    event.reply('response', id, response);
  } catch (ex) {
    event.reply('response', id, undefined, ex);
  }
}

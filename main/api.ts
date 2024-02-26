import { BrowserWindow, ipcMain, dialog, MessageBoxOptions, OpenDialogOptions, SaveDialogOptions } from 'electron';
import { readFile, writeFile } from 'fs/promises';
import { EOL } from 'os';

let activeWindow: BrowserWindow;

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

export function setActiveWindow(window: BrowserWindow) {
  activeWindow = window;
}

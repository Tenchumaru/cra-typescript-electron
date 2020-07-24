// Modules to control application life and create native browser window
import { join } from 'path';
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { format, parse } from 'url';

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

// Keep a global reference of the window object otherwise the window will
// be closed automatically when the JavaScript object is garbage-collected.
let mainWindow: Electron.BrowserWindow | undefined;

ipcMain.on('request', async (_event, request: Request) => {
  let response: number | string | undefined;
  switch (request.kind) {
    case 'showMessageBox':
      const a = await dialog.showMessageBox(mainWindow!, request);
      response = a.response;
      break;
    case 'showOpenDialog':
      const b = await dialog.showOpenDialog(mainWindow!, request);
      response = b.filePaths[0];
      break;
    case 'showSaveDialog':
      const c = await dialog.showSaveDialog(mainWindow!, request);
      response = c.filePath;
      break;
  }
  mainWindow!.webContents.send('response', response);
});

function createWindow() {
  // Create the browser window.
  const preload = join(__dirname, 'preload.js');
  const webPreferences = { contextIsolation: true, nodeIntegration: false, preload };
  mainWindow = new BrowserWindow({ width: 800, height: 600, webPreferences });

  // Load the index.html of the app.
  mainWindow.loadURL(composeApplicationUrl());

  // Open the Chromium Development Tools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows in an
    // array if your app supports multi windows, this is the time when you
    // should delete the corresponding element.
    mainWindow = undefined;
  });

  // Test Web request overriding.
  const { session } = require('electron');
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    const url = parse(details.url);
    if (url.hostname === 'localhost' && url.protocol === 'https:') {
      callback({ redirectURL: 'http://httpbin.org/get' });
    } else if (url.hostname && url.hostname.startsWith('localhost.test') && url.hash) {
      callback({ redirectURL: composeApplicationUrl() + url.hash });
    } else {
      callback({});
    }
  });
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['X-Requested-With'] = `cra-typescript-electron; ${app.getVersion()}`;
    callback({ requestHeaders: details.requestHeaders });
  });

  function composeApplicationUrl() {
    // tslint:disable:object-literal-sort-keys
    const query = {
      this: 1,
      that: 'two',
    };
    const url = process.env.DEV_URL ? format({
      ...parse(process.env.DEV_URL),
      query,
    }) : format({
      protocol: 'file',
      pathname: join(__dirname, '..', 'build', 'index.html'),
      query,
    });
    return url;
    // tslint:enable
  }
}

// This method will be called when Electron has finished initialization and
// is ready to create browser windows.  Some APIs can be used only after
// this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it's common for applications and their menu bar to stay active
  // until the user quits explicitly with Cmd+Q.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the dock icon
  // is clicked and there are no other windows open.
  if (!mainWindow) {
    createWindow();
  }
});

// Modules to control application life and create native browser window
import { join } from 'path';
import { app, BrowserWindow, Menu, MenuItem, session } from 'electron';
import { format, urlToHttpOptions } from 'url';
import { createApi } from './api';
import { ChildProcess, spawn, spawnSync } from 'child_process';

// Keep references to all window objects so they aren't garbage-collected.
const windows: BrowserWindow[] = [];

const api = createApi();

function createWindow() {
  // Create the browser window.
  const preload = join(__dirname, 'preload.js');
  const webPreferences = { contextIsolation: true, nodeIntegration: false, preload };
  const window = new BrowserWindow({ width: 800, height: 600, webPreferences });

  // Check the current application menu.
  const menu = Menu.getApplicationMenu();
  if (menu) {
    const submenu = menu.items[process.platform === 'darwin' ? 1 : 0].submenu!;
    if (submenu.items.length < 2) {
      // Add the "New Window" command to the application "File" menu.
      submenu.insert(0, new MenuItem({ click: createWindow, label: '&New Window', accelerator: 'CommandOrControl+N' }));
      Menu.setApplicationMenu(menu);

      // Test Web request overriding.
      session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
        const url = new URL(details.url);
        if (url.hostname === 'localhost' && url.protocol === 'https:') {
          callback({ redirectURL: 'http://httpbin.org/get' });
        } else if (url.hostname && url.hostname.startsWith('localhost.test') && url.hash) {
          callback({ redirectURL: composeApplicationUrl() + url.hash });
        } else {
          callback({});
        }
      });

      // Set the "X-Requested-With" header of all requests.
      session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['X-Requested-With'] = `cra-typescript-electron; ${app.getVersion()}`;
        callback({ requestHeaders: details.requestHeaders });
      });
    }
  }

  // Load the index.html of the app.
  window.loadURL(composeApplicationUrl());

  // Open the Chromium Development Tools.
  // window.webContents.openDevTools();

  window.webContents.on('did-finish-load', () => {
    // This might run multiple times since it depends on the renderer process.
    api.startTimer();
  });

  // Emitted when the window is closed.
  window.on('closed', () => {
    // Remove the window from the collection.
    windows.splice(0, windows.length, ...windows.filter((e) => e !== window));
  });

  // Emitted when the window gains focus.
  window.on('focus', () => {
    api.activeWindow = window;
  });

  windows.push(window);

  function composeApplicationUrl(): string {
    // tslint:disable:object-literal-sort-keys
    const query = {
      this: 1,
      that: 'two',
    };
    const url = process.env.DEV_URL ? format({
      ...urlToHttpOptions(new URL(process.env.DEV_URL)),
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

async function startApplication() {
  if (process.env.DEV_URL) {
    await runNpmAsync('exit', 'electron:wait-for-web');
  }
  createWindow();
}

function runNpmAsync(event: string, command: string): Promise<ChildProcess> {
  const options = { shell: process.platform === 'win32' };
  return new Promise<ChildProcess>((resolve, reject) => {
    const child = spawn('npm', ['run', command], options);
    child.on('error', reject);
    child.on(event, () => resolve(child));
  });
}

// This method will be called when Electron has finished initialization and
// is ready to create browser windows.  Some APIs can be used only after
// this event occurs.
app.on('ready', startApplication);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    api.stopTimer();

  // On OS X it's common for applications and their menu bar to stay active
  // until the user quits explicitly with Cmd+Q.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the dock icon
  // is clicked and there are no other windows open.
  if (!windows.length) {
    createWindow();
  }
});

// Visual Studio starts a debugging session by running start.js, which sets the
// START_PID environment variable.  On Windows, killing it with the /T flag
// will stop all of the processes it started, including Electronmon and the
// Web, ensuring a complete shut-down.  Perform this process termination iff
// quitting due to user action instead of Electronmon.
const startPid = process.env['START_PID'];
if (startPid) {
  let reloading = false;
  process.on('message', (message) => {
    if (message === 'reset') {
      reloading = true;
    }
  });
  app.on('quit', () => {
    if (!reloading) {
      if (process.platform === 'win32') {
        spawnSync('taskkill', ['/F', '/PID', startPid, '/T']);
      } else {
        process.kill(Number(startPid));
      }
    }
  });
}

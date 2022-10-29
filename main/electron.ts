// Modules to control application life and create native browser window
import { join } from 'path';
import { app, BrowserWindow, Menu, MenuItem, session } from 'electron';
import { format, parse } from 'url';
import { setActiveWindow } from './api';
import { ChildProcess, spawn, spawnSync } from 'child_process';

// Keep references to all window objects so they aren't garbage-collected.
const windows: BrowserWindow[] = [];

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
        const url = parse(details.url);
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

  let timerId: ReturnType<typeof setInterval>;
  window.webContents.on('did-finish-load', () => {
    timerId = setInterval(() => window.webContents.send('main', new Date().toString()), 990);
  });

  // Emitted when the window is to be closed.
  window.on('close', () => {
    clearInterval(timerId);
  });

  // Emitted when the window is closed.
  window.on('closed', () => {
    // Remove the window from the collection.
    windows.splice(0, windows.length, ...windows.filter((e) => e !== window));
  });

  // Emitted when the window gains focus.
  window.on('focus', () => {
    setActiveWindow(window);
  });

  windows.push(window);

  function composeApplicationUrl(): string {
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

let child: ChildProcess;

async function startApplication() {
  if (process.env.DEV_URL) {
    const options = process.platform === 'win32' ? { shell: true } : {};
    await new Promise((resolve, reject) => {
      child = spawn('yarn', ['electron:start-react'], options);
      child.on('error', reject);
      child.on('spawn', resolve);
    });
    await new Promise((resolve, reject) => {
      const waiter = spawn('yarn', ['electron:wait-for-react'], options);
      waiter.on('error', reject);
      waiter.on('exit', resolve);
    })
  }
  createWindow();
}

// This method will be called when Electron has finished initialization and
// is ready to create browser windows.  Some APIs can be used only after
// this event occurs.
app.on('ready', startApplication);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it's common for applications and their menu bar to stay active
  // until the user quits explicitly with Cmd+Q.
  if (process.platform !== 'darwin') {
    if (child) {
      if (process.platform === 'win32') {
        spawnSync('taskkill', ['/f', '/pid', child.pid!.toString(), '/t']);
      } else {
        child.kill();
      }
    }
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

# Debug

## Windows

### Development build

Debug the application in Visual Studio 2019 or 2022 in the same fashion as any other application.  Either set breakpoints in the
main process TypeScript files (e.g. `main\electron.ts`) as desired and select **Start Debugging** from the **Debug** menu (or press
**F5**) or place the cursor on any line of code in one of the main process TypeScript files and press **Ctrl+F10** to run to that
line.  After several seconds pass, the Electron application will start.  The Electron application window might appear behind the
Visual Studio window.

### Release build

1. Run `dist\win-unpacked\cra-typescript-electron.exe --inspect-brk=6006`.  The application will start but no window will appear.
1. Set breakpoints in the main process TypeScript files (e.g. `main\electron.ts`) as desired.
1. Select **Attach to Process...** from the **Debug** menu (or press **Ctrl+Alt+P**).  The **Attach to Process** dialog will open.
1. Select **Chrome devtools protocol websocket (no authentication)** in the **Connection type** drop-down list box.  The **Available processes** list view will empty.
1. Enter **127.0.0.1:6006** in the **Connection target** text box then click the **Refresh** button.  A process will appear in the **Available processes** list view and the **Attach** button will enable.
1. Click the **Attach** button.  The **Attach to 'file://' - Select Code Type** dialog will appear.
1. Click the **JavaScript (Node.js 8+)** check box then click the **OK** button.  All dialogs will disappear and the Electron application window will appear.

https://stackoverflow.com/questions/46500302/attach-visual-studio-debugger-to-electron-app

## macOS

### Development build

1. Run `yarn start --inspect-brk=6006`.  The application will start but no window will appear.
1. Visit `chrome://inspect/#devices` in Chrome.
1. Click the **inspect** link.  The debugger will load `main.js`.
1. If necessary, add the `.../cra-typescript-electron/main` folder to the workspace by clicking the `+` icon, navigating to it, and selecting it.
1. Set breakpoints as desired in the `.ts` files in the `main` folder and click the **Run** button to continue.
1. After debugging, close the `devtools:` Chrome window to allow the application to shut down.

### Release build

1. Run `'./dist/mac/CRA TypeScript Electron.app/Contents/MacOS/CRA TypeScript Electron' --inspect-brk=6006`.  The application will start but no window will appear.
1. Visit `chrome://inspect/#devices` in Chrome.
1. Click the **inspect** link.  The debugger will load `electron.js`.
1. If necessary, add the `.../cra-typescript-electron/dist/mac/CRA TypeScript Electron.app/Contents/Resources/app.asar/build` folder to the workspace by clicking the `+` icon, navigating to it, and selecting it.
1. Set breakpoints as desired in the `.js` files in the `build` folder and click the **Run** button to continue.
1. After debugging, close the `devtools:` Chrome window to allow the application to shut down.

The release build does not have source maps so breakpoints must be set in `.js` files instead of `.ts` files.  The files are in the
folder given in step 4 above.

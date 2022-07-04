# Debug

## Windows

Debug the application in Visual Studio 2019 or 2022 in the same fashion as any other application.  Either set breakpoints in the
main process TypeScript files (e.g. `main\electron.ts`) as desired and select **Start Debugging** from the **Debug** menu (or press
**F5**) or place the cursor on any line of code in one of the main process TypeScript files and press **Ctrl+F10** to run to that
line.  After several seconds pass, the Electron application will start.  The Electron application window might appear behind the
Visual Studio window.

It is also possible to debug a release build.  Run `dist\win-unpacked\cra-typescript-electron.exe --inspect-brk=6006` and follow these steps.

1. Set breakpoints in the main process TypeScript files (e.g. `main\electron.ts`) as desired.
1. Select **Attach to Process...** from the **Debug** menu (or press **Ctrl+Alt+P**).  The **Attach to Process** dialog will open.
1. Select **Chrome devtools protocol websocket (no authentication)** in the **Connection type** drop-down list box.  The **Available processes** list view will empty.
1. Enter **127.0.0.1:6006** in the **Connection target** text box then click the **Refresh** button.  A process will appear in the **Available processes** list view and the **Attach** button will enable.
1. Click the **Attach** button.  The **Attach to 'file://' - Select Code Type** dialog will appear.
1. Click the **JavaScript (Node.js 8+)** check box then click the **OK** button.  All dialogs will disappear and the Electron application will start.

https://stackoverflow.com/questions/46500302/attach-visual-studio-debugger-to-electron-app

## macOS

Run `'dist/mac/CRA TypeScript Electron.app/Contents/MacOS/CRA TypeScript Electron' --inspect-brk=6006` and connect to it with the
Chrome Developer Tools.

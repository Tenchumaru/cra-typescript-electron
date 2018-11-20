Follow these steps to debug the application in Visual Studio 2017.

1. Ensure no instance of the application is running.
2. In Visual Studio, select "Start Debugging" from the "Debug" menu (or press F5).  This will open a command prompt but will not start the application.
3. Set breakpoints in the main process JavaScript files (e.g. public\electron.js) as desired.
4. Select "Attach to Process..." from the "Debug" menu (or press Ctrl+Alt+P).  The "Attach to Process" dialog will open.
5. Select "Webkit websocket (no authentication)" in the "Connection type" drop-down list box.  The "Available processes" list view will empty.
6. Enter "127.0.0.1:6006" in the "Connection target" text box then click the "Refresh" button.  A process will appear in the "Available processes" list view and the "Attach" button will enable.
7. Click the "Attach" button.  The "Attach to 'file://' - Select Code Type" dialog will appear.
8. Click the "JavaScript (Node.js 8+)" check box then click the "OK" button.  All dialogs will disappear.

Upon closing the Electron application, the command prompt opened in step 2 will close.

https://stackoverflow.com/questions/46500302/attach-visual-studio-debugger-to-electron-app

It is also possible to debug a release build.  Run `dist\win-unpacked\cra-typescript-electron.exe --inspect-brk=6006` and follow the above steps starting with step 4.

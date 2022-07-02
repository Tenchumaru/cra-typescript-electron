Follow these steps to debug the application in Visual Studio 2017 or 2019.  TypeScript debugging of Node processes is broken in Visual Studio 2022.

1. Ensure no instance of the application is running.
1. Run `yarn xpile` in a command prompt.  This will build the necessary JavaScript files.
1. In Visual Studio, ensure the `electron` project is the start-up project by right-clicking it and selecting **Set as Startup Project**.
1. In Visual Studio, select **Start Debugging** from the **Debug** menu (or press **F5**).  This will open a command prompt but will not start the application.
1. Set breakpoints in the main process TypeScript files (e.g. `main\electron.ts`) as desired.  They will appear disabled.
1. Select **Attach to Process...** from the **Debug** menu (or press **Ctrl+Alt+P**).  The **Attach to Process** dialog will open.
1. Select **Chrome devtools protocol websocket (no authentication)** (**Webkit websocket (no authentication)** in Visual Studio 2017) in the **Connection type** drop-down list box.  The **Available processes** list view will empty.
1. Enter **127.0.0.1:6006** in the **Connection target** text box then click the **Refresh** button.  A process will appear in the **Available processes** list view and the **Attach** button will enable.
1. Click the **Attach** button.  The **Attach to 'file://' - Select Code Type** dialog will appear.
1. Click the **JavaScript (Node.js 8+)** check box then click the **OK** button.  All dialogs will disappear, all breakpoints will enable, and the Electron application will start.

The Electron application window might appear behind the Visual Studio Window.

Upon closing the Electron application, the command prompt opened in step 4 will close.

https://stackoverflow.com/questions/46500302/attach-visual-studio-debugger-to-electron-app

It is also possible to debug a release build.  Run `dist\win-unpacked\cra-typescript-electron.exe --inspect-brk=6006` and follow the above steps starting with step 5.

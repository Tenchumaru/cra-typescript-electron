# Create-React-App TypeScript Electron

This project demonstrates using a React front end in an Electron application with both the front end (i.e., the "renderer" process
in Electron) and the back end (i.e., the "main" process in Electron) implemented in TypeScript.  Also, the React front end has not
been "ejected" so there is no explicit WebPack configuration (i.e., the React scripts control WebPack).

Here is [the LinkedIn article](https://www.linkedin.com/pulse/notes-create-react-app-using-typescript-electron-chris-idzerda/)
referencing this repository.  Here is [the React README](React.md) created as a result of creating the front end of this repository.

Since NPM is a command line tool, perform all references to running `npm` commands on the command line in the project directory.
After cloning it, run `npm i` to initialize the project.  If you have Node installed, it must be at least version 14.

To run the tests in the project, run `npm test`.  Due to TypeScript compilation, it will take several seconds for the tests to
start running.

To run the project, run `npm start`.  If you'd like to debug the application using Visual Studio 2017 or above on Windows, open
[the solution file](cra-typescript-electron.sln) and follow [these debugging instructions](DEBUG.md).

To build the project for release, run `npm run release`.  This will create both the app and an installer (`.exe` for Windows and `.dmg`
for macOS) in the `dist` directory.  The app is in a subdirectory (`dist\win-unpacked` for Windows and `dist/mac/CRA TypeScript
Electron.app/Contents/MacOS` for macOS).  Build errors are usually the result of updating the project.  Delete the `node_modules`
directory and run `npm i` to recreate it.

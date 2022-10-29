export type MessageBoxType = 'none' | 'info' | 'error' | 'question' | 'warning';
export type ObserverFn = (message: string) => void;

declare global {
  interface Window {
    main: {
      delayResponse: (duration: number, value: string) => Promise<string>;
      readFile: (filePath: string) => Promise<string>;
      showMessageBox: (message: string, buttons?: string[], title?: string, type?: MessageBoxType) => Promise<number>;
      showOpenDialog: (defaultPath?: string, title?: string) => Promise<string | undefined>;
      showSaveDialog: (defaultPath?: string, title?: string) => Promise<string | undefined>;
      setMessageHandler: (fn: ObserverFn) => void;
      writeFile: (filePath: string, data: string) => Promise<void>;
    },
  }
}

const observers: ObserverFn[] = [];

function onMessage(message: string) {
  for (const observer of observers) {
    observer(message);
  }
}

window.main.setMessageHandler(onMessage);

export function delayResponse(duration: number, value: string): Promise<string> {
  return window.main.delayResponse(duration, value);
}

export function readFile(filePath: string): Promise<string> {
  return window.main.readFile(filePath);
}

export function showMessageBox(message: string, buttons?: string[], title?: string, type?: MessageBoxType): Promise<number> {
  return window.main.showMessageBox(message, buttons, title, type);
}

export function showOpenDialog(defaultPath?: string, title?: string): Promise<string | undefined> {
  return window.main.showOpenDialog(defaultPath, title);
}

export function showSaveDialog(defaultPath?: string, title?: string): Promise<string | undefined> {
  return window.main.showSaveDialog(defaultPath, title);
}

export function subscribe(fn: ObserverFn): void {
  if (!~observers.indexOf(fn)) {
    observers.push(fn);
  }
}

export function unsubscribe(fn: ObserverFn): void {
  const index = observers.indexOf(fn);
  if (~index) {
    observers.splice(index, 1);
  }
}

export function writeFile(filePath: string, data: string): Promise<void> {
  return window.main.writeFile(filePath, data);
}

export type MessageBoxType = 'none' | 'info' | 'error' | 'question' | 'warning';

declare global {
  interface Window {
    main: {
      showMessageBox: (message: string, buttons?: string[], title?: string, type?: MessageBoxType) => Promise<number>;
      showOpenDialog: (defaultPath?: string, title?: string) => Promise<string | undefined>;
      showSaveDialog: (defaultPath?: string, title?: string) => Promise<string | undefined>;
    },
  }
}

export async function showMessageBox(message: string, buttons?: string[], title?: string, type?: MessageBoxType): Promise<number> {
  return window.main.showMessageBox(message, buttons, title, type);
}

export async function showOpenDialog(defaultPath?: string, title?: string): Promise<string | undefined> {
  return window.main.showOpenDialog(defaultPath, title);
}

export async function showSaveDialog(defaultPath?: string, title?: string): Promise<string | undefined> {
  return window.main.showSaveDialog(defaultPath, title);
}

export type MessageBoxType = 'none' | 'info' | 'error' | 'question' | 'warning';

declare global {
  interface Window {
    main: {
      showMessageBox: (message: string, buttons?: string[], title?: string, type?: MessageBoxType) => Promise<number>;
    },
  }
}

export async function showMessageBox(message: string, buttons?: string[], title?: string, type?: MessageBoxType): Promise<number> {
  return window.main.showMessageBox(message, buttons, title, type);
}

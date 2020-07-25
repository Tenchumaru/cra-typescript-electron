declare global {
  interface Window {
    main: {
      request: (data: {}) => Promise<any>;
    },
  }
}

export async function showMessageBox(message: string): Promise<number> {
  return window.main.request({ kind: 'showMessageBox', message });
}

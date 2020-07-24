declare global {
  interface Window {
    main: {
      request: (data: {}) => void;
      onResponse: (fn: Function) => void;
    },
  }
}

let fn: Function = () => { };
window.main.onResponse(onMainResponse);

function onMainResponse(response: any) {
  fn(response);
}

export async function showMessageBox(message: string): Promise<number> {
  window.main.request({ kind: 'showMessageBox', message });
  return new Promise<number>((resolve, _reject) => {
    fn = (response: number) => {
      fn = () => { };
      resolve(response);
    }
  });
}

import { MessageBoxOptions, OpenDialogOptions, SaveDialogOptions } from 'electron';

type WithKind<T, K> = T & { kind: K; };
export type Request = WithKind<MessageBoxOptions, 'showMessageBox'> | WithKind<OpenDialogOptions, 'showOpenDialog'> | WithKind<SaveDialogOptions, 'showSaveDialog'>;

import { ipcRenderer } from 'electron';

export type WindowParams = {
  targetId?: number;
  show?: boolean;
  visiblity?: boolean;
  size?: {
    width: number;
    height: number;
  };

  maximize?: boolean;
  minimize?: boolean;
  sizeType?: 'maximize' | 'minimize' | 'restore';

  maximizable?: boolean;
  minimizable?: boolean;
  fullScreenable?: boolean;
  resizable?: boolean;
  closable?: boolean;
  movable?: boolean;
  focusable?: boolean;
};

export const setWindow = (args: WindowParams) => ipcRenderer.invoke('win-setting', args);

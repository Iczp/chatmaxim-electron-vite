import { app, ipcRenderer } from 'electron';

export enum WinEvents {
  'resize' = 'resize',
  'resized' = 'resized',
}

export type WinSize = {
  width: number;
  height: number;
};


export const setSize = (arg: WinSize) => ipcRenderer.invoke('win-resize', arg);

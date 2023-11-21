import { ipcRenderer } from "electron";


export type SetWindowParams = {
    show: boolean;
    size?: {
      width: number;
      height: number;
    };
}

export const setWindow = (args: SetWindowParams) => ipcRenderer.invoke('win-setting', args);

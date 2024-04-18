import { ipcMain } from 'electron';

/**
 * abstract
 */
export abstract class IpcHandle {
  public readonly channel: string;
  constructor() {
    // this.channel = change;
  }
  public install() {
    console.log('install', this.channel);
    ipcMain.handle(this.channel, this.handle);
  }
  public abstract handle: (_: Electron.IpcMainInvokeEvent, ...args: any[]) => any;
}

export type IpcMainHandle = {
  channel: string;
  handle: (event: Electron.IpcMainInvokeEvent | undefined, ...args: any[]) => any;
};

// Electron.IpcMain.handle(channel: string, listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any): void

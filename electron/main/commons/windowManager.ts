import { BrowserWindow } from 'electron';

export type Windows = {
  [key: 'main' | 'child' | string]: BrowserWindow;
};

export type WindowsMap = {
  [key: number]: string;
};

class WindowManger {
  
  public windows: Windows = {};
  public windowsMap: WindowsMap = {};
  constructor() {}
  set(name: string, win: BrowserWindow): BrowserWindow {
    this.windowsMap[win.id] = name;
    this.windows[name] = win;
    return win;
  }
  get(name: string): BrowserWindow | undefined {
    return this.windows[name];
  }
  getName(win: BrowserWindow): string {
    return this.windowsMap[win.id] ;
  }
  getMain(): BrowserWindow | undefined {
    return this.windows['main'];
  }
  getWindows() {
    return this.windows;
  }
  getMap() {
    return this.windowsMap;
  }
  remove(name: string): void {
    delete this.windowsMap[this.windows[name].id];
    delete this.windows[name];
  }
}

export const windowManager = new WindowManger();

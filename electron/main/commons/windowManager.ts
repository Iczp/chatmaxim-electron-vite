import { BrowserWindow } from 'electron';

class WindowManger {
 
  public windows: Map<string, BrowserWindow> = new Map<string, BrowserWindow>();
  public windowsMap: Map<number, string> = new Map<number, string>();
  constructor() {}
  set(name: string, win: BrowserWindow): BrowserWindow {
    // this.windowsMap[win.id] = name;
    // this.windows[name] = win;
    this.windowsMap.set(win.id, name);
    this.windows.set(name, win);
    win.on('closed', () => {
      win.destroy();
      this.remove(name);
      console.log(`win '${name}' closed`);
    });
    return win;
  }
  get(name: string): BrowserWindow | undefined {
    if (!name) {
      return undefined;
    }
    return this.windows.get(name);
  }
  getName(win: BrowserWindow): string {
    return this.getNameById(win.id);
  }
  getNameById(id: number): string {
    // return this.windowsMap[id];
    return this.windowsMap.get(id);
  }
  getMain(): BrowserWindow | undefined {
    return this.windows.get('main');
  }
  getLogin(): BrowserWindow | undefined {
    return this.windows.get('login');
  }
  getPop() {
    return this.windows.get('pop');
  }
  getTray() {
    return this.windows.get('tray');
  }
  getWindows(): Map<string, BrowserWindow> {
    return this.windows;
  }
  getMap(): Map<number, string> {
    return this.windowsMap;
  }
  remove(name: string): void {
    this.windowsMap.delete(this.windows.get(name)?.id);
    this.windows.delete(name);
    // delete this.windowsMap[this.windows[name].id];
    // delete this.windows[name];
  }
  isSeparatedChat(name: string) {
    return /^chat-.+$/.test(name) && this.windows.has(name);
  }
  getSeparatedChatWindows(): [string, BrowserWindow][] {
    return (
      this.getAllWindows()
        //ignore sender window
        .filter(([name, win]) => windowManager.isSeparatedChat(name))
    );
  }
  getAllWindows(): [string, BrowserWindow][] {
    return [...this.windows];
  }
  closeAll() {
    this.getAllWindows().map(([name, win]) => {
      console.log(`window name:`, name, win.id);
      win.close();
      // win.removeAllListeners();
    });
  }
}

export const windowManager = new WindowManger();

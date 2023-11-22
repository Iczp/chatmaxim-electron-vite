import { BrowserWindow } from 'electron';

export type Windows = {
  [key: 'main' | 'child' | string]: BrowserWindow;
};

export type WindowsMap = {
  [key: number]: string;
};

const windows: Windows = {};
const windowsMap: WindowsMap = {};

export const remove = (name: string): void => {
  delete windowsMap[windows[name].id];
  delete windows[name];
};

export const set = (name: string, win: BrowserWindow): BrowserWindow => {
  windowsMap[win.id] = name;
  windows[name] = win;
  return win;
};

export const setIfNotContains = (name: string, win: BrowserWindow): BrowserWindow => {
  return get(name) || set(name, win);
};
export const get = (name: string): BrowserWindow | undefined => {
  return windows[name];
};

export const getMain = (): BrowserWindow | undefined => windows['main'];

export const getWindows = (): Windows => windows;

export const getWindowsMap = (): WindowsMap => windowsMap;

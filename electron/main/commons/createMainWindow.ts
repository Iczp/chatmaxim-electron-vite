import { BrowserWindow,powerSaveBlocker  } from 'electron';
import { initWindowEvent } from './initWindowEvent';
import { preventClose, setWindow } from '../handles/windowSettingHandle';
import { getBackgroundColor, globalState, icon, preload } from '../global';
import { windowManager } from './windowManager';
import { WindowParams } from '../ipc-types';

let powerSaveBlockerId = null;

export const createMainWindow = (window: WindowParams, _?: Electron.IpcMainInvokeEvent) => {
  let win = windowManager.getMain();
  if (win) {
    console.log('createMainWindow setWindow', window);
    setWindow(win, window, _);
    return win;
  }
  win = new BrowserWindow({
    backgroundColor: getBackgroundColor(),
    title: 'Main window',
    // minWidth: 1560,
    // minHeight: 800,
    width: 1080,
    height: 750,
    icon: icon,
    hasShadow: true,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
    autoHideMenuBar: true,
    frame: false,
    // transparent: true,
  });
  win.on('close', () => win.setSkipTaskbar(true));
  win.on('show', () => win.setSkipTaskbar(false));
  // setWindow(win, { ...window, isPreventClose: true }, _);
  initWindowEvent(win, { name: 'main', path: window.path });
  preventClose(win, true);

  //阻止系统进入低功耗 (休眠) 模式。
  // https://www.electronjs.org/zh/docs/latest/api/power-save-blocker
  win.on('minimize', () => {
    console.log('Window minimized');
    // 当窗口最小化时，阻止应用挂起
    if (powerSaveBlockerId === null) {
      // 阻止系统进入低功耗 (休眠) 模式
      // prevent-app-suspension - 阻止应用被暂停。 保持系统活动状态，但允许屏幕关闭。 实例：下载文件或播放音频。
      // prevent-display-sleep - 防止显示器进入休眠状态。 保持系统和屏幕的活跃性。 实例：播放视频。
      const type = 'prevent-app-suspension'; // 或者使用 'prevent-display-sleep' 阻止显示器休眠
      powerSaveBlockerId = powerSaveBlocker.start(type);
      console.log('Power save blocker started:', powerSaveBlockerId);
    }
  });

  win.on('restore', () => {
    console.log('Window restored');
    // 当窗口恢复时，停止阻止
    if (powerSaveBlockerId !== null) {
      powerSaveBlocker.stop(powerSaveBlockerId);
      powerSaveBlockerId = null;
      console.log('Power save blocker stopped.');
    }
  });

  // 当窗口关闭时也要停止
  win.on('closed', () => {
    if (powerSaveBlockerId !== null) {
      powerSaveBlocker.stop(powerSaveBlockerId);
      powerSaveBlockerId = null;
    }
  });

  return win;
};



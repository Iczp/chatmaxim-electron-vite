import { ipcMain } from 'electron';
import { IpcMainHandleBase } from './IpcMainHandleBase';
import { openChildWindowHandle } from './openChildWindowHandle';
import { openPopWindowHandle } from './openPopWindowHandle';
import { openAppSettingsWindowHandle } from './openAppSettingsWindowHandle';
import { windowSettingHandle } from './windowSettingHandle';
import { websocketHandle } from './webscoketHandle';
import { setAuthorizehandle } from './setAuthorizehandle';
import { setTrayHandle } from './setTrayHandle';
import { setColorSchemeHandle } from './setColorSchemeHandle';
import { loginItemSettingsHandle } from './loginItemSettingsHandle';
import { setLanguageHandle } from './setLanguageHandle';
import { sheelHandle } from './sheelHandle';
import { saveAsHandle } from './saveAsHandle';
import { openBrowserWindowHandle } from './openBrowserWindowHandle';
import { globalEventHandle } from './globalEventHandle';
import { clipboradFilePathsHandle } from './clipboradFilePathsHandle';

// 获取继承自 IpcHandle 的所有非抽象子类
function getSubClasses(baseClass: typeof IpcMainHandleBase): (typeof IpcMainHandleBase)[] {
  const subClasses: (typeof IpcMainHandleBase)[] = [];
  for (const property in globalThis) {
    const potentialSubClass = (globalThis as any)[property];
    console.log('potentialSubClass', property, potentialSubClass);
    if (
      typeof potentialSubClass === 'function' &&
      potentialSubClass.prototype instanceof baseClass &&
      potentialSubClass !== baseClass &&
      !potentialSubClass.prototype.hasOwnProperty('constructor')
    ) {
      subClasses.push(potentialSubClass);
    }
  }
  return subClasses;
}

export const installAllIpcHandle = () => {
  ipcMain.handle(openChildWindowHandle.channel, openChildWindowHandle.handle);
  ipcMain.handle(openPopWindowHandle.channel, openPopWindowHandle.handle);
  ipcMain.handle(openAppSettingsWindowHandle.channel, openAppSettingsWindowHandle.handle);
  ipcMain.handle(windowSettingHandle.channel, windowSettingHandle.handle);
  ipcMain.handle(websocketHandle.channel, websocketHandle.handle);
  ipcMain.handle(setTrayHandle.channel, setTrayHandle.handle);
  ipcMain.handle(setAuthorizehandle.channel, setAuthorizehandle.handle);
  ipcMain.handle(setColorSchemeHandle.channel, setColorSchemeHandle.handle);
  ipcMain.handle(loginItemSettingsHandle.channel, loginItemSettingsHandle.handle);
  ipcMain.handle(setLanguageHandle.channel, setLanguageHandle.handle);
  ipcMain.handle(sheelHandle.channel, sheelHandle.handle);
  ipcMain.handle(saveAsHandle.channel, saveAsHandle.handle);
  ipcMain.handle(openBrowserWindowHandle.channel, openBrowserWindowHandle.handle);
  // ipcMain.handle(clipboradFilePathsHandle.channel, clipboradFilePathsHandle.handle);
  // ipcMain.handle(globalEventHandle.channel, globalEventHandle.handle);

  globalEventHandle.install();
  clipboradFilePathsHandle.install();

  // 调用每个子类的 install 方法
  // const subClasses = getSubClasses(IpcMainHandleBase);

  //   console.log('installAllIpcHandle', subClasses);

  //   subClasses.forEach(subClass => {
  //     const instance = new subClass();

  //     console.log('instance', instance);

  //     instance.install();
  //   });
};

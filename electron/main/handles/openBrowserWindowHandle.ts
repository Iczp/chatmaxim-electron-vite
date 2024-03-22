import { BrowserView, BrowserWindow, Menu, nativeImage } from 'electron';
import { initWindowEvent } from '../commons/initWindowEvent';
import { preventClose, setWindow } from './windowSettingHandle';
import { getBackgroundColor, globalState, icon, preload } from '../global';
import { windowManager } from '../commons/windowManager';
import { WindowParams } from '../ipc-types';
import { IpcMainHandle } from '../IpcMainHandle';
import { BrowserPayload } from '../ipc-types/BrowserPayload';
import fs from 'fs-extra';
export const openBrowserWindowHandle: IpcMainHandle = {
  channel: 'open-browser',
  handle: (
    _: Electron.IpcMainInvokeEvent,
    args: { window: WindowParams; browser: BrowserPayload },
  ): any => {
    return new Promise((resolve, reject) => {
      console.log('openBrowserWindowHandle', args);
      createBrowserWindow(args);
      resolve({});
    });
  },
};

export const createBrowserWindow = (
  {
    window,
    browser,
  }: {
    window: WindowParams;
    browser: BrowserPayload;
  },
  _?: Electron.IpcMainInvokeEvent,
) => {
  let win = windowManager.get(window.name);
  if (win) {
    console.log('createBrowserWindow setWindow', window);
    setWindow(win, window, _);
    return win;
  }
  win = new BrowserWindow({
    backgroundColor: getBackgroundColor(),
    title: '设置',
    minWidth: 240,
    minHeight: 160,
    width: 800,
    height: 600,
    icon,
    hasShadow: true,
    // minimizable: true,
    // maximizable: true,
    // resizable: false,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
    autoHideMenuBar: true,
    frame: false,
    alwaysOnTop: false,
    skipTaskbar: false,
    // transparent: true,
  });
  initWindowEvent(win, { name: window.name, path: window.path });

  const view = new BrowserView({});
  win.setBrowserView(view);
  const headerHieght = 200;
  view.setBounds({
    x: 0,
    y: headerHieght,
    width: 800,
    height: win.getBounds().height - headerHieght,
  });

  view.setAutoResize({
    width: true,
    height: true,
    // horizontal: true,
    // vertical: true,
  });

  view.webContents.loadURL(browser.url);

  // 当页面加载完成后，生成快照
  view.webContents.on('did-finish-load', async () => {
    // try {
    //   const { width, height } = await view.webContents.executeJavaScript(`
    //     (() => {
    //       return {
    //         width: document.documentElement.scrollWidth,
    //         height: document.documentElement.scrollHeight
    //       };
    //     })();
    //   `);

    //   const devicePixelRatio = win.webContents.getZoomFactor();
    //   const fullWidth = Math.ceil(width * devicePixelRatio);
    //   const fullHeight = Math.ceil(height * devicePixelRatio);

    //   win.setContentSize(fullWidth, fullHeight);

    //   const numberOfScreenshots = Math.ceil(fullHeight / 600); // Adjust 600 according to your need
    //   const screenshots:Electron.NativeImage[] = [];

    //   for (let i = 0; i < numberOfScreenshots; i++) {
    //     await view.webContents.executeJavaScript(`window.scrollTo(0, ${i * 600})`);
    //     await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the delay if necessary
    //     const screenshot = await view.webContents.capturePage();
    //     screenshots.push(screenshot);
    //   }

    //   let combinedImage = nativeImage.createEmpty();

    //   screenshots.forEach(image => {
    //     combinedImage.addRepresentation({ scaleFactor: 1.0, dataURL: image.toDataURL() });
    //   });

    //   const pngBuffer = combinedImage.toPNG();
    //   fs.writeFileSync('snapshot.png', pngBuffer);
    //   console.log('快照已保存至 snapshot.png');

    // } catch (error) {
    //   console.error('无法生成快照:', error);
    // }
  });

  view.webContents.on('context-menu', (event, params) => {
    const menu = Menu.buildFromTemplate([
      { label: '复制', role: 'copy' },
      { type: 'separator' },
      {
        label: '在新标签页中打开链接',
        click: () => {
          console.log('new window');
        },
      },
    ]);
    menu.popup({ window: win });
  });

  const setWindowOpenHandler = (win: BrowserView | BrowserWindow) => {
    win.webContents.on('did-create-window', (win, detail) => {
      console.log('did-create-window', detail);
      setWindowOpenHandler(win);
    });

    win.webContents.setWindowOpenHandler((details: Electron.HandlerDetails) => {
      console.log('details', details);

      return {
        action: 'allow',
        outlivesOpener: true,
        overrideBrowserWindowOptions: {
          autoHideMenuBar: true,
        },
      };
    });
  };

  setWindowOpenHandler(view);

  view.webContents.on('will-navigate', (event, url) => {
    event.preventDefault(); // 阻止在当前窗口打开链接
    console.log('will-navigate', url);
  });

  return win;
};

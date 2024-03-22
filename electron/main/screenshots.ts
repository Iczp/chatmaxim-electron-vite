// import debug from "electron-debug";
import { app, globalShortcut, ipcMain } from 'electron';
import Screenshots from 'electron-screenshots';
import { IpcMainHandle } from './IpcMainHandle';

app.whenReady().then(() => {
  console.log('screenshots');

  const screenshots = new Screenshots();

  const screenshotsWindowHandle: IpcMainHandle = {
    channel: 'screenshots',
    handle: (_: Electron.IpcMainInvokeEvent,args:any): any => {
      return new Promise((resolve, reject) => {
        console.log('screenshotsWindowHandle', args);
        screenshots.startCapture();
        resolve({});
      });
    },
  };

  ipcMain.handle(screenshotsWindowHandle.channel, screenshotsWindowHandle.handle);


  globalShortcut.register('CTRL+ALT+E', () => {
    console.log('CTRL+ALT+E');
    
    screenshots.startCapture();
    screenshots.$view.webContents.openDevTools();
  });
  // 点击确定按钮回调事件
  screenshots.on('ok', (e, buffer, bounds) => {
    console.log('capture',  bounds);
  });
  // 点击取消按钮回调事件
  screenshots.on('cancel', () => {
    console.log('capture', 'cancel1');
  });
  screenshots.on('cancel', e => {
    // 执行了preventDefault
    // 点击取消不会关闭截图窗口
    e.preventDefault();
    console.log('capture', 'cancel2');
  });
  // 点击保存按钮回调事件
  screenshots.on('save', (e, buffer, bounds) => {
    // console.log('capture', buffer, bounds);
  });
  // 保存后的回调事件
  screenshots.on('afterSave', (e, buffer, bounds, isSaved) => {
    // console.log('capture', buffer, bounds);
    console.log('isSaved', isSaved); // 是否保存成功
  });
  //   debug({ showDevTools: true, devToolsMode: "undocked" });
});



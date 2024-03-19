// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST;

import {
  app,
  BrowserWindow,
  ipcMain,
  webContents,
  screen,
  dialog,
  protocol,
  shell,
  powerMonitor,
} from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import Store from 'electron-store';
import { openChildWindowHandle } from './handles/openChildWindowHandle';
import { createMainWindow } from './commons/createMainWindow';
import { windowSettingHandle } from './handles/windowSettingHandle';
import { initMachine } from './commons/machine';

import { websocketHandle } from './handles/webscoketHandle';
import './commons/logger';
import './commons/tray';
import './commons/keyboardShortcuts';
import { openPopWindowHandle } from './handles/openPopWindowHandle';
import { setTrayHandle } from './handles/setTrayHandle';
import setAppProtocol from './commons/setAppProtocol';
import { setAuthorizehandle } from './handles/setAuthorizehandle';
import { createLoginWindow } from './commons/createLoginWindow';
import { openAppSettingsWindowHandle } from './handles/openAppSettingsWindowHandle';
import { env } from './env';
import { setColorSchemeHandle } from './handles/setColorSchemeHandle';
import { loginItemSettingsHandle } from './handles/loginItemSettingsHandle';
import { setLanguageHandle } from './handles/setLanguageHandle';
import { sheelHandle } from './handles/sheelHandle';
import { saveAsHandle } from './handles/saveAsHandle';

setAppProtocol();

//当前用户的空闲时间
// setInterval(() => {
//   console.log('System Idle Time',powerMonitor.getSystemIdleTime())
// }, 3000)
// import {Test} from '../../public/Test.ts'

//
Store.initRenderer();

initMachine();

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');
console.log('app.getPath', app.getAppPath(), app.getPath('userData'));

//应用是否打包
if (app.isPackaged) {
  //设置开机启动
  app.setLoginItemSettings(<Electron.Settings>{
    openAtLogin: true,
  });
  //获取是否开机启动
  const appSetting = app.getLoginItemSettings();
  console.log('getLoginItemSettings', appSetting);
}

const ffmpegTest = () => {
  var ffmpeg = require('fluent-ffmpeg');
  // console.log('ffmpeg', ffmpeg);

  const dirname = env.isDev ? '../../' : '';
  // 指定 ffmpeg 二进制文件的路径
  const ffmpegPath = join(__dirname, dirname, 'node_modules', 'ffmpeg-static', 'ffmpeg');

  console.error('ffmpegPath:', ffmpegPath);

  ffmpeg.setFfmpegPath(ffmpegPath);

  // 执行一个简单的命令，比如获取 ffmpeg 的版本信息
  ffmpeg.getAvailableEncoders((err, encoders) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Encoders:', 'ok');
    }
  });

  let inputPath = 'C:\\Users\\ZP\\Videos\\2.7.mp4';
  let outputPath = 'C:\\Users\\ZP\\Videos\\2.7____1.mp4';

  var command = ffmpeg(inputPath)
    .videoCodec('libx264')
    .audioCodec('libmp3lame')
    .on('start', function () {
      console.log('start');

      // Send SIGSTOP to suspend ffmpeg
      // command.kill('SIGSTOP');

      // doSomething(function() {
      //   // Send SIGCONT to resume ffmpeg
      //   command.kill('SIGCONT');
      // });
    })
    .on('error', err => {
      console.log('err: ', err);
    })
    .save(outputPath);

  ffmpeg.ffprobe(inputPath, function (err, metadata) {
    console.log('metadata', metadata);
  });
};
app.whenReady().then(() => {
  createLoginWindow({ path: 'login', visiblity: true });
  // win = createMainWindow();
  // pop = createPopWindow({});
  ffmpegTest();
});
app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    win = createMainWindow({ path: '/' });
  }
});
app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', (event, argv) => {
  if (win) {
    // Focus on the main window if the user tried to open another
    win.show();
    win.focus();
  }
  // Windows 下通过协议URL启动时，URL会作为参数，所以需要在这个事件里处理
  if (process.platform === 'win32') {
    handleArgv(argv);
  }
});
const handleArgv = (argv: any[]) => {
  const url = argv.find(x => x.startsWith(env.url_scheme));
  if (url) {
    handleUrl(url);
  }
};
const handleUrl = (url: string) => {
  dialog.showErrorBox('handleUrl', url);
};

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
//
// macOS
app.on('open-url', (event, url) => {
  dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`);
});

// Handle window controls via IPC
ipcMain.on('shell:open', () => {
  const pageDirectory = __dirname.replace('app.asar', 'app.asar.unpacked');
  const pagePath = join('file://', pageDirectory, 'index.html');
  shell.openExternal(pagePath);
});

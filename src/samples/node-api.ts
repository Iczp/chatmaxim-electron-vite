import { lstat } from 'node:fs/promises';
import { cwd } from 'node:process';
import { ipcRenderer } from 'electron';
import Store from 'electron-store';

import { WinEvents } from '../ipc';

const store = new Store();

store.set('unicorn', '🦄');

console.log(store.get('unicorn'));

ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args);
});
ipcRenderer.on('websocket', (...args) => {
  console.log('[websocket]:', ...args);
});
setTimeout(() => {
  console.log('ipcRenderer.send:login');
  ipcRenderer.send('login', 'dddddddd');
  // const Store = require('electron-store');
}, 5000);

lstat(cwd())
  .then(stats => {
    console.log('[fs.lstat]', stats);
  })
  .catch(err => {
    console.error(err);
  });

ipcRenderer.on(WinEvents.resized, (_event, ...args) => {
  console.log(WinEvents.resized, ...args);
});

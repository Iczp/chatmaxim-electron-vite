import { lstat } from 'node:fs/promises';
import { cwd } from 'node:process';
import { ipcRenderer } from 'electron';
import Store from 'electron-store';
import { router } from '../routes';
import { WinEvents } from '../ipc';

import { useWindowStore } from '../stores/window';

const store = new Store();

store.set('unicorn', '🦄');

console.log(store.get('unicorn'));

ipcRenderer.on('websocket', (...args) => {
  console.log('[websocket]:', ...args);
});

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

ipcRenderer.on('navigate', (_event, url) => {
  console.log('[navigate]:', url);
  // const { event, callerId } = args;
  // const url = addParamsToUrl(args.url, { event, callerId });
  // console.log('url', url);
  router.replace(url);
});

ipcRenderer.on('window-event', (_, args) => {
  console.log('[window-event]:', _, args);
  const winStore = useWindowStore();
  winStore.handle(args);
});

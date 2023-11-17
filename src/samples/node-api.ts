import { lstat } from 'node:fs/promises';
import { cwd } from 'node:process';
import { ipcRenderer } from 'electron';
import Store from 'electron-store';
import { router } from '../routes';
import { WinEvents } from '../ipc';
import queryString from 'query-string';

import { useWindowStore } from '../stores/window';

import { toQueryString } from '../commons/utils';
import { addParamsToUrl } from '../commons/addParamsToUrl';
const store = new Store();

store.set('unicorn', '🦄');

console.log(store.get('unicorn'));

ipcRenderer.on('main-process-message', (_event, ...args) => {
  const winStore = useWindowStore();
  winStore.setId(1);
  console.log('[Receive Main-process message]:', _event, ...args);
});
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

ipcRenderer.on('navigate', (_event, args) => {
  console.log('[navigate]:', args);
  const { event, callerId } = args;
  const url = addParamsToUrl(args.url, { event, callerId });
  console.log('url', url);
  router.replace(url);
});



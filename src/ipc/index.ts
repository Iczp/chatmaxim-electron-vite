import { lstat } from 'node:fs/promises';
import { cwd } from 'node:process';
import { ipcRenderer } from 'electron';
import Store from 'electron-store';
import { router } from '../routes';
import { useWindowStore } from '../stores/window';
import { websocketHandle } from '../apis/websockets/websocketHandle';

export enum WinEvents {
  'resize' = 'resize',
  'resized' = 'resized',
}

export type WinSize = {
  width: number;
  height: number;
};

const store = new Store();

store.set('unicorn', '🦄');

console.log(store.get('unicorn'));

ipcRenderer.on('websocket', websocketHandle);

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
  winStore.update(args);
});

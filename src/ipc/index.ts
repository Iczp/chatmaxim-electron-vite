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
    const windowStore = useWindowStore();
    console.log('[fs.lstat]', windowStore.name, stats);
  })
  .catch(err => {
    console.error(err);
  });

ipcRenderer.on(WinEvents.resized, (_event, ...args) => {
  console.log(WinEvents.resized, ...args);
});

ipcRenderer.on(
  'navigate',
  (_event, { path, payload, type }: { path: string; payload: any; type?: 'push' | 'replace' }) => {
    console.log('[navigate]:', type, path, payload);
    const windowStore = useWindowStore();
    windowStore.setPayload(path, payload);
    if (type == 'push') {
      router.push(path);
    } else {
      router.replace(path);
    }
  },
);

ipcRenderer.on('window-event', (_, args) => {
  // console.log('[window-event]:', _, args);
  const winStore = useWindowStore();
  winStore.handle(args);
});

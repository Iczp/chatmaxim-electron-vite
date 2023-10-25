import { lstat } from 'node:fs/promises';
import { cwd } from 'node:process';
import { ipcRenderer } from 'electron';

ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args);
});

setTimeout(() => {
  console.log('ipcRenderer.send:login');
  ipcRenderer.send('login', 'dddddddd');
}, 1000);

lstat(cwd())
  .then(stats => {
    console.log('[fs.lstat]', stats);
  })
  .catch(err => {
    console.error(err);
  });

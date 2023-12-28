import { BrowserWindow, app, globalShortcut } from 'electron';
import { windowManager } from './windowManager';
import { electronLocalshortcut } from 'electron-localshortcut';
import { globalState } from '../global';
import { WindowParams } from '../ipc-types';
import { setWindow } from './windowSettingHandle';
import { setTrayHandle } from './setTrayHandle';

app.whenReady().then(() => {
  //   const electronLocalshortcut = require('electron-localshortcut');
});

const accelerator = 'CommandOrControl+D';
app.whenReady().then(() => {
  // Register a 'CommandOrControl+X' shortcut listener.

  const ret = globalShortcut.register(accelerator, () => {
    try {
      console.log(`'${accelerator}' is pressed`);
      const trayPayload = globalState.trayPayload;
      const { items, totalBadge } = trayPayload;
      const win = windowManager.getMain();
      if (items.length > 0) {
        // items[0].
        console.log(`item 0`, items[0]);
        const { ownerId, id, publicBadge } = items[0];
        const path = `/chat/${ownerId}/${id}`;
        const params = <WindowParams>{
          name: 'main',
          path,
          visiblity: true,
        };
        console.log('params', params);
        setWindow(win, params, null);
        // update tray
        items.splice(0, 1);
        trayPayload.totalBadge -= Number(publicBadge || 0);
        setTrayHandle(null, trayPayload);
      } else if (totalBadge > 0) {
        setWindow(win, { name: 'main', visiblity: true }, null);
        trayPayload.totalBadge = 0;
        setTrayHandle(null, trayPayload);
      } else {
        win.isVisible() ? win.hide() : win.show();
      }
    } catch (error) {
      console.error('error', error);
    }
  });

  if (!ret) {
    console.log(`'${accelerator}' registration failed`);
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered(accelerator));
});

app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister(accelerator);

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

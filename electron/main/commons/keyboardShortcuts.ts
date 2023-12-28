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

export const messageShortcutHandle = () => {
  try {
    console.log(`messageShortcutHandle:'${accelerator}' is pressed`);
    const trayPayload = globalState.trayPayload;
    const { items, totalBadge } = trayPayload;
    const win = windowManager.getMain();
    if (items.length > 0) {
      // items[0].
      console.log(`item 0`, items[0]);
      const { ownerId, id, publicBadge } = items[0];
      let chatWinName = `chat-${id}`;
      const isSeparatedChat = windowManager.isSeparatedChat(chatWinName);
      const chatWin = isSeparatedChat ? windowManager.get(chatWinName) : win;
      const path = isSeparatedChat ? `/separate-chat/${ownerId}/${id}` : `/chat/${ownerId}/${id}`;
      const params = <WindowParams>{
        name: isSeparatedChat ? chatWinName : 'main',
        path,
        visiblity: true,
      };
      console.log('params', params);
      setWindow(chatWin, params, null);
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
};
app.whenReady().then(() => {
  // Register a 'CommandOrControl+X' shortcut listener.
  if (!globalShortcut.isRegistered(accelerator)) {
    const ret = globalShortcut.register(accelerator, messageShortcutHandle);
    if (!ret) {
      console.error(`'${accelerator}' registration failed`);
    }
  }
});

app.on('will-quit', () => {
  // Unregister a shortcut.
  // globalShortcut.unregister(accelerator);
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

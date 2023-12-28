import { app, globalShortcut } from 'electron';
import { windowManager } from './windowManager';
import { globalState } from '../global';
import { WindowParams } from '../ipc-types';
import { setWindow } from './windowSettingHandle';
import { setTrayHandle } from './setTrayHandle';

const accelerator = globalState.globalShortcut;

export const messageShortcutHandle = () => {
  try {
    console.log(`messageShortcutHandle:'${accelerator}' is pressed`);
    const trayPayload = globalState.trayPayload;
    const { items, totalBadge } = trayPayload;
    const win = windowManager.getMain();
    if (!win) {
      console.warn('win is null');
      return;
    }
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
        focus: true,
      };
      console.log('params', params);
      setWindow(chatWin, params, null);
      // update tray
      items.splice(0, 1);
      trayPayload.totalBadge -= Number(publicBadge || 0);
      setTrayHandle(null, trayPayload);
    } else if (totalBadge > 0) {
      setWindow(win, { name: 'main', visiblity: true, focus: true }, null);
      trayPayload.totalBadge = 0;
      setTrayHandle(null, trayPayload);
    } else {
      if (win.isVisible() && win.isFocused()) {
        win.hide();
      } else {
        win.show();
        win.focus();
      }
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
  console.log('will-quit', 'globalShortcut.unregisterAll');
  globalShortcut.unregisterAll();
});

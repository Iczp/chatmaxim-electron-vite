import { BrowserWindow, app, globalShortcut } from 'electron';
import { windowManager } from './windowManager';
import { electronLocalshortcut } from 'electron-localshortcut';

app.whenReady().then(() => {
  //   const electronLocalshortcut = require('electron-localshortcut');
});

const accelerator = 'CommandOrControl+D';
app.whenReady().then(() => {
  // Register a 'CommandOrControl+X' shortcut listener.

  const ret = globalShortcut.register(accelerator, () => {
    console.log(`'${accelerator}' is pressed`);
    const win = windowManager.getMain();
    win.isVisible() ? win.hide() : win.show();
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

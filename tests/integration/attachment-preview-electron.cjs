const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const root = process.argv[2];
app.setPath('userData', path.join(root, 'profile'));
app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true } });
  try {
    await win.loadFile(path.join(root, 'index.html'));
    const value = await win.webContents.executeJavaScript('globalThis.runPreviewTest()');
    if (JSON.stringify(value) !== JSON.stringify({ initial: 'blob:local-first', confirmed: 'blob:server-preview', afterStale: 'blob:local-new' })) throw new Error(`preview mismatch ${JSON.stringify(value)}`);
    console.log('ATTACHMENT_PREVIEW_OK');
  } catch (error) { console.error('ATTACHMENT_PREVIEW_ERROR', error); process.exitCode = 1; }
  finally { win.destroy(); app.quit(); }
}).catch(error => { console.error(error); app.exit(1); });

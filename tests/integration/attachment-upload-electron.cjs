const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const root = process.argv[2];
const base = process.env.GOTOIM_TEST_BASE_URL;
const phase = process.argv[3];
app.setPath('userData', path.join(root, 'profile'));
app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true } });
  try {
    await win.loadFile(path.join(root, 'index.html'));
    const value = await win.webContents.executeJavaScript(`globalThis.runUploadTest(${JSON.stringify(base)}, ${JSON.stringify(phase)})`);
    const expected = phase === 'prepare' ? { prepared: true } : { id: 42, name: 'sample.png', type: 'image/png', size: 25 };
    if (JSON.stringify(value) !== JSON.stringify(expected)) throw new Error(`unexpected upload result ${JSON.stringify(value)}`);
    console.log(phase === 'prepare' ? 'ATTACHMENT_PREPARE_OK' : 'ATTACHMENT_UPLOAD_OK');
  } catch (error) { console.error('ATTACHMENT_UPLOAD_ERROR', error); process.exitCode = 1; }
  finally { win.destroy(); app.quit(); }
}).catch(error => { console.error(error); app.exit(1); });

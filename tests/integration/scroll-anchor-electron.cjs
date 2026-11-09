const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const root = process.argv[2];
app.setPath('userData', path.join(root, 'profile'));
app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, width: 700, height: 500, webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true, backgroundThrottling: false } });
  try {
    await win.loadFile(path.join(root, 'index.html'));
    const result = await win.webContents.executeJavaScript('globalThis.runAnchorTest()');
    if (Math.abs(result.first - result.anchor) > 3 || Math.abs(result.second - result.moved) > 3 || Math.abs(result.afterResize - result.moved) > 3 || result.count !== 130) throw new Error(`滚动锚点偏移 ${JSON.stringify(result)}`);
    console.log('SCROLL_ANCHOR_OK', JSON.stringify(result));
  } catch (error) { console.error('SCROLL_ANCHOR_ERROR', error); process.exitCode = 1; }
  finally { win.destroy(); app.quit(); }
}).catch(error => { console.error(error); app.exit(1); });

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function setup() {
  const opened = [];
  const views = [];
  let existing;
  class Contents {
    constructor() { this.listeners = {}; this.loads = []; }
    on(name, handler) { this.listeners[name] = handler; }
    setWindowOpenHandler(handler) { this.open = handler; }
    loadURL(url) { this.loads.push(url); return Promise.resolve(); }
  }
  class BrowserWindow {
    constructor(options) { this.options = options; this.webContents = new Contents(); existing = this; }
    setBrowserView(view) { this.view = view; }
    getBounds() { return { height: 600 }; }
  }
  class BrowserView {
    constructor(options) { this.options = options; this.webContents = new Contents(); views.push(this); }
    setBounds() {}
    setAutoResize() {}
  }
  const deps = {
    electron: { BrowserWindow, BrowserView, Menu: {}, shell: { openExternal: async url => opened.push(url) } },
    '../commons/initWindowEvent': { initWindowEvent() {} },
    './windowSettingHandle': { setWindow() {} },
    '../global': { getBackgroundColor: () => '#000', icon: '', preload: 'preload' },
    '../commons/windowManager': { windowManager: { get: () => existing } },
  };
  const source = fs.readFileSync(new URL('../electron/main/handles/openBrowserWindowHandle.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: name => deps[name], console, URL, Promise, WeakMap, Error });
  const open = url => exports.createBrowserWindow({ window: { name: 'browser', path: '/browser' }, browser: { url } });
  return { open, exports, views, opened };
}

test('仅允许 HTTP 和 HTTPS，拒绝文件与脚本协议', () => {
  const h = setup();
  for (const url of ['file:///secret', 'javascript:alert(1)', 'data:text/html,test', 'not a url']) {
    assert.equal(h.exports.isWebUrl(url), false);
    assert.throws(() => h.open(url), /HTTP/);
  }
  assert.equal(h.exports.isWebUrl('http://localhost:8080/a'), true);
  assert.equal(h.exports.isWebUrl('https://example.test'), true);
});

test('远程页面隔离 Node、禁止危险跳转和弹窗', async () => {
  const h = setup();
  const win = h.open('https://example.test');
  const view = h.views[0];
  assert.equal(view.options.webPreferences.nodeIntegration, false);
  assert.equal(view.options.webPreferences.contextIsolation, true);
  assert.equal(view.options.webPreferences.sandbox, true);
  assert.equal(view.options.webPreferences.webSecurity, true);
  let prevented = false;
  view.webContents.listeners['will-redirect']({ preventDefault: () => { prevented = true; } }, 'file:///secret');
  assert.equal(prevented, true);
  prevented = false;
  view.webContents.listeners['will-navigate']({ preventDefault: () => { prevented = true; } }, 'https://example.test/path');
  assert.equal(prevented, false);
  assert.equal(view.webContents.open({ url: 'javascript:alert(1)' }).action, 'deny');
  assert.equal(view.webContents.open({ url: 'https://example.test/popup' }).action, 'deny');
  assert.equal(h.opened.join(','), 'https://example.test/popup');
  win.webContents.listeners['will-navigate']({ preventDefault: () => { prevented = true; } });
  assert.equal(prevented, true);
});

test('复用浏览器窗口时加载新的安全地址且不能操作其他应用窗口', () => {
  const h = setup();
  h.open('https://one.test');
  h.open('https://two.test');
  assert.equal(h.views.length, 1);
  assert.equal(h.views[0].webContents.loads.join(','), 'https://one.test,https://two.test');
  assert.throws(() => h.exports.createBrowserWindow({ window: { name: 'main', path: '/' }, browser: { url: 'https://test' } }), /窗口参数/);
});

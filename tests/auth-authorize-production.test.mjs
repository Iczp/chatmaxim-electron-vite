import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function createHandler(initial) {
  let current = initial;
  let windows = 0;
  const state = {};
  const deps = {
    '../global': { TOKEN_KEY: 'token', globalState: state, store: { get: () => current } },
    '../commons/createMainWindow': { createMainWindow: () => { windows++; } },
    './openPopWindowHandle': { createPopWindow() {} },
    '../commons/windowManager': { windowManager: { get: () => undefined } },
  };
  const source = fs.readFileSync(new URL('../electron/main/handles/setAuthorizehandle.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: name => deps[name], Promise, Error });
  return { authorize: payload => exports.setAuthorizehandle.handle(undefined, payload), setCurrent: value => { current = value; }, get windows() { return windows; } };
}
test('退出或切换账号后迟到的 authorize 不创建业务窗口', async () => {
  const h = createHandler({ access_token: 'old' });
  h.setCurrent(undefined);
  await assert.rejects(h.authorize({ access_token: 'old' }), /auth_session_changed/);
  h.setCurrent({ access_token: 'new' });
  await assert.rejects(h.authorize({ access_token: 'old' }), /auth_session_changed/);
  assert.equal(h.windows, 0);
  await h.authorize({ access_token: 'new' });
  assert.equal(h.windows, 1);
});

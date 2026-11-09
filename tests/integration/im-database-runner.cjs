const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const ts = require('typescript');
const electron = require('electron');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gotoim-db-integration-'));
const source = fs.readFileSync(path.resolve(__dirname, '../../src/data/local/imDatabase.ts'), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
fs.writeFileSync(path.join(root, 'database.js'), js);
const mergeSource = fs.readFileSync(path.resolve(__dirname, '../../src/data/local/friendMerge.ts'), 'utf8');
fs.writeFileSync(path.join(root, 'friend-merge.js'), ts.transpileModule(mergeSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText);
const friendSource = fs.readFileSync(path.resolve(__dirname, '../../src/data/local/friendCache.ts'), 'utf8');
fs.writeFileSync(path.join(root, 'friend-cache.js'), ts.transpileModule(friendSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText);
const friendInvalidationSource = fs.readFileSync(path.resolve(__dirname, '../../src/data/local/friendInvalidation.ts'), 'utf8');
fs.writeFileSync(path.join(root, 'friend-invalidation.js'), ts.transpileModule(friendInvalidationSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText);
const ownerSource = fs.readFileSync(path.resolve(__dirname, '../../src/data/local/ownerCache.ts'), 'utf8');
fs.writeFileSync(path.join(root, 'owner-cache.js'), ts.transpileModule(ownerSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText);
const messageSource = fs.readFileSync(path.resolve(__dirname, '../../src/data/local/messageCache.ts'), 'utf8');
fs.writeFileSync(path.join(root, 'message-cache.js'), ts.transpileModule(messageSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText);
const attachmentSource = fs.readFileSync(path.resolve(__dirname, '../../src/data/local/attachmentStore.ts'), 'utf8');
fs.writeFileSync(path.join(root, 'attachment-store.js'), ts.transpileModule(attachmentSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText);
const invalidationSource = fs.readFileSync(path.resolve(__dirname, '../../src/data/local/messageInvalidation.ts'), 'utf8');
fs.writeFileSync(path.join(root, 'message-invalidation.js'), ts.transpileModule(invalidationSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText);
const sendLockSource = fs.readFileSync(path.resolve(__dirname, '../../src/data/local/messageSendLock.ts'), 'utf8');
fs.writeFileSync(path.join(root, 'message-send-lock.js'), ts.transpileModule(sendLockSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText);
fs.writeFileSync(path.join(root, 'index.html'), '<!doctype html><title>database integration</title>');
for (const phase of ['write', 'restart']) {
  const env = { ...process.env };
  delete env.ELECTRON_RUN_AS_NODE;
  const result = spawnSync(electron, [path.join(__dirname, 'im-database-electron.cjs'), root, phase], { encoding: 'utf8', env, timeout: 30000 });
  if (result.error || result.status !== 0 || !result.stdout.includes(`DB_INTEGRATION_OK:${phase}`)) {
    console.error(result.error || '', result.stdout, result.stderr);
    process.exit(1);
  }
  process.stdout.write(result.stdout);
}
console.log(`测试配置和数据位于临时目录：${root}`);

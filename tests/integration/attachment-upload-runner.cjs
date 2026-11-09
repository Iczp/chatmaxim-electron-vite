const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { spawn } = require('node:child_process');
const esbuild = require('esbuild');
const electron = require('electron');

async function main() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gotoim-attachment-upload-'));
  const mocks = {
    env: `export const env={base_url:'',auth_host:'',app_id:'test',device_type:'test'};`,
    auth: `export const getToken=async()=>null; export const getLocalToken=()=>null; export const refreshToken=async()=>null; export const isTokenUrl=()=>false;`,
    window: `export const useWindowStore=()=>({machineId:'test-device'});`,
    account: `export const isFriendScopeCurrent=async()=>true;`,
  };
  await esbuild.build({ entryPoints: [path.resolve(__dirname, 'attachment-upload-app.ts')], bundle: true, platform: 'browser', format: 'iife',
    outfile: path.join(root, 'app.js'), define: { 'process.platform': '"win32"' }, logLevel: 'silent',
    plugins: [{ name: 'test-boundaries', setup(build) {
      build.onResolve({ filter: /^(\.\.\/)+env$/ }, () => ({ path: 'env', namespace: 'mock' }));
      build.onResolve({ filter: /TokenController$/ }, () => ({ path: 'auth', namespace: 'mock' }));
      build.onResolve({ filter: /stores\/windowStore$/ }, () => ({ path: 'window', namespace: 'mock' }));
      build.onResolve({ filter: /^\.\/friendCache$/ }, args => args.importer.endsWith('attachmentStore.ts') ? { path: 'account', namespace: 'mock' } : undefined);
      build.onLoad({ filter: /.*/, namespace: 'mock' }, args => ({ contents: mocks[args.path], loader: 'js' }));
    }}] });
  fs.writeFileSync(path.join(root, 'index.html'), '<!doctype html><script src="app.js"></script>');
  let upload;
  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      upload = { url: req.url, type: req.headers['content-type'], body: Buffer.concat(chunks).toString('utf8') };
      res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{"id":42}');
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const env = { ...process.env }; delete env.ELECTRON_RUN_AS_NODE;
  env.GOTOIM_TEST_BASE_URL = `http://127.0.0.1:${server.address().port}`;
  let stdout = '', stderr = '', code = 0;
  for (const phase of ['prepare', 'upload']) {
    const child = spawn(electron, [path.join(__dirname, 'attachment-upload-electron.cjs'), root, phase], { env });
    child.stdout.on('data', chunk => { stdout += chunk; }); child.stderr.on('data', chunk => { stderr += chunk; });
    const timeout = setTimeout(() => child.kill(), 40000);
    code = await new Promise(resolve => child.on('close', resolve));
    clearTimeout(timeout);
    if (code !== 0) break;
  }
  server.close();
  if (code !== 0 || !stdout.includes('ATTACHMENT_PREPARE_OK') || !stdout.includes('ATTACHMENT_UPLOAD_OK') || !upload ||
      upload.url !== '/api/chat/message-sender/send-upload-image/unit' ||
      !/^multipart\/form-data;\s*boundary=/i.test(upload.type || '') ||
      !upload.body.includes('filename="sample.png"') || !upload.body.includes('restored attachment bytes') ||
      !upload.body.includes('name="clientMessageId"') || !upload.body.includes('client-id')) {
    throw new Error(`upload integration failed (exit ${code}): ${stdout} ${stderr} ${JSON.stringify(upload && { url: upload.url, type: upload.type })}`);
  }
  process.stdout.write(stdout);
}
main().catch(error => { console.error(error); process.exitCode = 1; });

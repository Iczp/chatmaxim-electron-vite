const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const esbuild = require('esbuild');
const electron = require('electron');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gotoim-scroll-anchor-'));
const packageRoot = process.env.GOTOIM_SCROLLER_PACKAGE;
const alias = packageRoot ? {
  'vue-virtual-scroller/dist/vue-virtual-scroller.css': path.join(packageRoot, 'dist/vue-virtual-scroller.css'),
  'vue-virtual-scroller': path.join(packageRoot, 'dist/vue-virtual-scroller.esm.js'),
} : undefined;
esbuild.buildSync({ entryPoints: [path.resolve(__dirname, 'scroll-anchor-app.ts')], bundle: true, format: 'iife', platform: 'browser', outfile: path.join(root, 'app.js'), logLevel: 'silent', alias, nodePaths: [path.resolve(__dirname, '../../node_modules')] });
fs.writeFileSync(path.join(root, 'index.html'), '<!doctype html><link rel="stylesheet" href="app.css"><div id="app"></div><script src="app.js"></script>');
const env = { ...process.env }; delete env.ELECTRON_RUN_AS_NODE;
const result = spawnSync(electron, [path.join(__dirname, 'scroll-anchor-electron.cjs'), root], { encoding: 'utf8', env, timeout: 50000 });
if (result.error || result.status !== 0 || !result.stdout.includes('SCROLL_ANCHOR_OK')) {
  console.error(result.error || '', result.stdout, result.stderr); process.exit(1);
}
process.stdout.write(result.stdout);

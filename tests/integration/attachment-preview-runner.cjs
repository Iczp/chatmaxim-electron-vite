const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const esbuild = require('esbuild');
const { parse, compileScript } = require('@vue/compiler-sfc');
const electron = require('electron');

async function main() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gotoim-attachment-preview-'));
  const mocks = {
    utils: `export const formatImageRect=()=>({width:100,height:100}); export const getImageRect=async()=>({width:100,height:100}); export const formatUrl=x=>x;`,
    download: `import {ref} from 'vue'; globalThis.__previewRequests=[]; export const useDownload=()=>({downloadFile:url=>new Promise((resolve,reject)=>globalThis.__previewRequests.push({url,resolve,reject})),percent:ref(),blobUrl:ref(),isPending:ref(false)});`,
    i18n: `export const useI18n=()=>({t:x=>x});`,
    visibility: `import {ref} from 'vue'; export const useElementVisibility=()=>ref(true);`,
    bytes: `export default x=>String(x);`,
  };
  await esbuild.build({ entryPoints: [path.resolve(__dirname, 'attachment-preview-app.ts')], bundle: true, platform: 'browser', format: 'iife',
    outfile: path.join(root, 'app.js'), loader: { '.png': 'dataurl' }, logLevel: 'silent',
    plugins: [{ name: 'vue-and-boundaries', setup(build) {
      build.onResolve({ filter: /^\.\.\/commons\/utils$/ }, () => ({ path: 'utils', namespace: 'mock' }));
      build.onResolve({ filter: /^\.\.\/composables\/useDownload$/ }, () => ({ path: 'download', namespace: 'mock' }));
      build.onResolve({ filter: /^vue-i18n$/ }, () => ({ path: 'i18n', namespace: 'mock' }));
      build.onResolve({ filter: /^@vueuse\/core$/ }, () => ({ path: 'visibility', namespace: 'mock' }));
      build.onResolve({ filter: /^pretty-bytes$/ }, () => ({ path: 'bytes', namespace: 'mock' }));
      build.onLoad({ filter: /.*/, namespace: 'mock' }, args => ({ contents: mocks[args.path], loader: 'js', resolveDir: path.resolve(__dirname, '../..') }));
      build.onLoad({ filter: /\.vue$/ }, args => {
        const descriptor = parse(fs.readFileSync(args.path, 'utf8'), { filename: args.path }).descriptor;
        return { contents: compileScript(descriptor, { id: 'preview-test', inlineTemplate: true }).content, loader: 'ts', resolveDir: path.dirname(args.path) };
      });
    }}] });
  fs.writeFileSync(path.join(root, 'index.html'), '<!doctype html><div id="app"></div><script src="app.js"></script>');
  const env = { ...process.env }; delete env.ELECTRON_RUN_AS_NODE;
  const result = spawnSync(electron, [path.join(__dirname, 'attachment-preview-electron.cjs'), root], { encoding: 'utf8', env, timeout: 30000 });
  if (result.error || result.status !== 0 || !result.stdout.includes('ATTACHMENT_PREVIEW_OK')) throw new Error(`preview integration failed: ${result.stdout} ${result.stderr} ${result.error || ''}`);
  process.stdout.write(result.stdout);
}
main().catch(error => { console.error(error); process.exitCode = 1; });

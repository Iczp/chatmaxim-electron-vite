import { app, protocol } from 'electron';
import path from 'node:path';
export default function setAppProtocol(scheme: string) {
  if (process.env.VITE_DEV_SERVER_URL) {
    app.setAsDefaultProtocolClient(scheme, process.execPath, [path.resolve(process.argv[1])]);
  } else {
    app.setAsDefaultProtocolClient(scheme);
  }

  // Scheme must be registered before the app is ready
  // 此方法只能在 app 的 ready 事件触发前调用，且只能调用一次
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'chatmaxim',
      privileges: {
        secure: true,
        standard: true,
        // 绕过内容安全策略
        bypassCSP: true,
        supportFetchAPI: true,
      },
    },
  ]);

  const showProcessArgv = () => console.log('Process args: %o', process.argv);

  if (app.isReady()) showProcessArgv();
  else app.on('ready', showProcessArgv);
}

app.whenReady().then(() => {
  protocol.handle('chatmaxim', req => {
    const { host, pathname } = new URL(req.url);
    if (host === 'bundle') {
      if (pathname === '/') {
        return new Response('<h1>1111111</h1>', {
          headers: { 'content-type': 'text/html' },
        });
      }
      // NB, this does not check for paths that escape the bundle, e.g.
      // app://bundle/../../secret_file.txt
      return new Response('<h1>222222222222</h1>', {
        headers: { 'content-type': 'text/html' },
      });
    } else if (host === 'api') {
      return new Response('<h1>3333333333333</h1>', {
        headers: { 'content-type': 'text/html' },
      });
    } else {
      return new Response('<h1>else</h1>', {
        headers: { 'content-type': 'text/html' },
      });
    }
  });
});

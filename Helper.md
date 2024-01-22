### 平台打包过程经常报错

#### remove F:\Dev\electron-vite-vue\release\2.0.0\win-unpacked\resources\app.asar: The process cannot access the file because it is being used by another process.

https://github.com/electron-userland/electron-builder/issues/4429

1. 当软件被安装在c盘时，我们就需要管理员权限来替换`app.asar`文件。![exe](https://file.xuxin123.com/blog/2021/12/1.png)
2. 关于锁定问题，在增量二中已经说明了一下，处理方式就是关闭我们的Electron应用，然后再进行`app.asar`文件的替换。

### 更新步骤

1. 编写bat脚本，在脚本中执行Electron应用的关闭，`app.asar`文件的替换，重启Electron应用，然后将bat脚本打包成exe文件。
2. 下载update.asar（更新版本的app.asar），判断用户软件是否安装在c盘，是：使用`sudo-prompt`这个包临时提权执行上面的exe，不是：可以不用提权，直接使用node的exec执行上面的exe。

```bash
 built in 22ms
  • electron-builder  version=24.6.4 os=10.0.22621
  • loaded configuration  file=F:\Dev\electron-vite-vue\electron-builder.json5
  • writing effective config  file=release\2.0.0\builder-effective-config.yaml
  • packaging       platform=win32 arch=x64 electron=26.3.0 appOutDir=release\2.0.0\win-unpacked
  ⨯ remove F:\Dev\electron-vite-vue\release\2.0.0\win-unpacked\resources\app.asar: The process cannot access the file because it is being used by another process.
github.com/develar/go-fs-util.EnsureEmptyDir
        /Volumes/data/go/pkg/mod/github.com/develar/go-fs-util@v0.0.0-20190620175131-69a2d4542206/fs.go:98
github.com/develar/app-builder/pkg/electron.UnpackElectron.func1.1
        /Volumes/data/Documents/app-builder/pkg/electron/electronUnpack.go:38
github.com/develar/app-builder/pkg/util.MapAsyncConcurrency.func2
        /Volumes/data/Documents/app-builder/pkg/util/async.go:68
runtime.goexit
        /usr/local/Cellar/go/1.17/libexec/src/runtime/asm_amd64.s:1581
  ⨯ F:\Dev\electron-vite-vue\node_modules\app-builder-bin\win\x64\app-builder.exe process failed ERR_ELECTRON_BUILDER_CANNOT_EXECUTE
Exit code:
1  failedTask=build stackTrace=Error: F:\Dev\electron-vite-vue\node_modules\app-builder-bin\win\x64\app-builder.exe process failed ERR_ELECTRON_BUILDER_CANNOT_EXECUTE
Exit code:
1
    at ChildProcess.<anonymous> (F:\Dev\electron-vite-vue\node_modules\builder-util\src\util.ts:250:14)
    at Object.onceWrapper (node:events:629:26)
    at ChildProcess.emit (node:events:514:28)
    at ChildProcess.cp.emit (F:\Dev\electron-vite-vue\node_modules\cross-spawn\lib\enoent.js:34:29)
    at maybeClose (node:internal/child_process:1105:16)
    at Process.ChildProcess._handle.onexit (node:internal/child_process:305:5)
```

#### 错误1

```
[electron](https://so.csdn.net/so/search?q=electron&spm=1001.2101.3001.7020)-build,windows平台打包过程经常报错 :

Error: C:\Users\M******_C******\AppData\Local\electron-builder\Cache\nsis\nsis-3.0.3.2\Bin\makensis.exe exited with code ERR_ELECTRON_BUILDER_CANNOT_EXECUTE
at ChildProcess. (H:\SaveLane\node_modules\builder-util\src\util.ts:239:14)
at Object.onceWrapper (events.js:422:26)
at ChildProcess.emit (events.js:315:20)
at maybeClose (internal/child_process.js:1021:16)
at Process.ChildProcess._handle.onexit (internal/child_process.js:286:5)

调查后发现 每次打包之前,打开[任务管理器](https://so.csdn.net/so/search?q=任务管理器&spm=1001.2101.3001.7020), 查看是否有electron进程运行, 必须全部杀掉才能正常打包

https://github.com/electron-userland/electron-builder/issues/5134
```

### electron-store 启用过慢

`在主进程中先初始化之后，再在渲染进程序调用`

`/electron/main.ts`

```typescript
import Store from 'electron-store';

//主进程中先初始化
Store.initRenderer();
```

### 打包

```bash
(base) PS F:\Dev\electron-vite-vue> npm run build

> electron-vue-vite@2.0.0 build
> vue-tsc --noEmit && vite build && electron-builder

vite v4.4.11 building for production...
✓ 3912 modules transformed.
dist/index.html                                                                0.55 kB │ gzip:   0.36 kB
dist/assets/imfont-24b41fce.ttf                                               24.63 kB
dist/assets/Login-4bbab236.css                                                 0.32 kB │ gzip:   0.21 kB
dist/assets/ChatEmpty-f3548be1.css                                             0.42 kB │ gzip:   0.29 kB
dist/assets/UserProfile-73a0f53f.css                                           0.48 kB │ gzip:   0.28 kB
dist/assets/Home-695848e2.css                                                  1.39 kB │ gzip:   0.51 kB
dist/assets/Chat-b2c6d1a8.css                                                  2.17 kB │ gzip:   0.62 kB
dist/assets/Session-f87759da.css                                               2.77 kB │ gzip:   0.81 kB
dist/assets/index-796f0823.css                                               166.49 kB │ gzip:  21.86 kB
dist/assets/Settings-427a1def.js                                               0.13 kB │ gzip:   0.13 kB
dist/assets/omit-2dcbf001.js                                                   0.15 kB │ gzip:   0.15 kB
dist/assets/Settings.vue_vue_type_script_setup_true_lang-89a1fec4.js           0.40 kB │ gzip:   0.25 kB
dist/assets/useMergedState-4d047a71.js                                         0.48 kB │ gzip:   0.30 kB
dist/assets/colors-8122010b.js                                                 0.53 kB │ gzip:   0.35 kB
dist/assets/vnode-60ad5644.js                                                  0.80 kB │ gzip:   0.38 kB
dist/assets/About-67fcc504.js                                                  1.09 kB │ gzip:   0.56 kB
dist/assets/ChatEmpty-376c4194.js                                              1.24 kB │ gzip:   0.69 kB
dist/assets/responsiveObserve-824cac96.js                                      1.40 kB │ gzip:   0.72 kB
dist/assets/CloseOutlined-c25c2f45.js                                          1.46 kB │ gzip:   0.76 kB
dist/assets/UserProfile-d13c0eb9.js                                            1.70 kB │ gzip:   0.94 kB
dist/assets/collapseMotion-5a2a0faa.js                                         1.90 kB │ gzip:   0.77 kB
dist/assets/im-b6884cfe.js                                                     2.37 kB │ gzip:   1.25 kB
dist/assets/SettingOutlined-a720d3a5.js                                        2.61 kB │ gzip:   1.32 kB
dist/assets/index-ccd39d14.js                                                  3.12 kB │ gzip:   1.52 kB
dist/assets/hasIn-be40b04c.js                                                  3.56 kB │ gzip:   1.70 kB
dist/assets/index-77fc0aa8.js                                                  5.64 kB │ gzip:   2.53 kB
dist/assets/ChatObjectService-c447885a.js                                      6.29 kB │ gzip:   1.00 kB
dist/assets/IczpNet_Chat_WalletRecorders_Dtos_WalletRecorderDto-0cc53dae.js    6.66 kB │ gzip:   0.72 kB
dist/assets/SessionUnitService-2f9f92af.js                                     7.29 kB │ gzip:   1.13 kB
dist/assets/Session-6a8d788c.js                                                8.65 kB │ gzip:   3.83 kB
dist/assets/UserOutlined-5c0f61b2.js                                          14.52 kB │ gzip:   5.24 kB
dist/assets/Home-65572100.js                                                  14.62 kB │ gzip:   4.63 kB
dist/assets/useFlexGapSupport-8dadee2c.js                                     16.52 kB │ gzip:   4.89 kB
dist/assets/zoom-6093f440.js                                                  20.38 kB │ gzip:   6.87 kB
dist/assets/index-d7b61a0b.js                                                 28.96 kB │ gzip:   9.48 kB
dist/assets/index-4c87b44f.js                                                 41.87 kB │ gzip:  12.62 kB
dist/assets/index-5a2a2fae.js                                                 46.72 kB │ gzip:  15.10 kB
dist/assets/index-0849435f.js                                                 53.10 kB │ gzip:  17.41 kB
dist/assets/EditOutlined-20301d25.js                                          58.44 kB │ gzip:  18.83 kB
dist/assets/Chat-53546c51.js                                                  67.80 kB │ gzip:  20.03 kB
dist/assets/Login-7fa1e9f9.js                                                 76.58 kB │ gzip:  26.29 kB
dist/assets/index-6e3e6d42.js                                                631.25 kB │ gzip: 211.38 kB

(!) Some chunks are larger than 500 kBs after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 11.14s
vite v4.4.11 building for production...
✓ 1 modules transformed.
dist-electron/main/index.js  2.13 kB │ gzip: 0.99 kB
✓ built in 26ms
vite v4.4.11 building for production...
✓ 1 modules transformed.
dist-electron/preload/index.js  1.57 kB │ gzip: 0.76 kB
✓ built in 12ms
  • electron-builder  version=24.6.4 os=10.0.22621
  • loaded configuration  file=F:\Dev\electron-vite-vue\electron-builder.json5
  • writing effective config  file=release\2.0.0\builder-effective-config.yaml
  • packaging       platform=win32 arch=x64 electron=26.3.0 appOutDir=release\2.0.0\win-unpacked
  • downloading     url=https://github.com/electron/electron/releases/download/v26.3.0/electron-v26.3.0-win32-x64.zip size=102 MB parts=8
  • downloaded      url=https://github.com/electron/electron/releases/download/v26.3.0/electron-v26.3.0-win32-x64.zip duration=4m41.189s
  • default Electron icon is used  reason=application icon is not set
  • building        target=nsis file=release\2.0.0\YourAppName-Windows-2.0.0-Setup.exe archs=x64 oneClick=false perMachine=false
  • building block map  blockMapFile=release\2.0.0\YourAppName-Windows-2.0.0-Setup.exe.blockmap
```

# [npm 源地址设置及恢复](https://www.cnblogs.com/uzi666/p/15350757.html)

### 设置国内淘宝镜像

1. 通过cnpm使用淘宝镜像：

```javascript
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

1. 将npm设置为淘宝镜像：

```javascript
npm config set registry https://registry.npm.taobao.org
```

1. 查看当前npm源

```javascript
npm config get registry 
```

1. 查看当前cnpm源

```javascript
cnpm config get registry  
```

1. 如果设置了npm为淘宝镜像，需要恢复为默认源时：

```javascript
npm config set registry=https://registry.npmjs.org 
```

设置之后，记得通过**npm config get registry** 查看源是否设置成功

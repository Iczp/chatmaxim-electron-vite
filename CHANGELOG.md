## 2026-11-05

v2.1.0 - 对齐 GotoIM 新客户端协议

- 认证：`IM_Mobile` 公共客户端、新 scope、设备 UUID、设备注册、`scan-token` 授权、单飞刷新。
- 新增扫码登录（PC 端 SignalR Hub 生成二维码 + 轮询确认）。
- 实时：删除自建 WebSocket，改用 SignalR `/signalr-hubs/chat`（17 个命令、Heartbeat、kicked、重连）。
- REST：消息 history/latest/changes、会话 session-unit-cache、在线状态、设备管理。
- 多窗口：统一 `app-event` 总线，主窗口单连接 + 子窗口广播；Token 以主进程为准。
- 聊天：`DynamicScroller` 虚拟列表 + 历史消息滚动锚定；会话列表改可变高度虚拟滚动。
- 详细差异见 `docs/UPGRADE-ANALYSIS.md`。

## 2022-10-03

[v2.1.0](https://github.com/electron-vite/electron-vite-vue/pull/267)

- `vite-electron-plugin` is Fast, and WYSIWYG. 🌱
- last-commit: db2e830 v2.1.0: use `vite-electron-plugin` instead `vite-plugin-electron`

## 2022-06-04

[v2.0.0](https://github.com/electron-vite/electron-vite-vue/pull/156)

- 🖖 Based on the `vue-ts` template created by `npm create vite`, integrate `vite-plugin-electron`
- ⚡️ More simplify, is in line with Vite project structure
- last-commit: a15028a (HEAD -> main) feat: hoist `process.env`

## 2022-01-30

[v1.0.0](https://github.com/electron-vite/electron-vite-vue/releases/tag/v1.0.0)

- ⚡️ Main、Renderer、preload, all built with vite

## 2022-01-27
- Refactor the scripts part.
- Remove `configs` directory.

## 2021-11-11
- Refactor the project. Use vite.config.ts build `Main-process`, `Preload-script` and `Renderer-process` alternative rollup.
- Scenic `Vue>=3.2.13`, `@vue/compiler-sfc` is no longer necessary.
- If you prefer Rollup, Use rollup branch.

```bash
Error: @vitejs/plugin-vue requires vue (>=3.2.13) or @vue/compiler-sfc to be present in the dependency tree.
```

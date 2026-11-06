# 旧桌面端（electron-vite-vue）对齐新客户端（gotoim-flutter）差异分析

> 基准：`F:\Dev\GotoIM\gotoim-flutter`（只读参考，本次不修改）
> 目标：`F:\Dev\electron-vite-vue`（本次只改这里）
> 分析时间：2026-11

## 1. 结论摘要

旧项目是 Vue3 + Electron 的 IM 桌面端，功能完整但协议层停留在旧版：

| 领域 | 旧实现 | 新客户端（后端现状） | 影响 |
| --- | --- | --- | --- |
| 登录 | `IM_App` + client_secret + 固定 scope | `IM_Mobile` 公共客户端 + 新 scope + 设备 UUID + 设备注册 | 可能 401/invalid_client |
| 扫码登录 | 无 | 扫码登录 SignalR Hub + `scan-token` 授权 | 缺功能 |
| 实时通道 | 自建 WebSocket（ticket + ping 文本帧），同时残留一个只打印日志的 SignalR 连接 | SignalR `/signalr-hubs/chat`，17 种命令、Heartbeat、kicked | 消息/在线状态不可用或双连接 |
| REST API | 旧 Swagger 生成（message、session-unit、badge…） | message/history、session-unit-cache、online、app-device、ai 等 | 列表/历史/已读/设备管理失效 |
| 多窗口 | 每个窗口各自建连；`websocket` 只转发给 chat-* 窗口 | 主窗口单连接 + WindowMessenger 广播 + 子窗口代理调用 | 连接数翻倍、状态不同步 |
| 虚拟列表 | 聊天页 `v-for` 全量渲染（DynamicScroller 被注释） | 反向 `ListView.builder`、分页阈值、滚动锚定 | 长会话卡顿/内存上涨 |

## 2. 新项目基准

- 分层：`app / core / features`，Riverpod 状态、Dio 网络、Drift 本地库、signalr_netcore。
- 实时边界：`core/realtime/signalr_gateway.dart`（协议、命令枚举）、`signalr_gateway_io.dart`（连接）。
- 实时消费：`features/session/application/realtime_sync_coordinator.dart`，**只把推送当通知，再走 REST 增量同步**，不直接信任 payload 改库。
- 认证：`features/auth/data/openid_connect_auth_repository.dart`。
- 扫码：`features/scan_login/**`（PC 端生成二维码 + 等待 `scanned/granted/rejected/cancelled`）。
- 多窗口：`core/services/window_messenger.dart`（事件定义 + 单连接原则）、`core/native_window/*`。
- 环境变量：`.env.*`，`core/config/app_environment.dart`。

## 3. 逐项差异与变更清单

### 3.1 登录方式参数（P0）

旧：

```
client_id     = IM_App
client_secret = 1q2w3e*########
scope         = IM offline_access roles profile phone email address
device_id     = "electron-" + machineId（非 UUID）
headers       = app-id / app-version / app-platform + App-Device-Id / App-Device-Type=pc
grant_type    = password / refresh_token
```

新：

```
client_id     = IM_Mobile（公共客户端，client_secret 可为空）
scope         = IM Chat Cms Social AppStatistic AppDevice offline_access roles profile phone email address
device_id     = UUID（由机器码 SHA-256 格式化）
headers       = Accept / App-Device-Id / App-Device-Type / App-Id / App-Version
grant_type    = password / refresh_token / scan-token / client_credentials
设备注册      = POST {app-device}/api/app-device/public/device-public/register（client_credentials 换 AppDevice token）
用户信息      = POST /connect/userinfo；撤销 = /connect/revocat
```

变更：

1. `.env*`：`VITE_APP_CLIENT_ID=IM_Mobile`，`VITE_APP_CLIENT_SECRET=`（可空），新增 `VITE_APP_AUTH_SCOPE`、`VITE_APP_APP_DEVICE_BASEURL`、`VITE_APP_SIGNALR_*`、`VITE_APP_SCAN_LOGIN_*`、`VITE_APP_DEVICE_TYPE`、`VITE_APP_PRESENCE_HEARTBEAT_SECONDS`。
2. `src/env.ts` 增加上述字段及默认值。
3. `electron/main/commons/machine.ts`：机器码转 UUID 并持久化；老值做一次确定性迁移。
4. `src/apis/auth/*`：Token 增加 `expires_at`/`refresh_token` 轮换、单飞刷新、`scan-token`、client_credentials、`/connect/userinfo`、`/connect/revocat`。
5. 请求头统一由 `request.ts`/v2 客户端注入，`App-Device-Type` 使用 `desktop`。
6. 启动时（有/无登录态）完成设备注册，失败不阻塞离线使用。

### 3.2 扫码登录（P0，新增）

协议（新项目实测）：

1. 用 client_credentials（scope=IM）连接 `SIGNALR_BASE_URL + /scan-login/hub`，查询串带 `appId/appName/deviceId/deviceType/platform/...`。
2. `invoke("Generate", state)` → `{ scanText, expiredTime }`；`state` 为 4 位数字校验码。
3. 监听 `ReceivedMessage`：`{ command: "scanned" | "granted" | "rejected" | "cancelled", payload }`；`payload.scanToken` 为一次性票据。
4. 用 `grant_type=scan-token&scan_token=...` 调 `/connect/token` 换正式 Token。
5. 二维码过期时间默认 90s；PC 端点击可刷新，刷新前 `invoke("Cancel")` 可选（服务端亦会过期）。

变更：

- 新增 `src/scanlogin/ScanLoginHub.ts`（连接/生成/事件/断开）。
- 新增 `src/components/LoginQrCode.vue`（canvas 渲染，`qrcode` 依赖）。
- `src/views/Login.vue` 改为「账号密码 / 扫码登录」双 Tab，保持原窗口尺寸 320×560。
- 记住上次账号；登录成功后沿用 `setAuthorize` 流程。

### 3.3 后端 API 同步（P0）

| 能力 | 旧路径 | 新路径 |
| --- | --- | --- |
| 消息历史 | `GET /api/chat/message?maxMessageId=` | `GET /api/chat/message/history` |
| 消息增量 | `GET /api/chat/message?minMessageId=` | `GET /api/chat/message/latest` + `POST /api/chat/message/changes/query` |
| 指定消息同步 | — | `POST /api/chat/message/sync-items` |
| 会话列表 | `GET /api/chat/session-unit?ownerId=` | `GET /api/chat/session-unit-cache/friends` |
| 会话增量 | 推送直接改本地 | `GET /api/chat/session-unit-cache/changes`（minTicks/cursorId） |
| 会话详情 | `GET /api/chat/session-unit/{id}` | `GET /api/chat/session-unit-cache/friend/{id}` |
| 角标总览 | `GET /api/chat/session-unit/badge-by-current-user` | `GET /api/chat/session-unit-cache/overview` + `chat-object/by-current-user` |
| 在线好友 | 无 | `GET /api/chat/online/online-friends` |
| 我的在线设备 | `GET /api/chat/connection` | `GET /api/chat/online/by-current-user` |
| 强制下线 | 无 | `POST /api/chat/online/abort` |
| 已读 | `set-readed-message-id` | `POST /api/chat/session-unit-setting/set-read?sessionUnitId&messageId` |
| 删除消息 | — | `POST /api/chat/session-unit-setting/delete-message` |
| 发消息 | 无 `clientMessageId` | 所有 send-* 需带 `clientMessageId`（幂等） |
| 上传 | `send-upload{type}` | 兼容；建议显式 `send-upload-image/file/sound/video` |
| 设备 | 无 | `/api/app-device/public/device-public/{register,logout,my-devices}`、`app-version/latest` |
| 扫码解析 | 无 | `POST /api/chat/scan-code/scan` |
| 社交/AI | 无 | `/api/chat/ai/*`、`/api/social/*`（本期不做 UI，保留扩展点） |

变更：

- 新增 `src/apis/v2/{http,auth,device,messages,sessions,presence,app}.ts`，统一走 `__request` 以复用 Token/错误处理。
- `useMessageList` 改用 history/latest；`useSessionUnitList` 改用 friends + changes。
- `imStore` 角标改为 overview + chat-object 组合，保留旧 DTO 形状减少 UI 改动。
- `sendMessage` 增加 `clientMessageId`（本地 `autoId` 派生 UUID），上传走新显式路径。
- DTO 增补 `clientMessageId`、`score`、`isDeleted`、`deviceTypes` 等可选字段。

### 3.4 实时通道：WebSocket → SignalR（P0）

旧链路：`POST /api/pusher/ticket/generate` → `ws://...`；文本 `ping <ms>`；payload `{command: Chat/Rollback/SessionRequest/IncrementCompleted}`。
新链路：

```
URL            = SIGNALR_BASE_URL + /signalr-hubs/chat
query          = appId, appName, deviceId, deviceType, pushClientId, brand, model,
                 deviceBrand, deviceModel, platform, browser
transport      = WebSockets + skipNegotiation=true
auth           = accessTokenFactory → Bearer access_token（连接前如将过期先刷新）
keepAlive      = 5000ms，serverTimeout = 15000ms
reconnect      = [0, 2000, 10000, 30000]ms
心跳           = invoke("Heartbeat", ticks) 每 10s
命令           = offline@me, online@me, offline@friend, online@friend,
                 created@message, forwarded@message, updated@message,
                 updated-badge@message, rollbacked@message, deleted@message,
                 started@ai, delta@ai, completed@ai, failed@ai,
                 kicked, welcome, changed@session-unit
```

变更：

- 新增 `src/realtime/{commands,signalrClient,realtimeHub,useRealtime}.ts`。
- `Home.vue` 只启动 `realtimeHub`（主窗口），移除 `useWebSocketKit`。
- 删除/停用 `src/apis/websockets/*` 的运行时引用；`electron/main/handles/webscoketHandle.ts` 由统一消息总线替代。
- 推送处理改为「通知 → 增量同步」，并广播给子窗口（见 3.5）。
- `kicked`：清 Token、关闭业务窗口、回登录页并提示原因。
- 连接状态、网络延迟进入 store，设置页/状态栏可展示。

### 3.5 多窗口通讯（P0）

旧问题：

1. 每个窗口都可能 import `useWebSocketKit`/`useSignalR`，连接数 = 窗口数。
2. `websocket` IPC 只转发 `chat-*` 窗口，pop/tray 收不到。
3. `global-event` 与 `websocket` 两套通道语义重叠，无类型。
4. 新开窗口依赖 localStorage，主进程 store 与渲染进程可能不一致。

新设计（对齐 WindowMessenger 的单连接原则）：

- `electron/main/commons/messageHub.ts` + `handles/messageHubHandle.ts`：
  - `app-event:broadcast`（除发送者外全部窗口）
  - `app-event:to-window`（按 name/id）
  - `app-event:to-main`（子窗口 → 主窗口请求）
  - `app-event:windows`（窗口注册表/聚焦）
- 渲染层 `src/ipc/appEvent.ts`：类型化 `on/off/broadcast/sendToMain/sendToWindow`，`window-ready` 握手。
- 仅 `windowStore.isMain()` 建立 SignalR；主窗口把 `realtime:event`/`session:updated`/`signalr:status` 广播给子窗口；子窗口只消费。
- 子窗口发消息等写操作：`sendToMain('chat:send', payload)` 由主窗口代理（本期先提供通道，聊天页逐步接入）。
- `authorize`/`token` 走主进程 store，渲染层启动时 `auth:get-token` 对齐。
- 保留 `openChildWindow` 的请求/响应模式，事件名纳入统一命名空间。

### 3.6 虚拟列表（P1）

旧：

- `Chat.vue` 使用 `v-for` 渲染全部消息；`DynamicScroller` 被注释；历史消息 prepend 后无滚动锚定。
- `Session.vue` 用 `RecycleScroller :item-size="64"`，但会话项含副标题/时间，实际高度可变。

新：

- 聊天：反向列表 + 保持底部、向上分页（`extentAfter < 300`）、`localId` 稳定 key、临时消息层、消息入场动画。
- 会话：可变高度虚拟滚动 + 置顶分组。

变更：

- `Chat.vue`：`DynamicScroller` + `DynamicScrollerItem`，`:min-item-size="56"`，reverse 滚动，prepend 前记录 `scrollHeight` 补偿。
- `Session.vue`：`RecycleScroller` 改 `DynamicScroller`（或固定 72px + 省略号），key 用 `sessionUnitId`。
- `MessageItem.vue`：减少响应式依赖，图片/视频尺寸稳定占位，避免滚动抖动。

### 3.7 其他（P2）

- 设备管理页（`DevicesSetting.vue`）接 `my-devices` + `logout` + `abort`。
- 托盘/角标继续用本地 store，但数据源改为 overview。
- AI 流式消息：预留 `ai@*` 事件与渲染占位，本期不与 UI 深度整合。
- 版本号升至 `2.1.0`，CHANGELOG 记录。

## 4. 实施顺序

1. 配置/环境 → 2. 设备 ID 与设备注册 → 3. 认证与 Token → 4. v2 REST → 5. SignalR + 单连接 →
6. 多窗口总线 → 7. 扫码登录 UI → 8. 虚拟列表 → 9. 类型检查/构建/回归。

## 5. 验证清单

- [ ] 账号密码登录、刷新 Token、退出登录、扫码登录（scanned/granted/rejected/expired）。
- [ ] 断网重连、Token 过期重连、401 后刷新重试、kicked 强制下线。
- [ ] 新消息（单聊/群聊/转发/撤回/删除）在多个窗口同步，角标与托盘一致。
- [ ] 历史消息上翻不跳动，1000+ 条消息滚动流畅。
- [ ] 会话列表 500+ 条滚动流畅，置顶/取消置顶排序正确。
- [ ] 独立聊天窗口、pop、tray 只保持 1 条 SignalR 连接。
- [ ] `vue-tsc --noEmit` 与 `vite build` 通过。

## 6. 风险

- 后端若仍保留旧路由，双写期需按环境开关切换；本期以新路由为准。
- `client_secret` 置空依赖后端把桌面端登记为公共客户端；若未登记，保留环境变量回填即可。
- SignalR `skipNegotiation` 需服务端允许 WebSockets 直连；失败时回退协商（客户端自动）。
- 多窗口单连接意味着主窗口关闭时子窗口失去实时能力，需要主窗口隐藏而非销毁（现有 `isPreventClose` 已满足）。

# Electron 客户端迁移任务说明书

更新：2026-11-06。目标仓库：`F:\Dev\electron-vite-vue`；参考：`F:\Dev\GotoIM\gotoim-flutter`（只读）。本文件是代码静态核对和后续任务清单，不代表已完成后端联调。路径均相对对应仓库。

## 现状与边界

旧仓库为 Electron/Vue 3/Pinia/Axios；Flutter 参考使用 Dio、Drift、Riverpod 和 SignalR。迁移目标是兼容当前业务协议与交互，不要求复制 Flutter 技术栈。本次只编写规划，不改业务实现或 Flutter 项目。

旧仓库当前分支 `dev-up` 相对 `github/dev-up` 超前 1 个提交，并有大量未提交修改及未跟踪文件。已有工作包括 `src/apis/v2/`、`src/scanlogin/`、`src/realtime/`、窗口 IPC、登录页和列表改造；它们是进行中的工作，不能当作已验收成果。`docs/UPGRADE-ANALYSIS.md` 也是未跟踪的已有文档，列出的设计和协议值需逐项核验：例如它称聊天仍全量 `v-for`、会话使用 `RecycleScroller`，而当前 `src/views/chat/Chat.vue` 和 `src/views/Session.vue` 都已使用 `DynamicScroller`。它提出的协商回退、子窗口写操作代理等也不能凭文档推断已经实现。

## 差异与任务

### P0：认证、设备与扫码

- 参考 Flutter `lib/features/auth/data/openid_connect_auth_repository.dart`、`lib/core/network/`、`lib/core/device/`、`lib/features/scan_login/`；核对环境配置和当前后端契约，不在文档固化凭据。
- 旧端 `src/apis/auth/TokenController.ts` 已加入密码、扫码票据、client credentials、过期预刷新与进程内 `refreshPromise`；`src/scanlogin/ScanLoginHub.ts` 和 `src/views/Login.vue` 已有二维码流程。逐项核实 client ID、scope、设备 ID、头、注册、用户信息和退出端点及响应；扫码测试生成、扫描、授权、拒绝、取消、过期和重新生成，保证重复授权不会登录两次。
- 每个 Electron 渲染进程各自有模块状态，现有 `refreshPromise` 不能保证跨窗口单飞；检查 `electron/main/handles/authTokenHandle.ts` 的持久化和广播一致性，设计唯一刷新协调者，覆盖轮换、并发 401、旧 token 响应晚到、登出与刷新竞态。认证接口不能进入无限刷新；业务请求失败后的重试必须有上限。检查现有请求链路是否确实处理 401，而不只提前刷新。
- 验收：多窗口同时过期和同时 401 只产生一次刷新，所有请求得到正确结果；失败清理与重新登录一致。检查 token 安全存储、日志脱敏和设备注册失败处理。

### P0：API 与数据契约

- 参考 Flutter `lib/features/chat/data/datasources/message_api.dart` 和 `lib/features/session/data/datasources/session_unit_api.dart`；旧端 `src/apis/v2/index.ts` 已声明部分新接口，`useMessageList.ts` 已调用 history/latest，`useSessionUnitList.ts` 已调用 friends。
- 建立旧调用点到新端点的清单，逐项核对 HTTP 方法、路径、查询/请求体、分页游标、返回字段及错误行为。优先会话列表/详情/增量、消息历史/latest/changes/sync-items、发送/撤回/删除/已读、在线设备和角标。API 被声明不等于已接通：当前会话 `fetchLatest` 仍刷新 friends 首页，不能视为已实现 changes 增量；确认消息 changes/sync-items 的消费与游标持久化。
- 不直接覆盖整个生成 API；确认 `npm run generate` 的输入和手工扩展边界。为关键 DTO 和请求增加契约测试，以后端实际 JSON 或可用 OpenAPI 为依据。未确认的 endpoint、客户端配置和兼容策略记录为待联调。
- 验收：首次加载、翻页、增量、修改/撤回/删除、已读、空结果、错误和重试正确，历史数据不丢失、不重复。

### P0：SignalR 与同步

- 参考 Flutter `lib/core/realtime/` 和 `lib/features/session/application/realtime_sync_coordinator.dart`。旧端 `src/realtime/signalrClient.ts` 已建立 Hub、重连和心跳，`realtimeHub.ts` 限制主窗口启动，并通过 IPC 广播。旧 WebSocket 相关文件存在删除及残留引用，需全面搜索运行时依赖后处理。
- 按真实 Hub 协议验证 URL、认证、查询参数、事件结构、命令、心跳和连接策略。当前处理部分消息时直接更新最后消息和角标；核实重复事件、乱序和缺字段，建立以服务端增量同步为准的补偿流程。重连后检查漏消息和会话变化，处理首次连接失败、token 过期、踢下线及网络恢复。
- 验收：主业务进程只保有一条聊天 Hub 连接（扫码 Hub 是独立登录连接）；多窗口开启、关闭、重连和退出后连接及监听数量正确，消息不重复、角标最终一致。

### P0：多窗口与认证状态

- 参考 Flutter `lib/core/services/window_messenger.dart`；旧端已有 `electron/main/commons/messageHub.ts`、`electron/main/handles/appEventHandle.ts`、`src/ipc/appEvent.ts`。梳理主窗口、独立聊天、设置、托盘、弹窗的注册、ready、事件方向与卸载；验证新开窗口如何获得当前状态，避免只依赖启动后的广播。
- 定义事件载荷和请求/响应、所有权、去重与失败语义；处理主窗口隐藏/关闭、子窗口重建、切换账号及被踢。明确哪些操作需要主窗口代理，哪些可安全独立执行，避免未经验证就将所有写操作集中。
- 检查 IPC 发送方校验与凭据访问范围；当前多个 BrowserWindow 启用 Node 集成、关闭上下文隔离及 Web 安全，需作为独立安全任务评估 preload 和兼容迁移，不在业务改造中无计划扩大权限。
- 验收：至少两个聊天窗口及托盘同时操作，登录状态、消息、会话、未读和退出一致；重复打开关闭不泄漏监听。

### P1：消息持久化、发送与列表

- 对照 Flutter `lib/features/chat/data/repositories/message_repository.dart`、`lib/features/session/data/repositories/session_repository.dart` 和相应 DAO。旧端现有 `useMessageList.ts`、`useSessionUnitList.ts` 以响应式内存列表为主；确认现有持久化覆盖后确定桌面本地数据方案，不假定已有离线库。
- 设计独立 local ID、server ID、clientMessageId 和会话游标；本地待发送、失败重试和服务端回执去重；好友/聊天详情及历史先读本地再后台同步，按需分页，保留已读语义。确认存储迁移、账号隔离、登出和数据清理策略。
- 两个页面已有 `DynamicScroller`：检查 key 唯一稳定、变高消息与媒体加载、旧消息 prepend 锚点、触底跟随、搜索跳转、空列表及多窗口变化。不要仅因为组件存在就判定性能达标。
- 验收：断网启动有缓存时可展示；发送失败可重试且不重复；上翻历史保持视口；用可复现的大列表数据测量 DOM 数量、帧表现和内存，并记录环境和结果。

### P1：诊断、测试与发布

- 增加可重复的自动化测试：认证刷新单飞与 401、扫码状态机、API 请求/解析、SignalR 重连及增量去重、IPC 生命周期、消息分页与列表锚点。缺少测试框架时先评估与现有构建兼容的最小方案。
- 为可独立验证的关键能力提供实际诊断入口或可执行诊断工具，显示输入、运行状态、结果和错误并支持复制，严禁泄露 token 或消息隐私；涉及平台能力时标记支持范围。
- 类型检查 `npx vue-tsc --noEmit`；按任务范围运行测试、Vite 构建及 Electron 打包验证。`npm run build` 会先 clean 再调用 electron-builder，应检查环境与产物影响。真实服务、不同操作系统和打包结果分别记录，不用静态检查代替联调。

## 执行顺序与依赖

1. 保护现有工作，确认后端环境、设备和 API 契约，建立可复现基线。
2. 认证单飞和设备身份 → 扫码登录及登录态恢复 → API 契约与数据层。
3. IPC 所有权和状态同步 → SignalR 生命周期与断线补偿 → 消息/会话持久化和发送一致性。
4. 虚拟列表与滚动体验 → 诊断、自动化、跨窗口/平台联调及发布回归。

任务可交叉，但协议或单连接结论必须有实测支持。每项交付记录实际修改、测试命令与结果、无法验证的服务/平台。禁止把参考项目或既有未提交文件纳入提交；推送前确认已有超前提交是否属于本次授权范围。

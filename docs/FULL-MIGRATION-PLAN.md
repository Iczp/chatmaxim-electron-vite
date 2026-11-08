# GotoIM Flutter → Electron 全量迁移计划与 AI 执行说明书

基线日期：2026-11-09。目标：`F:\Dev\electron-vite-vue`（现有 Electron 客户端，本文称 Electron）；功能和协议参考：`F:\Dev\GotoIM\gotoim-flutter`（本文称 Flutter，只读）。目标是让 Electron 获得 Flutter 已实现且适用于桌面的业务能力和行为，同时保留 Electron 已有有效功能。Flutter 的移动端能力需逐项判断适用性；不承诺把传感器、拨号等手机专属行为原样搬到桌面。

## 0. 给执行 AI 的工作指令

1. 首先阅读本文件、目标仓库 `AGENTS.md`、`docs/MIGRATION-TASKS.md` 和相关源码；执行 `git status --short --branch`、检查当前分支、远程、已有未提交修改及本计划基线后再修改。旧文件中记录的日期和状态可能已过时，以代码和实际运行结果为准。
2. 只能修改目标仓库。Flutter、UniApp、后端、其他工作区一律只读；禁止覆盖、重置、清理、提交用户不相关的文件。当前已有未提交改动，尤其登录、扫码、Vite 配置及测试；继承并检查，不视为错误或重新生成。
3. 按下列任务分批交付，不要一次性重写；每个任务先读 Flutter 对应文件及其测试、Electron 调用链、可取得的后端 OpenAPI/DTO 和真实响应。Flutter 是可执行参考，不保证其代码、注释、平台支持或测试覆盖均无缺陷。对不明确的契约列出证据及待联调项，不猜路径、不硬编码凭据。
4. 执行者应直接推进已经授权的开发工作；仅在不可推断的业务决策或真实环境/凭据缺失时请求必要信息。不得将存在文件、测试通过或 Mock 成功写成完整上线验收。
5. 每阶段更新任务状态：`未开始 / 已实现待测试 / 自动测试通过 / 真实后端已验证 / 平台已验证 / 阻塞`，记录提交、命令、结果和剩余风险；每功能中文提交，只纳入本任务文件。推送前确认远程和已有待推送提交，避免附带无关历史。
6. 不要为了“全量迁移”删除 Electron 独有业务。列清新增、复用、修改、待确认、平台不适用。重命名项目、产品标识、应用 ID、安装目录和数据库目录属于影响升级兼容的独立变更，应先完成影响评估，不因标题把目录直接改名。

## 1. 本次盘点基线与证据等级

- Electron：分支 `vite5`，HEAD `9dbf8a2f6d1f23a0d7f0e2c1421fa6228e121de9`；工作区中 package、lockfile、登录、扫码、TS/Vite 配置和一个扫码测试有未提交变动。源码状态包含这些改动，执行时可能继续变化。
- Flutter：分支 `dev`，HEAD `1413452411e5607f210ee79f64b32a29864d25c5`，本次只读。
- 状态标记：**部分**＝找到相关页面/代码，但行为及契约尚需逐项验证；**缺口待核**＝在已检查的目标路由、模块中未找到对应实现，并非声称仓库绝对没有；**风险**＝静态证据支持的问题或可能故障，需测试确认；**待确认**＝证据不足。
- `npm test` 于上述 Electron 工作区运行：13 个用例通过。其中认证和消息测试含自行复制的模拟协调/去重逻辑，不能证明真实生产代码、Electron IPC 或后端正确；扫码未跟踪测试也参与了本次测试。类型检查、Electron 真机、后端联调、macOS/Linux 验证均不以本记录代替。
- 已有 `docs/UPGRADE-ANALYSIS.md` 和 `docs/MIGRATION-TASKS.md` 为历史补充，不应覆盖本文件或反推当前完成度。

## 2. 功能对照总表

| 领域 | Flutter 参考（路径相对 Flutter） | Electron 现状（路径相对 Electron） | 状态与迁移要点 |
|---|---|---|---|
| 登录和令牌 | `features/auth/`、`core/network/` | `src/apis/auth/`、`electron/main/handles/authTokenHandle.ts`、`src/views/Login.vue` | 部分：密码、刷新、主进程单飞与 401 重试已有代码；验证并发、退出竞态和真实 IPC。 |
| PC 扫码登录 | `features/scan_login/` | `src/scanlogin/ScanLoginHub.ts`、`LoginQrCode.vue` | 部分：生成和事件处理已有；完整状态机、断线/刷新竞态待测。移动端扫码授权与桌面扫码登录区分。 |
| 设备注册及登录设备 | `core/device/`、`features/session/presentation/login_devices_page.dart` | `src/apis/v2/deviceRegistration.ts`、`DevicesSetting.vue` | 部分：检查注册、授权、设备列表及强制下线真实链路，避免混淆设备服务与在线连接。 |
| 身份/好友/会话 | `features/session/`、`features/contact/` | `Session.vue`、`Contacts.vue`、`useSessionUnitList.ts` | 部分：friends 新 API 和分页存在，本地优先、身份缓存及 changes 增量待迁移。 |
| 消息存储、发送、同步 | `features/chat/data/`、`core/database/` | `useMessageList.ts`、`sendMessage.ts`、`apis/v2/index.ts` | 部分：history/latest、发送和去重有代码；缺少已确认的持久消息库与 cursor 同步链路。 |
| 消息 UI 和媒体 | `features/chat/presentation/`、`features/media/` | `Chat.vue`、`MessageItem.vue`、`Msg*.vue`、`message-viewer/` | 部分：动态虚拟列表、图片/音视频/文件等已有；逐类型对齐、稳定滚动和预览交互待测。 |
| SignalR | `core/realtime/`、`features/session/application/realtime_sync_coordinator.dart` | `src/realtime/` | 部分：连接/事件/心跳/重连已有；可靠增量补偿、幂等和关闭生命周期待完成。 |
| 多窗口/托盘 | `core/services/window_messenger.dart`、`core/native_window/` | `electron/main/commons/windowManager.ts`、`messageHub.ts`、`src/ipc/` | 部分：独立聊天和广播已有；ready 快照、账号隔离、安全与同步待验证。 |
| 群组和会话设置 | `features/group/`、`group_management/`、`chat_settings/` | `views/chat-settings/`、`ObjectPicker.vue`、相关旧 API | 部分：已有成员/权限等旧功能；按功能和 API 逐项核验，不以旧页面存在等同兼容。 |
| 联系人与搜索 | `features/contact/`、`features/search/` | `Contacts.vue`、`composables/useContacts.ts`、搜索相关组件 | 部分：好友搜索、请求、分组索引、在线状态核对及集成。 |
| 个人、账户、设置 | `features/mine/`、`account/`、`user/`、`settings/` | `UserProfile.vue`、`object-settings/`、`app-settings/` | 部分：资料、头像、账户、设备、主题、通知等逐项对齐并保留旧设置。 |
| 探索与社交 | `features/explore/`、`features/social/` | 未发现对应新社交流和详情路由；旧 `markets/` 需逐项判定 | 缺口待核：Feed、动态、发布、评论、通知、媒体需按 Flutter 和社交服务实现。 |
| 工作台和小程序 | `features/workbench/` | `views/apps/`、`views/browser/` | 部分：已有应用列表和浏览器，但不能等同 Flutter 工作台、文件夹、H5 容器或会话恢复。 |
| JSBridge、浏览器、Deep Link | `core/jsbridge/`、`core/browser/`、`core/deep_link/` | 有浏览器窗口/IPC，未在已核对模块找到完整同协议分发器 | 缺口待核：统计真实 action 清单，设计隔离、授权和回调；禁止直接向不可信页面暴露 Node。 |
| 本地文件共享/媒体 | `features/local_file_server/`、`core/media/` | 文件选择、下载、截图、预览等已有 | 部分：核对局域网共享、生命周期、授权、传输进度与桌面支持。 |
| 通知、托盘、快捷键 | `core/notifications/`、`core/services/` | `electron/main/commons/tray.ts`、`keyboardShortcuts.ts` 等 | 部分：对齐通知设置、未读、焦点及窗口恢复；分别验证 Windows/macOS/Linux。 |
| 应用更新、隐私与统计 | `features/app_update/`、`core/compliance/`、`core/statistic/` | `app-settings/`、设备版本 API 声明 | 缺口待核：检查现有升级/隐私功能，补齐更新检测、事件队列及同意策略。 |
| 诊断 | `features/diagnostics/` | 未发现同规模诊断中心 | 缺口待核：重要独立能力提供真实诊断、异常、复制与平台支持信息。 |

## 3. 已发现的具体问题与优先风险

### D01 消息去重不能匹配客户端待发送与服务端回执（P0，静态风险）

`src/composables/useMessageList.ts` 的 `deduplicateMessages` 对带 `id` 的消息优先以 `id` 建 key，对无 `id` 的待发送消息以 `clientMessageId` 建 key。同一消息从待发送变为已确认时，两种 key 不同，不能仅凭此函数合并；先到旧行和后到新行也可能保留旧内容。目标是按账户、会话、server ID 和 client ID 双索引匹配并更新同一条本地记录，保证稳定本地 ID 与状态单调推进。用真实模块构造回执先到、推送先到、重试和重复消息测试。

### D02 消息变更协议与 Flutter 当前实现不一致（P0，已观察）

Electron `src/apis/v2/index.ts` 的 `MessageChangesInput` 使用 `minMessageId/maxMessageId`，返回类型声明为 `MessageOwnerDto[]`；Flutter `features/chat/data/repositories/message_repository_sync.dart` 按每会话 `cursor`、`snapshotCursor` 发送，处理每会话 `nextCursor`、`resetRequired` 等页面，并由 `sync-items` 校准。两边语义不同，且已检查的 Electron 调用链未发现消费 `changes`/`syncItems` 的同步协调。应先核对真实契约与返回，再建立 cursor 持久化、分页、快照、重置校准、幂等写入和提交原子性；禁止简单把响应当消息数组。

### D03 好友增量和离线优先未形成闭环（P0，已观察）

`src/composables/useSessionUnitList.ts` 的 `fetchLatest` 请求 friends 首页而非 `sessions.changes`；现有列表为内存 `ref`。Flutter `session_unit_api.dart` 暴露 friends、friend、changes，DAO 和 repository 支持本地数据。核查现有数据存储后建立账户/owner 隔离的本地好友、身份与同步游标；首页本地分页，网络 upsert，增量分页完成后才提交游标，支持删除/置顶/已读/角标变化。离线显示缓存，网络失败不误显示空列表。

### D04 实时事件与重连补偿（P0，静态风险）

`src/realtime/realtimeHub.ts` 对消息事件直接更新最后消息和增加角标；重复或乱序事件可能造成错误，需以复现测试为准。`signalrClient.ts` 的 `onreconnected` 更新状态并启动心跳，已检查代码中未见触发可靠的消息/好友 cursor 补偿。应通过统一同步协调器合并触发和请求，重连补齐，正确处理删除、撤回、已读、活跃会话和多窗口；对 event payload 不完整也能同步。

### D05 安全边界和敏感数据（P0）

`electron/main/handles/openBrowserWindowHandle.ts` 等 BrowserWindow 目前启用 `nodeIntegration`、关闭 `contextIsolation` 和 `webSecurity`；特别要验证外部内容是否能够获得高权限。`authTokenHandle.ts` 的 `auth:changed` 广播包含 token；须限定来源、接收者及暴露范围。`src/commons/sendMessage.ts`、`src/commons/parseContent.ts` 和 `CodeViewer.vue` 有内容日志。迁移时优先隔离不可信 Web 内容，限制导航、权限、下载和 IPC，明确 preload 白名单，并脱敏日志；安全整改应分阶段验证所有原有窗口与功能。

### D06 测试覆盖不等于产品验证（P0）

`tests/auth-coordination.test.mjs` 自建 mock 协调器，`tests/message-session-coordination.test.mjs` 重新实现排序/去重函数；这些测试没有直接约束对应生产函数。保留有价值的用例，将核心逻辑提取为可直接导入模块或通过依赖注入测试真实实现，增加 Electron 多窗口集成、真实后端契约和故障注入。不要为通过测试复制业务算法。

### D07 其他需要复现与核实的风险

- `useSessionUnitList.ts` 的历史请求设置 pending 标志但已检查函数缺少入口并发拒绝；重复触发可能重复请求、游标竞态。补充并发测试再修复。
- 列表 `DynamicScroller` 已存在，不能依据组件名判定锚点、变高媒体与内存达标；以测试测量。
- `src/apis/v2/index.ts` 中 `/connect/revocat` 等路径和每个客户端 scope、query、字段及旧 API fallback 以 Flutter、当前服务器契约验证，不能仅按标准名称改写或假定正确。
- 账号登出期间正在刷新的任务可能重新写入凭据；账号切换、窗口关闭、设备 ID 和存储迁移需用 generation/版本等机制验证。主进程单飞已有实现，不代表这些竞态已解决。
- 同一仓库同时存在 npm 与 pnpm lockfile、Vite 升级未提交改动；先确认实际使用的包管理器、Node 与构建版本，不随意重新生成另一个锁文件。

## 4. 目标架构与关键数据语义

- Electron 主进程负责受控的系统能力、窗口注册与生命周期、凭据安全边界和跨窗口协调。渲染进程采用 Vue/Pinia；业务通过 repository/service、HTTP 和数据访问层获取数据。单一权威本地库和数据变更通知用于协调窗口；避免每个窗口各写互不一致的内存副本。
- SQLite 等持久化实现按 Electron ABI、Windows/macOS/Linux 打包、迁移、加密/备份和现有依赖评估后选型，不先指定未经验证的新库。表至少覆盖账户、owner、好友/会话、消息、成员、附件、设置、同步 cursor 和必要队列；索引、事务、升级回滚、崩溃恢复、账号隔离必须明确。文件存应用目录，数据库存路径与元数据，不保存大文件 Blob。
- 消息分别保留 localId、serverId、clientMessageId、sessionId/sessionUnitId、会话内序号以及 Pending/Sending/Sent/Failed/Delivered/Read/Recalled/Deleted 状态；幂等键必须满足真实后端约束。发送先持久化本地、立即显示、HTTP 发送、回执或推送合并；失败保留并允许重试。
- 本地优先：身份和好友先读缓存，网络 upsert；聊天详情立即使用本地数据、异步刷新；初始本地最近 10 条，向上每次读取本地约 30 条，本地耗尽且未标记历史完成时请求 history 并写库；以 Flutter 与后端实际实现确认边界、游标和顺序。历史到头状态按会话保存，网络故障不能标记到头。
- `ReadMessageId` / `PeerReadMessageId` 按现有协议处理；好友 changes、消息 changes 的进度仅在数据与 cursor 同事务成功后前进；SignalR 作为同步触发信号，HTTP + 持久库提供恢复能力。
- 单个应用实例一个聊天 SignalR 所有者，扫码 Hub 独立。事件附带账户/owner、版本和作用域；新窗口 ready 后先获得快照再订阅增量，防止丢事件，退出及窗口销毁释放监听。重连执行增量补偿。
- 网络使用统一认证和业务通道、配置、设备头、错误映射、超时、取消、上传下载进度；401 仅受控刷新/重试一次，刷新在应用范围单飞。不要写出 secret、token、聊天正文或完整私有授权地址。

## 5. 可交付任务分解与验收

每个任务包括生产代码、必要迁移与诊断、直接覆盖生产逻辑的测试、文档状态。任务号用于后续 AI 汇报。

### M0 基线、契约与构建（先做）

- M0.1 核实 Git 状态、锁文件权威、Node/pnpm/npm、平台配置、构建产物和 `#swagger.json` 输入，记录 Flutter 与目标提交；不执行会清理用户数据的命令。
- M0.2 运行 `npm test`、`npx vue-tsc --noEmit`、适当的 Vite 构建；`npm run build` 会执行 clean 和打包，检查产物及环境后运行。真实 Electron 启动、登录和离线流程记录基线。
- M0.3 生成完整业务能力、路由、Flutter API → Electron API/调用点、方法、参数、响应、证据和状态矩阵。用户要求全面迁移，不能只审阅本文件所举端点；检查 Flutter 所有 `features/`、`core/` 与可访问服务契约。敏感内容不写入清单。
- 验收：基线可复现，每个失败有归因，不把无后端条件归为通过。

### M1 身份认证、扫码、设备（P0）

- 参考 `features/auth/`、`features/scan_login/`、`core/device/`；梳理登录、刷新、吊销、用户信息、设备注册/注销、账号恢复，核实各 endpoint、header、scope、UUID 迁移和服务基础地址。
- 以现有主进程刷新协调为基础补生命周期与安全，覆盖多窗口并发过期/401、旧 access token 晚到、refresh 轮换、5xx/断网、401、注销中刷新、切换账号、请求取消和进程重启。
- 扫码覆盖连接、Generate、二维码/验证码、scanned/granted/rejected/cancelled、过期、重新生成和切页/窗口销毁；防旧挑战事件和重复兑换。诊断显示状态而非票据。
- 验收：调用真实协调器的测试和至少一轮真实服务跨窗口联调；权限/设备注册失败具备可解释错误。

### M2 网络和 API 合约（P0，与 M1 并进）

- 按 M0.3 矩阵逐域迁移：认证、设备、chat-object、friends/changes/overview、message history/latest/changes/sync-items、发送、已读、会话设置、contacts/group、presence、social、workbench、设备管理、统计等。具体路径以 Flutter 数据源与后端证据为准。
- 分离各服务 base URL 和认证范围、序列化 DTO、错误/取消/上传下载；检查旧生成客户端和 `apis/v2` 的重复或回退路径，逐调用点替换，避免粗暴重生成覆盖手工代码。
- 验收：fixture 和真实请求校验方法、URL、query、body、分页/空值/错误；所有替换调用的 UI 有回归覆盖，未使用 API 不标已完成。

### M3 本地数据库和会话（P0）

- 对照 Flutter `core/database/unified_database.dart`、session DAO/repository；实现 schema/version、索引、事务、账号隔离与升级；保留 Electron 原有用户设置和可迁移数据。
- 缓存 owner、currentOwner、好友、头像元数据、friend detail、总数和游标；本地分页后补网络、上拉分页、下拉 changes，进入聊天先本地 detail 再后台刷新。网络失败保留已缓存内容。身份切换重新订阅对应数据。
- 验收：有缓存断网冷启动、切换身份、重启和跨窗口更新，分页与增量边界、同游标并发/重复数据、删除及异常回滚均正确。

### M4 消息数据、可靠同步与发送（P0）

- 按第 4 节建立消息表/DAO/repository、分页和 EOF 标记；对照 Flutter `message_repository.dart`、`message_repository_sync.dart`、`message_dao.dart` 和 `message_sync_database.dart` 的同步语义。
- 修复 D01/D02：从真实 DTO 实现 per-session cursor、snapshot、nextCursor、resetRequired、sync-items 校准、删除/撤回等；对于重复、乱序、重连和崩溃可恢复。精确处理发送状态与 clientMessageId，HTTP 响应与 SignalR 到达任意顺序都合并。
- 覆盖文本、引用、@、图片、语音、视频、文件、链接、名片、历史卡片、系统/撤回/删除、转发、搜索、失败重试和已读；按 Flutter 实际提供能力及后端支持逐项验收。处理上传下载进度、取消、授权地址、文件大小和 MIME。
- 验收：断网发送/重试、重启、回执顺序、重复事件、同步重置、删除撤回和多窗口同时操作均无丢失、错误覆盖或重复。

### M5 SignalR、窗口和 IPC（P0）

- 对照 `core/realtime/`、`realtime_sync_coordinator.dart`、`window_messenger.dart`；完善连接所有权、事件反序列化、心跳、重连补偿、失败退避、登出踢出及应用退出。
- 为主窗口/独立聊天/托盘/弹窗/设置建立注册、唯一窗口 ID、激活已有窗口、ready 快照、事件类型和订阅取消机制。增加 IPC 参数和发送方校验，按账户隔离；验证主窗口隐藏或销毁后的行为。
- 验收：连接计数、两个聊天窗口 + 主窗口 + 托盘，事件先后和首次快照、反复打开关闭、重连、注销、切换账户及异常恢复自动化/手工联调。

### M6 聊天与列表交互（P1）

- 对照 Flutter `chat/presentation/`、`session/presentation/`：分组时间、消息发送者头像昵称、好友数、连接状态、设备栏、身份切换、已读/未读分隔、选中/引用/转发、长按菜单等桌面行为。
- 基于现有 `DynamicScroller` 验证稳定 key、prepend 锚点、异步图片高度变化、滚动到底/新消息提示、搜索定位、并发加载与取消；会话置顶、排序、未读刷新、搜索和空状态不回退。
- 验收：记录机器、窗口尺寸、数据规模与测量方式，验证 1000+ 动态消息和 500+ 会话的 DOM 数量、滚动、内存、耗时；数值作为测试规模不是性能承诺。

### M7 联系人、群组、账户、设置（P1）

- 联系人索引/搜索/在线、添加好友与请求处理、创建群、成员管理、资料/昵称/头像、群设置与权限；对照 Flutter `contact/`、`group/`、`group_management/`、`chat_settings/`、`user/`、`account/`。映射旧 Electron 对应页及保留特有能力。
- 对照 `mine/`、`settings/`、`app_update/`：多账户、个人二维码、设备管理、主题、语言、消息提醒、快捷键、代理和版本更新；所有修改写回适当存储并跨窗口生效。
- 验收：每个功能列入口、读/写 API、权限、失败/恢复、平台及测试证据；不能仅测试页面打开。

### M8 探索、社交与工作台（P1/P2）

- 按 Flutter `explore/`、`social/`、`workbench/` 建立桌面信息架构；社交服务独立认证/地址按实际配置，覆盖 feed、个人动态、详情、发布、上传、点赞、收藏、回复、通知与未读。列表分页、图片视频权限和错误恢复。
- 工作台对齐应用列表、目录/布局、启动、内嵌 H5、窗口管理和会话状态；检查 Electron 原 `apps/`、`browser/` 能否复用。探索入口及导航按 Flutter 桌面可用行为适配，不强求手机 Tab 样式。
- 验收：真实服务读写、媒体受权与分页、切账号、重启恢复；未完成的入口提供真实错误/不支持提示，不造成功状态。

### M9 浏览器、JSBridge、深链和文件共享（P1/P2）

- 对照 `core/jsbridge/js_api_dispatcher.dart` 的实际 action、响应协议、Flutter 测试以及原 H5 使用情况建立 action × 平台/权限/风险/测试矩阵；先支持桌面已用 API，不虚构成功。统一 request ID、Promise、取消、错误、超时和生命周期；敏感 API 用户授权及来源限制。
- 隔离外部页面，逐步迁移 preload、context isolation、最小 IPC，限制跳转、下载、弹窗；验证旧应用兼容。对齐 deep link 解析、冷/热启动及登录前路由恢复。
- 对照 `features/local_file_server/` 和媒体服务：共享文件的可见范围、监听地址、认证、临时目录、进度、取消、结束清理及无网络表现；明确 Windows/macOS/Linux 差异。
- 验收：可信/不可信源、权限拒绝、错误输入、窗口销毁、文件传输和 IPC 负面测试，外部页面不得获得 Node 或任意文件访问。

### M10 桌面系统、诊断、发布（P1/P2）

- 通知、托盘、全局快捷键、窗口尺寸和恢复、剪贴板、截图、文件选择/打开、主题和语言、自动启动；逐平台核查。Flutter 的移动传感器、电话等不适用项目明确标记或按 Electron 平台能力实现，不让调用崩溃。
- 建立正式诊断中心：环境版本、平台、输入、执行/耗时、实际结果、错误堆栈、复制、恢复默认和支持矩阵；覆盖认证、设备、API、数据库、SignalR、IPC、消息同步、媒体、通知、桥接与深链等，隐藏敏感信息。
- 构建签名与安装包、升级保留数据、崩溃恢复、卸载策略和生产配置。Windows、macOS 必须分别实机验证；Linux 能力列明验证/支持状态。真实平台不可用时记阻塞，不标通过。

## 6. 跨阶段测试矩阵与完成定义

| 类别 | 必测场景 |
|---|---|
| 认证 | 密码/扫码、取消过期、两个窗口并发预刷新和 401、轮换、旧结果、登出竞态、离线恢复、踢下线 |
| 数据 | 空库/旧库升级、两个账号隔离、断网缓存、服务错误不标 EOF、增量 cursor 原子提交/重复/重置、重启恢复 |
| 消息 | 发送即显示、失败重试、回执/推送乱序、同 client ID 匹配、编辑撤回删除、已读、上传中断、授权过期 |
| 实时/窗口 | 单聊天连接、扫码独立、所有窗口 ready/快照/解绑、重连漏消息补齐、重开和主窗口隐藏 |
| UI/性能 | 长列表动态高度和锚点、图片延迟解码、搜索跳转、快捷键/多窗口焦点，记录实际设备与指标 |
| 契约/安全 | 实际服务方法/字段/错误、凭据隔离、IPC 来源与参数、外链沙箱、日志脱敏、私有文件访问 |
| 平台/发布 | Windows/macOS 分别开发运行及打包升级；Linux 标明实测与缺口；有诊断入口 |

最终完成要求：功能矩阵中 Flutter 桌面适用项全部有 Electron 对应实现、证据与验收结果；不适用或服务未开放有明确标记和原因；旧端独有功能有回归结论；无 P0 未关闭问题；类型检查、真实生产逻辑测试、构建、跨窗口和真实服务联调通过；Windows/macOS 实机结果可复核。以上任一条件未满足时，明确报告未完成，不能以规划文档、Mock 或静态代码搜索代替。

## 7. 交接模板

每完成一个任务，执行 AI 更新：

```
任务编号 / 状态：
源码与契约证据（Flutter / Electron / 后端）：
实现与兼容决策：
涉及文件与数据迁移：
测试命令、真实结果、平台及服务环境：
诊断入口：
未验证项目、风险和后续任务：
提交号 / 推送状态：
```

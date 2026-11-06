# 已废弃：自建 WebSocket 通道

后端已把聊天长连接切换为 SignalR（`/signalr-hubs/chat`），旧的
`/api/pusher/ticket/generate` + 裸 WebSocket 实现已从运行时移除。

本目录仅保留：

- `ReceivedDto.ts`：历史事件信封类型，`eventBus` 与聊天页仍用它做兼容类型；
  新代码请使用 `src/realtime/signalrClient.ts` 的 `RealtimeEnvelope`。

新的实时入口：

- `src/realtime/signalrClient.ts`：连接、鉴权、心跳、重连；
- `src/realtime/realtimeHub.ts`：命令分发、REST 增量同步、多窗口广播；
- `src/realtime/commands.ts`：与后端一致的 17 个命令。

请勿在新的功能代码中引用本目录以外的旧文件（已删除）。

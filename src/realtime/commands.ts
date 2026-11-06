/**
 * SignalR 业务命令，与后端 / 新客户端 `SignalRCommand` 保持一致。
 */
export enum SignalRCommand {
  OfflineMe = 'offline@me',
  OnlineMe = 'online@me',
  OfflineFriend = 'offline@friend',
  OnlineFriend = 'online@friend',
  MessageCreated = 'created@message',
  MessageForwarded = 'forwarded@message',
  MessageUpdated = 'updated@message',
  MessageBadgeUpdated = 'updated-badge@message',
  MessageRollbacked = 'rollbacked@message',
  MessageDeleted = 'deleted@message',
  AiStarted = 'started@ai',
  AiDelta = 'delta@ai',
  AiCompleted = 'completed@ai',
  AiFailed = 'failed@ai',
  Kicked = 'kicked',
  Welcome = 'welcome',
  SessionUnitChanged = 'changed@session-unit',
}

const commandValues = new Set<string>(Object.values(SignalRCommand));

export const isSignalRCommand = (value: string): value is SignalRCommand =>
  commandValues.has(value);

export const isMessageCommand = (command: SignalRCommand): boolean =>
  command === SignalRCommand.MessageCreated ||
  command === SignalRCommand.MessageForwarded ||
  command === SignalRCommand.MessageUpdated ||
  command === SignalRCommand.MessageRollbacked;

export const isAiCommand = (command: SignalRCommand): boolean =>
  command === SignalRCommand.AiStarted ||
  command === SignalRCommand.AiDelta ||
  command === SignalRCommand.AiCompleted ||
  command === SignalRCommand.AiFailed;

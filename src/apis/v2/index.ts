import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { PagedResultDto } from '../dtos/PagedResultDto';
import type { MessageOwnerDto } from '../dtos/MessageOwnerDto';
import type { SessionUnitOwnerDto } from '../dtos/SessionUnitOwnerDto';
import { env } from '../../env';

/**
 * 对齐 GotoIM 新后端的 REST 封装（v2）。
 *
 * 说明：
 * - 复用生成代码的 `request`，自动带上 App-Device-Id / App-Id / Token；
 * - 只覆盖旧客户端实际使用的读写路径，避免继续维护整份旧 Swagger；
 * - 所有路径以新客户端 features 下的 data/datasources 为准。
 */

export type SessionScope = {
  chatObjectId?: number;
  sessionUnitId: string;
};

export type OnlineFriendDto = {
  chatObjectId?: number;
  deviceTypes?: string[];
  deviceCount?: number;
};

export type OnlineDeviceDto = {
  connectionId?: string;
  deviceId?: string;
  deviceType?: string;
  deviceInfo?: string;
  appName?: string;
  clientId?: string;
  activeTime?: string;
  creationTime?: string;
};

export type SessionOverviewDto = {
  ownerId?: number;
  totalUnreadCount?: number;
  totalPrivateBadge?: number;
  stat?: { immersed?: number; [key: string]: any };
  [key: string]: any;
};

export type MessageChangesInput = {
  sessions: Array<SessionScope & { minMessageId?: number; maxMessageId?: number }>;
  maxResultCount?: number;
};

const authUrl = (path: string): string => `${env.auth_host}${path}`;
const deviceUrl = (path: string): string =>
  `${env.app_device_baseurl || env.base_url}${path.startsWith('/') ? path : `/${path}`}`;

export const messagesV2 = {
  /** 历史消息（向上翻页） */
  history(args: {
    sessionUnitId: string;
    maxResultCount?: number;
    maxMessageId?: number;
  }): CancelablePromise<PagedResultDto<MessageOwnerDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/message/history',
      query: {
        sessionUnitId: args.sessionUnitId,
        maxResultCount: args.maxResultCount ?? 20,
        maxMessageId: args.maxMessageId,
      },
    });
  },

  /** 最新消息（向下补齐） */
  latest(args: {
    sessionUnitId: string;
    minMessageId?: number;
    maxResultCount?: number;
  }): CancelablePromise<PagedResultDto<MessageOwnerDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/message/latest',
      query: {
        sessionUnitId: args.sessionUnitId,
        minMessageId: args.minMessageId,
        maxResultCount: args.maxResultCount ?? 20,
      },
    });
  },

  /** 多会话批量增量 */
  changes(input: MessageChangesInput): CancelablePromise<MessageOwnerDto[]> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message/changes/query',
      body: { maxResultCount: 200, ...input },
      mediaType: 'application/json',
    });
  },

  /** 按 id 补齐消息体 */
  syncItems(args: { sessionUnitId: string; messageIds: number[] }): CancelablePromise<MessageOwnerDto[]> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message/sync-items',
      body: args,
      mediaType: 'application/json',
    });
  },

  setRead(args: { sessionUnitId: string; messageId: number }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/session-unit-setting/set-read',
      query: args,
    });
  },

  deleteMessage(args: { sessionUnitId: string; messageId: number }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/session-unit-setting/delete-message',
      query: args,
    });
  },

  sendText(args: {
    sessionUnitId: string;
    clientMessageId: string;
    text: string;
    quoteMessageId?: number;
    remindList?: string[];
  }): CancelablePromise<MessageOwnerDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: `/api/chat/message-sender/send-text/${args.sessionUnitId}`,
      body: {
        clientMessageId: args.clientMessageId,
        quoteMessageId: args.quoteMessageId,
        remindList: args.remindList,
        content: { text: args.text },
      },
      mediaType: 'application/json',
    });
  },

  sendHistory(args: {
    sessionUnitId: string;
    clientMessageId: string;
    messageIds: number[];
  }): CancelablePromise<MessageOwnerDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: `/api/chat/message-sender/send-history/${args.sessionUnitId}`,
      body: {
        clientMessageId: args.clientMessageId,
        content: { messageIdList: args.messageIds },
      },
      mediaType: 'application/json',
    });
  },

  forward(args: {
    sessionUnitId: string;
    messageId: number;
    targetSessionUnitIds: string[];
  }): CancelablePromise<MessageOwnerDto[]> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message-sender/forward',
      query: { sessionUnitId: args.sessionUnitId, messageId: args.messageId },
      body: args.targetSessionUnitIds,
      mediaType: 'application/json',
    });
  },

  rollback(messageId: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'POST',
      url: `/api/chat/message-sender/rollback/${messageId}`,
    });
  },
};

export const sessionsV2 = {
  /** 会话列表（游标：maxMessageId） */
  friends(args: {
    ownerId: number;
    maxResultCount?: number;
    maxMessageId?: number;
    maxScore?: number;
    cursorId?: string;
    keyword?: string;
  }): CancelablePromise<PagedResultDto<SessionUnitOwnerDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit-cache/friends',
      query: {
        ownerId: args.ownerId,
        maxResultCount: args.maxResultCount ?? 20,
        maxMessageId: args.maxMessageId,
        maxScore: args.maxScore,
        cursorId: args.cursorId,
        keyword: args.keyword,
      },
    });
  },

  /** 会话增量（minTicks + cursorId） */
  changes(args: {
    ownerId: number;
    minTicks: number;
    cursorId?: string;
    maxResultCount?: number;
  }): CancelablePromise<PagedResultDto<SessionUnitOwnerDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit-cache/changes',
      query: {
        ownerId: args.ownerId,
        minTicks: args.minTicks,
        cursorId: args.cursorId,
        maxResultCount: args.maxResultCount ?? 99,
      },
    });
  },

  /** 单个会话详情 */
  friend(sessionUnitId: string): CancelablePromise<SessionUnitOwnerDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: `/api/chat/session-unit-cache/friend/${sessionUnitId}`,
    });
  },

  /** 各聊天对象未读总览 */
  overview(): CancelablePromise<{ overviews?: SessionOverviewDto[] }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit-cache/overview',
    });
  },
};

export const presenceV2 = {
  /** 我的在线设备 */
  myDevices(): CancelablePromise<PagedResultDto<OnlineDeviceDto>> {
    return __request(OpenAPI, { method: 'GET', url: '/api/chat/online/by-current-user' });
  },

  /** 在线好友及设备类型 */
  onlineFriends(): CancelablePromise<PagedResultDto<OnlineFriendDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/online/online-friends',
    });
  },

  /** 踢下线 */
  abort(connectionIds: string[], reason?: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/online/abort',
      body: { connectionIdList: connectionIds, reason },
      mediaType: 'application/json',
    });
  },
};

export const deviceV2 = {
  register(body: Record<string, any>, accessToken?: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: deviceUrl('/api/app-device/public/device-public/register'),
      body,
      mediaType: 'application/json',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });
  },

  logout(args: {
    appId: string;
    deviceId: string;
    allUsers?: boolean;
    reason?: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: deviceUrl('/api/app-device/public/device-public/logout'),
      body: { allUsers: false, ...args },
      mediaType: 'application/json',
    });
  },

  myDevices(args: { appId: string; take?: number; afterId?: string }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: deviceUrl('/api/app-device/public/device-public/my-devices'),
      query: args,
    });
  },

  latestVersion(args?: { appId?: string }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: deviceUrl('/api/app-device/public/app-version/latest'),
      query: args,
    });
  },
};

export const authV2 = {
  userInfo(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: authUrl('/connect/userinfo'),
      body: {},
      mediaType: 'application/x-www-form-urlencoded',
    });
  },

  revoke(args: { token: string; tokenTypeHint?: 'access_token' | 'refresh_token' }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: authUrl('/connect/revocat'),
      body: new URLSearchParams({
        token: args.token,
        token_type_hint: args.tokenTypeHint ?? 'access_token',
      }).toString(),
      mediaType: 'application/x-www-form-urlencoded',
    });
  },
};

export const appV2 = {
  /** 扫码解析（移动端使用；桌面端保留扩展） */
  scanCode(args: { content: string; type?: string }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/scan-code/scan',
      query: { content: args.content, type: args.type },
      body: {},
      mediaType: 'application/json',
    });
  },
};

export const apiV2 = {
  messages: messagesV2,
  sessions: sessionsV2,
  presence: presenceV2,
  device: deviceV2,
  auth: authV2,
  app: appV2,
};

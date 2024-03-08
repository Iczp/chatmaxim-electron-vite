import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { MessageInput, MessageOwnerDto } from '../dtos';
import { MessageInputTyped } from '../dtos/message/MessageInputTyped';
import { TextContentDto } from '../dtos/message/TextContentDto';
import { CmdContentDto } from '../dtos/message/CmdContentDto';
import { VideoContentDto } from '../dtos/message/VideoContentDto';
import { SoundContentDto } from '../dtos/message/SoundContentDto';
import { RedEnvelopeContentInput } from '../dtos/message/RedEnvelopeContentInput';
import { LocationContentDto } from '../dtos/message/LocationContentDto';
import { LinkContentDto } from '../dtos/message/LinkContentDto';
import { HtmlContentDto } from '../dtos/message/HtmlContentDto';
import { HistoryContentInput } from '../dtos/message/HistoryContentInput';
import { FileContentDto } from '../dtos/message/FileContentDto';
import { ContactsContentDto } from '../dtos/message/ContactsContentDto';
import { ImageContentDto } from '../dtos/message/ImageContentDto';
import { MessageTypeEnums } from '../enums';
import { AxiosProgressEvent } from 'axios';

export class MessageSenderService {
  /**
   * 转发消息
   * @returns IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto Success
   * @throws ApiError
   */
  public static forward({
    sessionUnitId,
    messageId,
    requestBody,
  }: {
    /**
     * 会话单元Id
     */
    sessionUnitId?: string;
    /**
     * 消息Id
     */
    messageId?: number;
    /**
     * 目标
     */
    requestBody?: Array<string>;
  }): CancelablePromise<Array<MessageOwnerDto>> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message-sender/forward',
      query: {
        sessionUnitId: sessionUnitId,
        messageId: messageId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 撤回消息
   * @returns number Success
   * @throws ApiError
   */
  public static rollback({
    messageId,
  }: {
    /**
     * 消息Id
     */
    messageId: number;
  }): CancelablePromise<Record<string, number>> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message-sender/rollback/{messageId}',
      path: {
        messageId: messageId,
      },
    });
  }

  /**
   * 发[命令]消息
   * @returns MessageOwnerDto Success
   * @throws ApiError
   */
  public static sendCmd({
    sessionUnitId,
    requestBody,
  }: {
    /**
     * 会话单元Id
     */
    sessionUnitId: string;
    requestBody?: MessageInputTyped<CmdContentDto>;
  }): CancelablePromise<MessageOwnerDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message-sender/send-cmd/{sessionUnitId}',
      path: {
        sessionUnitId: sessionUnitId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 发[名片]消息
   * @returns CancelablePromise<MessageOwnerDto>
   * @throws ApiError
   */
  public static sendContacts({
    sessionUnitId,
    requestBody,
  }: {
    /**
     * 会话单元Id
     */
    sessionUnitId: string;
    requestBody?: MessageInputTyped<ContactsContentDto>;
  }): CancelablePromise<MessageOwnerDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message-sender/send-contacts/{sessionUnitId}',
      path: {
        sessionUnitId: sessionUnitId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 发[文件]消息
   * @returns CancelablePromise<MessageOwnerDto>
   * @throws ApiError
   */
  public static sendFile({
    sessionUnitId,
    requestBody,
  }: {
    /**
     * 会话单元Id
     */
    sessionUnitId: string;
    requestBody?: MessageInputTyped<FileContentDto>;
  }): CancelablePromise<MessageOwnerDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message-sender/send-file/{sessionUnitId}',
      path: {
        sessionUnitId: sessionUnitId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 发[聊天记录]消息
   * @returns CancelablePromise<MessageOwnerDto>
   * @throws ApiError
   */
  public static sendHistory({
    sessionUnitId,
    requestBody,
  }: {
    /**
     * 会话单元Id
     */
    sessionUnitId: string;
    requestBody?: MessageInputTyped<HistoryContentInput>;
  }): CancelablePromise<MessageOwnerDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message-sender/send-history/{sessionUnitId}',
      path: {
        sessionUnitId: sessionUnitId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 发[HTML]消息
   * @returns CancelablePromise<MessageOwnerDto>
   * @throws ApiError
   */
  public static sendHtml({
    sessionUnitId,
    requestBody,
  }: {
    /**
     * 会话单元Id
     */
    sessionUnitId: string;
    requestBody?: MessageInputTyped<HtmlContentDto>;
  }): CancelablePromise<MessageOwnerDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message-sender/send-html/{sessionUnitId}',
      path: {
        sessionUnitId: sessionUnitId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 发[图片]消息
   * @returns CancelablePromise<MessageOwnerDto>
   * @throws ApiError
   */
  public static sendImage({
    sessionUnitId,
    requestBody,
  }: {
    /**
     * 会话单元Id
     */
    sessionUnitId: string;
    requestBody?: MessageInputTyped<ImageContentDto>;
  }): CancelablePromise<MessageOwnerDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message-sender/send-image/{sessionUnitId}',
      path: {
        sessionUnitId: sessionUnitId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 发[链接]消息
   * @returns CancelablePromise<MessageOwnerDto>
   * @throws ApiError
   */
  public static sendLink({
    sessionUnitId,
    requestBody,
  }: {
    /**
     * 会话单元Id
     */
    sessionUnitId: string;
    requestBody?: MessageInputTyped<LinkContentDto>;
  }): CancelablePromise<MessageOwnerDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message-sender/send-link/{sessionUnitId}',
      path: {
        sessionUnitId: sessionUnitId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 发[位置]消息
   * @returns CancelablePromise<MessageOwnerDto>
   * @throws ApiError
   */
  public static sendLocation({
    sessionUnitId,
    requestBody,
  }: {
    /**
     * 会话单元Id
     */
    sessionUnitId: string;
    requestBody?: MessageInputTyped<LocationContentDto>;
  }): CancelablePromise<MessageOwnerDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message-sender/send-location/{sessionUnitId}',
      path: {
        sessionUnitId: sessionUnitId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 发[红包]消息
   * @returns CancelablePromise<MessageOwnerDto>
   * @throws ApiError
   */
  public static sendRedEnvelope({
    sessionUnitId,
    requestBody,
  }: {
    /**
     * 会话单元Id
     */
    sessionUnitId: string;
    requestBody?: MessageInputTyped<RedEnvelopeContentInput>;
  }): CancelablePromise<MessageOwnerDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message-sender/send-red-envelope/{sessionUnitId}',
      path: {
        sessionUnitId: sessionUnitId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 发[语音]消息
   * @returns CancelablePromise<MessageOwnerDto>
   * @throws ApiError
   */
  public static sendSound({
    sessionUnitId,
    requestBody,
  }: {
    /**
     * 会话单元Id
     */
    sessionUnitId: string;
    requestBody?: MessageInputTyped<SoundContentDto>;
  }): CancelablePromise<MessageOwnerDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message-sender/send-sound/{sessionUnitId}',
      path: {
        sessionUnitId: sessionUnitId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 发[文本]消息
   * @returns CancelablePromise<MessageOwnerDto>
   * @throws ApiError
   */
  public static sendText({
    sessionUnitId,
    requestBody,
  }: {
    /**
     * 会话单元Id
     */
    sessionUnitId: string;
    requestBody?: MessageInputTyped<TextContentDto>;
  }): CancelablePromise<MessageOwnerDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message-sender/send-text/{sessionUnitId}',
      path: {
        sessionUnitId: sessionUnitId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 发[视频]消息
   * @returns CancelablePromise<MessageOwnerDto>
   * @throws ApiError
   */
  public static sendVideo({
    sessionUnitId,
    requestBody,
  }: {
    /**
     * 会话单元Id
     */
    sessionUnitId: string;
    requestBody?: MessageInputTyped<VideoContentDto>;
  }): CancelablePromise<MessageOwnerDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message-sender/send-video/{sessionUnitId}',
      path: {
        sessionUnitId: sessionUnitId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 上传并发送
   * @returns MessageOwnerDto Success
   * @throws ApiError
   */
  public static sendUploadFile({
    sessionUnitId,
    quoteMessageId,
    remindList,
    file,
    onUploadProgress,
  }: {
    /**
     * 主建Id
     */
    sessionUnitId?: string;
    /**
     * 引用消息Id
     *
     * @type {number}
     */
    quoteMessageId?: number;
    /**
     * 提醒（@XXX） sessionUnitId
     *
     * @type {Array<string>}
     */
    remindList?: Array<string>;
    /**
     * file
     *
     * @type {Blob}
     */
    file: Blob;
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  }): CancelablePromise<MessageOwnerDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message-sender/send-upload/{sessionUnitId}',
      path: {
        sessionUnitId,
      },
      query: {
        quoteMessageId,
        remindList,
      },
      formData: {
        file,
      },
      mediaType: 'multipart/form-data',
      onUploadProgress,
    });
  }

  /**
   * 上传图片并发送
   * @returns MessageOwnerDto Success
   * @throws ApiError
   */
  public static sendUploadImage({
    sessionUnitId,
    quoteMessageId,
    remindList,
    file,
    onUploadProgress,
  }: {
    /**
     * 主建Id
     */
    sessionUnitId?: string;
    /**
     * 引用消息Id
     *
     * @type {number}
     */
    quoteMessageId?: number;
    /**
     * 提醒（@XXX） sessionUnitId
     *
     * @type {Array<string>}
     */
    remindList?: Array<string>;
    /**
     * file
     *
     * @type {Blob}
     */
    file: Blob;
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  }): CancelablePromise<MessageOwnerDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/message-sender/send-upload-image/{sessionUnitId}',
      path: {
        sessionUnitId,
      },
      query: {
        quoteMessageId,
        remindList,
      },
      formData: {
        file,
      },
      mediaType: 'multipart/form-data',
      onUploadProgress,
    });
  }

  public static send(args: {
    /**
     * 会话单元Id
     */
    sessionUnitId: string;
    /**
     * 消息类型
     *
     * @type {MessageTypeEnums}
     */
    messageType: MessageTypeEnums;
    requestBody?: MessageInput;
  }): CancelablePromise<MessageOwnerDto> {
    const { messageType, sessionUnitId, requestBody } = args;
    const _args = { sessionUnitId, requestBody };
    switch (messageType) {
      case MessageTypeEnums.Text:
        return this.sendText(_args);
      case MessageTypeEnums.Image:
        return this.sendImage(_args);
      case MessageTypeEnums.File:
        return this.sendFile(_args);
      case MessageTypeEnums.Sound:
        return this.sendSound(_args);
      case MessageTypeEnums.Video:
        return this.sendVideo(_args);
      case MessageTypeEnums.Contacts:
        return this.sendContacts(_args);
      case MessageTypeEnums.History:
        return this.sendHistory(_args);
    }
    throw new Error(`messageType error;${messageType}`);
  }
}

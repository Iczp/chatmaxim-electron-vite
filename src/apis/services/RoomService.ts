import { ChatObjectDto } from "../dtos";;
import type { RoomCreateInput } from '../models/RoomCreateInput';
import type { IczpNet_Chat_RoomSections_Rooms_InviteInput } from '../models/IczpNet_Chat_RoomSections_Rooms_InviteInput';
import type { IczpNet_Chat_SessionSections_SessionUnits_SessionUnitSenderInfo } from '../models/IczpNet_Chat_SessionSections_SessionUnits_SessionUnitSenderInfo';
// import type { IczpNet_Chat_SessionUnits_Dtos_SessionUnitDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionUnits_Dtos_SessionUnitDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RoomService {
  /**
   * 创建群
   * @returns ChatObjectDto Success
   * @throws ApiError
   */
  public static postApiChatCreateRoom(input: RoomCreateInput): CancelablePromise<ChatObjectDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/room',
      body: input,
      mediaType: 'application/json',
    });
  }

  /**
   * 解散群
   * @returns any Success
   * @throws ApiError
   */
  public static postApiChatRoomDissolve({
    sessionUnitId,
  }: {
    /**
     * 会话单元Id
     */
    sessionUnitId: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/room/dissolve/{sessionUnitId}',
      path: {
        sessionUnitId: sessionUnitId,
      },
    });
  }

  /**
   * 获取共同所在的群列表
   * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionUnits_Dtos_SessionUnitDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
   * @throws ApiError
   */
  public static getApiChatRoomSame({
    sourceChatObjectId,
    targetChatObjectId,
    keyword,
    maxResultCount,
    skipCount,
    sorting,
  }: {
    /**
     * 原聊天对象Id
     */
    sourceChatObjectId?: number;
    /**
     * 目标对象Id
     */
    targetChatObjectId?: number;
    /**
     * 关键字(支持拼音)
     */
    keyword?: string;
    /**
     * 显示数量
     */
    maxResultCount?: number;
    /**
     * 跳过数量
     */
    skipCount?: number;
    /**
     * 排序
     */
    sorting?: string;
  }): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/room/same',
      query: {
        SourceChatObjectId: sourceChatObjectId,
        TargetChatObjectId: targetChatObjectId,
        Keyword: keyword,
        MaxResultCount: maxResultCount,
        SkipCount: skipCount,
        Sorting: sorting,
      },
    });
  }

  /**
   * 获取共同所在的群数量
   * @returns number Success
   * @throws ApiError
   */
  public static getApiChatRoomSameCount({
    sourceChatObjectId,
    targetChatObjectId,
  }: {
    /**
     * 原聊天对象Id
     */
    sourceChatObjectId?: number;
    /**
     * 目标对象Id
     */
    targetChatObjectId?: number;
  }): CancelablePromise<number> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/room/same-count',
      query: {
        sourceChatObjectId: sourceChatObjectId,
        targetChatObjectId: targetChatObjectId,
      },
    });
  }

  /**
   * 邀请加入群聊
   * @returns IczpNet_Chat_SessionSections_SessionUnits_SessionUnitSenderInfo Success
   * @throws ApiError
   */
  public static postApiChatRoomInvite({
    requestBody,
  }: {
    requestBody?: IczpNet_Chat_RoomSections_Rooms_InviteInput;
  }): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionUnits_SessionUnitSenderInfo>> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/room/invite',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 转让群主
   * @returns any Success
   * @throws ApiError
   */
  public static postApiChatRoomTransferCreator({
    sessionUnitId,
    targetSessionUnitId,
  }: {
    /**
     * 会话单元Id
     */
    sessionUnitId?: string;
    /**
     * 目标会话单元Id(新群主Id)
     */
    targetSessionUnitId?: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/room/transfer-creator',
      query: {
        sessionUnitId: sessionUnitId,
        targetSessionUnitId: targetSessionUnitId,
      },
    });
  }

  /**
   * 更新群名称并群内公告
   * @returns ChatObjectDto Success
   * @throws ApiError
   */
  public static postApiChatRoomUpdateName({
    sessionUnitId,
    name,
  }: {
    /**
     * 会话单元Id
     */
    sessionUnitId: string;
    /**
     * 群名字
     */
    name?: string;
  }): CancelablePromise<ChatObjectDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/room/update-name/{sessionUnitId}',
      path: {
        sessionUnitId: sessionUnitId,
      },
      query: {
        name: name,
      },
    });
  }

  /**
   * 修改群头像
   * @returns ChatObjectDto Success
   * @throws ApiError
   */
  public static postApiChatRoomUpdatePortrait({
    sessionUnitId,
    portrait,
  }: {
    /**
     * 会话单元Id
     */
    sessionUnitId: string;
    /**
     * 头像,全地址或相对地址:"http://www.icpz.net/logo.png","/logo.png"
     */
    portrait?: string;
  }): CancelablePromise<ChatObjectDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/room/update-portrait/{sessionUnitId}',
      path: {
        sessionUnitId: sessionUnitId,
      },
      query: {
        portrait: portrait,
      },
    });
  }
}

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_ChatObjects_ChatObjectInfo } from '../models/IczpNet_Chat_ChatObjects_ChatObjectInfo';
// import type { IczpNet_Chat_ChatObjects_ChatObjectInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_ChatObjects_ChatObjectInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectCreateInput } from '../models/IczpNet_Chat_ChatObjects_Dtos_ChatObjectCreateInput';

// import type { ChatObjectDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/ChatObjectDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { ChatObjectUpdateInput } from '../models/ChatObjectUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { PagedResultDto } from '../dtos/PagedResultDto';
import { ChatObjectTypeEnums } from '../enums';
import { ChatObjectDetailDto, ChatObjectDto, GetListInput } from '../dtos';
import { AxiosProgressEvent } from 'axios';
import { ChatObjectGetListInput } from '../dtos/ChatObjectGetListInput';

export class ChatObjectService {
  /**
   * 新增
   * @returns ChatObjectDto Success
   * @throws ApiError
   */
  public static postApiChatChatObject({
    requestBody,
  }: {
    requestBody?: IczpNet_Chat_ChatObjects_Dtos_ChatObjectCreateInput;
  }): CancelablePromise<ChatObjectDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/chat-object',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 列表
   * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<ChatObjectDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
   * @throws ApiError
   */
  public static getApiChatChatObjectList({
    chatObjectTypeId,
    isStatic,
    isPublic,
    isEnabled,
    isDefault,
    objectType,
    categoryIdList,
    isImportChildCategory,
    isEnabledParentId = false,
    parentId,
    depthList,
    keyword,
    maxResultCount,
    skipCount,
    sorting,
  }: ChatObjectGetListInput): CancelablePromise<PagedResultDto<ChatObjectDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/chat-object',
      query: {
        ChatObjectTypeId: chatObjectTypeId,
        IsStatic: isStatic,
        IsPublic: isPublic,
        IsEnabled: isEnabled,
        IsDefault: isDefault,
        ObjectType: objectType,
        CategoryIdList: categoryIdList,
        IsImportChildCategory: isImportChildCategory,
        IsEnabledParentId: isEnabledParentId,
        ParentId: parentId,
        DepthList: depthList,
        Keyword: keyword,
        MaxResultCount: maxResultCount,
        SkipCount: skipCount,
        Sorting: sorting,
      },
    });
  }

  /**
   * 创建聊天对象[机器人]
   * @returns ChatObjectDto Success
   * @throws ApiError
   */
  public static postApiChatChatObjectRobot({
    name,
  }: {
    name?: string;
  }): CancelablePromise<ChatObjectDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/chat-object/robot',
      query: {
        name: name,
      },
    });
  }

  /**
   * 创建聊天对象[掌柜]
   * @returns ChatObjectDto Success
   * @throws ApiError
   */
  public static postApiChatChatObjectShopKeeper({
    name,
  }: {
    name?: string;
  }): CancelablePromise<ChatObjectDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/chat-object/shop-keeper',
      query: {
        name: name,
      },
    });
  }

  /**
   * 创建聊天对象[店小二]
   * @returns ChatObjectDto Success
   * @throws ApiError
   */
  public static postApiChatChatObjectShopWaiter({
    shopKeeperId,
    name,
  }: {
    shopKeeperId: number;
    name?: string;
  }): CancelablePromise<ChatObjectDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/chat-object/shop-waiter/{shopKeeperId}',
      path: {
        shopKeeperId: shopKeeperId,
      },
      query: {
        name: name,
      },
    });
  }

  /**
   * 创建聊天对象[聊天广场]
   * @returns ChatObjectDto Success
   * @throws ApiError
   */
  public static postApiChatChatObjectSquare({
    name,
  }: {
    name?: string;
  }): CancelablePromise<ChatObjectDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/chat-object/square',
      query: {
        name: name,
      },
    });
  }

  /**
   * 删除多条数据
   * @returns any Success
   * @throws ApiError
   */
  public static postApiChatChatObjectDeleteMany({
    requestBody,
  }: {
    /**
     * 主键Id[多个]
     */
    requestBody?: Array<number>;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/chat-object/delete-many',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 获取一条数据
   * @returns ChatObjectDto Success
   * @throws ApiError
   */
  public static getApiChatChatObject1({
    id,
  }: {
    /**
     * 主键Id
     */
    id: number;
  }): CancelablePromise<ChatObjectDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/chat-object/{id}',
      path: {
        id: id,
      },
    });
  }

  /**
   * 列表(缓存)
   * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_ChatObjects_ChatObjectInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
   * @throws ApiError
   */
  public static getApiChatChatObjectByCache({
    isEnabledParentId = false,
    depthList,
    parentId,
    keyword,
    sorting,
    skipCount,
    maxResultCount,
  }: {
    isEnabledParentId?: boolean;
    depthList?: Array<number>;
    parentId?: number;
    keyword?: string;
    sorting?: string;
    skipCount?: number;
    maxResultCount?: number;
  }): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/chat-object/by-cache',
      query: {
        IsEnabledParentId: isEnabledParentId,
        DepthList: depthList,
        ParentId: parentId,
        Keyword: keyword,
        Sorting: sorting,
        SkipCount: skipCount,
        MaxResultCount: maxResultCount,
      },
    });
  }

  /**
   * 获取一条数据[code]
   * @returns ChatObjectDto Success
   * @throws ApiError
   */
  public static getApiChatChatObjectByCode({
    code,
  }: {
    code?: string;
  }): CancelablePromise<ChatObjectDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/chat-object/by-code',
      query: {
        code: code,
      },
    });
  }

  /**
   * 获取详情
   * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDetailDto Success
   * @throws ApiError
   */
  public static getApiChatChatObjectDetail({
    id,
  }: {
    /**
     * 主建Id
     */
    id: number;
  }): CancelablePromise<ChatObjectDetailDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/chat-object/{id}/detail',
      path: {
        id: id,
      },
    });
  }

  /**
   * 获取一条数据(缓存)
   * @returns IczpNet_Chat_ChatObjects_ChatObjectInfo Success
   * @throws ApiError
   */
  public static getApiChatChatObjectItemByCache({
    id,
  }: {
    /**
     * 主键Id
     */
    id: number;
  }): CancelablePromise<IczpNet_Chat_ChatObjects_ChatObjectInfo> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/chat-object/{id}/item-by-cache',
      path: {
        id: id,
      },
    });
  }

  /**
   * 获取当前用户的聊天对象
   * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<ChatObjectDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
   * @throws ApiError
   */
  public static getApiChatChatObjectByCurrentUser({
    keyword,
    maxResultCount,
    skipCount,
    sorting,
  }: {
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
  }): CancelablePromise<PagedResultDto<ChatObjectDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/chat-object/by-current-user',
      query: {
        Keyword: keyword,
        MaxResultCount: maxResultCount,
        SkipCount: skipCount,
        Sorting: sorting,
      },
    });
  }

  /**
   * 获取用户的聊天对象
   * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<ChatObjectDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
   * @throws ApiError
   */
  public static getApiChatChatObjectByUserId({
    userId,
    keyword,
    maxResultCount,
    skipCount,
    sorting,
  }: {
    /**
     * 用户Id
     */
    userId: string;
  } & GetListInput): CancelablePromise<PagedResultDto<ChatObjectDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/chat-object/by-user-id/{userId}',
      path: {
        userId: userId,
      },
      query: {
        Keyword: keyword,
        MaxResultCount: maxResultCount,
        SkipCount: skipCount,
        Sorting: sorting,
      },
    });
  }

  /**
   * 获取多条数据(缓存)
   * @returns IczpNet_Chat_ChatObjects_ChatObjectInfo Success
   * @throws ApiError
   */
  public static getApiChatChatObjectManayByCache({
    idList,
  }: {
    /**
     * 主键Id[多个]
     */
    idList?: Array<number>;
  }): CancelablePromise<Array<ChatObjectDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/chat-object/manay-by-cache',
      query: {
        idList: idList,
      },
    });
  }

  /**
   * 获取多条数据
   * @returns ChatObjectDto Success
   * @throws ApiError
   */
  public static getApiChatChatObjectMany({
    idList,
  }: {
    /**
     * 主键Id[多个]
     */
    idList?: Array<number>;
  }): CancelablePromise<Array<ChatObjectDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/chat-object/many',
      query: {
        idList: idList,
      },
    });
  }

  /**
   * 修复数据（fullPath,fullName,childrenCount,depth等）
   * @returns string Success
   * @throws ApiError
   */
  public static postApiChatChatObjectRepairData({
    maxResultCount = 100,
    skinCount,
  }: {
    /**
     * 每次修复最大数量（过多可能导致数据库超时）
     */
    maxResultCount?: number;
    /**
     * 跳过数量
     */
    skinCount?: number;
  }): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/chat-object/repair-data',
      query: {
        maxResultCount: maxResultCount,
        skinCount: skinCount,
      },
    });
  }

  /**
   * 设置验证方式(好友|群|广场等)
   * @returns ChatObjectDto Success
   * @throws ApiError
   */
  public static postApiChatChatObjectSetVerificationMethod({
    id,
    verificationMethod,
  }: {
    /**
     * 主建Id
     */
    id: number;
    /**
     * 验证方式
     */
    verificationMethod?: 0 | 1 | 2;
  }): CancelablePromise<ChatObjectDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/chat-object/{id}/set-verification-method',
      path: {
        id: id,
      },
      query: {
        verificationMethod: verificationMethod,
      },
    });
  }

  /**
   * 修改
   * @returns ChatObjectDto Success
   * @throws ApiError
   */
  public static postApiChatChatObjectUpdate({
    id,
    requestBody,
  }: {
    /**
     * 主键Id
     */
    id: number;
    requestBody?: ChatObjectUpdateInput;
  }): CancelablePromise<ChatObjectDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/chat-object/{id}/update',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * 修改名称
   * @returns ChatObjectDto Success
   * @throws ApiError
   */
  public static postApiChatChatObjectUpdateName({
    id,
    name,
  }: {
    /**
     * 主建Id
     */
    id: number;
    name?: string;
  }): CancelablePromise<ChatObjectDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/chat-object/{id}/update-name',
      path: {
        id: id,
      },
      query: {
        name: name,
      },
    });
  }

  /**
   * 更新头像
   * @returns ChatObjectDto Success
   * @throws ApiError
   */
  public static uploadPortrait({
    id,
    file,
    onUploadProgress,
  }: {
    /**
     * 主建Id
     */
    id?: number;
    file?: Blob;
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  }): CancelablePromise<ChatObjectDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/chat-object/{id}/upload-portrait',
      path: {
        id: id,
      },
      formData: {
        file,
      },
      mediaType: 'multipart/form-data',
      onUploadProgress,
    });
  }
}

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_ChatObjects_ChatObjectInfo } from '../models/IczpNet_Chat_ChatObjects_ChatObjectInfo';
// import type { IczpNet_Chat_ChatObjects_ChatObjectInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_ChatObjects_ChatObjectInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectCreateInput } from '../models/IczpNet_Chat_ChatObjects_Dtos_ChatObjectCreateInput';
import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectDetailDto } from '../models/IczpNet_Chat_ChatObjects_Dtos_ChatObjectDetailDto';
import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto } from '../models/IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto';
// import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectUpdateInput } from '../models/IczpNet_Chat_ChatObjects_Dtos_ChatObjectUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { PagedResultDto } from '../dtos/PagedResultDto';
import { ChatObjectTypeEnums } from '../enums';
import { ChatObjectDto } from '../dtos';

export class ChatObjectService {
  /**
   * 新增
   * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
   * @throws ApiError
   */
  public static postApiChatChatObject({
    requestBody,
  }: {
    requestBody?: IczpNet_Chat_ChatObjects_Dtos_ChatObjectCreateInput;
  }): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/chat-object',
      body: requestBody,
      mediaType: 'application/json',
      
    });
  }

  /**
   * 列表
   * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
   * @throws ApiError
   */
  public static getApiChatChatObject({
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
  }: {
    /**
     * 聊天对象类型Id
     */
    chatObjectTypeId?: string;
    /**
     * 是否固定
     */
    isStatic?: boolean;
    /**
     * 是否公开
     */
    isPublic?: boolean;
    /**
     * 是否可用
     */
    isEnabled?: boolean;
    /**
     * 是否默认
     */
    isDefault?: boolean;
    /**
     * 聊天对象类型:个人|群|服务号等
     */
    objectType?: ChatObjectTypeEnums;
    categoryIdList?: Array<string>;
    /**
     * 包含下级
     */
    isImportChildCategory?: boolean;
    /**
     * 是否启用 ParentId
     */
    isEnabledParentId?: boolean;
    /**
     * 父级Id,当IsEnabledParentId=false时,查询全部
     */
    parentId?: number;
    /**
     * 层级
     */
    depthList?: Array<number>;
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
   * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
   * @throws ApiError
   */
  public static postApiChatChatObjectRobot({
    name,
  }: {
    name?: string;
  }): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
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
   * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
   * @throws ApiError
   */
  public static postApiChatChatObjectShopKeeper({
    name,
  }: {
    name?: string;
  }): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
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
   * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
   * @throws ApiError
   */
  public static postApiChatChatObjectShopWaiter({
    shopKeeperId,
    name,
  }: {
    shopKeeperId: number;
    name?: string;
  }): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
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
   * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
   * @throws ApiError
   */
  public static postApiChatChatObjectSquare({
    name,
  }: {
    name?: string;
  }): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
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
   * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
   * @throws ApiError
   */
  public static getApiChatChatObject1({
    id,
  }: {
    /**
     * 主键Id
     */
    id: number;
  }): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
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
   * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
   * @throws ApiError
   */
  public static getApiChatChatObjectByCode({
    code,
  }: {
    code?: string;
  }): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
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
  }): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDetailDto> {
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
   * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
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
   * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
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
  }): CancelablePromise<Array<IczpNet_Chat_ChatObjects_ChatObjectInfo>> {
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
   * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
   * @throws ApiError
   */
  public static getApiChatChatObjectMany({
    idList,
  }: {
    /**
     * 主键Id[多个]
     */
    idList?: Array<number>;
  }): CancelablePromise<Array<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto>> {
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
   * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
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
  }): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
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
   * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
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
    requestBody?: IczpNet_Chat_ChatObjects_Dtos_ChatObjectUpdateInput;
  }): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
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
   * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
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
  }): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
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
   * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
   * @throws ApiError
   */
  public static postApiChatChatObjectUpdatePortrait({
    id,
    formData,
  }: {
    /**
     * 主建Id
     */
    id?: number;
    formData?: {
      file?: Blob;
    };
  }): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/chat/ChatObject/UpdatePortrait',
      query: {
        id: id,
      },
      formData: formData,
      mediaType: 'multipart/form-data',
      
    });
  }
}

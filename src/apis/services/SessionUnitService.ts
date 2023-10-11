/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_SessionSections_SessionUnits_SessionUnitCacheItem } from '../models/IczpNet_Chat_SessionSections_SessionUnits_SessionUnitCacheItem';
// import type { IczpNet_Chat_SessionSections_SessionUnits_SessionUnitCacheItem_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionSections_SessionUnits_SessionUnitCacheItem_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_SessionSections_SessionUnits_SessionUnitCounterInfo } from '../models/IczpNet_Chat_SessionSections_SessionUnits_SessionUnitCounterInfo';
// import type { IczpNet_Chat_SessionSections_SessionUnits_SessionUnitDisplayName_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionSections_SessionUnits_SessionUnitDisplayName_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_SessionUnits_Dtos_BadgeDto } from '../models/IczpNet_Chat_SessionUnits_Dtos_BadgeDto';
import type { IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDto } from '../models/IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDto';
// import type { IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
// import type { IczpNet_Chat_SessionUnits_Dtos_SessionUnitDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionUnits_Dtos_SessionUnitDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDetailDto } from '../models/IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDetailDto';
import type { IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto } from '../models/IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto';
// import type { IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_SessionUnits_SessionUnitStatModel } from '../models/IczpNet_Chat_SessionUnits_SessionUnitStatModel';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SessionUnitService {
  /**
   * 查询会话单元
   * @param ownerId 原聊天对象Id
   * @param destinactionId 目标聊天对象Id
   * @returns string Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitFindId(
    ownerId: number,
    destinactionId: number
  ): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/find-id',
      query: {
        ownerId: ownerId,
        destinactionId: destinactionId,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 获取一个会话单元
   * @param id 会话单元Id
   * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto Success
   * @throws ApiError
   */
  public static getApiChatSessionUnit(
    id: string
  ): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/{id}',
      path: {
        id: id,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 获取当前用户总的消息角标（新消息）
   * @param isImmersed 是否包含免打扰的消息
   * @returns IczpNet_Chat_SessionUnits_Dtos_BadgeDto Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitBadgeByCurrentUser(
    isImmersed?: boolean
  ): CancelablePromise<Array<IczpNet_Chat_SessionUnits_Dtos_BadgeDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/badge-by-current-user',
      query: {
        isImmersed: isImmersed,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 获取消息角标（新消息）- sessionUnitId
   * @param id 会话单元Id
   * @param isImmersed 是否包含免打扰的消息
   * @returns IczpNet_Chat_SessionUnits_Dtos_BadgeDto Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitBadgeById(
    id: string,
    isImmersed?: boolean
  ): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_BadgeDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/{id}/badge-by-id',
      path: {
        id: id,
      },
      query: {
        isImmersed: isImmersed,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 获取消息角标（新消息）- ownerId
   * @param ownerId 聊天对象Id
   * @param isImmersed 是否包含免打扰的消息
   * @returns IczpNet_Chat_SessionUnits_Dtos_BadgeDto Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitBadgeByOwnerId(
    ownerId: number,
    isImmersed?: boolean
  ): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_BadgeDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/badge-by-owner-id/{ownerId}',
      path: {
        ownerId: ownerId,
      },
      query: {
        isImmersed: isImmersed,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 获取用户总的消息角标（新消息）- userId
   * @param userId 用户Id
   * @param isImmersed 是否包含免打扰的消息
   * @returns IczpNet_Chat_SessionUnits_Dtos_BadgeDto Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitBadgeByUserId(
    userId: string,
    isImmersed?: boolean
  ): CancelablePromise<Array<IczpNet_Chat_SessionUnits_Dtos_BadgeDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/badge-by-user-id/{userId}',
      path: {
        userId: userId,
      },
      query: {
        isImmersed: isImmersed,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 获取一个会话单元【缓存】
   * @param sessionUnitId 会话单元Id
   * @returns IczpNet_Chat_SessionSections_SessionUnits_SessionUnitCacheItem Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitCache(
    sessionUnitId: string
  ): CancelablePromise<IczpNet_Chat_SessionSections_SessionUnits_SessionUnitCacheItem> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/cache/{sessionUnitId}',
      path: {
        sessionUnitId: sessionUnitId,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 获取会话单元记数器（新消息，提醒、@我、@所有人等）
   * @param sessionUnitId 会话单元Id
   * @param minMessageId 最小消息Id
   * @param isImmersed 是否包含免打扰
   * @returns IczpNet_Chat_SessionSections_SessionUnits_SessionUnitCounterInfo Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitCounter(
    sessionUnitId: string,
    minMessageId: number,
    isImmersed: boolean = false
  ): CancelablePromise<IczpNet_Chat_SessionSections_SessionUnits_SessionUnitCounterInfo> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/counter',
      query: {
        SessionUnitId: sessionUnitId,
        MinMessageId: minMessageId,
        IsImmersed: isImmersed,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 获取一个会话单元（目标）
   * @param id 会话单元Id
   * @param destinationId 目标会话单元Id
   * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDto Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitDestination(
    id: string,
    destinationId: string
  ): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/{id}/destination/{destinationId}',
      path: {
        id: id,
        destinationId: destinationId,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 获取一个会话单元（详情）
   * @param id 会话单元Id
   * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDetailDto Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitDetail(
    id: string
  ): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDetailDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/{id}/detail',
      path: {
        id: id,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 会话单元列表（消息总线）
   * @param ownerId 所属聊天对象Id
   * @param destinationId 目标聊天对象Id
   * @param destinationObjectType 聊天对象类型:个人|群|服务号等
   * @param isCreator 是否创建人(群主/场主等)
   * @param isTopping 是否置顶
   * @param isContacts 是否保存通讯录(群)
   * @param isImmersed 消息免打扰，默认为 false
   * @param isKilled 是否被移除会话
   * @param minMessageId 最小消息Id
   * @param maxMessageId 最大消息Id
   * @param isBadge 是否有角标（新消息）
   * @param isRemind 是否有提醒
   * @param isFollowing 是否有关注的人
   * @param keyword 关键字(支持拼音)
   * @param maxResultCount 显示数量
   * @param skipCount 跳过数量
   * @param sorting 排序
   * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
   * @throws ApiError
   */
  public static getApiChatSessionUnit1(
    ownerId?: number,
    destinationId?: number,
    destinationObjectType?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
    isCreator?: boolean,
    isTopping?: boolean,
    isContacts?: boolean,
    isImmersed?: boolean,
    isKilled?: boolean,
    minMessageId?: number,
    maxMessageId?: number,
    isBadge?: boolean,
    isRemind?: boolean,
    isFollowing?: boolean,
    keyword?: string,
    maxResultCount?: number,
    skipCount?: number,
    sorting?: string
  ): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit',
      query: {
        OwnerId: ownerId,
        DestinationId: destinationId,
        DestinationObjectType: destinationObjectType,
        IsCreator: isCreator,
        IsTopping: isTopping,
        IsContacts: isContacts,
        IsImmersed: isImmersed,
        IsKilled: isKilled,
        MinMessageId: minMessageId,
        MaxMessageId: maxMessageId,
        IsBadge: isBadge,
        IsRemind: isRemind,
        IsFollowing: isFollowing,
        Keyword: keyword,
        MaxResultCount: maxResultCount,
        SkipCount: skipCount,
        Sorting: sorting,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 获取会话单元列表【缓存】
   * @param sessionId 会话Id（二者不能同时为null）
   * @param sessionUnitId 会话单元Id（二者不能同时为null）
   * @param keyword 关键字(支持拼音)
   * @param maxResultCount 显示数量
   * @param skipCount 跳过数量
   * @param sorting 排序
   * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionUnits_SessionUnitCacheItem_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitCaches(
    sessionId?: string,
    sessionUnitId?: string,
    keyword?: string,
    maxResultCount?: number,
    skipCount?: number,
    sorting?: string
  ): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/caches',
      query: {
        SessionId: sessionId,
        SessionUnitId: sessionUnitId,
        Keyword: keyword,
        MaxResultCount: maxResultCount,
        SkipCount: skipCount,
        Sorting: sorting,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 获取目标列表（好友、群、群成员、机器人等）
   * @param id 会话单元Id
   * @param isMuted 是否被禁言
   * @param isKilled 是否已删除的
   * @param isPublic 是否公开的
   * @param isStatic 是否固定成员
   * @param ownerIdList 所属聊天对象Id
   * @param ownerTypeList 所属聊天对象类型
   * @param tagId 会话标签Id
   * @param roleId 会话角色Id
   * @param joinWay 加入方式
   * @param inviterId 邀请人Id
   * @param keyword 关键字(支持拼音)
   * @param maxResultCount 显示数量
   * @param skipCount 跳过数量
   * @param sorting 排序
   * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitDestination1(
    id: string,
    isMuted?: boolean,
    isKilled?: boolean,
    isPublic?: boolean,
    isStatic?: boolean,
    ownerIdList?: Array<number>,
    ownerTypeList?: Array<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>,
    tagId?: string,
    roleId?: string,
    joinWay?: 0 | 1 | 2 | 3 | 4 | 5,
    inviterId?: string,
    keyword?: string,
    maxResultCount?: number,
    skipCount?: number,
    sorting?: string
  ): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/{id}/destination',
      path: {
        id: id,
      },
      query: {
        IsMuted: isMuted,
        IsKilled: isKilled,
        IsPublic: isPublic,
        IsStatic: isStatic,
        OwnerIdList: ownerIdList,
        OwnerTypeList: ownerTypeList,
        TagId: tagId,
        RoleId: roleId,
        JoinWay: joinWay,
        InviterId: inviterId,
        Keyword: keyword,
        MaxResultCount: maxResultCount,
        SkipCount: skipCount,
        Sorting: sorting,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 获取目标名称列表
   * @param id 会话单元Id
   * @param keyword 关键字(支持拼音)
   * @param maxResultCount 显示数量
   * @param skipCount 跳过数量
   * @param sorting 排序
   * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionUnits_SessionUnitDisplayName_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitDestinationNames(
    id: string,
    keyword?: string,
    maxResultCount?: number,
    skipCount?: number,
    sorting?: string
  ): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/{id}/destination-names',
      path: {
        id: id,
      },
      query: {
        Keyword: keyword,
        MaxResultCount: maxResultCount,
        SkipCount: skipCount,
        Sorting: sorting,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 获取目标OwnerId列表（好友、群、群成员、机器人等）
   * @param id
   * @returns number Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitDestinationOwnerIdList(
    id: string
  ): CancelablePromise<Array<number>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/{id}/destination-owner-id-list',
      path: {
        id: id,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 获取相同聊天对象的会话单元列表(共同好友、群、聊天广场等)
   * @param sourceId 原聊天对象Id
   * @param targetId 目标对象Id
   * @param objectTypeList 目标聊天对象类型
   * @param keyword 关键字(支持拼音)
   * @param maxResultCount 显示数量
   * @param skipCount 跳过数量
   * @param sorting 排序
   * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionUnits_Dtos_SessionUnitDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitSameDestination(
    sourceId: number,
    targetId: number,
    objectTypeList?: Array<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>,
    keyword?: string,
    maxResultCount?: number,
    skipCount?: number,
    sorting?: string
  ): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/same-destination',
      query: {
        SourceId: sourceId,
        TargetId: targetId,
        ObjectTypeList: objectTypeList,
        Keyword: keyword,
        MaxResultCount: maxResultCount,
        SkipCount: skipCount,
        Sorting: sorting,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 获取相同的会话单元列表(好友、共同好友、群、聊天广场等)
   * @param sourceId 源 聊天对象
   * @param targetId 目标聊天对象
   * @param objectTypeList 聊天对象类型
   * @param keyword 关键字(支持拼音)
   * @param maxResultCount 显示数量
   * @param skipCount 跳过数量
   * @param sorting 排序
   * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionUnits_Dtos_SessionUnitDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitSameSession(
    sourceId: number,
    targetId: number,
    objectTypeList?: Array<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>,
    keyword?: string,
    maxResultCount?: number,
    skipCount?: number,
    sorting?: string
  ): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/same-session',
      query: {
        SourceId: sourceId,
        TargetId: targetId,
        ObjectTypeList: objectTypeList,
        Keyword: keyword,
        MaxResultCount: maxResultCount,
        SkipCount: skipCount,
        Sorting: sorting,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 获取相同聊天对象的会话单元数量(共同好友、群、聊天广场等)
   * @param sourceId 原聊天对象Id
   * @param targetId 目标聊天对象Id
   * @param objectTypeList 聊天对象类型
   * @returns number Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitSameDestinationCount(
    sourceId: number,
    targetId: number,
    objectTypeList?: Array<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>
  ): CancelablePromise<number> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/same-destination-count',
      query: {
        sourceId: sourceId,
        targetId: targetId,
        objectTypeList: objectTypeList,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 获取相同的会话单元数量(好友、共同好友、群、聊天广场等)
   * @param sourceId 原聊天对象Id
   * @param targetId 目标聊天对象Id
   * @param objectTypeList 聊天对象类型
   * @returns number Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitSameSessionCount(
    sourceId: number,
    targetId: number,
    objectTypeList?: Array<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>
  ): CancelablePromise<number> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/same-session-count',
      query: {
        sourceId: sourceId,
        targetId: targetId,
        objectTypeList: objectTypeList,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 消息统计
   * @param minMessageId 最小消息Id
   * @param idList 会话单元Id
   * @returns IczpNet_Chat_SessionUnits_SessionUnitStatModel Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitStats(
    minMessageId: number,
    idList?: Array<string>
  ): CancelablePromise<
    Record<string, IczpNet_Chat_SessionUnits_SessionUnitStatModel>
  > {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/stats/{minMessageId}',
      path: {
        minMessageId: minMessageId,
      },
      query: {
        idList: idList,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  /**
   * 获取消息角标（新消息）- ownerId
   * @param ownerId 聊天对象Id
   * @param isImmersed 是否包含免打扰的消息
   * @returns number Success
   * @throws ApiError
   */
  public static getApiChatSessionUnitTypedBadgeByOwnerId(
    ownerId: number,
    isImmersed?: boolean
  ): CancelablePromise<Record<string, number>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/chat/session-unit/typed-badge-by-owner-id/{ownerId}',
      path: {
        ownerId: ownerId,
      },
      query: {
        isImmersed: isImmersed,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }
}

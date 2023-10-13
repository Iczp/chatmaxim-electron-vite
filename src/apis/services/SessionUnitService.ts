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
     * @returns string Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitFindId({
ownerId,
destinactionId,
}: {
/**
 * 原聊天对象Id
 */
ownerId: number,
/**
 * 目标聊天对象Id
 */
destinactionId: number,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/find-id',
            query: {
                'ownerId': ownerId,
                'destinactionId': destinactionId,
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
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto Success
     * @throws ApiError
     */
    public static getApiChatSessionUnit({
id,
}: {
/**
 * 会话单元Id
 */
id: string,
}): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/{id}',
            path: {
                'id': id,
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
     * @returns IczpNet_Chat_SessionUnits_Dtos_BadgeDto Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitBadgeByCurrentUser({
isImmersed,
}: {
/**
 * 是否包含免打扰的消息
 */
isImmersed?: boolean,
}): CancelablePromise<Array<IczpNet_Chat_SessionUnits_Dtos_BadgeDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/badge-by-current-user',
            query: {
                'isImmersed': isImmersed,
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
     * @returns IczpNet_Chat_SessionUnits_Dtos_BadgeDto Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitBadgeById({
id,
isImmersed,
}: {
/**
 * 会话单元Id
 */
id: string,
/**
 * 是否包含免打扰的消息
 */
isImmersed?: boolean,
}): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_BadgeDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/{id}/badge-by-id',
            path: {
                'id': id,
            },
            query: {
                'isImmersed': isImmersed,
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
     * @returns IczpNet_Chat_SessionUnits_Dtos_BadgeDto Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitBadgeByOwnerId({
ownerId,
isImmersed,
}: {
/**
 * 聊天对象Id
 */
ownerId: number,
/**
 * 是否包含免打扰的消息
 */
isImmersed?: boolean,
}): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_BadgeDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/badge-by-owner-id/{ownerId}',
            path: {
                'ownerId': ownerId,
            },
            query: {
                'isImmersed': isImmersed,
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
     * @returns IczpNet_Chat_SessionUnits_Dtos_BadgeDto Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitBadgeByUserId({
userId,
isImmersed,
}: {
/**
 * 用户Id
 */
userId: string,
/**
 * 是否包含免打扰的消息
 */
isImmersed?: boolean,
}): CancelablePromise<Array<IczpNet_Chat_SessionUnits_Dtos_BadgeDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/badge-by-user-id/{userId}',
            path: {
                'userId': userId,
            },
            query: {
                'isImmersed': isImmersed,
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
     * @returns IczpNet_Chat_SessionSections_SessionUnits_SessionUnitCacheItem Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitCache({
sessionUnitId,
}: {
/**
 * 会话单元Id
 */
sessionUnitId: string,
}): CancelablePromise<IczpNet_Chat_SessionSections_SessionUnits_SessionUnitCacheItem> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/cache/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
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
     * @returns IczpNet_Chat_SessionSections_SessionUnits_SessionUnitCounterInfo Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitCounter({
sessionUnitId,
minMessageId,
isImmersed = false,
}: {
/**
 * 会话单元Id
 */
sessionUnitId: string,
/**
 * 最小消息Id
 */
minMessageId: number,
/**
 * 是否包含免打扰
 */
isImmersed?: boolean,
}): CancelablePromise<IczpNet_Chat_SessionSections_SessionUnits_SessionUnitCounterInfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/counter',
            query: {
                'SessionUnitId': sessionUnitId,
                'MinMessageId': minMessageId,
                'IsImmersed': isImmersed,
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
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDto Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitDestination({
id,
destinationId,
}: {
/**
 * 会话单元Id
 */
id: string,
/**
 * 目标会话单元Id
 */
destinationId: string,
}): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/{id}/destination/{destinationId}',
            path: {
                'id': id,
                'destinationId': destinationId,
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
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitDetail({
id,
}: {
/**
 * 会话单元Id
 */
id: string,
}): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/{id}/detail',
            path: {
                'id': id,
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
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionUnit1({
ownerId,
destinationId,
destinationObjectType,
isCreator,
isTopping,
isContacts,
isImmersed,
isKilled,
minMessageId,
maxMessageId,
isBadge,
isRemind,
isFollowing,
keyword,
maxResultCount,
skipCount,
sorting,
}: {
/**
 * 所属聊天对象Id
 */
ownerId?: number,
/**
 * 目标聊天对象Id
 */
destinationId?: number,
/**
 * 聊天对象类型:个人|群|服务号等
 */
destinationObjectType?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
/**
 * 是否创建人(群主/场主等)
 */
isCreator?: boolean,
/**
 * 是否置顶
 */
isTopping?: boolean,
/**
 * 是否保存通讯录(群)
 */
isContacts?: boolean,
/**
 * 消息免打扰，默认为 false
 */
isImmersed?: boolean,
/**
 * 是否被移除会话
 */
isKilled?: boolean,
/**
 * 最小消息Id
 */
minMessageId?: number,
/**
 * 最大消息Id
 */
maxMessageId?: number,
/**
 * 是否有角标（新消息）
 */
isBadge?: boolean,
/**
 * 是否有提醒
 */
isRemind?: boolean,
/**
 * 是否有关注的人
 */
isFollowing?: boolean,
/**
 * 关键字(支持拼音)
 */
keyword?: string,
/**
 * 显示数量
 */
maxResultCount?: number,
/**
 * 跳过数量
 */
skipCount?: number,
/**
 * 排序
 */
sorting?: string,
}): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit',
            query: {
                'OwnerId': ownerId,
                'DestinationId': destinationId,
                'DestinationObjectType': destinationObjectType,
                'IsCreator': isCreator,
                'IsTopping': isTopping,
                'IsContacts': isContacts,
                'IsImmersed': isImmersed,
                'IsKilled': isKilled,
                'MinMessageId': minMessageId,
                'MaxMessageId': maxMessageId,
                'IsBadge': isBadge,
                'IsRemind': isRemind,
                'IsFollowing': isFollowing,
                'Keyword': keyword,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
                'Sorting': sorting,
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
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionUnits_SessionUnitCacheItem_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitCaches({
sessionId,
sessionUnitId,
keyword,
maxResultCount,
skipCount,
sorting,
}: {
/**
 * 会话Id（二者不能同时为null）
 */
sessionId?: string,
/**
 * 会话单元Id（二者不能同时为null）
 */
sessionUnitId?: string,
/**
 * 关键字(支持拼音)
 */
keyword?: string,
/**
 * 显示数量
 */
maxResultCount?: number,
/**
 * 跳过数量
 */
skipCount?: number,
/**
 * 排序
 */
sorting?: string,
}): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/caches',
            query: {
                'SessionId': sessionId,
                'SessionUnitId': sessionUnitId,
                'Keyword': keyword,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
                'Sorting': sorting,
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
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitDestination1({
id,
isMuted,
isKilled,
isPublic,
isStatic,
ownerIdList,
ownerTypeList,
tagId,
roleId,
joinWay,
inviterId,
keyword,
maxResultCount,
skipCount,
sorting,
}: {
/**
 * 会话单元Id
 */
id: string,
/**
 * 是否被禁言
 */
isMuted?: boolean,
/**
 * 是否已删除的
 */
isKilled?: boolean,
/**
 * 是否公开的
 */
isPublic?: boolean,
/**
 * 是否固定成员
 */
isStatic?: boolean,
/**
 * 所属聊天对象Id
 */
ownerIdList?: Array<number>,
/**
 * 所属聊天对象类型
 */
ownerTypeList?: Array<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>,
/**
 * 会话标签Id
 */
tagId?: string,
/**
 * 会话角色Id
 */
roleId?: string,
/**
 * 加入方式
 */
joinWay?: 0 | 1 | 2 | 3 | 4 | 5,
/**
 * 邀请人Id
 */
inviterId?: string,
/**
 * 关键字(支持拼音)
 */
keyword?: string,
/**
 * 显示数量
 */
maxResultCount?: number,
/**
 * 跳过数量
 */
skipCount?: number,
/**
 * 排序
 */
sorting?: string,
}): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/{id}/destination',
            path: {
                'id': id,
            },
            query: {
                'IsMuted': isMuted,
                'IsKilled': isKilled,
                'IsPublic': isPublic,
                'IsStatic': isStatic,
                'OwnerIdList': ownerIdList,
                'OwnerTypeList': ownerTypeList,
                'TagId': tagId,
                'RoleId': roleId,
                'JoinWay': joinWay,
                'InviterId': inviterId,
                'Keyword': keyword,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
                'Sorting': sorting,
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
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionUnits_SessionUnitDisplayName_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitDestinationNames({
id,
keyword,
maxResultCount,
skipCount,
sorting,
}: {
/**
 * 会话单元Id
 */
id: string,
/**
 * 关键字(支持拼音)
 */
keyword?: string,
/**
 * 显示数量
 */
maxResultCount?: number,
/**
 * 跳过数量
 */
skipCount?: number,
/**
 * 排序
 */
sorting?: string,
}): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/{id}/destination-names',
            path: {
                'id': id,
            },
            query: {
                'Keyword': keyword,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
                'Sorting': sorting,
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
     * @returns number Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitDestinationOwnerIdList({
id,
}: {
id: string,
}): CancelablePromise<Array<number>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/{id}/destination-owner-id-list',
            path: {
                'id': id,
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
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionUnits_Dtos_SessionUnitDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitSameDestination({
sourceId,
targetId,
objectTypeList,
keyword,
maxResultCount,
skipCount,
sorting,
}: {
/**
 * 原聊天对象Id
 */
sourceId: number,
/**
 * 目标对象Id
 */
targetId: number,
/**
 * 目标聊天对象类型
 */
objectTypeList?: Array<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>,
/**
 * 关键字(支持拼音)
 */
keyword?: string,
/**
 * 显示数量
 */
maxResultCount?: number,
/**
 * 跳过数量
 */
skipCount?: number,
/**
 * 排序
 */
sorting?: string,
}): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/same-destination',
            query: {
                'SourceId': sourceId,
                'TargetId': targetId,
                'ObjectTypeList': objectTypeList,
                'Keyword': keyword,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
                'Sorting': sorting,
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
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionUnits_Dtos_SessionUnitDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitSameSession({
sourceId,
targetId,
objectTypeList,
keyword,
maxResultCount,
skipCount,
sorting,
}: {
/**
 * 源 聊天对象
 */
sourceId: number,
/**
 * 目标聊天对象
 */
targetId: number,
/**
 * 聊天对象类型
 */
objectTypeList?: Array<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>,
/**
 * 关键字(支持拼音)
 */
keyword?: string,
/**
 * 显示数量
 */
maxResultCount?: number,
/**
 * 跳过数量
 */
skipCount?: number,
/**
 * 排序
 */
sorting?: string,
}): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/same-session',
            query: {
                'SourceId': sourceId,
                'TargetId': targetId,
                'ObjectTypeList': objectTypeList,
                'Keyword': keyword,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
                'Sorting': sorting,
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
     * @returns number Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitSameDestinationCount({
sourceId,
targetId,
objectTypeList,
}: {
/**
 * 原聊天对象Id
 */
sourceId: number,
/**
 * 目标聊天对象Id
 */
targetId: number,
/**
 * 聊天对象类型
 */
objectTypeList?: Array<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>,
}): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/same-destination-count',
            query: {
                'sourceId': sourceId,
                'targetId': targetId,
                'objectTypeList': objectTypeList,
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
     * @returns number Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitSameSessionCount({
sourceId,
targetId,
objectTypeList,
}: {
/**
 * 原聊天对象Id
 */
sourceId: number,
/**
 * 目标聊天对象Id
 */
targetId: number,
/**
 * 聊天对象类型
 */
objectTypeList?: Array<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>,
}): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/same-session-count',
            query: {
                'sourceId': sourceId,
                'targetId': targetId,
                'objectTypeList': objectTypeList,
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
     * @returns IczpNet_Chat_SessionUnits_SessionUnitStatModel Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitStats({
minMessageId,
idList,
}: {
/**
 * 最小消息Id
 */
minMessageId: number,
/**
 * 会话单元Id
 */
idList?: Array<string>,
}): CancelablePromise<Record<string, IczpNet_Chat_SessionUnits_SessionUnitStatModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/stats/{minMessageId}',
            path: {
                'minMessageId': minMessageId,
            },
            query: {
                'idList': idList,
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
     * @returns number Success
     * @throws ApiError
     */
    public static getApiChatSessionUnitTypedBadgeByOwnerId({
ownerId,
isImmersed,
}: {
/**
 * 聊天对象Id
 */
ownerId: number,
/**
 * 是否包含免打扰的消息
 */
isImmersed?: boolean,
}): CancelablePromise<Record<string, number>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-unit/typed-badge-by-owner-id/{ownerId}',
            path: {
                'ownerId': ownerId,
            },
            query: {
                'isImmersed': isImmersed,
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

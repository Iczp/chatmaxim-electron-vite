/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto } from '../models/IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto';
import type { IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDetailDto } from '../models/IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDetailDto';
import type { IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDto } from '../models/IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDto';
// import type { IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_SessionSections_SessionTags_Dtos_SessionTagDto } from '../models/IczpNet_Chat_SessionSections_SessionTags_Dtos_SessionTagDto';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SessionService {

    /**
     * 添加会话角色
     * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto Success
     * @throws ApiError
     */
    public static postApiChatSessionRole({
sessionId,
name,
}: {
sessionId: string,
name?: string,
}): CancelablePromise<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/role/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'name': name,
            },
            
        });
    }

    /**
     * 添加角色成员
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionRoleMembers({
roleId,
requestBody,
}: {
/**
 * 会话角色Id
 */
roleId: string,
/**
 * 会话单元Id列表
 */
requestBody?: Array<string>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/role-members/{roleId}',
            path: {
                'roleId': roleId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 添加会话标签
     * @returns IczpNet_Chat_SessionSections_SessionTags_Dtos_SessionTagDto Success
     * @throws ApiError
     */
    public static postApiChatSessionTag({
sessionId,
name,
}: {
/**
 * 会话Id
 */
sessionId: string,
/**
 * 名称
 */
name?: string,
}): CancelablePromise<IczpNet_Chat_SessionSections_SessionTags_Dtos_SessionTagDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/tag/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'name': name,
            },
            
        });
    }

    /**
     * 添加标签成员
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionTagMembers({
tagId,
requestBody,
}: {
/**
 * 会话标签Id
 */
tagId: string,
/**
 * 会话单元Id列表
 */
requestBody?: Array<string>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/tag-members/{tagId}',
            path: {
                'tagId': tagId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 根据消息Id生成会话
     * @returns IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDto Success
     * @throws ApiError
     */
    public static postApiChatSessionGenerateSessionByMessage(): CancelablePromise<Array<IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/generate-session-by-message',
            
        });
    }

    /**
     * 获取一个聊天会话
     * @returns IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDto Success
     * @throws ApiError
     */
    public static getApiChatSession({
id,
}: {
/**
 * 主建Id
 */
id: string,
}): CancelablePromise<IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session/{id}',
            path: {
                'id': id,
            },
            
        });
    }

    /**
     * 聊天会话详情
     * @returns IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionDetail({
id,
}: {
/**
 * 主建Id
 */
id: string,
}): CancelablePromise<IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session/{id}/detail',
            path: {
                'id': id,
            },
            
        });
    }

    /**
     * 聊天会话列表
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSession1({
ownerId,
keyword,
maxResultCount,
skipCount,
sorting,
}: {
/**
 * 聊天对象Id
 */
ownerId?: number,
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
            url: '/api/chat/session',
            query: {
                'OwnerId': ownerId,
                'Keyword': keyword,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
                'Sorting': sorting,
            },
            
        });
    }

    /**
     * 删除会话角色
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionRemoveRole({
roleId,
}: {
/**
 * 会话角色Id
 */
roleId: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/remove-role/{roleId}',
            path: {
                'roleId': roleId,
            },
            
        });
    }

    /**
     * 删除角色成员
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionRemoveRoleMembers({
roleId,
requestBody,
}: {
/**
 * 会话角色Id
 */
roleId: string,
/**
 * 会话单元Id列表
 */
requestBody?: Array<string>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/remove-role-members/{roleId}',
            path: {
                'roleId': roleId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 删除会话标签
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionRemoveTag({
tagId,
}: {
/**
 * 会话标签Id
 */
tagId: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/remove-tag/{tagId}',
            path: {
                'tagId': tagId,
            },
            
        });
    }

    /**
     * 删除标签成员
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionRemoveTagMembers({
tagId,
requestBody,
}: {
/**
 * 会话标签Id
 */
tagId: string,
/**
 * 会话单元Id列表
 */
requestBody?: Array<string>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/remove-tag-members/{tagId}',
            path: {
                'tagId': tagId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 设置角色
     * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto Success
     * @throws ApiError
     */
    public static postApiChatSessionSetRoles({
sessionUnitId,
requestBody,
}: {
/**
 * 会话单元Id
 */
sessionUnitId: string,
/**
 * 会话角色Id
 */
requestBody?: Array<string>,
}): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/set-roles/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 设置标签
     * @returns IczpNet_Chat_SessionSections_SessionTags_Dtos_SessionTagDto Success
     * @throws ApiError
     */
    public static postApiChatSessionSetTags({
sessionUnitId,
requestBody,
}: {
/**
 * 会话单元Id
 */
sessionUnitId: string,
/**
 * 会话标签Id列表
 */
requestBody?: Array<string>,
}): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionTags_Dtos_SessionTagDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/set-tags/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

}

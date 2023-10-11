/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto } from '../models/IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto';
import type { IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDetailDto } from '../models/IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDetailDto';
import type { IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDto } from '../models/IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDto';
import type { IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_SessionSections_SessionTags_Dtos_SessionTagDto } from '../models/IczpNet_Chat_SessionSections_SessionTags_Dtos_SessionTagDto';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SessionService {

    /**
     * 添加会话角色
     * @param sessionId 
     * @param name 
     * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto Success
     * @throws ApiError
     */
    public static postApiChatSessionRole(
sessionId: string,
name?: string,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/role/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'name': name,
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
     * 添加角色成员
     * @param roleId 会话角色Id
     * @param requestBody 会话单元Id列表
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionRoleMembers(
roleId: string,
requestBody?: Array<string>,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/role-members/{roleId}',
            path: {
                'roleId': roleId,
            },
            body: requestBody,
            mediaType: 'application/json',
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
     * 添加会话标签
     * @param sessionId 会话Id
     * @param name 名称
     * @returns IczpNet_Chat_SessionSections_SessionTags_Dtos_SessionTagDto Success
     * @throws ApiError
     */
    public static postApiChatSessionTag(
sessionId: string,
name?: string,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionTags_Dtos_SessionTagDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/tag/{sessionId}',
            path: {
                'sessionId': sessionId,
            },
            query: {
                'name': name,
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
     * 添加标签成员
     * @param tagId 会话标签Id
     * @param requestBody 会话单元Id列表
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionTagMembers(
tagId: string,
requestBody?: Array<string>,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/tag-members/{tagId}',
            path: {
                'tagId': tagId,
            },
            body: requestBody,
            mediaType: 'application/json',
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
     * 根据消息Id生成会话
     * @returns IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDto Success
     * @throws ApiError
     */
    public static postApiChatSessionGenerateSessionByMessage(): CancelablePromise<Array<IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/generate-session-by-message',
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
     * 获取一个聊天会话
     * @param id 主建Id
     * @returns IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDto Success
     * @throws ApiError
     */
    public static getApiChatSession(
id: string,
): CancelablePromise<IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session/{id}',
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
     * 聊天会话详情
     * @param id 主建Id
     * @returns IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionDetail(
id: string,
): CancelablePromise<IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session/{id}/detail',
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
     * 聊天会话列表
     * @param ownerId 聊天对象Id
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_Sessions_Dtos_SessionDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSession1(
ownerId?: number,
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
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
     * 删除会话角色
     * @param roleId 会话角色Id
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionRemoveRole(
roleId: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/remove-role/{roleId}',
            path: {
                'roleId': roleId,
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
     * 删除角色成员
     * @param roleId 会话角色Id
     * @param requestBody 会话单元Id列表
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionRemoveRoleMembers(
roleId: string,
requestBody?: Array<string>,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/remove-role-members/{roleId}',
            path: {
                'roleId': roleId,
            },
            body: requestBody,
            mediaType: 'application/json',
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
     * 删除会话标签
     * @param tagId 会话标签Id
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionRemoveTag(
tagId: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/remove-tag/{tagId}',
            path: {
                'tagId': tagId,
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
     * 删除标签成员
     * @param tagId 会话标签Id
     * @param requestBody 会话单元Id列表
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionRemoveTagMembers(
tagId: string,
requestBody?: Array<string>,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/remove-tag-members/{tagId}',
            path: {
                'tagId': tagId,
            },
            body: requestBody,
            mediaType: 'application/json',
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
     * 设置角色
     * @param sessionUnitId 会话单元Id
     * @param requestBody 会话角色Id
     * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto Success
     * @throws ApiError
     */
    public static postApiChatSessionSetRoles(
sessionUnitId: string,
requestBody?: Array<string>,
): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/set-roles/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            body: requestBody,
            mediaType: 'application/json',
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
     * 设置标签
     * @param sessionUnitId 会话单元Id
     * @param requestBody 会话标签Id列表
     * @returns IczpNet_Chat_SessionSections_SessionTags_Dtos_SessionTagDto Success
     * @throws ApiError
     */
    public static postApiChatSessionSetTags(
sessionUnitId: string,
requestBody?: Array<string>,
): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionTags_Dtos_SessionTagDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session/set-tags/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            body: requestBody,
            mediaType: 'application/json',
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

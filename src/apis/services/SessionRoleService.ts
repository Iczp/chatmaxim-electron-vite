/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_SessionSections_SessionPermissions_PermissionGrantValue } from '../models/IczpNet_Chat_SessionSections_SessionPermissions_PermissionGrantValue';
import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleCreateInput } from '../models/IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleCreateInput';
import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto } from '../models/IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto';
import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRolePermissionDto } from '../models/IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRolePermissionDto';
import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleUpdateInput } from '../models/IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SessionRoleService {

    /**
     * 新增
     * @param requestBody 
     * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionRole(
requestBody?: IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleCreateInput,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-role',
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
     * 获取列表
     * @param sessionId 会话Id
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionRole(
sessionId?: string,
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-role',
            query: {
                'SessionId': sessionId,
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
     * 删除一条数据
     * @param id 主键Id
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionRoleDelete(
id: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-role/{id}/delete',
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
     * 删除多条数据
     * @param requestBody 主键Id[多个]
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionRoleDeleteMany(
requestBody?: Array<string>,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-role/delete-many',
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
     * 获取一条记录 Get
     * @param id 主键Id
     * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionRole1(
id: string,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-role/{id}',
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
     * 获取多条数据
     * @param idList 主键Id[多个]
     * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionRoleMany(
idList?: Array<string>,
): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-role/many',
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
     * 获取角色权限
     * @param id 主建Id
     * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRolePermissionDto Success
     * @throws ApiError
     */
    public static getApiChatSessionRolePermissions(
id: string,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRolePermissionDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-role/{id}/permissions',
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
     * 授予角色所有权限
     * @param id 主建Id
     * @param requestBody 授予值
     * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRolePermissionDto Success
     * @throws ApiError
     */
    public static postApiChatSessionRoleSetAllPermissions(
id: string,
requestBody?: IczpNet_Chat_SessionSections_SessionPermissions_PermissionGrantValue,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRolePermissionDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-role/{id}/set-all-permissions',
            path: {
                'id': id,
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
     * 修改
     * @param id 主键Id
     * @param requestBody 
     * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionRoleUpdate(
id: string,
requestBody?: IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleUpdateInput,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-role/{id}/update',
            path: {
                'id': id,
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

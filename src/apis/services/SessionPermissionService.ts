/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionGrantDto } from '../models/IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionGrantDto';
import type { IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionRoleGrantDto } from '../models/IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionRoleGrantDto';
import type { IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionUnitGrantDto } from '../models/IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionUnitGrantDto';
import type { IczpNet_Chat_SessionSections_SessionPermissions_PermissionGrantValue } from '../models/IczpNet_Chat_SessionSections_SessionPermissions_PermissionGrantValue';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SessionPermissionService {

    /**
     * 获取会话角色权限
     * @param sessionRoleId 会话角色Id
     * @returns IczpNet_Chat_SessionSections_SessionPermissions_PermissionGrantValue Success
     * @throws ApiError
     */
    public static getApiChatSessionPermissionGrantedBySessionRole(
sessionRoleId: string,
): CancelablePromise<Record<string, IczpNet_Chat_SessionSections_SessionPermissions_PermissionGrantValue>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-permission/granted-by-session-role/{sessionRoleId}',
            path: {
                'sessionRoleId': sessionRoleId,
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
     * 获取授予权限的会话单元
     * @param permissionDefinitionId 权限Id
     * @param sessionUnitId 会话单元Id
     * @returns IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionGrantDto Success
     * @throws ApiError
     */
    public static getApiChatSessionPermissionGrantedBySessionUnit(
permissionDefinitionId?: string,
sessionUnitId?: string,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionGrantDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-permission/granted-by-session-unit',
            query: {
                'permissionDefinitionId': permissionDefinitionId,
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
     * 授予会话角色权限
     * @param definitionId 权限Id
     * @param sessionRoleId 角色Id
     * @param requestBody 授予值
     * @returns IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionRoleGrantDto Success
     * @throws ApiError
     */
    public static postApiChatSessionPermissionGrantBySessionRole(
definitionId?: string,
sessionRoleId?: string,
requestBody?: IczpNet_Chat_SessionSections_SessionPermissions_PermissionGrantValue,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionRoleGrantDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-permission/grant-by-session-role',
            query: {
                'definitionId': definitionId,
                'sessionRoleId': sessionRoleId,
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
     * 授予会话单元权限
     * @param definitionId 权限Id
     * @param sessionUnitId 会话单元
     * @param requestBody 授予值
     * @returns IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionUnitGrantDto Success
     * @throws ApiError
     */
    public static postApiChatSessionPermissionGrantBySessionUnit(
definitionId?: string,
sessionUnitId?: string,
requestBody?: IczpNet_Chat_SessionSections_SessionPermissions_PermissionGrantValue,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionPermissions_Dtos_SessionPermissionUnitGrantDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-permission/grant-by-session-unit',
            query: {
                'definitionId': definitionId,
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

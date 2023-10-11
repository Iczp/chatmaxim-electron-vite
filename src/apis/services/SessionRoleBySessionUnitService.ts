/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleCreateBySessionUnitInput } from '../models/IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleCreateBySessionUnitInput';
import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto } from '../models/IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto';
import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleUpdateInput } from '../models/IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SessionRoleBySessionUnitService {

    /**
     * @param sessionUnitId 
     * @param requestBody 
     * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionRoleBySessionUnit(
sessionUnitId?: string,
requestBody?: IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleCreateBySessionUnitInput,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-role-by-session-unit',
            query: {
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
     * @param sessionUnitId 
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionRoleBySessionUnit(
sessionUnitId?: string,
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-role-by-session-unit',
            query: {
                'sessionUnitId': sessionUnitId,
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
     * @param sessionUnitId 
     * @param id 
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionRoleBySessionUnitDeleteBy(
sessionUnitId: string,
id: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-role-by-session-unit/{id}/delete-by/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
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
     * @param sessionUnitId 
     * @param requestBody 
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionRoleBySessionUnitDeleteMany(
sessionUnitId: string,
requestBody?: Array<string>,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-role-by-session-unit/delete-many/{sessionUnitId}',
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
     * @param id 
     * @param sessionUnitId 
     * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionRoleBySessionUnit1(
id: string,
sessionUnitId?: string,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-role-by-session-unit/{id}',
            path: {
                'id': id,
            },
            query: {
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
     * 获取多条数据
     * @param idList 主键Id[多个]
     * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionRoleBySessionUnitMany(
idList?: Array<string>,
): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-role-by-session-unit/many',
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
     * @param sessionUnitId 
     * @param id 
     * @param requestBody 
     * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionRoleBySessionUnitUpdate(
sessionUnitId: string,
id: string,
requestBody?: IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleUpdateInput,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-role-by-session-unit/{id}/update/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
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

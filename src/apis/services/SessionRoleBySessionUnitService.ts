/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleCreateBySessionUnitInput } from '../models/IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleCreateBySessionUnitInput';
import type { SessionRoleDetailDto } from '../models/SessionRoleDetailDto';
// import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleUpdateInput } from '../models/IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SessionRoleBySessionUnitService {

    /**
     * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionRoleBySessionUnit({
sessionUnitId,
requestBody,
}: {
sessionUnitId?: string,
requestBody?: IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleCreateBySessionUnitInput,
}): CancelablePromise<SessionRoleDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-role-by-session-unit',
            query: {
                'sessionUnitId': sessionUnitId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionRoleBySessionUnit({
sessionUnitId,
keyword,
maxResultCount,
skipCount,
sorting,
}: {
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
            url: '/api/chat/session-role-by-session-unit',
            query: {
                'sessionUnitId': sessionUnitId,
                'Keyword': keyword,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
                'Sorting': sorting,
            },
            
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionRoleBySessionUnitDeleteBy({
sessionUnitId,
id,
}: {
sessionUnitId: string,
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-role-by-session-unit/{id}/delete-by/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
                'id': id,
            },
            
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionRoleBySessionUnitDeleteMany({
sessionUnitId,
requestBody,
}: {
sessionUnitId: string,
requestBody?: Array<string>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-role-by-session-unit/delete-many/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionRoleBySessionUnit1({
id,
sessionUnitId,
}: {
id: string,
sessionUnitId?: string,
}): CancelablePromise<SessionRoleDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-role-by-session-unit/{id}',
            path: {
                'id': id,
            },
            query: {
                'sessionUnitId': sessionUnitId,
            },
            
        });
    }

    /**
     * 获取多条数据
     * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionRoleBySessionUnitMany({
idList,
}: {
/**
 * 主键Id[多个]
 */
idList?: Array<string>,
}): CancelablePromise<Array<SessionRoleDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-role-by-session-unit/many',
            query: {
                'idList': idList,
            },
            
        });
    }

    /**
     * @returns IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionRoleBySessionUnitUpdate({
sessionUnitId,
id,
requestBody,
}: {
sessionUnitId: string,
id: string,
requestBody?: IczpNet_Chat_SessionSections_SessionRoles_Dtos_SessionRoleUpdateInput,
}): CancelablePromise<SessionRoleDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-role-by-session-unit/{id}/update/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

}

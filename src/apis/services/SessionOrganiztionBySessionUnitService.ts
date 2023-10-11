/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationCreateBySessionUnitInput } from '../models/IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationCreateBySessionUnitInput';
import type { IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto } from '../models/IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto';
import type { IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationUpdateInput } from '../models/IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SessionOrganiztionBySessionUnitService {

    /**
     * @param sessionUnitId 
     * @param requestBody 
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionOrganiztionBySessionUnit(
sessionUnitId?: string,
requestBody?: IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationCreateBySessionUnitInput,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-organiztion-by-session-unit',
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
     * @param isEnabledParentId 是否启用 ParentId
     * @param parentId 父级Id,当IsEnabledParentId=false时,查询全部
     * @param depthList 层级
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionOrganiztionBySessionUnit(
sessionUnitId?: string,
isEnabledParentId: boolean = false,
parentId: number = null,
depthList: Array<number> = null,
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-organiztion-by-session-unit',
            query: {
                'sessionUnitId': sessionUnitId,
                'IsEnabledParentId': isEnabledParentId,
                'ParentId': parentId,
                'DepthList': depthList,
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
    public static postApiChatSessionOrganiztionBySessionUnitDelete(
sessionUnitId: string,
id: number,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-organiztion-by-session-unit/{id}/delete/{sessionUnitId}',
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
    public static postApiChatSessionOrganiztionBySessionUnitDeleteMany(
sessionUnitId: string,
requestBody?: Array<number>,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-organiztion-by-session-unit/delete-many/{sessionUnitId}',
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
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionOrganiztionBySessionUnit1(
id: number,
sessionUnitId?: string,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-organiztion-by-session-unit/{id}',
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
     * @param idList 
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionOrganiztionBySessionUnitMany(
idList?: Array<number>,
): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-organiztion-by-session-unit/many',
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
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionOrganiztionBySessionUnitUpdate(
sessionUnitId: string,
id: number,
requestBody?: IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationUpdateInput,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-organiztion-by-session-unit/{id}/update/{sessionUnitId}',
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

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
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionOrganiztionBySessionUnit({
sessionUnitId,
requestBody,
}: {
sessionUnitId?: string,
requestBody?: IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationCreateBySessionUnitInput,
}): CancelablePromise<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto> {
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
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionOrganiztionBySessionUnit({
sessionUnitId,
isEnabledParentId = false,
parentId = null,
depthList = null,
keyword = null,
maxResultCount,
skipCount,
sorting = null,
}: {
sessionUnitId?: string,
/**
 * 是否启用 ParentId
 */
isEnabledParentId?: boolean,
/**
 * 父级Id,当IsEnabledParentId=false时,查询全部
 */
parentId?: number,
/**
 * 层级
 */
depthList?: Array<number>,
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
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionOrganiztionBySessionUnitDelete({
sessionUnitId,
id,
}: {
sessionUnitId: string,
id: number,
}): CancelablePromise<any> {
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
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionOrganiztionBySessionUnitDeleteMany({
sessionUnitId,
requestBody,
}: {
sessionUnitId: string,
requestBody?: Array<number>,
}): CancelablePromise<any> {
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
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionOrganiztionBySessionUnit1({
id,
sessionUnitId,
}: {
id: number,
sessionUnitId?: string,
}): CancelablePromise<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto> {
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
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionOrganiztionBySessionUnitMany({
idList,
}: {
idList?: Array<number>,
}): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto>> {
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
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionOrganiztionBySessionUnitUpdate({
sessionUnitId,
id,
requestBody,
}: {
sessionUnitId: string,
id: number,
requestBody?: IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationUpdateInput,
}): CancelablePromise<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto> {
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

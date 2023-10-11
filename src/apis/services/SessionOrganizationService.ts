/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_SessionSections_SessionOrganizations_SessionOrganizationInfo } from '../models/IczpNet_Chat_SessionSections_SessionOrganizations_SessionOrganizationInfo';
import type { IczpNet_Chat_SessionSections_SessionOrganizations_SessionOrganizationInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionSections_SessionOrganizations_SessionOrganizationInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationCreateInput } from '../models/IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationCreateInput';
import type { IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto } from '../models/IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto';
import type { IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationUpdateInput } from '../models/IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SessionOrganizationService {

    /**
     * 添加组织
     * @param requestBody 
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionOrganization(
requestBody?: IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationCreateInput,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-organization',
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
     * 列表
     * @param sessionId 会话Id
     * @param sessionUnitId 会话单元Id
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
    public static getApiChatSessionOrganization(
sessionId?: string,
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
            url: '/api/chat/session-organization',
            query: {
                'SessionId': sessionId,
                'SessionUnitId': sessionUnitId,
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
     * 删除一条数据
     * @param id 主键Id
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionOrganizationDelete(
id: number,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-organization/{id}/delete',
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
    public static postApiChatSessionOrganizationDeleteMany(
requestBody?: Array<number>,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-organization/delete-many',
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
     * 获取一条数据
     * @param id 主键Id
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionOrganization1(
id: number,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-organization/{id}',
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
     * 列表(缓存)
     * @param isEnabledParentId 
     * @param depthList 
     * @param parentId 
     * @param keyword 
     * @param sorting 
     * @param skipCount 
     * @param maxResultCount 
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionOrganizations_SessionOrganizationInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionOrganizationByCache(
isEnabledParentId: boolean = false,
depthList: Array<number> = null,
parentId: number = null,
keyword: string = null,
sorting?: string,
skipCount?: number,
maxResultCount?: number,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-organization/by-cache',
            query: {
                'IsEnabledParentId': isEnabledParentId,
                'DepthList': depthList,
                'ParentId': parentId,
                'Keyword': keyword,
                'Sorting': sorting,
                'SkipCount': skipCount,
                'MaxResultCount': maxResultCount,
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
     * 获取一条数据(缓存)
     * @param id 主键Id
     * @returns IczpNet_Chat_SessionSections_SessionOrganizations_SessionOrganizationInfo Success
     * @throws ApiError
     */
    public static getApiChatSessionOrganizationItemByCache(
id: number,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionOrganizations_SessionOrganizationInfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-organization/{id}/item-by-cache',
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
     * 获取多条数据(缓存)
     * @param idList 主键Id[多个]
     * @returns IczpNet_Chat_SessionSections_SessionOrganizations_SessionOrganizationInfo Success
     * @throws ApiError
     */
    public static getApiChatSessionOrganizationManayByCache(
idList?: Array<number>,
): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionOrganizations_SessionOrganizationInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-organization/manay-by-cache',
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
     * 获取多条数据
     * @param idList 主键Id[多个]
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionOrganizationMany(
idList?: Array<number>,
): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-organization/many',
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
     * 修复数据（fullPath,fullName,childrenCount,depth等）
     * @param maxResultCount 每次修复最大数量（过多可能导致数据库超时）
     * @param skinCount 跳过数量
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatSessionOrganizationRepairData(
maxResultCount: number = 100,
skinCount?: number,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-organization/repair-data',
            query: {
                'maxResultCount': maxResultCount,
                'skinCount': skinCount,
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
     * 修改组织
     * @param id 主建Id
     * @param requestBody 
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionOrganizationUpdate(
id: number,
requestBody?: IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationUpdateInput,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-organization/{id}/update',
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

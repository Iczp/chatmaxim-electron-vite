/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupCreateInput } from '../models/IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupCreateInput';
import type { IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupDetailDto } from '../models/IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupDetailDto';
import type { IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupUpdateInput } from '../models/IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupUpdateInput';
import type { IczpNet_Chat_SessionSections_SessionPermissionGroups_SessionPermissionGroupInfo } from '../models/IczpNet_Chat_SessionSections_SessionPermissionGroups_SessionPermissionGroupInfo';
import type { IczpNet_Chat_SessionSections_SessionPermissionGroups_SessionPermissionGroupInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionSections_SessionPermissionGroups_SessionPermissionGroupInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SessionPermissionGroupService {

    /**
     * 新增
     * @param requestBody 
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionPermissionGroup(
requestBody?: IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupCreateInput,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-permission-group',
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
     * @param depth 
     * @param isEnabledParentId 是否启用 ParentId
     * @param parentId 父级Id,当IsEnabledParentId=false时,查询全部
     * @param depthList 层级
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionPermissionGroup(
depth?: number,
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
            url: '/api/chat/session-permission-group',
            query: {
                'Depth': depth,
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
    public static postApiChatSessionPermissionGroupDelete(
id: number,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-permission-group/{id}/delete',
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
    public static postApiChatSessionPermissionGroupDeleteMany(
requestBody?: Array<number>,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-permission-group/delete-many',
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
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionPermissionGroup1(
id: number,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-permission-group/{id}',
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
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionPermissionGroups_SessionPermissionGroupInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionPermissionGroupByCache(
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
            url: '/api/chat/session-permission-group/by-cache',
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
     * @returns IczpNet_Chat_SessionSections_SessionPermissionGroups_SessionPermissionGroupInfo Success
     * @throws ApiError
     */
    public static getApiChatSessionPermissionGroupItemByCache(
id: number,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionPermissionGroups_SessionPermissionGroupInfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-permission-group/{id}/item-by-cache',
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
     * @returns IczpNet_Chat_SessionSections_SessionPermissionGroups_SessionPermissionGroupInfo Success
     * @throws ApiError
     */
    public static getApiChatSessionPermissionGroupManayByCache(
idList?: Array<number>,
): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionPermissionGroups_SessionPermissionGroupInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-permission-group/manay-by-cache',
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
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionPermissionGroupMany(
idList?: Array<number>,
): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-permission-group/many',
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
    public static postApiChatSessionPermissionGroupRepairData(
maxResultCount: number = 100,
skinCount?: number,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-permission-group/repair-data',
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
     * 修改
     * @param id 主键Id
     * @param requestBody 
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionPermissionGroupUpdate(
id: number,
requestBody?: IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupUpdateInput,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-permission-group/{id}/update',
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

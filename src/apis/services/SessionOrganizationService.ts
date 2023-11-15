/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_SessionSections_SessionOrganizations_SessionOrganizationInfo } from '../models/IczpNet_Chat_SessionSections_SessionOrganizations_SessionOrganizationInfo';
// import type { IczpNet_Chat_SessionSections_SessionOrganizations_SessionOrganizationInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionSections_SessionOrganizations_SessionOrganizationInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationCreateInput } from '../models/IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationCreateInput';
import type { IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto } from '../models/IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto';
// import type { IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationUpdateInput } from '../models/IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SessionOrganizationService {

    /**
     * 添加组织
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionOrganization({
requestBody,
}: {
requestBody?: IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationCreateInput,
}): CancelablePromise<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-organization',
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 列表
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionOrganization({
sessionId,
sessionUnitId,
isEnabledParentId = false,
parentId,
depthList,
keyword,
maxResultCount,
skipCount,
sorting,
}: {
/**
 * 会话Id
 */
sessionId?: string,
/**
 * 会话单元Id
 */
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
            
        });
    }

    /**
     * 删除一条数据
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionOrganizationDelete({
id,
}: {
/**
 * 主键Id
 */
id: number,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-organization/{id}/delete',
            path: {
                'id': id,
            },
            
        });
    }

    /**
     * 删除多条数据
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSessionOrganizationDeleteMany({
requestBody,
}: {
/**
 * 主键Id[多个]
 */
requestBody?: Array<number>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-organization/delete-many',
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 获取一条数据
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionOrganization1({
id,
}: {
/**
 * 主键Id
 */
id: number,
}): CancelablePromise<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-organization/{id}',
            path: {
                'id': id,
            },
            
        });
    }

    /**
     * 列表(缓存)
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionOrganizations_SessionOrganizationInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionOrganizationByCache({
isEnabledParentId = false,
depthList,
parentId,
keyword,
sorting,
skipCount,
maxResultCount,
}: {
isEnabledParentId?: boolean,
depthList?: Array<number>,
parentId?: number,
keyword?: string,
sorting?: string,
skipCount?: number,
maxResultCount?: number,
}): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
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
            
        });
    }

    /**
     * 获取一条数据(缓存)
     * @returns IczpNet_Chat_SessionSections_SessionOrganizations_SessionOrganizationInfo Success
     * @throws ApiError
     */
    public static getApiChatSessionOrganizationItemByCache({
id,
}: {
/**
 * 主键Id
 */
id: number,
}): CancelablePromise<IczpNet_Chat_SessionSections_SessionOrganizations_SessionOrganizationInfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-organization/{id}/item-by-cache',
            path: {
                'id': id,
            },
            
        });
    }

    /**
     * 获取多条数据(缓存)
     * @returns IczpNet_Chat_SessionSections_SessionOrganizations_SessionOrganizationInfo Success
     * @throws ApiError
     */
    public static getApiChatSessionOrganizationManayByCache({
idList,
}: {
/**
 * 主键Id[多个]
 */
idList?: Array<number>,
}): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionOrganizations_SessionOrganizationInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-organization/manay-by-cache',
            query: {
                'idList': idList,
            },
            
        });
    }

    /**
     * 获取多条数据
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionOrganizationMany({
idList,
}: {
/**
 * 主键Id[多个]
 */
idList?: Array<number>,
}): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-organization/many',
            query: {
                'idList': idList,
            },
            
        });
    }

    /**
     * 修复数据（fullPath,fullName,childrenCount,depth等）
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatSessionOrganizationRepairData({
maxResultCount = 100,
skinCount,
}: {
/**
 * 每次修复最大数量（过多可能导致数据库超时）
 */
maxResultCount?: number,
/**
 * 跳过数量
 */
skinCount?: number,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-organization/repair-data',
            query: {
                'maxResultCount': maxResultCount,
                'skinCount': skinCount,
            },
            
        });
    }

    /**
     * 修改组织
     * @returns IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionOrganizationUpdate({
id,
requestBody,
}: {
/**
 * 主建Id
 */
id: number,
requestBody?: IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationUpdateInput,
}): CancelablePromise<IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-organization/{id}/update',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

}

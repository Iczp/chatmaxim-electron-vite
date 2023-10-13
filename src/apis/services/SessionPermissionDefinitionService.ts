/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDetailDto } from '../models/IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDetailDto';
import type { IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDto } from '../models/IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDto';
import type { IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionUpdateInput } from '../models/IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SessionPermissionDefinitionService {

    /**
     * 获取一条记录 Get
     * @returns IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionPermissionDefinition({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-permission-definition/{id}',
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
     * 获取列表
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionPermissionDefinition1({
groupIdList = null,
isImportChildGroup,
keyword = null,
maxResultCount,
skipCount,
sorting = null,
}: {
/**
 * 分组Id
 */
groupIdList?: Array<number>,
/**
 * 是否包含子组分组
 */
isImportChildGroup?: boolean,
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
            url: '/api/chat/session-permission-definition',
            query: {
                'GroupIdList': groupIdList,
                'IsImportChildGroup': isImportChildGroup,
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
     * 获取多条数据
     * @returns IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionPermissionDefinitionMany({
idList,
}: {
/**
 * 主键Id[多个]
 */
idList?: Array<string>,
}): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-permission-definition/many',
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
     * 全部启用或禁用
     * @returns number Success
     * @throws ApiError
     */
    public static postApiChatSessionPermissionDefinitionSetAllIsEnabled({
isEnabled,
}: {
/**
 * 启用或禁用
 */
isEnabled?: boolean,
}): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-permission-definition/set-all-is-enabled',
            query: {
                'isEnabled': isEnabled,
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
     * 启用或禁用
     * @returns IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDto Success
     * @throws ApiError
     */
    public static postApiChatSessionPermissionDefinitionSetIsEnabled({
id,
isEnabled,
}: {
/**
 * 权限Id
 */
id: string,
/**
 * 启用或禁用
 */
isEnabled?: boolean,
}): CancelablePromise<IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-permission-definition/{id}/set-is-enabled',
            path: {
                'id': id,
            },
            query: {
                'isEnabled': isEnabled,
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
     * @returns IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionPermissionDefinitionUpdate({
id,
requestBody,
}: {
/**
 * 主键Id
 */
id: string,
requestBody?: IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionUpdateInput,
}): CancelablePromise<IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-permission-definition/{id}/update',
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

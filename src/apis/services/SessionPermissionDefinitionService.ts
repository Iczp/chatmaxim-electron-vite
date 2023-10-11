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
     * @param id 主键Id
     * @returns IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionPermissionDefinition(
id: string,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDetailDto> {
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
     * @param groupIdList 分组Id
     * @param isImportChildGroup 是否包含子组分组
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionPermissionDefinition1(
groupIdList: Array<number> = null,
isImportChildGroup?: boolean,
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
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
     * @param idList 主键Id[多个]
     * @returns IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionPermissionDefinitionMany(
idList?: Array<string>,
): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDetailDto>> {
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
     * @param isEnabled 启用或禁用
     * @returns number Success
     * @throws ApiError
     */
    public static postApiChatSessionPermissionDefinitionSetAllIsEnabled(
isEnabled?: boolean,
): CancelablePromise<number> {
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
     * @param id 权限Id
     * @param isEnabled 启用或禁用
     * @returns IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDto Success
     * @throws ApiError
     */
    public static postApiChatSessionPermissionDefinitionSetIsEnabled(
id: string,
isEnabled?: boolean,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDto> {
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
     * @param id 主键Id
     * @param requestBody 
     * @returns IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionPermissionDefinitionUpdate(
id: string,
requestBody?: IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionUpdateInput,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionPermissionDefinitions_Dtos_SessionPermissionDefinitionDetailDto> {
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

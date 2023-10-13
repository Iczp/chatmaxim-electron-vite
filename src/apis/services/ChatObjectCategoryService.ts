/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_ChatObjectCategorys_ChatObjectCategoryInfo } from '../models/IczpNet_Chat_ChatObjectCategorys_ChatObjectCategoryInfo';
import type { IczpNet_Chat_ChatObjectCategorys_ChatObjectCategoryInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_ChatObjectCategorys_ChatObjectCategoryInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryCreateInput } from '../models/IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryCreateInput';
import type { IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryDetailDto } from '../models/IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryDetailDto';
import type { IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryUpdateInput } from '../models/IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ChatObjectCategoryService {

    /**
     * 新增
     * @returns IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryDetailDto Success
     * @throws ApiError
     */
    public static postApiChatChatObjectCategory({
requestBody,
}: {
requestBody?: IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryCreateInput,
}): CancelablePromise<IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/chat-object-category',
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
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatChatObjectCategory({
chatObjectTypeId,
isEnabledParentId = false,
parentId = null,
depthList = null,
keyword = null,
maxResultCount,
skipCount,
sorting = null,
}: {
chatObjectTypeId?: string,
/**
 * 是否启用 ParentId
 */
isEnabledParentId?: boolean,
/**
 * 父级Id,当IsEnabledParentId=false时,查询全部
 */
parentId?: string,
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
            url: '/api/chat/chat-object-category',
            query: {
                'ChatObjectTypeId': chatObjectTypeId,
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
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatChatObjectCategoryDelete({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/chat-object-category/{id}/delete',
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
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatChatObjectCategoryDeleteMany({
requestBody,
}: {
/**
 * 主键Id[多个]
 */
requestBody?: Array<string>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/chat-object-category/delete-many',
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
     * @returns IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryDetailDto Success
     * @throws ApiError
     */
    public static getApiChatChatObjectCategory1({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/chat-object-category/{id}',
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
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_ChatObjectCategorys_ChatObjectCategoryInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatChatObjectCategoryByCache({
isEnabledParentId = false,
depthList = null,
parentId = null,
keyword = null,
sorting,
skipCount,
maxResultCount,
}: {
isEnabledParentId?: boolean,
depthList?: Array<number>,
parentId?: string,
keyword?: string,
sorting?: string,
skipCount?: number,
maxResultCount?: number,
}): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/chat-object-category/by-cache',
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
     * @returns IczpNet_Chat_ChatObjectCategorys_ChatObjectCategoryInfo Success
     * @throws ApiError
     */
    public static getApiChatChatObjectCategoryItemByCache({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<IczpNet_Chat_ChatObjectCategorys_ChatObjectCategoryInfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/chat-object-category/{id}/item-by-cache',
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
     * @returns IczpNet_Chat_ChatObjectCategorys_ChatObjectCategoryInfo Success
     * @throws ApiError
     */
    public static getApiChatChatObjectCategoryManayByCache({
idList,
}: {
/**
 * 主键Id[多个]
 */
idList?: Array<string>,
}): CancelablePromise<Array<IczpNet_Chat_ChatObjectCategorys_ChatObjectCategoryInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/chat-object-category/manay-by-cache',
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
     * @returns IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryDetailDto Success
     * @throws ApiError
     */
    public static getApiChatChatObjectCategoryMany({
idList,
}: {
/**
 * 主键Id[多个]
 */
idList?: Array<string>,
}): CancelablePromise<Array<IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/chat-object-category/many',
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
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatChatObjectCategoryRepairData({
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
            url: '/api/chat/chat-object-category/repair-data',
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
     * @returns IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryDetailDto Success
     * @throws ApiError
     */
    public static postApiChatChatObjectCategoryUpdate({
id,
requestBody,
}: {
/**
 * 主键Id
 */
id: string,
requestBody?: IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryUpdateInput,
}): CancelablePromise<IczpNet_Chat_ChatObjectCategorys_Dtos_ChatObjectCategoryDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/chat-object-category/{id}/update',
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

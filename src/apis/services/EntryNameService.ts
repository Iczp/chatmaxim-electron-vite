/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_AbpTrees_TreeInfo_1 } from '../models/IczpNet_AbpTrees_TreeInfo_1';
import type { IczpNet_AbpTrees_TreeInfo_1_System_Guid_System_Private_CoreLib_Version_7_0_0_0_Culture_neutral_PublicKeyToken_7cec85d7bea7798e_IczpNet_AbpTrees_Domain_Shared_Version_0_2_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_AbpTrees_TreeInfo_1_System_Guid_System_Private_CoreLib_Version_7_0_0_0_Culture_neutral_PublicKeyToken_7cec85d7bea7798e_IczpNet_AbpTrees_Domain_Shared_Version_0_2_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_EntryNames_Dtos_EntryNameCreateInput } from '../models/IczpNet_Chat_EntryNames_Dtos_EntryNameCreateInput';
import type { IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto } from '../models/IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto';
import type { IczpNet_Chat_EntryNames_Dtos_EntryNameDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_EntryNames_Dtos_EntryNameDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_EntryNames_Dtos_EntryNameUpdateInput } from '../models/IczpNet_Chat_EntryNames_Dtos_EntryNameUpdateInput';
import type { System_Guid_System_Private_CoreLib_Version_7_0_0_0_Culture_neutral_PublicKeyToken_7cec85d7bea7798e_ } from '../models/System_Guid_System_Private_CoreLib_Version_7_0_0_0_Culture_neutral_PublicKeyToken_7cec85d7bea7798e_';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EntryNameService {

    /**
     * 新增
     * @param requestBody 
     * @returns IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto Success
     * @throws ApiError
     */
    public static postApiChatEntryName(
requestBody?: IczpNet_Chat_EntryNames_Dtos_EntryNameCreateInput,
): CancelablePromise<IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/entry-name',
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
     * @param isChoice 是否选择
     * @param isUniqued 是否唯一
     * @param isRequired 是否必填
     * @param isStatic 是否固定
     * @param isPublic 是否公开
     * @param isEnabledParentId 是否启用 ParentId
     * @param parentId 父级Id,当IsEnabledParentId=false时,查询全部
     * @param depthList 层级
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_EntryNames_Dtos_EntryNameDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatEntryName(
isChoice?: boolean,
isUniqued?: boolean,
isRequired?: boolean,
isStatic?: boolean,
isPublic?: boolean,
isEnabledParentId: boolean = false,
parentId: string = null,
depthList: Array<number> = null,
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/entry-name',
            query: {
                'IsChoice': isChoice,
                'IsUniqued': isUniqued,
                'IsRequired': isRequired,
                'IsStatic': isStatic,
                'IsPublic': isPublic,
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
    public static postApiChatEntryNameDelete(
id: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/entry-name/{id}/delete',
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
    public static postApiChatEntryNameDeleteMany(
requestBody?: Array<string>,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/entry-name/delete-many',
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
     * @returns IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto Success
     * @throws ApiError
     */
    public static getApiChatEntryName1(
id: string,
): CancelablePromise<IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/entry-name/{id}',
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
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_AbpTrees_TreeInfo_1_System_Guid_System_Private_CoreLib_Version_7_0_0_0_Culture_neutral_PublicKeyToken_7cec85d7bea7798e_IczpNet_AbpTrees_Domain_Shared_Version_0_2_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatEntryNameByCache(
isEnabledParentId: boolean = false,
depthList: Array<number> = null,
parentId: string = null,
keyword: string = null,
sorting?: string,
skipCount?: number,
maxResultCount?: number,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/entry-name/by-cache',
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
     * @returns IczpNet_AbpTrees_TreeInfo_1<System_Guid_System_Private_CoreLib_Version_7_0_0_0_Culture_neutral_PublicKeyToken_7cec85d7bea7798e_> Success
     * @throws ApiError
     */
    public static getApiChatEntryNameItemByCache(
id: string,
): CancelablePromise<IczpNet_AbpTrees_TreeInfo_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/entry-name/{id}/item-by-cache',
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
     * @returns IczpNet_AbpTrees_TreeInfo_1<System_Guid_System_Private_CoreLib_Version_7_0_0_0_Culture_neutral_PublicKeyToken_7cec85d7bea7798e_> Success
     * @throws ApiError
     */
    public static getApiChatEntryNameManayByCache(
idList?: Array<string>,
): CancelablePromise<Array<IczpNet_AbpTrees_TreeInfo_1>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/entry-name/manay-by-cache',
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
     * @returns IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto Success
     * @throws ApiError
     */
    public static getApiChatEntryNameMany(
idList?: Array<string>,
): CancelablePromise<Array<IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/entry-name/many',
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
    public static postApiChatEntryNameRepairData(
maxResultCount: number = 100,
skinCount?: number,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/entry-name/repair-data',
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
     * @returns IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto Success
     * @throws ApiError
     */
    public static postApiChatEntryNameUpdate(
id: string,
requestBody?: IczpNet_Chat_EntryNames_Dtos_EntryNameUpdateInput,
): CancelablePromise<IczpNet_Chat_EntryNames_Dtos_EntryNameDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/entry-name/{id}/update',
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

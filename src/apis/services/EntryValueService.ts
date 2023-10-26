/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_EntryValues_Dtos_EntryValueCreateInput } from '../models/IczpNet_Chat_EntryValues_Dtos_EntryValueCreateInput';
import type { IczpNet_Chat_EntryValues_Dtos_EntryValueDetailDto } from '../models/IczpNet_Chat_EntryValues_Dtos_EntryValueDetailDto';
// import type { IczpNet_Chat_EntryValues_Dtos_EntryValueDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_EntryValues_Dtos_EntryValueDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_EntryValues_Dtos_EntryValueUpdateInput } from '../models/IczpNet_Chat_EntryValues_Dtos_EntryValueUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EntryValueService {

    /**
     * 新增
     * @returns IczpNet_Chat_EntryValues_Dtos_EntryValueDetailDto Success
     * @throws ApiError
     */
    public static postApiChatEntryValue({
requestBody,
}: {
requestBody?: IczpNet_Chat_EntryValues_Dtos_EntryValueCreateInput,
}): CancelablePromise<IczpNet_Chat_EntryValues_Dtos_EntryValueDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/entry-value',
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
     * 获取列表
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_EntryValues_Dtos_EntryValueDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatEntryValue({
entryNameId,
isStatic,
isPublic,
isOption,
keyword,
maxResultCount,
skipCount,
sorting,
}: {
entryNameId?: string,
isStatic?: boolean,
isPublic?: boolean,
isOption?: boolean,
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
            url: '/api/chat/entry-value',
            query: {
                'EntryNameId': entryNameId,
                'IsStatic': isStatic,
                'IsPublic': isPublic,
                'IsOption': isOption,
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
    public static postApiChatEntryValueDelete({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/entry-value/{id}/delete',
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
    public static postApiChatEntryValueDeleteMany({
requestBody,
}: {
/**
 * 主键Id[多个]
 */
requestBody?: Array<string>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/entry-value/delete-many',
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
     * 获取一条记录 Get
     * @returns IczpNet_Chat_EntryValues_Dtos_EntryValueDetailDto Success
     * @throws ApiError
     */
    public static getApiChatEntryValue1({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<IczpNet_Chat_EntryValues_Dtos_EntryValueDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/entry-value/{id}',
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
     * 获取多条数据
     * @returns IczpNet_Chat_EntryValues_Dtos_EntryValueDetailDto Success
     * @throws ApiError
     */
    public static getApiChatEntryValueMany({
idList,
}: {
/**
 * 主键Id[多个]
 */
idList?: Array<string>,
}): CancelablePromise<Array<IczpNet_Chat_EntryValues_Dtos_EntryValueDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/entry-value/many',
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
     * 修改
     * @returns IczpNet_Chat_EntryValues_Dtos_EntryValueDetailDto Success
     * @throws ApiError
     */
    public static postApiChatEntryValueUpdate({
id,
requestBody,
}: {
/**
 * 主键Id
 */
id: string,
requestBody?: IczpNet_Chat_EntryValues_Dtos_EntryValueUpdateInput,
}): CancelablePromise<IczpNet_Chat_EntryValues_Dtos_EntryValueDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/entry-value/{id}/update',
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

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_Words_Dtos_WordCreateInput } from '../models/IczpNet_Chat_Words_Dtos_WordCreateInput';
import type { IczpNet_Chat_Words_Dtos_WordDetailDto } from '../models/IczpNet_Chat_Words_Dtos_WordDetailDto';
import type { IczpNet_Chat_Words_Dtos_WordDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_Words_Dtos_WordDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_Words_Dtos_WordUpdateInput } from '../models/IczpNet_Chat_Words_Dtos_WordUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class WordService {

    /**
     * 新增
     * @param requestBody 
     * @returns IczpNet_Chat_Words_Dtos_WordDetailDto Success
     * @throws ApiError
     */
    public static postApiChatWord(
requestBody?: IczpNet_Chat_Words_Dtos_WordCreateInput,
): CancelablePromise<IczpNet_Chat_Words_Dtos_WordDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/word',
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
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_Words_Dtos_WordDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatWord(
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/word',
            query: {
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
    public static postApiChatWordDelete(
id: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/word/{id}/delete',
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
    public static postApiChatWordDeleteMany(
requestBody?: Array<string>,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/word/delete-many',
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
     * @param id 主键Id
     * @returns IczpNet_Chat_Words_Dtos_WordDetailDto Success
     * @throws ApiError
     */
    public static getApiChatWord1(
id: string,
): CancelablePromise<IczpNet_Chat_Words_Dtos_WordDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/word/{id}',
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
     * @param idList 主键Id[多个]
     * @returns IczpNet_Chat_Words_Dtos_WordDetailDto Success
     * @throws ApiError
     */
    public static getApiChatWordMany(
idList?: Array<string>,
): CancelablePromise<Array<IczpNet_Chat_Words_Dtos_WordDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/word/many',
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
     * @param id 主键Id
     * @param requestBody 
     * @returns IczpNet_Chat_Words_Dtos_WordDetailDto Success
     * @throws ApiError
     */
    public static postApiChatWordUpdate(
id: string,
requestBody?: IczpNet_Chat_Words_Dtos_WordUpdateInput,
): CancelablePromise<IczpNet_Chat_Words_Dtos_WordDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/word/{id}/update',
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

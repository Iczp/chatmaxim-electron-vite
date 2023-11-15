/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_Words_Dtos_WordCreateInput } from '../models/IczpNet_Chat_Words_Dtos_WordCreateInput';
import type { IczpNet_Chat_Words_Dtos_WordDetailDto } from '../models/IczpNet_Chat_Words_Dtos_WordDetailDto';
// import type { IczpNet_Chat_Words_Dtos_WordDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_Words_Dtos_WordDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_Words_Dtos_WordUpdateInput } from '../models/IczpNet_Chat_Words_Dtos_WordUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class WordService {

    /**
     * 新增
     * @returns IczpNet_Chat_Words_Dtos_WordDetailDto Success
     * @throws ApiError
     */
    public static postApiChatWord({
requestBody,
}: {
requestBody?: IczpNet_Chat_Words_Dtos_WordCreateInput,
}): CancelablePromise<IczpNet_Chat_Words_Dtos_WordDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/word',
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 获取列表
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_Words_Dtos_WordDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatWord({
keyword,
maxResultCount,
skipCount,
sorting,
}: {
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
            url: '/api/chat/word',
            query: {
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
    public static postApiChatWordDelete({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/word/{id}/delete',
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
    public static postApiChatWordDeleteMany({
requestBody,
}: {
/**
 * 主键Id[多个]
 */
requestBody?: Array<string>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/word/delete-many',
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 获取一条记录 Get
     * @returns IczpNet_Chat_Words_Dtos_WordDetailDto Success
     * @throws ApiError
     */
    public static getApiChatWord1({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<IczpNet_Chat_Words_Dtos_WordDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/word/{id}',
            path: {
                'id': id,
            },
            
        });
    }

    /**
     * 获取多条数据
     * @returns IczpNet_Chat_Words_Dtos_WordDetailDto Success
     * @throws ApiError
     */
    public static getApiChatWordMany({
idList,
}: {
/**
 * 主键Id[多个]
 */
idList?: Array<string>,
}): CancelablePromise<Array<IczpNet_Chat_Words_Dtos_WordDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/word/many',
            query: {
                'idList': idList,
            },
            
        });
    }

    /**
     * 修改
     * @returns IczpNet_Chat_Words_Dtos_WordDetailDto Success
     * @throws ApiError
     */
    public static postApiChatWordUpdate({
id,
requestBody,
}: {
/**
 * 主键Id
 */
id: string,
requestBody?: IczpNet_Chat_Words_Dtos_WordUpdateInput,
}): CancelablePromise<IczpNet_Chat_Words_Dtos_WordDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/word/{id}/update',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

}

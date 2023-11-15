/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeCreateInput } from '../models/IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeCreateInput';
import type { IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeDetailDto } from '../models/IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeDetailDto';
// import type { IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeUpdateInput } from '../models/IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ChatObjectTypeService {

    /**
     * 新增
     * @returns IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeDetailDto Success
     * @throws ApiError
     */
    public static postApiChatChatObjectType({
requestBody,
}: {
requestBody?: IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeCreateInput,
}): CancelablePromise<IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/chat-object-type',
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 获取列表
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatChatObjectType({
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
            url: '/api/chat/chat-object-type',
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
    public static postApiChatChatObjectTypeDelete({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/chat-object-type/{id}/delete',
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
    public static postApiChatChatObjectTypeDeleteMany({
requestBody,
}: {
/**
 * 主键Id[多个]
 */
requestBody?: Array<string>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/chat-object-type/delete-many',
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 获取一条记录 Get
     * @returns IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeDetailDto Success
     * @throws ApiError
     */
    public static getApiChatChatObjectType1({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/chat-object-type/{id}',
            path: {
                'id': id,
            },
            
        });
    }

    /**
     * 获取多条数据
     * @returns IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeDetailDto Success
     * @throws ApiError
     */
    public static getApiChatChatObjectTypeMany({
idList,
}: {
/**
 * 主键Id[多个]
 */
idList?: Array<string>,
}): CancelablePromise<Array<IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/chat-object-type/many',
            query: {
                'idList': idList,
            },
            
        });
    }

    /**
     * 修改
     * @returns IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeDetailDto Success
     * @throws ApiError
     */
    public static postApiChatChatObjectTypeUpdate({
id,
requestBody,
}: {
/**
 * 主键Id
 */
id: string,
requestBody?: IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeUpdateInput,
}): CancelablePromise<IczpNet_Chat_ChatObjectTypes_Dtos_ChatObjectTypeDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/chat-object-type/{id}/update',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

}

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_ContactTags_Dtos_ContactTagCreateInput } from '../models/IczpNet_Chat_ContactTags_Dtos_ContactTagCreateInput';
import type { IczpNet_Chat_ContactTags_Dtos_ContactTagDetailDto } from '../models/IczpNet_Chat_ContactTags_Dtos_ContactTagDetailDto';
// import type { IczpNet_Chat_ContactTags_Dtos_ContactTagDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_ContactTags_Dtos_ContactTagDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_ContactTags_Dtos_ContactTagUpdateInput } from '../models/IczpNet_Chat_ContactTags_Dtos_ContactTagUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ContactTagService {

    /**
     * 新增
     * @returns IczpNet_Chat_ContactTags_Dtos_ContactTagDetailDto Success
     * @throws ApiError
     */
    public static postApiChatContactTag({
requestBody,
}: {
requestBody?: IczpNet_Chat_ContactTags_Dtos_ContactTagCreateInput,
}): CancelablePromise<IczpNet_Chat_ContactTags_Dtos_ContactTagDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/contact-tag',
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 获取列表
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_ContactTags_Dtos_ContactTagDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatContactTag({
ownerId,
keyword,
maxResultCount,
skipCount,
sorting,
}: {
ownerId?: number,
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
            url: '/api/chat/contact-tag',
            query: {
                'OwnerId': ownerId,
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
    public static postApiChatContactTagDelete({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/contact-tag/{id}/delete',
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
    public static postApiChatContactTagDeleteMany({
requestBody,
}: {
/**
 * 主键Id[多个]
 */
requestBody?: Array<string>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/contact-tag/delete-many',
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 获取一条记录 Get
     * @returns IczpNet_Chat_ContactTags_Dtos_ContactTagDetailDto Success
     * @throws ApiError
     */
    public static getApiChatContactTag1({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<IczpNet_Chat_ContactTags_Dtos_ContactTagDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/contact-tag/{id}',
            path: {
                'id': id,
            },
            
        });
    }

    /**
     * 获取多条数据
     * @returns IczpNet_Chat_ContactTags_Dtos_ContactTagDetailDto Success
     * @throws ApiError
     */
    public static getApiChatContactTagMany({
idList,
}: {
/**
 * 主键Id[多个]
 */
idList?: Array<string>,
}): CancelablePromise<Array<IczpNet_Chat_ContactTags_Dtos_ContactTagDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/contact-tag/many',
            query: {
                'idList': idList,
            },
            
        });
    }

    /**
     * 修改
     * @returns IczpNet_Chat_ContactTags_Dtos_ContactTagDetailDto Success
     * @throws ApiError
     */
    public static postApiChatContactTagUpdate({
id,
requestBody,
}: {
/**
 * 主键Id
 */
id: string,
requestBody?: IczpNet_Chat_ContactTags_Dtos_ContactTagUpdateInput,
}): CancelablePromise<IczpNet_Chat_ContactTags_Dtos_ContactTagDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/contact-tag/{id}/update',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

}

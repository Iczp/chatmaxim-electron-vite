/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_ShopWaiters_Dtos_ShopWaiterCreateInput } from '../models/IczpNet_Chat_ShopWaiters_Dtos_ShopWaiterCreateInput';
import type { IczpNet_Chat_ShopWaiters_Dtos_ShopWaiterDto } from '../models/IczpNet_Chat_ShopWaiters_Dtos_ShopWaiterDto';
import type { IczpNet_Chat_ShopWaiters_Dtos_ShopWaiterDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_ShopWaiters_Dtos_ShopWaiterDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { IczpNet_Chat_ShopWaiters_Dtos_ShopWaiterUpdateInput } from '../models/IczpNet_Chat_ShopWaiters_Dtos_ShopWaiterUpdateInput';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ShopWaiterService {

    /**
     * 店小二绑定用户
     * @param id 主建Id
     * @param userId 用户Id
     * @returns IczpNet_Chat_ShopWaiters_Dtos_ShopWaiterDto Success
     * @throws ApiError
     */
    public static postApiChatShopWaiterBingUser(
id: number,
userId: string,
): CancelablePromise<IczpNet_Chat_ShopWaiters_Dtos_ShopWaiterDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/shop-waiter/{id}/bing-user/{userId}',
            path: {
                'id': id,
                'userId': userId,
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
     * 添加店小二
     * @param requestBody 
     * @returns IczpNet_Chat_ShopWaiters_Dtos_ShopWaiterDto Success
     * @throws ApiError
     */
    public static postApiChatShopWaiter(
requestBody?: IczpNet_Chat_ShopWaiters_Dtos_ShopWaiterCreateInput,
): CancelablePromise<IczpNet_Chat_ShopWaiters_Dtos_ShopWaiterDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/shop-waiter',
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
     * 获取店小二（子账号）列表
     * @param shopKeeperId 掌柜Id[聊天对象]
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_ShopWaiters_Dtos_ShopWaiterDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatShopWaiter(
shopKeeperId?: number,
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/shop-waiter',
            query: {
                'ShopKeeperId': shopKeeperId,
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
     * 修改店小二
     * @param id 主建Id
     * @param requestBody 
     * @returns IczpNet_Chat_ShopWaiters_Dtos_ShopWaiterDto Success
     * @throws ApiError
     */
    public static postApiChatShopWaiterUpdate(
id: number,
requestBody?: IczpNet_Chat_ShopWaiters_Dtos_ShopWaiterUpdateInput,
): CancelablePromise<IczpNet_Chat_ShopWaiters_Dtos_ShopWaiterDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/shop-waiter/{id}/update',
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

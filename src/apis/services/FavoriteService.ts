/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_FavoritedRecorders_Dtos_FavoritedRecorderDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_FavoritedRecorders_Dtos_FavoritedRecorderDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FavoriteService {

    /**
     * 添加收藏
     * @param sessionUnitId 会话单元Id
     * @param messageId 消息Id
     * @param deviceId 设备Id
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatFavorite(
sessionUnitId: string,
messageId: number,
deviceId?: string,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/favorite',
            query: {
                'SessionUnitId': sessionUnitId,
                'MessageId': messageId,
                'DeviceId': deviceId,
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
     * 收藏列表
     * @param ownerId 所有聊天对象
     * @param destinationId 目标聊天对象
     * @param minSize 消息大小（最小值）
     * @param maxSize 消息大小（最大值）
     * @param messageType 消息类型
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_FavoritedRecorders_Dtos_FavoritedRecorderDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatFavorite(
ownerId?: number,
destinationId?: number,
minSize?: number,
maxSize?: number,
messageType?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/favorite',
            query: {
                'OwnerId': ownerId,
                'DestinationId': destinationId,
                'MinSize': minSize,
                'MaxSize': maxSize,
                'MessageType': messageType,
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
     * 取消收藏
     * @param sessionUnitId 会话单元Id
     * @param messageId 消息Id
     * @param deviceId 设备Id
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatFavoriteDelete(
sessionUnitId: string,
messageId: number,
deviceId?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/favorite/delete',
            query: {
                'SessionUnitId': sessionUnitId,
                'MessageId': messageId,
                'DeviceId': deviceId,
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
     * 获取收藏数量
     * @param ownerId 聊天对象Id
     * @returns number Success
     * @throws ApiError
     */
    public static getApiChatFavoriteCount(
ownerId: number,
): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/favorite/count/{ownerId}',
            path: {
                'ownerId': ownerId,
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
     * 获取收藏的总大小
     * @param ownerId 聊天对象Id
     * @returns number Success
     * @throws ApiError
     */
    public static getApiChatFavoriteSize(
ownerId: number,
): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/favorite/size/{ownerId}',
            path: {
                'ownerId': ownerId,
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

}

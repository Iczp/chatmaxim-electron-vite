/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ReadedRecorderService {

    /**
     * 获取【已读】的数量
     * @param messageIdList 
     * @returns number Success
     * @throws ApiError
     */
    public static getApiChatReadedRecorderCounts(
messageIdList?: Array<number>,
): CancelablePromise<Record<string, number>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/readed-recorder/counts',
            query: {
                'messageIdList': messageIdList,
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
     * 获取消息已读的聊天对象
     * @param messageId 消息Id
     * @param isReaded 是否已读
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatReadedRecorderByMessageId(
messageId: number,
isReaded: boolean = true,
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/readed-recorder/by-message-id/{messageId}',
            path: {
                'messageId': messageId,
            },
            query: {
                'IsReaded': isReaded,
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
     * 消息全部设置为已读
     * @param messageId 消息Id
     * @returns number Success
     * @throws ApiError
     */
    public static postApiChatReadedRecorderSetAll(
messageId: number,
): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/readed-recorder/set-all/{messageId}',
            path: {
                'messageId': messageId,
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
     * 设置为【忌讳】
     * @param sessunitUnitId 会话单元Id
     * @param messageIdList 消息列表
     * @param deviceId 设备Id
     * @returns number Success
     * @throws ApiError
     */
    public static postApiChatReadedRecorderSetReadedMany(
sessunitUnitId: string,
messageIdList: Array<number>,
deviceId?: string,
): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/readed-recorder/set-readed-many',
            query: {
                'SessunitUnitId': sessunitUnitId,
                'MessageIdList': messageIdList,
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

}

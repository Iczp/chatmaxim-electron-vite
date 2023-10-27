/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_OpenedRecorders_Dtos_OpenedRecorderDto } from '../models/IczpNet_Chat_OpenedRecorders_Dtos_OpenedRecorderDto';
// import type { IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class OpenedRecorderService {

    /**
     * 获取消息【已打开】的数量
     * @returns number Success
     * @throws ApiError
     */
    public static getApiChatOpenedRecorderCounts({
messageIdList,
}: {
messageIdList?: Array<number>,
}): CancelablePromise<Record<string, number>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/opened-recorder/counts',
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
     * 获取消息【已打开】的聊天对象
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatOpenedRecorderByMessageId({
messageId,
isReaded = true,
keyword,
maxResultCount,
skipCount,
sorting,
}: {
/**
 * 消息Id
 */
messageId: number,
/**
 * 是否已读
 */
isReaded?: boolean,
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
            url: '/api/chat/opened-recorder/by-message-id',
            query: {
                'MessageId': messageId,
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
     * 设置为【已打开】
     * @returns IczpNet_Chat_OpenedRecorders_Dtos_OpenedRecorderDto Success
     * @throws ApiError
     */
    public static postApiChatOpenedRecorderSetOpened({
sessionUnitId,
messageId,
deviceId,
}: {
/**
 * 会话单元
 */
sessionUnitId: string,
/**
 * 消息id
 */
messageId: number,
/**
 * 设备id
 */
deviceId?: string,
}): CancelablePromise<IczpNet_Chat_OpenedRecorders_Dtos_OpenedRecorderDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/opened-recorder/set-opened',
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

}
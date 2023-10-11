/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_Enums_Dtos_EnumDto } from '../models/IczpNet_Chat_Enums_Dtos_EnumDto';
import type { IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto } from '../models/IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto';
import type { IczpNet_Chat_MessageSections_Messages_Dtos_MessageOwnerDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_MessageSections_Messages_Dtos_MessageOwnerDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MessageService {

    /**
     * 获取禁止转发的消息类型
     * @returns IczpNet_Chat_Enums_Dtos_EnumDto Success
     * @throws ApiError
     */
    public static getApiChatMessageDisabledForwardList(): CancelablePromise<Array<IczpNet_Chat_Enums_Dtos_EnumDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/message/disabled-forward-list',
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
     * 获取一条消息
     * @param sessionUnitId 会话单元Id
     * @param messageId 消息Id
     * @returns IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto Success
     * @throws ApiError
     */
    public static getApiChatMessageItem(
sessionUnitId: string,
messageId: number,
): CancelablePromise<IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/message/item',
            query: {
                'SessionUnitId': sessionUnitId,
                'MessageId': messageId,
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
     * 获取消息列表
     * @param sessionUnitId 会话单元Id
     * @param senderId 发送人【聊天对象】
     * @param isRemind 是否有提醒
     * @param messageType 消息类型
     * @param isFollowed 是否特别关注
     * @param forwardDepth 转发层级
     * @param quoteDepth 引用层级
     * @param minMessageId 最小消息Id
     * @param maxMessageId 最大消息Id
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_MessageSections_Messages_Dtos_MessageOwnerDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatMessage(
sessionUnitId: string,
senderId?: number,
isRemind?: boolean,
messageType?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
isFollowed?: boolean,
forwardDepth?: number,
quoteDepth?: number,
minMessageId?: number,
maxMessageId?: number,
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/message',
            query: {
                'SessionUnitId': sessionUnitId,
                'SenderId': senderId,
                'IsRemind': isRemind,
                'MessageType': messageType,
                'IsFollowed': isFollowed,
                'ForwardDepth': forwardDepth,
                'QuoteDepth': quoteDepth,
                'MinMessageId': minMessageId,
                'MaxMessageId': maxMessageId,
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

}

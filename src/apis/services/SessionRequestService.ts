/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto } from '../models/IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto';
import type { IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SessionRequestService {

    /**
     * 添加会话请求（加好友、加群、加聊天广场）
     * @returns IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionRequest({
ownerId,
destinationId,
requestMessage,
}: {
/**
 * 所属聊天对象Id[发起者]
 */
ownerId: number,
/**
 * 目标聊天对象Id[被请求者]
 */
destinationId: number,
/**
 * 请求消息
 */
requestMessage?: string,
}): CancelablePromise<IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-request',
            query: {
                'OwnerId': ownerId,
                'DestinationId': destinationId,
                'RequestMessage': requestMessage,
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
     * 获取列表
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionRequest({
ownerId,
destinationId,
isEnabled,
isExpired,
isHandled,
isAgreed,
startHandleTime,
endHandleTime,
startCreationTime,
endCreationTime,
keyword = null,
maxResultCount,
skipCount,
sorting = null,
}: {
/**
 * 所属聊天对象Id
 */
ownerId?: number,
/**
 * 目标聊天对象Id
 */
destinationId?: number,
/**
 * 是否可用
 */
isEnabled?: boolean,
/**
 * 是否过期
 */
isExpired?: boolean,
/**
 * 是否处理过
 */
isHandled?: boolean,
/**
 * 是否同意请求
 */
isAgreed?: boolean,
/**
 * 处理起始时间
 */
startHandleTime?: string,
/**
 * 处理结束时间
 */
endHandleTime?: string,
/**
 * 创建请求的起始时间
 */
startCreationTime?: string,
/**
 * 创建请求的结束时间
 */
endCreationTime?: string,
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
            url: '/api/chat/session-request',
            query: {
                'OwnerId': ownerId,
                'DestinationId': destinationId,
                'IsEnabled': isEnabled,
                'IsExpired': isExpired,
                'IsHandled': isHandled,
                'IsAgreed': isAgreed,
                'StartHandleTime': startHandleTime,
                'EndHandleTime': endHandleTime,
                'StartCreationTime': startCreationTime,
                'EndCreationTime': endCreationTime,
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
     * 获取一条记录 Get
     * @returns IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionRequest1({
id,
}: {
/**
 * 主键Id
 */
id: string,
}): CancelablePromise<IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-request/{id}',
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
     * @returns IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionRequestMany({
idList,
}: {
/**
 * 主键Id[多个]
 */
idList?: Array<string>,
}): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-request/many',
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
     * 处理申请
     * @returns IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionRequestHandleRequest({
sessionRequestId,
isAgreed,
handleMessage,
}: {
/**
 * 主键Id
 */
sessionRequestId: string,
/**
 * 是否同意加好友/加入聊天广场/加入群聊
 */
isAgreed: boolean,
/**
 * 处理消息
 */
handleMessage?: string,
}): CancelablePromise<IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-request/handle-request',
            query: {
                'SessionRequestId': sessionRequestId,
                'IsAgreed': isAgreed,
                'HandleMessage': handleMessage,
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

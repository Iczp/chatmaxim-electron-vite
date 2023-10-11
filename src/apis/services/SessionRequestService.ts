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
     * @param ownerId 所属聊天对象Id[发起者]
     * @param destinationId 目标聊天对象Id[被请求者]
     * @param requestMessage 请求消息
     * @returns IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionRequest(
ownerId: number,
destinationId: number,
requestMessage?: string,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto> {
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
     * @param ownerId 所属聊天对象Id
     * @param destinationId 目标聊天对象Id
     * @param isEnabled 是否可用
     * @param isExpired 是否过期
     * @param isHandled 是否处理过
     * @param isAgreed 是否同意请求
     * @param startHandleTime 处理起始时间
     * @param endHandleTime 处理结束时间
     * @param startCreationTime 创建请求的起始时间
     * @param endCreationTime 创建请求的结束时间
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionRequest(
ownerId?: number,
destinationId?: number,
isEnabled?: boolean,
isExpired?: boolean,
isHandled?: boolean,
isAgreed?: boolean,
startHandleTime?: string,
endHandleTime?: string,
startCreationTime?: string,
endCreationTime?: string,
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
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
     * @param id 主键Id
     * @returns IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionRequest1(
id: string,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto> {
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
     * @param idList 主键Id[多个]
     * @returns IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto Success
     * @throws ApiError
     */
    public static getApiChatSessionRequestMany(
idList?: Array<string>,
): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto>> {
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
     * @param sessionRequestId 主键Id
     * @param isAgreed 是否同意加好友/加入聊天广场/加入群聊
     * @param handleMessage 处理消息
     * @returns IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto Success
     * @throws ApiError
     */
    public static postApiChatSessionRequestHandleRequest(
sessionRequestId: string,
isAgreed: boolean,
handleMessage?: string,
): CancelablePromise<IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto> {
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

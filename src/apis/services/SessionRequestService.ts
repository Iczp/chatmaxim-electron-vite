/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SessionRequestDetailDto } from '../dtos/SessionRequestDetailDto';
// import type { IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { PagedResultDto, SessionRequestInput } from '../dtos';
import { SessionRequestGetListInput } from '../dtos/SessionRequestGetListInput';

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
}: SessionRequestInput): CancelablePromise<SessionRequestDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-request',
            query: {
                'OwnerId': ownerId,
                'DestinationId': destinationId,
                'RequestMessage': requestMessage,
            },
            
        });
    }

    /**
     * 获取列表
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatSessionRequestList({
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
keyword,
maxResultCount,
skipCount,
sorting,
}: SessionRequestGetListInput ): CancelablePromise<PagedResultDto<SessionRequestDetailDto>> {
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
}): CancelablePromise<SessionRequestDetailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-request/{id}',
            path: {
                'id': id,
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
}): CancelablePromise<Array<SessionRequestDetailDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/session-request/many',
            query: {
                'idList': idList,
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
}): CancelablePromise<SessionRequestDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/session-request/handle-request',
            query: {
                'SessionRequestId': sessionRequestId,
                'IsAgreed': isAgreed,
                'HandleMessage': handleMessage,
            },
            
        });
    }

}

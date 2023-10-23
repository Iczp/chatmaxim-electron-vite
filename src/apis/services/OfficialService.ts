/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto } from '../models/IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto';
import type { IczpNet_Chat_OfficialSections_Officials_Dtos_OfficialCreateInput } from '../models/IczpNet_Chat_OfficialSections_Officials_Dtos_OfficialCreateInput';
import type { SessionUnitOwnerDto } from '../dtos/SessionUnitOwnerDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class OfficialService {

    /**
     * 创建公众号
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatOfficial({
requestBody,
}: {
requestBody?: IczpNet_Chat_OfficialSections_Officials_Dtos_OfficialCreateInput,
}): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/official',
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
     * 关注公众号[ownerId]
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto Success
     * @throws ApiError
     */
    public static postApiChatOfficialSubscribe({
ownerId,
destinationId,
}: {
/**
 * 聊天对象Id
 */
ownerId?: number,
destinationId?: number,
}): CancelablePromise<SessionUnitOwnerDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/official/subscribe',
            query: {
                'ownerId': ownerId,
                'destinationId': destinationId,
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
     * 关注公众号[sessionUnitId]
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto Success
     * @throws ApiError
     */
    public static postApiChatOfficialSubscribeById({
sessionUnitId,
}: {
/**
 * 会话单元Id
 */
sessionUnitId: string,
}): CancelablePromise<SessionUnitOwnerDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/official/subscribe-by-id/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
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
     * 取消关注公众号
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto Success
     * @throws ApiError
     */
    public static postApiChatOfficialUnsubscribe({
sessionUnitId,
}: {
/**
 * 会话单元Id
 */
sessionUnitId: string,
}): CancelablePromise<SessionUnitOwnerDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/official/unsubscribe/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
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

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto } from '../models/IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto';
import type { IczpNet_Chat_OfficialSections_Officials_Dtos_OfficialCreateInput } from '../models/IczpNet_Chat_OfficialSections_Officials_Dtos_OfficialCreateInput';
import type { IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto } from '../models/IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class OfficialService {

    /**
     * 创建公众号
     * @param requestBody 
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatOfficial(
requestBody?: IczpNet_Chat_OfficialSections_Officials_Dtos_OfficialCreateInput,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
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
     * @param ownerId 聊天对象Id
     * @param destinationId 
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto Success
     * @throws ApiError
     */
    public static postApiChatOfficialSubscribe(
ownerId?: number,
destinationId?: number,
): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto> {
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
     * @param sessionUnitId 会话单元Id
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto Success
     * @throws ApiError
     */
    public static postApiChatOfficialSubscribeById(
sessionUnitId: string,
): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto> {
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
     * @param sessionUnitId 会话单元Id
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto Success
     * @throws ApiError
     */
    public static postApiChatOfficialUnsubscribe(
sessionUnitId: string,
): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto> {
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

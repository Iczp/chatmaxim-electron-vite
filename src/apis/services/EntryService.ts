/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectDetailDto } from '../models/IczpNet_Chat_ChatObjects_Dtos_ChatObjectDetailDto';
import type { IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDetailDto } from '../models/IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDetailDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EntryService {

    /**
     * 设置聊天对象条目
     * @param ownerId 聊天对象Id
     * @param requestBody {entryNameId:["v1","v2"]}
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDetailDto Success
     * @throws ApiError
     */
    public static postApiChatEntrySetForChatObject(
ownerId: number,
requestBody: Record<string, Array<string>>,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/entry/set-for-chat-object/{ownerId}',
            path: {
                'ownerId': ownerId,
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

    /**
     * 设置会话单元Id条目值
     * @param sessionUnitId 会话单元Id
     * @param requestBody {entryNameId:["v1","v2"]}
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDetailDto Success
     * @throws ApiError
     */
    public static postApiChatEntrySetForSessionUnit(
sessionUnitId: string,
requestBody: Record<string, Array<string>>,
): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitDestinationDetailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/entry/set-for-session-unit/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
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

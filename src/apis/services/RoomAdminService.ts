/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto } from '../models/IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto';
import type { IczpNet_Chat_RoomSections_Rooms_Dtos_RoomCreateInput } from '../models/IczpNet_Chat_RoomSections_Rooms_Dtos_RoomCreateInput';
import type { IczpNet_Chat_RoomSections_Rooms_InviteInput } from '../models/IczpNet_Chat_RoomSections_Rooms_InviteInput';
import type { IczpNet_Chat_SessionSections_SessionUnits_SessionUnitSenderInfo } from '../models/IczpNet_Chat_SessionSections_SessionUnits_SessionUnitSenderInfo';
import type { IczpNet_Chat_SessionUnits_Dtos_SessionUnitDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionUnits_Dtos_SessionUnitDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RoomAdminService {

    /**
     * @param requestBody 
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatRoomAdmin(
requestBody?: IczpNet_Chat_RoomSections_Rooms_Dtos_RoomCreateInput,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room-admin',
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
     * @param name 
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatRoomAdminByAllUsers(
name?: string,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room-admin/by-all-users',
            query: {
                'name': name,
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
     * @param sessionUnitId 
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatRoomAdminDissolve(
sessionUnitId: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room-admin/dissolve/{sessionUnitId}',
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
     * @param sourceChatObjectId 原聊天对象Id
     * @param targetChatObjectId 目标对象Id
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionUnits_Dtos_SessionUnitDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatRoomAdminSame(
sourceChatObjectId?: number,
targetChatObjectId?: number,
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/room-admin/same',
            query: {
                'SourceChatObjectId': sourceChatObjectId,
                'TargetChatObjectId': targetChatObjectId,
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
     * @param sourceChatObjectId 
     * @param targetChatObjectId 
     * @returns number Success
     * @throws ApiError
     */
    public static getApiChatRoomAdminSameCount(
sourceChatObjectId?: number,
targetChatObjectId?: number,
): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/room-admin/same-count',
            query: {
                'sourceChatObjectId': sourceChatObjectId,
                'targetChatObjectId': targetChatObjectId,
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
     * @param requestBody 
     * @returns IczpNet_Chat_SessionSections_SessionUnits_SessionUnitSenderInfo Success
     * @throws ApiError
     */
    public static postApiChatRoomAdminInvite(
requestBody?: IczpNet_Chat_RoomSections_Rooms_InviteInput,
): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionUnits_SessionUnitSenderInfo>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room-admin/invite',
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
     * @param sessionUnitId 
     * @param targetSessionUnitId 
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatRoomAdminTransferCreator(
sessionUnitId?: string,
targetSessionUnitId?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room-admin/transfer-creator',
            query: {
                'sessionUnitId': sessionUnitId,
                'targetSessionUnitId': targetSessionUnitId,
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
     * @param sessionUnitId 
     * @param name 
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatRoomAdminUpdateName(
sessionUnitId: string,
name?: string,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room-admin/update-name/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            query: {
                'name': name,
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
     * @param sessionUnitId 
     * @param portrait 
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatRoomAdminUpdatePortrait(
sessionUnitId: string,
portrait?: string,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room-admin/update-portrait/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            query: {
                'portrait': portrait,
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

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { ChatObjectDto } from "../dtos";;
import type { RoomCreateInput } from '../models/RoomCreateInput';
import type { IczpNet_Chat_RoomSections_Rooms_InviteInput } from '../models/IczpNet_Chat_RoomSections_Rooms_InviteInput';
import type { IczpNet_Chat_SessionSections_SessionUnits_SessionUnitSenderInfo } from '../models/IczpNet_Chat_SessionSections_SessionUnits_SessionUnitSenderInfo';
// import type { IczpNet_Chat_SessionUnits_Dtos_SessionUnitDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_SessionUnits_Dtos_SessionUnitDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
import type { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../models/Volo_Abp_Application_Dtos_PagedResultDto_1';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RoomAdminService {

    /**
     * @returns ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatRoomAdmin({
requestBody,
}: {
requestBody?: RoomCreateInput,
}): CancelablePromise<ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room-admin',
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * @returns ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatRoomAdminByAllUsers({
name,
}: {
name?: string,
}): CancelablePromise<ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room-admin/by-all-users',
            query: {
                'name': name,
            },
            
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatRoomAdminDissolve({
sessionUnitId,
}: {
sessionUnitId: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room-admin/dissolve/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            
        });
    }

    /**
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionUnits_Dtos_SessionUnitDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatRoomAdminSame({
sourceChatObjectId,
targetChatObjectId,
keyword,
maxResultCount,
skipCount,
sorting,
}: {
/**
 * 原聊天对象Id
 */
sourceChatObjectId?: number,
/**
 * 目标对象Id
 */
targetChatObjectId?: number,
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
            url: '/api/chat/room-admin/same',
            query: {
                'SourceChatObjectId': sourceChatObjectId,
                'TargetChatObjectId': targetChatObjectId,
                'Keyword': keyword,
                'MaxResultCount': maxResultCount,
                'SkipCount': skipCount,
                'Sorting': sorting,
            },
            
        });
    }

    /**
     * @returns number Success
     * @throws ApiError
     */
    public static getApiChatRoomAdminSameCount({
sourceChatObjectId,
targetChatObjectId,
}: {
sourceChatObjectId?: number,
targetChatObjectId?: number,
}): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/room-admin/same-count',
            query: {
                'sourceChatObjectId': sourceChatObjectId,
                'targetChatObjectId': targetChatObjectId,
            },
            
        });
    }

    /**
     * @returns IczpNet_Chat_SessionSections_SessionUnits_SessionUnitSenderInfo Success
     * @throws ApiError
     */
    public static postApiChatRoomAdminInvite({
requestBody,
}: {
requestBody?: IczpNet_Chat_RoomSections_Rooms_InviteInput,
}): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionUnits_SessionUnitSenderInfo>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room-admin/invite',
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatRoomAdminTransferCreator({
sessionUnitId,
targetSessionUnitId,
}: {
sessionUnitId?: string,
targetSessionUnitId?: string,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room-admin/transfer-creator',
            query: {
                'sessionUnitId': sessionUnitId,
                'targetSessionUnitId': targetSessionUnitId,
            },
            
        });
    }

    /**
     * @returns ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatRoomAdminUpdateName({
sessionUnitId,
name,
}: {
sessionUnitId: string,
name?: string,
}): CancelablePromise<ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room-admin/update-name/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            query: {
                'name': name,
            },
            
        });
    }

    /**
     * @returns ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatRoomAdminUpdatePortrait({
sessionUnitId,
portrait,
}: {
sessionUnitId: string,
portrait?: string,
}): CancelablePromise<ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room-admin/update-portrait/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            query: {
                'portrait': portrait,
            },
            
        });
    }

}

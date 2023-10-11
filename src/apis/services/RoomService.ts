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

export class RoomService {

    /**
     * 创建群
     * @param requestBody 
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatRoom(
requestBody?: IczpNet_Chat_RoomSections_Rooms_Dtos_RoomCreateInput,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room',
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
     * 解散群
     * @param sessionUnitId 会话单元Id
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatRoomDissolve(
sessionUnitId: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room/dissolve/{sessionUnitId}',
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
     * 获取共同所在的群列表
     * @param sourceChatObjectId 原聊天对象Id
     * @param targetChatObjectId 目标对象Id
     * @param keyword 关键字(支持拼音)
     * @param maxResultCount 显示数量
     * @param skipCount 跳过数量
     * @param sorting 排序
     * @returns Volo_Abp_Application_Dtos_PagedResultDto_1<IczpNet_Chat_SessionUnits_Dtos_SessionUnitDto_IczpNet_Chat_Application_Contracts_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static getApiChatRoomSame(
sourceChatObjectId?: number,
targetChatObjectId?: number,
keyword: string = null,
maxResultCount?: number,
skipCount?: number,
sorting: string = null,
): CancelablePromise<Volo_Abp_Application_Dtos_PagedResultDto_1> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/room/same',
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
     * 获取共同所在的群数量
     * @param sourceChatObjectId 原聊天对象Id
     * @param targetChatObjectId 目标对象Id
     * @returns number Success
     * @throws ApiError
     */
    public static getApiChatRoomSameCount(
sourceChatObjectId?: number,
targetChatObjectId?: number,
): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/room/same-count',
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
     * 邀请加入群聊
     * @param requestBody 
     * @returns IczpNet_Chat_SessionSections_SessionUnits_SessionUnitSenderInfo Success
     * @throws ApiError
     */
    public static postApiChatRoomInvite(
requestBody?: IczpNet_Chat_RoomSections_Rooms_InviteInput,
): CancelablePromise<Array<IczpNet_Chat_SessionSections_SessionUnits_SessionUnitSenderInfo>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room/invite',
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
     * 转让群主
     * @param sessionUnitId 会话单元Id
     * @param targetSessionUnitId 目标会话单元Id(新群主Id)
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatRoomTransferCreator(
sessionUnitId?: string,
targetSessionUnitId?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room/transfer-creator',
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
     * 更新群名称并群内公告
     * @param sessionUnitId 会话单元Id
     * @param name 群名字
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatRoomUpdateName(
sessionUnitId: string,
name?: string,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room/update-name/{sessionUnitId}',
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
     * 修改群头像
     * @param sessionUnitId 会话单元Id
     * @param portrait 头像,全地址或相对地址:"http://www.icpz.net/logo.png","/logo.png"
     * @returns IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto Success
     * @throws ApiError
     */
    public static postApiChatRoomUpdatePortrait(
sessionUnitId: string,
portrait?: string,
): CancelablePromise<IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/room/update-portrait/{sessionUnitId}',
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

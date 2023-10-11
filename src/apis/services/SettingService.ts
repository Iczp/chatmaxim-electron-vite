/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto } from '../models/IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SettingService {

    /**
     * 清空消息
     * @param sessionUnitId 会话单元Id
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto Success
     * @throws ApiError
     */
    public static postApiChatSettingClearMessage(
sessionUnitId: string,
): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/setting/clear-message/{sessionUnitId}',
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
     * 删除消息
     * @param sessionUnitId 会话单元Id
     * @param messageId 消息Id
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSettingDeleteMessage(
sessionUnitId: string,
messageId?: number,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/setting/delete-message',
            query: {
                'sessionUnitId': sessionUnitId,
                'messageId': messageId,
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
     * 退出会话
     * @param sessionUnitId 会话单元Id
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto Success
     * @throws ApiError
     */
    public static postApiChatSettingExit(
sessionUnitId: string,
): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/setting/exit/{sessionUnitId}',
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
     * 删除会话
     * @param sessionUnitId 会话单元Id
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto Success
     * @throws ApiError
     */
    public static postApiChatSettingKill(
sessionUnitId: string,
): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/setting/kill/{sessionUnitId}',
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
     * 移除会话
     * @param sessionUnitId 会话单元Id
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto Success
     * @throws ApiError
     */
    public static postApiChatSettingRemove(
sessionUnitId: string,
): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/setting/remove/{sessionUnitId}',
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
     * 设置联系人标签
     * @param sessionUnitId 会话单元Id
     * @param requestBody 联系人标签Id
     * @returns any Success
     * @throws ApiError
     */
    public static postApiChatSettingSetContactTags(
sessionUnitId: string,
requestBody?: Array<string>,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/setting/set-contact-tags/{sessionUnitId}',
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

    /**
     * 设置为静默模式（免打扰）
     * @param sessionUnitId 会话单元Id
     * @param isImmersed 
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto Success
     * @throws ApiError
     */
    public static postApiChatSettingSetImmersed(
sessionUnitId: string,
isImmersed?: boolean,
): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/setting/set-immersed/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            query: {
                'isImmersed': isImmersed,
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
     * 设置成员（群内名称，会话内名称）
     * @param sessionUnitId 会话单元Id
     * @param memberName 会话内名称
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto Success
     * @throws ApiError
     */
    public static postApiChatSettingSetMemberName(
sessionUnitId: string,
memberName?: string,
): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/setting/set-member-name/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            query: {
                'memberName': memberName,
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
     * 禁言过期时间，为空则不禁言
     * @param muterSessionUnitId 被设置的会话单元Id
     * @param setterSessionUnitId 设置者会话单元Id
     * @param seconds 禁言(秒)，为0则取消禁言
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatSettingSetMuteExpireTime(
muterSessionUnitId: string,
setterSessionUnitId: string,
seconds?: number,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/setting/set-mute-expire-time',
            query: {
                'muterSessionUnitId': muterSessionUnitId,
                'setterSessionUnitId': setterSessionUnitId,
                'seconds': seconds,
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
     * 设置已读消息Id
     * @param sessionUnitId 会话单元Id
     * @param isForce 是否强制
     * @param messageId 消息Id
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto Success
     * @throws ApiError
     */
    public static postApiChatSettingSetReadedMessageId(
sessionUnitId: string,
isForce: boolean = false,
messageId?: number,
): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/setting/set-readed-message-id',
            query: {
                'sessionUnitId': sessionUnitId,
                'isForce': isForce,
                'messageId': messageId,
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
     * 备注名称
     * @param sessionUnitId 会话单元Id
     * @param rename 名称
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto Success
     * @throws ApiError
     */
    public static postApiChatSettingSetRename(
sessionUnitId: string,
rename?: string,
): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/setting/set-rename/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            query: {
                'rename': rename,
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
     * 设置置顶
     * @param sessionUnitId 会话单元Id
     * @param isTopping 是否置顶
     * @returns IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto Success
     * @throws ApiError
     */
    public static postApiChatSettingSetTopping(
sessionUnitId: string,
isTopping?: boolean,
): CancelablePromise<IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/setting/set-topping/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            query: {
                'isTopping': isTopping,
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

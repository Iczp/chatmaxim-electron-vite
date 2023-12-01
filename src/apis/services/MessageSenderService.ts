/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto } from '../models/IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto';
import type { IczpNet_Chat_MessageSections_Messages_MessageInfo_1 } from '../models/IczpNet_Chat_MessageSections_Messages_MessageInfo_1';
import type { IczpNet_Chat_MessageSections_Messages_MessageInput_1 } from '../models/IczpNet_Chat_MessageSections_Messages_MessageInput_1';
// import type { IczpNet_Chat_MessageSections_Templates_CmdContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_MessageSections_Templates_CmdContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
// import type { IczpNet_Chat_MessageSections_Templates_ContactsContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_MessageSections_Templates_ContactsContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
// import type { IczpNet_Chat_MessageSections_Templates_FileContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_MessageSections_Templates_FileContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
// import type { IczpNet_Chat_MessageSections_Templates_HistoryContentInput_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_MessageSections_Templates_HistoryContentInput_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
// import type { IczpNet_Chat_MessageSections_Templates_HistoryContentOutput_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_MessageSections_Templates_HistoryContentOutput_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
// import type { IczpNet_Chat_MessageSections_Templates_HtmlContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_MessageSections_Templates_HtmlContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
// import type { IczpNet_Chat_MessageSections_Templates_ImageContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_MessageSections_Templates_ImageContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
// import type { IczpNet_Chat_MessageSections_Templates_LinkContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_MessageSections_Templates_LinkContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
// import type { IczpNet_Chat_MessageSections_Templates_LocationContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_MessageSections_Templates_LocationContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
// import type { IczpNet_Chat_MessageSections_Templates_RedEnvelopeContentInput_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_MessageSections_Templates_RedEnvelopeContentInput_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
// import type { IczpNet_Chat_MessageSections_Templates_RedEnvelopeContentOutput_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_MessageSections_Templates_RedEnvelopeContentOutput_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
// import type { IczpNet_Chat_MessageSections_Templates_SoundContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_MessageSections_Templates_SoundContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
// import type { IczpNet_Chat_MessageSections_Templates_TextContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_MessageSections_Templates_TextContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';
// import type { IczpNet_Chat_MessageSections_Templates_VideoContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_ } from '../models/IczpNet_Chat_MessageSections_Templates_VideoContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { MessageOwnerDto } from '../dtos';

export class MessageSenderService {

    /**
     * 转发消息
     * @returns IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto Success
     * @throws ApiError
     */
    public static postApiChatMessageSenderForward({
sessionUnitId,
messageId,
requestBody,
}: {
/**
 * 会话单元Id
 */
sessionUnitId?: string,
/**
 * 消息Id
 */
messageId?: number,
/**
 * 目标
 */
requestBody?: Array<string>,
}): CancelablePromise<Array<IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message-sender/forward',
            query: {
                'sessionUnitId': sessionUnitId,
                'messageId': messageId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * 撤回消息
     * @returns number Success
     * @throws ApiError
     */
    public static postApiChatMessageSenderRollback({
messageId,
}: {
/**
 * 消息Id
 */
messageId: number,
}): CancelablePromise<Record<string, number>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message-sender/rollback/{messageId}',
            path: {
                'messageId': messageId,
            },
            
        });
    }

    /**
     * 发[命令]消息
     * @returns IczpNet_Chat_MessageSections_Messages_MessageInfo_1<IczpNet_Chat_MessageSections_Templates_CmdContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static postApiChatMessageSenderSendCmd({
sessionUnitId,
requestBody,
}: {
/**
 * 会话单元Id
 */
sessionUnitId: string,
requestBody?: IczpNet_Chat_MessageSections_Messages_MessageInput_1,
}): CancelablePromise<IczpNet_Chat_MessageSections_Messages_MessageInfo_1> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message-sender/send-cmd/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 发[名片]消息
     * @returns IczpNet_Chat_MessageSections_Messages_MessageInfo_1<IczpNet_Chat_MessageSections_Templates_ContactsContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static postApiChatMessageSenderSendContacts({
sessionUnitId,
requestBody,
}: {
/**
 * 会话单元Id
 */
sessionUnitId: string,
requestBody?: IczpNet_Chat_MessageSections_Messages_MessageInput_1,
}): CancelablePromise<IczpNet_Chat_MessageSections_Messages_MessageInfo_1> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message-sender/send-contacts/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 发[文件]消息
     * @returns IczpNet_Chat_MessageSections_Messages_MessageInfo_1<IczpNet_Chat_MessageSections_Templates_FileContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static postApiChatMessageSenderSendFile({
sessionUnitId,
requestBody,
}: {
/**
 * 会话单元Id
 */
sessionUnitId: string,
requestBody?: IczpNet_Chat_MessageSections_Messages_MessageInput_1,
}): CancelablePromise<IczpNet_Chat_MessageSections_Messages_MessageInfo_1> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message-sender/send-file/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 发[聊天记录]消息
     * @returns IczpNet_Chat_MessageSections_Messages_MessageInfo_1<IczpNet_Chat_MessageSections_Templates_HistoryContentOutput_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static postApiChatMessageSenderSendHistory({
sessionUnitId,
requestBody,
}: {
/**
 * 会话单元Id
 */
sessionUnitId: string,
requestBody?: IczpNet_Chat_MessageSections_Messages_MessageInput_1,
}): CancelablePromise<IczpNet_Chat_MessageSections_Messages_MessageInfo_1> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message-sender/send-history/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 发[HTML]消息
     * @returns IczpNet_Chat_MessageSections_Messages_MessageInfo_1<IczpNet_Chat_MessageSections_Templates_HtmlContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static postApiChatMessageSenderSendHtml({
sessionUnitId,
requestBody,
}: {
/**
 * 会话单元Id
 */
sessionUnitId: string,
requestBody?: IczpNet_Chat_MessageSections_Messages_MessageInput_1,
}): CancelablePromise<IczpNet_Chat_MessageSections_Messages_MessageInfo_1> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message-sender/send-html/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 发[图片]消息
     * @returns IczpNet_Chat_MessageSections_Messages_MessageInfo_1<IczpNet_Chat_MessageSections_Templates_ImageContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static postApiChatMessageSenderSendImage({
sessionUnitId,
requestBody,
}: {
/**
 * 会话单元Id
 */
sessionUnitId: string,
requestBody?: IczpNet_Chat_MessageSections_Messages_MessageInput_1,
}): CancelablePromise<IczpNet_Chat_MessageSections_Messages_MessageInfo_1> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message-sender/send-image/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 发[链接]消息
     * @returns IczpNet_Chat_MessageSections_Messages_MessageInfo_1<IczpNet_Chat_MessageSections_Templates_LinkContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static postApiChatMessageSenderSendLink({
sessionUnitId,
requestBody,
}: {
/**
 * 会话单元Id
 */
sessionUnitId: string,
requestBody?: IczpNet_Chat_MessageSections_Messages_MessageInput_1,
}): CancelablePromise<IczpNet_Chat_MessageSections_Messages_MessageInfo_1> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message-sender/send-link/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 发[位置]消息
     * @returns IczpNet_Chat_MessageSections_Messages_MessageInfo_1<IczpNet_Chat_MessageSections_Templates_LocationContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static postApiChatMessageSenderSendLocation({
sessionUnitId,
requestBody,
}: {
/**
 * 会话单元Id
 */
sessionUnitId: string,
requestBody?: IczpNet_Chat_MessageSections_Messages_MessageInput_1,
}): CancelablePromise<IczpNet_Chat_MessageSections_Messages_MessageInfo_1> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message-sender/send-location/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 发[红包]消息
     * @returns IczpNet_Chat_MessageSections_Messages_MessageInfo_1<IczpNet_Chat_MessageSections_Templates_RedEnvelopeContentOutput_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static postApiChatMessageSenderSendRedEnvelope({
sessionUnitId,
requestBody,
}: {
/**
 * 会话单元Id
 */
sessionUnitId: string,
requestBody?: IczpNet_Chat_MessageSections_Messages_MessageInput_1,
}): CancelablePromise<IczpNet_Chat_MessageSections_Messages_MessageInfo_1> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message-sender/send-red-envelope/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 发[语音]消息
     * @returns IczpNet_Chat_MessageSections_Messages_MessageInfo_1<IczpNet_Chat_MessageSections_Templates_SoundContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static postApiChatMessageSenderSendSound({
sessionUnitId,
requestBody,
}: {
/**
 * 会话单元Id
 */
sessionUnitId: string,
requestBody?: IczpNet_Chat_MessageSections_Messages_MessageInput_1,
}): CancelablePromise<MessageOwnerDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message-sender/send-sound/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 发[文本]消息
     * @returns IczpNet_Chat_MessageSections_Messages_MessageInfo_1<IczpNet_Chat_MessageSections_Templates_TextContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static postApiChatMessageSenderSendText({
sessionUnitId,
requestBody,
}: {
/**
 * 会话单元Id
 */
sessionUnitId: string,
requestBody?: IczpNet_Chat_MessageSections_Messages_MessageInput_1,
}): CancelablePromise<MessageOwnerDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message-sender/send-text/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

    /**
     * 发[视频]消息
     * @returns IczpNet_Chat_MessageSections_Messages_MessageInfo_1<IczpNet_Chat_MessageSections_Templates_VideoContentInfo_IczpNet_Chat_Domain_Shared_Version_0_1_1_0_Culture_neutral_PublicKeyToken_null_> Success
     * @throws ApiError
     */
    public static postApiChatMessageSenderSendVideo({
sessionUnitId,
requestBody,
}: {
/**
 * 会话单元Id
 */
sessionUnitId: string,
requestBody?: IczpNet_Chat_MessageSections_Messages_MessageInput_1,
}): CancelablePromise<IczpNet_Chat_MessageSections_Messages_MessageInfo_1> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/message-sender/send-video/{sessionUnitId}',
            path: {
                'sessionUnitId': sessionUnitId,
            },
            body: requestBody,
            mediaType: 'application/json',
            
        });
    }

}

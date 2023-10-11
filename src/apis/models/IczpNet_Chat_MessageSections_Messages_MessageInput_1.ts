/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IczpNet_Chat_MessageSections_Templates_VideoContentInfo } from './IczpNet_Chat_MessageSections_Templates_VideoContentInfo';

export type IczpNet_Chat_MessageSections_Messages_MessageInput_1 = {
    /**
     * 引用消息Id
     */
    quoteMessageId?: number | null;
    /**
     * Ignore Connections
     */
    ignoreConnections?: Array<string> | null;
    /**
     * Remind SessionUnitId
     */
    remindList?: Array<string> | null;
    content?: IczpNet_Chat_MessageSections_Templates_VideoContentInfo;
};

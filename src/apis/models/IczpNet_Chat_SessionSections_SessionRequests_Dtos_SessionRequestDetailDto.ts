/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IczpNet_Chat_ChatObjects_Dtos_ChatObjectSimpleDto } from './IczpNet_Chat_ChatObjects_Dtos_ChatObjectSimpleDto';

export type IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDetailDto = {
    id?: string;
    creationTime?: string;
    /**
     * 发起者Id
     */
    ownerId?: number;
    /**
     * 被请求者Id
     */
    destinationId?: number | null;
    destination?: IczpNet_Chat_ChatObjects_Dtos_ChatObjectSimpleDto;
    /**
     * 是否处理过
     */
    isHandled?: boolean;
    /**
     * 是否同意
     */
    isAgreed?: boolean | null;
    /**
     * 请求消息
     */
    requestMessage?: string | null;
    /**
     * 是否过期
     */
    isExpired?: boolean;
    /**
     * 过期时间
     */
    expirationTime?: string | null;
    owner?: IczpNet_Chat_ChatObjects_Dtos_ChatObjectSimpleDto;
    /**
     * 处理消息
     */
    handleMessage?: string | null;
    /**
     * 处理时间
     */
    handleTime?: string | null;
};

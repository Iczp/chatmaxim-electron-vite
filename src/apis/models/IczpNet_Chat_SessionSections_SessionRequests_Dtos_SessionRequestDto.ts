/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { ChatObjectDto } from "../dtos";

export type IczpNet_Chat_SessionSections_SessionRequests_Dtos_SessionRequestDto = {
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
    owner?: ChatObjectDto;
    destination?: ChatObjectDto;
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
};

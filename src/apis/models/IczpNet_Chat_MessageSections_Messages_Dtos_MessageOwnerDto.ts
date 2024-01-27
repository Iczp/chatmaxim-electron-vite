/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { ChatObjectDto } from "../dtos";

export type IczpNet_Chat_MessageSections_Messages_Dtos_MessageOwnerDto = {
    id?: number;
    messageType?: IczpNet_Chat_MessageSections_Messages_Dtos_MessageOwnerDto.messageType;
    reminderType?: IczpNet_Chat_MessageSections_Messages_Dtos_MessageOwnerDto.reminderType | null;
    isPrivate?: boolean;
    /**
     * 撤回消息时间
     */
    rollbackTime?: string | null;
    creationTime?: string;
    content?: any;
    senderName?: string | null;
    /**
     * 发送人显示名称
     */
    senderDisplayName?: string | null;
    /**
     * 朋友Id
     */
    friendshipSessionUnitId?: string | null;
    sender?: ChatObjectDto;
    /**
     * 转发来源Id(转发才有)
     */
    forwardMessageId?: number | null;
    /**
     * 转发层级 0:不是转发
     */
    forwardDepth?: number;
    /**
     * 引用来源Id(引用才有)
     */
    quoteMessageId?: number | null;
    /**
     * 引用层级 0:不是引用
     */
    quoteDepth?: number;
    /**
     * 是否已打开
     */
    isOpened?: boolean | null;
    /**
     * 是否已读
     */
    isReaded?: boolean | null;
    /**
     * 是否特别关注
     */
    isFollowing?: boolean | null;
    /**
     * 成员数量
     */
    sessionUnitCount?: number;
    /**
     * 已读数量
     */
    readedCount?: number;
    /**
     * 打开数量
     */
    openedCount?: number;
    /**
     * 收藏数量
     */
    favoritedCount?: number;
};

export namespace IczpNet_Chat_MessageSections_Messages_Dtos_MessageOwnerDto {

    export enum messageType {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
        '_3' = 3,
        '_4' = 4,
        '_5' = 5,
        '_6' = 6,
        '_7' = 7,
        '_8' = 8,
        '_9' = 9,
        '_10' = 10,
        '_11' = 11,
        '_12' = 12,
    }

    export enum reminderType {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
    }


}

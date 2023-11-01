/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SessionUnitSettingDto = {
    readedMessageId?: number | null;
    memberName?: string | null;
    rename?: string | null;
    /**
     * 备注
     */
    remarks?: string | null;
    /**
     * 是否保存通讯录(群)
     */
    isContacts?: boolean;
    /**
     * 消息免打扰，默认为 false
     */
    isImmersed?: boolean;
    /**
     * 是否显示成员名称
     */
    isShowMemberName?: boolean;
    /**
     * 是否显示已读
     */
    isShowReaded?: boolean;
    /**
     * 聊天背景，默认为 null
     */
    backgroundImage?: string | null;
    /**
     * 加入方式
     */
    isKilled?: boolean;
    isInputEnabled?: boolean;
    isEnabled?: boolean;
    /**
     * 邀请人
     */
    inviterId?: string | null;
    /**
     * 禁言过期时间
     */
    muteExpireTime?: string | null;
};

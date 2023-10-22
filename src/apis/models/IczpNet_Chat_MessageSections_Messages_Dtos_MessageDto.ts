/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto = {
    id?: number;
    messageType?: IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto.messageType;
    reminderType?: IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto.reminderType | null;
    isPrivate?: boolean;
    /**
     * 撤回消息时间
     */
    rollbackTime?: string | null;
    creationTime?: string;
    content?: any;
    senderName?: string | null;
};

export namespace IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto {

    export enum messageType {

        /**
         * 文本类型
         */
        'Text' = 0,
        'Cmd' = 1,
        'Image' = 2,
        'Sound' = 3,
        'Video' = 4,
        'File' = 5,
        'Link' = 6,
        'Location' = 7,
        'Contacts' = 8,
        'RedEnvelope' = 9,
        'Html' = 10,
        'Article' = 11,
        'History' = 12,
    }

    export enum reminderType {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
    }


}

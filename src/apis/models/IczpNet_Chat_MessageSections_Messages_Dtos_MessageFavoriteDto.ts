/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type IczpNet_Chat_MessageSections_Messages_Dtos_MessageFavoriteDto = {
    id?: number;
    messageType?: IczpNet_Chat_MessageSections_Messages_Dtos_MessageFavoriteDto.messageType;
    reminderType?: IczpNet_Chat_MessageSections_Messages_Dtos_MessageFavoriteDto.reminderType | null;
    isPrivate?: boolean;
    /**
     * 撤回消息时间
     */
    rollbackTime?: string | null;
    creationTime?: string;
    content?: any;
};

export namespace IczpNet_Chat_MessageSections_Messages_Dtos_MessageFavoriteDto {

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

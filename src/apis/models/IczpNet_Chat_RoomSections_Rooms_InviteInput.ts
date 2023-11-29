/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type IczpNet_Chat_RoomSections_Rooms_InviteInput = {
    /**
     * 群Id
     */
    roomId?: number;
    /**
     * 聊天对象Id(群成员)
     */
    memberIdList?: Array<number> | null;
    /**
     * 邀请人(可空)
     */
    inviterId?: number | null;
};

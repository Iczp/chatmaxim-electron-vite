/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto = {
    id?: number;
    parentId?: number | null;
    name?: string | null;
    depth?: number;
    childrenCount?: number;
    fullPath?: string | null;
    fullPathName?: string | null;
    chatObjectTypeId?: string | null;
    code?: string | null;
    /**
     * 性别
     */
    gender?: IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto.gender;
    portrait?: string | null;
    appUserId?: string | null;
    isEnabled?: boolean;
    isDefault?: boolean;
    objectType?: IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto.objectType | null;
    readonly serviceStatus?: IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto.serviceStatus | null;
};

export namespace IczpNet_Chat_ChatObjects_Dtos_ChatObjectDto {

    /**
     * 性别
     */
    export enum gender {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
    }

    export enum objectType {
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
    }

    export enum serviceStatus {
        '_0' = 0,
        '_1' = 1,
    }


}

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IczpNet_Chat_Entries_Dtos_EntryObjectDto } from './IczpNet_Chat_Entries_Dtos_EntryObjectDto';

export type IczpNet_Chat_ChatObjects_Dtos_ChatObjectDetailDto = {
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
    gender?: IczpNet_Chat_ChatObjects_Dtos_ChatObjectDetailDto.gender;
    portrait?: string | null;
    appUserId?: string | null;
    isEnabled?: boolean;
    isDefault?: boolean;
    objectType?: IczpNet_Chat_ChatObjects_Dtos_ChatObjectDetailDto.objectType | null;
    readonly serviceStatus?: IczpNet_Chat_ChatObjects_Dtos_ChatObjectDetailDto.serviceStatus | null;
    description?: string | null;
    entries?: Array<IczpNet_Chat_Entries_Dtos_EntryObjectDto> | null;
};

export namespace IczpNet_Chat_ChatObjects_Dtos_ChatObjectDetailDto {

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

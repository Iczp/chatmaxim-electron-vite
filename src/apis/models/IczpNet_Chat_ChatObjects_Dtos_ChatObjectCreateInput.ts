/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type IczpNet_Chat_ChatObjects_Dtos_ChatObjectCreateInput = {
    /**
     * 父级Id,为null时，根级
     */
    parentId?: number | null;
    /**
     * 排序(越大越前)
     */
    sorting?: number;
    code?: string | null;
    /**
     * 性别
     */
    gender?: IczpNet_Chat_ChatObjects_Dtos_ChatObjectCreateInput.gender;
    description?: string | null;
    name?: string | null;
    chatObjectTypeId?: string | null;
    objectType?: IczpNet_Chat_ChatObjects_Dtos_ChatObjectCreateInput.objectType | null;
};

export namespace IczpNet_Chat_ChatObjects_Dtos_ChatObjectCreateInput {

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


}

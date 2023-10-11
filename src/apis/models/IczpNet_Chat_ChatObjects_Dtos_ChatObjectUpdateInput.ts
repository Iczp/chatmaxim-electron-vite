/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type IczpNet_Chat_ChatObjects_Dtos_ChatObjectUpdateInput = {
    /**
     * 父级Id,为null时，根级
     */
    parentId?: number | null;
    /**
     * 名称
     */
    name?: string | null;
    /**
     * 排序(越大越前)
     */
    sorting?: number;
    code?: string | null;
    /**
     * 性别
     */
    gender?: IczpNet_Chat_ChatObjects_Dtos_ChatObjectUpdateInput.gender;
    description?: string | null;
};

export namespace IczpNet_Chat_ChatObjects_Dtos_ChatObjectUpdateInput {

    /**
     * 性别
     */
    export enum gender {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
    }


}

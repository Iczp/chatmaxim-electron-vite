/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type IczpNet_Chat_Menus_Dtos_MenuUpdateInput = {
    /**
     * 父级Id,为null时，根级
     */
    parentId?: string | null;
    /**
     * 名称
     */
    name?: string | null;
    /**
     * 排序(越大越前)
     */
    sorting?: number;
    /**
     * 说明
     */
    description?: string | null;
};

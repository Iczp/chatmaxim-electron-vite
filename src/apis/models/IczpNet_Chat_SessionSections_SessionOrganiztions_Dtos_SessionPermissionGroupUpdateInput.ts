/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * SessionPermissionGroup UpdateInput
 */
export type IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionPermissionGroupUpdateInput = {
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
};

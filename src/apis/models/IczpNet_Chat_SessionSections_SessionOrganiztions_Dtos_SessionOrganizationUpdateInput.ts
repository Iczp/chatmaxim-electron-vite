/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * SessionOrganization UpdateInput
 */
export type IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationUpdateInput = {
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
    /**
     * 说明
     */
    description?: string | null;
};

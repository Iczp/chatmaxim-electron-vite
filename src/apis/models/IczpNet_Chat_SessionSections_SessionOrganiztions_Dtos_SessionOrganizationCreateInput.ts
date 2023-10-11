/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type IczpNet_Chat_SessionSections_SessionOrganiztions_Dtos_SessionOrganizationCreateInput = {
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
    /**
     * 会话Id
     */
    sessionId?: string | null;
};

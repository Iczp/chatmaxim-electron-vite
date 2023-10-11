/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type IczpNet_Chat_EntryNames_Dtos_EntryNameCreateInput = {
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
    code?: string | null;
    regex?: string | null;
    maxLenth?: number;
    minLenth?: number;
    maxCount?: number;
    minCount?: number;
    isUniqued?: boolean;
    isRequired?: boolean;
    isStatic?: boolean;
    isPublic?: boolean;
    description?: string | null;
    errorMessage?: string | null;
};

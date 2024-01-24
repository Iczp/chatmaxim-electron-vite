import { GenderEnums } from "../enums";

export type ChatObjectUpdateInput = {
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
    gender?: GenderEnums;
    description?: string | null;
};

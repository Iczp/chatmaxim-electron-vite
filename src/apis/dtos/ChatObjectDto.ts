import { ChatObjectTypeEnums, GenderEnums, ServiceStatusEnums } from "../enums";


export type ChatObjectDto ={
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
    gender?: GenderEnums;
    portrait?: string | null;
    appUserId?: string | null;
    isEnabled?: boolean;
    isDefault?: boolean;
    objectType?: ChatObjectTypeEnums | null;
    readonly serviceStatus?: ServiceStatusEnums | null;
}

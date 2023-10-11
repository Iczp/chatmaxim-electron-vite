/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * 联系人消息
 */
export type IczpNet_Chat_MessageSections_Templates_ContactsContentInfo = {
    id?: string | null;
    destinationId?: number;
    /**
     * 联系人名称
     */
    name?: string | null;
    code?: string | null;
    /**
     * 头像
     */
    portrait?: string | null;
    objectType?: IczpNet_Chat_MessageSections_Templates_ContactsContentInfo.objectType | null;
    /**
     * 说明
     */
    description?: string | null;
    /**
     * 备注
     */
    remark?: string | null;
};

export namespace IczpNet_Chat_MessageSections_Templates_ContactsContentInfo {

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

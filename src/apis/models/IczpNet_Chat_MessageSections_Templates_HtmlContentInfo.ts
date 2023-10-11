/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * HTML消息
 */
export type IczpNet_Chat_MessageSections_Templates_HtmlContentInfo = {
    id?: string | null;
    /**
     * 编辑器类型
     */
    editorType?: IczpNet_Chat_MessageSections_Templates_HtmlContentInfo.editorType;
    /**
     * 文本内容
     */
    title?: string | null;
    /**
     * 内容
     */
    content?: string | null;
    /**
     * 原始地址
     */
    originalUrl?: string | null;
};

export namespace IczpNet_Chat_MessageSections_Templates_HtmlContentInfo {

    /**
     * 编辑器类型
     */
    export enum editorType {
        '_0' = 0,
        '_1' = 1,
    }


}

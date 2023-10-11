/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type IczpNet_Chat_Articles_Dtos_ArticleUpdateInput = {
    /**
     * 文章类型,
 * 0:常规
     */
    articleType?: IczpNet_Chat_Articles_Dtos_ArticleUpdateInput.articleType;
    /**
     * 编辑器类型,
 * 0:常规
 * 1:MarkDown
     */
    editorType?: IczpNet_Chat_Articles_Dtos_ArticleUpdateInput.editorType;
    /**
     * 文本内容
     */
    title?: string | null;
    /**
     * 简要说明
     */
    description?: string | null;
    /**
     * 封面图片地址
     */
    coverImageUrl?: string | null;
    /**
     * 内容
     */
    content?: string | null;
    /**
     * 作者
     */
    author?: string | null;
    /**
     * 访问数量
     */
    visitsCount?: number;
    /**
     * 原始地址
     */
    originalUrl?: string | null;
};

export namespace IczpNet_Chat_Articles_Dtos_ArticleUpdateInput {

    /**
     * 文章类型,
 * 0:常规
     */
    export enum articleType {
        '_0' = 0,
    }

    /**
     * 编辑器类型,
 * 0:常规
 * 1:MarkDown
     */
    export enum editorType {
        '_0' = 0,
        '_1' = 1,
    }


}

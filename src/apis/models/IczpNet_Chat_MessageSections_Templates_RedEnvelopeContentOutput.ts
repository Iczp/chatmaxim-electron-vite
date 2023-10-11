/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type IczpNet_Chat_MessageSections_Templates_RedEnvelopeContentOutput = {
    id?: string | null;
    /**
     * 文本内容
     */
    text?: string | null;
    /**
     * 创建人(发红包的人)
     */
    readonly ownerId?: number | null;
    /**
     * 红包发放方式（0：随机金额;1:固定金额）
     */
    grantMode?: IczpNet_Chat_MessageSections_Templates_RedEnvelopeContentOutput.grantMode;
    /**
     * 金额
     */
    amount?: number;
    /**
     * 数量
     */
    count?: number;
    /**
     * 总金额
     */
    totalAmount?: number;
    /**
     * 到期时间
     */
    readonly expireTime?: string | null;
};

export namespace IczpNet_Chat_MessageSections_Templates_RedEnvelopeContentOutput {

    /**
     * 红包发放方式（0：随机金额;1:固定金额）
     */
    export enum grantMode {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
    }


}

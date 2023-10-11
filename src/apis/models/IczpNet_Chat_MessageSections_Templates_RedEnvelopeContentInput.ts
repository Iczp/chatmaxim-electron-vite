/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type IczpNet_Chat_MessageSections_Templates_RedEnvelopeContentInput = {
    id?: string | null;
    password?: string | null;
    /**
     * 红包发放方式（0：随机金额;1:固定金额）
     */
    grantMode?: IczpNet_Chat_MessageSections_Templates_RedEnvelopeContentInput.grantMode;
    /**
     * 单个金额Red Envelope
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
     * 文本内容
     */
    text?: string | null;
};

export namespace IczpNet_Chat_MessageSections_Templates_RedEnvelopeContentInput {

    /**
     * 红包发放方式（0：随机金额;1:固定金额）
     */
    export enum grantMode {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
    }


}

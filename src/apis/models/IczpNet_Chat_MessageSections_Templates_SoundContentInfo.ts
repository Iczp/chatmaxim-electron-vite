/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * 语音消息
 */
export type IczpNet_Chat_MessageSections_Templates_SoundContentInfo = {
    id?: string | null;
    /**
     * 语音地址
     */
    url?: string | null;
    /**
     * 手机的存储路径(前端使用字段，服务端不能存这个字段)
     */
    path?: string | null;
    /**
     * 语音的文本内容
     */
    text?: string | null;
    /**
     * 语音时长（毫秒）
     */
    time?: number;
    /**
     * 语音文件大小
     */
    size?: number;
};

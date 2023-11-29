/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * 客户端位置信息
 */
export type IczpNet_Chat_Locations_UserLocationCacheItem = {
    /**
     * 用户ID
     */
    userId?: string | null;
    /**
     * 显示名称
     */
    name?: string | null;
    /**
     * 手机品牌
     */
    brand?: string | null;
    /**
     * 手机型号
     */
    model?: string | null;
    /**
     * 设备Id（唯一识别码）
     */
    deviceId?: string | null;
    /**
     * 坐标 Latitude
     */
    latitude?: number;
    /**
     * 坐标 Longitude
     */
    longitude?: number;
    /**
     * 最近活动时间
     */
    activeTime?: string;
};

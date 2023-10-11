/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * 位置信息
 */
export type IczpNet_Chat_MessageSections_Templates_LocationContentInfo = {
    id?: string | null;
    /**
     * AMap(高德地图)、baidu(百度地图)
     */
    provider?: string | null;
    /**
     * 位置名称
     */
    name?: string | null;
    /**
     * 简要说明
     */
    address?: string | null;
    /**
     * 地图图片
     */
    image?: string | null;
    /**
     * 坐标 Latitude
     */
    latitude?: number;
    /**
     * 坐标 Longitude
     */
    longitude?: number;
};

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Volo_Abp_PermissionManagement_GetPermissionListResultDto } from '../models/Volo_Abp_PermissionManagement_GetPermissionListResultDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ToolService {

    /**
     * 数据播种
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatToolDataSeed(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/tool/data-seed',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Server Error`,
                501: `Server Error`,
            },
        });
    }

    /**
     * Abp解密
     * @param value 
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatToolDecrpyt(
value?: string,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/tool/decrpyt',
            query: {
                'value': value,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Server Error`,
                501: `Server Error`,
            },
        });
    }

    /**
     * Abp加密
     * @param value 
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatToolEncrypt(
value?: string,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/tool/encrypt',
            query: {
                'value': value,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Server Error`,
                501: `Server Error`,
            },
        });
    }

    /**
     * 生成短Id(ShortId)
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatToolGenerateShortId(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/tool/generate-short-id',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Server Error`,
                501: `Server Error`,
            },
        });
    }

    /**
     * 获取系统权限列表
     * @param providerName 
     * @param providerKey 
     * @returns Volo_Abp_PermissionManagement_GetPermissionListResultDto Success
     * @throws ApiError
     */
    public static postApiChatToolGet(
providerName?: string,
providerKey?: string,
): CancelablePromise<Volo_Abp_PermissionManagement_GetPermissionListResultDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/tool/get',
            query: {
                'providerName': providerName,
                'providerKey': providerKey,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Server Error`,
                501: `Server Error`,
            },
        });
    }

    /**
     * string 转 Md5 再转 Guid
     * @param input 
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatToolToGuid(
input?: string,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/tool/to-guid',
            query: {
                'input': input,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Server Error`,
                501: `Server Error`,
            },
        });
    }

    /**
     * 转Md5
     * @param input 
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatToolToMD5(
input?: string,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/tool/to-mD5',
            query: {
                'input': input,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Server Error`,
                501: `Server Error`,
            },
        });
    }

    /**
     * ToUnixTimeMilliseconds
     * @param dateTime 
     * @returns number Success
     * @throws ApiError
     */
    public static getApiChatToolToUnixTimeMilliseconds(
dateTime?: string,
): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/tool/to-unix-time-milliseconds',
            query: {
                'dateTime': dateTime,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Server Error`,
                501: `Server Error`,
            },
        });
    }

    /**
     * ToUnixTimeSeconds
     * @param dateTime 
     * @returns number Success
     * @throws ApiError
     */
    public static getApiChatToolToUnixTimeSeconds(
dateTime?: string,
): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/tool/to-unix-time-seconds',
            query: {
                'dateTime': dateTime,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Server Error`,
                501: `Server Error`,
            },
        });
    }

}

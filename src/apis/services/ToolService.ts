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
            
        });
    }

    /**
     * Abp解密
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatToolDecrpyt({
value,
}: {
value?: string,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/tool/decrpyt',
            query: {
                'value': value,
            },
            
        });
    }

    /**
     * Abp加密
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatToolEncrypt({
value,
}: {
value?: string,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/tool/encrypt',
            query: {
                'value': value,
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
            
        });
    }

    /**
     * 获取系统权限列表
     * @returns Volo_Abp_PermissionManagement_GetPermissionListResultDto Success
     * @throws ApiError
     */
    public static postApiChatToolGet({
providerName,
providerKey,
}: {
providerName?: string,
providerKey?: string,
}): CancelablePromise<Volo_Abp_PermissionManagement_GetPermissionListResultDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/tool/get',
            query: {
                'providerName': providerName,
                'providerKey': providerKey,
            },
            
        });
    }

    /**
     * string 转 Md5 再转 Guid
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatToolToGuid({
input,
}: {
input?: string,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/tool/to-guid',
            query: {
                'input': input,
            },
            
        });
    }

    /**
     * 转Md5
     * @returns string Success
     * @throws ApiError
     */
    public static postApiChatToolToMD5({
input,
}: {
input?: string,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/tool/to-mD5',
            query: {
                'input': input,
            },
            
        });
    }

    /**
     * ToUnixTimeMilliseconds
     * @returns number Success
     * @throws ApiError
     */
    public static getApiChatToolToUnixTimeMilliseconds({
dateTime,
}: {
dateTime?: string,
}): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/tool/to-unix-time-milliseconds',
            query: {
                'dateTime': dateTime,
            },
            
        });
    }

    /**
     * ToUnixTimeSeconds
     * @returns number Success
     * @throws ApiError
     */
    public static getApiChatToolToUnixTimeSeconds({
dateTime,
}: {
dateTime?: string,
}): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/tool/to-unix-time-seconds',
            query: {
                'dateTime': dateTime,
            },
            
        });
    }

}
